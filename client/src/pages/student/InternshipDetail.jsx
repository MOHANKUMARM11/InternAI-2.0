import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { internshipApi } from '../../api/internshipApi'
import { applicationApi } from '../../api/applicationApi'
import { useAuthStore } from '../../store/useAuthStore'

const InternshipDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    internshipApi.getInternshipById(id)
      .then(({ data }) => setInternship(data.data))
      .catch(err => {
        alert('Failed to load internship')
        navigate('/internships')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleApply = async () => {
    if (!user) {
      alert('Please login to apply')
      navigate('/login')
      return
    }
    if (user.role !== 'student') {
      alert('Only students can apply to internships')
      return
    }
    
    setApplying(true)
    try {
      await applicationApi.applyToInternship({ internshipId: id })
      alert('Applied successfully!')
      navigate('/student/applications')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="p-12 text-center">Loading...</div>
  if (!internship) return null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-start justify-between mb-8 pb-8 border-b">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
              {internship.companyId?.logoUrl ? (
                <img src={internship.companyId.logoUrl} alt="Logo" className="object-cover w-full h-full" />
              ) : (
                <span className="font-bold text-gray-400 text-2xl">{internship.companyId?.companyName?.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
              <p className="text-lg text-indigo-600 font-medium">{internship.companyId?.companyName}</p>
            </div>
          </div>
          <button 
            onClick={handleApply} 
            disabled={applying}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">About the Internship</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{internship.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skillsRequired?.map((sk, idx) => (
                  <span key={idx} className="bg-gray-100 border text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{sk}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border h-max space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Domain</p>
              <p className="font-semibold">{internship.domain}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Location</p>
              <p className="font-semibold">{internship.isRemote ? 'Remote' : internship.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Stipend</p>
              <p className="font-semibold">{internship.stipend ? `₹${internship.stipend}/month` : 'Unpaid'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Duration</p>
              <p className="font-semibold">{internship.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Openings</p>
              <p className="font-semibold">{internship.openings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Applicants</p>
              <p className="font-semibold">{internship.applicantCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternshipDetail
