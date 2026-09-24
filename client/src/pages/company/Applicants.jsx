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
                        <span className={`font-bold ${app.aiMatchScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
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
