import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { internshipApi } from '../../api/internshipApi'
import { Edit, Trash2, Users } from 'lucide-react'

const ManageInternships = () => {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInternships = async () => {
    setLoading(true)
    try {
      const { data } = await internshipApi.getCompanyInternships()
      setInternships(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await internshipApi.deleteInternship(id)
        setInternships(internships.filter(i => i._id !== id))
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await internshipApi.updateInternship(id, { isActive: !currentStatus })
      fetchInternships()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Internships</h1>
        <Link to="/company/internships/new" className="bg-indigo-600 text-white px-5 py-2 rounded font-medium hover:bg-indigo-700 transition">
          Post New Internship
        </Link>
      </div>

      {internships.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow-sm border text-gray-500">
          You haven't posted any internships yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Posted On</th>
                <th className="p-4 font-semibold">Applicants</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {internships.map(intern => (
                <tr key={intern._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{intern.title}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(intern.postedAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="flex items-center text-sm font-medium text-indigo-600">
                      <Users size={16} className="mr-1"/> {intern.applicantCount}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleActive(intern._id, intern.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${intern.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {intern.isActive ? 'Active' : 'Closed'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-indigo-600" title="Edit (Coming soon)"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(intern._id)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 size={18}/></button>
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

export default ManageInternships
