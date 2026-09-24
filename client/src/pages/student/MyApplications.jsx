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
                    <Link to={`/internships/${app.internshipId?._id}`} className="font-medium text-indigo-600 hover:underline">
                      {app.internshipId?.title || 'Unknown Role'}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
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
