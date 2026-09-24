const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/api/applicationApi.js', `
import api from './axiosInstance'

export const applicationApi = {
  applyToInternship: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/me'),
  withdrawApplication: (id) => api.delete(\`/applications/\${id}\`),
  getInternshipApplicants: (internshipId) => api.get(\`/applications/internship/\${internshipId}\`),
  updateApplicationStatus: (id, status) => api.put(\`/applications/\${id}/status\`, { status })
}
`);

write('src/pages/student/MyApplications.jsx', `
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationApi } from '../../api/applicationApi'
import { Trash2, Building } from 'lucide-react'

const MyApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const { data } = await applicationApi.getMyApplications()
      setApplications(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleWithdraw = async (id) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await applicationApi.withdrawApplication(id)
        setApplications(applications.filter(a => a._id !== id))
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to withdraw application')
      }
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-100 text-blue-800'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800'
      case 'Shortlisted': return 'bg-purple-100 text-purple-800'
      case 'Interview Scheduled': return 'bg-indigo-100 text-indigo-800'
      case 'Selected': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow-sm border text-gray-500">
          <p className="mb-4">You haven't applied to any internships yet.</p>
          <Link to="/internships" className="text-indigo-600 font-medium hover:underline">Explore Internships</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Applied Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map(app => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded border bg-white flex items-center justify-center overflow-hidden">
                        {app.internshipId?.companyId?.logoUrl ? (
                          <img src={app.internshipId.companyId.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building className="text-gray-400" size={20} />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{app.internshipId?.companyId?.companyName || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link to={\`/internships/\${app.internshipId?._id}\`} className="font-medium text-indigo-600 hover:underline">
                      {app.internshipId?.title || 'Unknown Role'}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={\`px-3 py-1 rounded-full text-xs font-semibold \${getStatusColor(app.status)}\`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {app.status === 'Applied' && (
                      <button 
                        onClick={() => handleWithdraw(app._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                        title="Withdraw Application"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyApplications
`);

write('src/pages/company/Applicants.jsx', `
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationApi } from '../../api/applicationApi'
import { Download, ExternalLink, ChevronDown } from 'lucide-react'

const Applicants = () => {
  const { id } = useParams()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      const { data } = await applicationApi.getInternshipApplicants(id)
      setApplications(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [id])

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationApi.updateApplicationStatus(appId, newStatus)
      setApplications(applications.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
  }

  const getAvailableStatuses = (current) => {
    const transitions = {
      'Applied': ['Under Review'],
      'Under Review': ['Shortlisted', 'Rejected'],
      'Shortlisted': ['Interview Scheduled', 'Rejected'],
      'Interview Scheduled': ['Selected', 'Rejected'],
      'Rejected': [],
      'Selected': []
    }
    return transitions[current] || []
  }

  const filteredApps = filterStatus === 'All' 
    ? applications 
    : applications.filter(app => app.status === filterStatus)

  if (loading) return <div className="p-8 text-center">Loading applicants...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
          <p className="text-gray-500 mt-1">Manage applications for this role</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Filter Status:</label>
          <select 
            className="border p-2 rounded-lg bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Selected</option>
          </select>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow-sm border text-gray-500">
          No applicants yet for this internship.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Match Score</th>
                <th className="p-4 font-semibold">Applied Date</th>
                <th className="p-4 font-semibold">Resume</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredApps.map(app => {
                const availableStatuses = getAvailableStatuses(app.status)
                return (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{app.studentId?.name || 'Unknown'}</td>
                    <td className="p-4">
                      {app.aiMatchScore ? (
                        <span className={\`font-bold \${app.aiMatchScore >= 80 ? 'text-green-600' : 'text-yellow-600'}\`}>
                          {app.aiMatchScore}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {app.studentId?.resumeUrl ? (
                        <a href={app.studentId.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
                          <Download size={14} className="mr-1"/> Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not provided</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {availableStatuses.length > 0 ? (
                        <select 
                          className="border border-gray-300 rounded text-sm p-1.5 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-indigo-500"
                          onChange={(e) => {
                            if (e.target.value) handleStatusChange(app._id, e.target.value)
                            e.target.value = ""
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Update Status...</option>
                          {availableStatuses.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-gray-400">Final</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <div className="p-8 text-center text-gray-500">No applications match the selected filter.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Applicants
`);

console.log('M5 frontend files generated');
