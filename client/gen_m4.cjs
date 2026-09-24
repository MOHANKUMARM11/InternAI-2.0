const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/api/internshipApi.js', `
import api from './axiosInstance'

export const internshipApi = {
  searchInternships: (params) => api.get('/internships', { params }),
  getInternshipById: (id) => api.get(\`/internships/\${id}\`),
  getCompanyInternships: () => api.get('/internships/company/mine'),
  createInternship: (data) => api.post('/internships', data),
  updateInternship: (id, data) => api.put(\`/internships/\${id}\`, data),
  deleteInternship: (id) => api.delete(\`/internships/\${id}\`)
}
`);

write('src/pages/student/InternshipList.jsx', `
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { internshipApi } from '../../api/internshipApi'
import { Search, Filter, MapPin, DollarSign, Clock } from 'lucide-react'

const InternshipList = () => {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [filters, setFilters] = useState({
    search: '',
    domain: '',
    isRemote: false,
    page: 1,
    limit: 12
  })

  const [totalPages, setTotalPages] = useState(1)

  const fetchInternships = async () => {
    setLoading(true)
    try {
      const { data } = await internshipApi.searchInternships(filters)
      setInternships(data.data)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [filters.page, filters.domain, filters.isRemote]) // fetch when these change

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters({ ...filters, page: 1 })
    fetchInternships()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm h-max">
        <h2 className="text-lg font-bold mb-4 flex items-center"><Filter size={20} className="mr-2"/> Filters</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Domain</label>
          <select 
            className="w-full border p-2 rounded text-sm"
            value={filters.domain}
            onChange={(e) => setFilters({ ...filters, domain: e.target.value, page: 1 })}
          >
            <option value="">All Domains</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full-Stack">Full-Stack</option>
            <option value="Data Science">Data Science</option>
            <option value="ML/AI">ML/AI</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <input 
            type="checkbox" 
            id="remote" 
            checked={filters.isRemote}
            onChange={(e) => setFilters({ ...filters, isRemote: e.target.checked, page: 1 })}
            className="mr-2"
          />
          <label htmlFor="remote" className="text-sm font-medium">Remote Only</label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <form onSubmit={handleSearch} className="mb-6 flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, skills..." 
              className="w-full pl-10 pr-4 py-3 rounded-l-lg border focus:outline-none focus:border-indigo-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition">
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">No internships found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map(intern => (
              <Link to={\`/internships/\${intern._id}\`} key={intern._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                      {intern.companyId?.logoUrl ? (
                        <img src={intern.companyId.logoUrl} alt="Logo" className="object-cover w-full h-full" />
                      ) : (
                        <span className="font-bold text-gray-400">{intern.companyId?.companyName?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">{intern.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{intern.companyId?.companyName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{intern.domain}</span>
                  {intern.isRemote && <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">Remote</span>}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400"/> {intern.location || 'Not specified'}</div>
                  <div className="flex items-center"><DollarSign size={16} className="mr-2 text-gray-400"/> {intern.stipend ? \`₹\${intern.stipend}/mo\` : 'Unpaid'}</div>
                  <div className="flex items-center"><Clock size={16} className="mr-2 text-gray-400"/> {intern.duration || 'Not specified'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button 
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {filters.page} of {totalPages}</span>
            <button 
              disabled={filters.page === totalPages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InternshipList
`);

write('src/pages/student/InternshipDetail.jsx', `
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { internshipApi } from '../../api/internshipApi'

const InternshipDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    internshipApi.getInternshipById(id)
      .then(({ data }) => setInternship(data.data))
      .catch(err => {
        alert('Failed to load internship')
        navigate('/internships')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleApply = () => {
    // We will implement Application in Module 5
    alert('Apply functionality will be implemented in Module 5')
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
          <button onClick={handleApply} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Apply Now
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
              <p className="font-semibold">{internship.stipend ? \`₹\${internship.stipend}/month\` : 'Unpaid'}</p>
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
`);

write('src/pages/company/PostInternship.jsx', `
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { internshipApi } from '../../api/internshipApi'

const PostInternship = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      domain: 'Frontend',
      location: '',
      isRemote: false,
      stipend: '',
      duration: '',
      openings: 1,
      skillsRequired: []
    }
  })

  const skillsArr = watch('skillsRequired') || []

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = e.target.value.trim()
      if (val && !skillsArr.includes(val)) {
        setValue('skillsRequired', [...skillsArr, val])
        e.target.value = ''
      }
    }
  }

  const removeSkill = (sk) => {
    setValue('skillsRequired', skillsArr.filter(s => s !== sk))
  }

  const onSubmit = async (data) => {
    try {
      if (data.stipend) data.stipend = Number(data.stipend)
      data.openings = Number(data.openings)
      await internshipApi.createInternship(data)
      alert('Internship Posted Successfully!')
      navigate('/company/internships')
    } catch (error) {
      alert(error.response?.data?.message || 'Error posting internship')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Post New Internship</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Internship Title</label>
          <input {...register('title')} required className="w-full border p-2 rounded" placeholder="e.g. React Developer Intern" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} required className="w-full border p-2 rounded" rows="5" placeholder="Details about the role..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <select {...register('domain')} required className="w-full border p-2 rounded">
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="Data Science">Data Science</option>
              <option value="ML/AI">ML/AI</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Openings</label>
            <input type="number" min="1" {...register('openings')} required className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input {...register('location')} className="w-full border p-2 rounded" placeholder="e.g. Bangalore, India" />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" id="isRemote" {...register('isRemote')} className="mr-2 h-4 w-4" />
            <label htmlFor="isRemote" className="text-sm font-medium">This is a Remote internship</label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stipend (per month in ₹)</label>
            <input type="number" {...register('stipend')} className="w-full border p-2 rounded" placeholder="Leave empty if unpaid" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input {...register('duration')} className="w-full border p-2 rounded" placeholder="e.g. 3 months" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills Required (Press Enter)</label>
          <input type="text" onKeyDown={handleAddSkill} className="w-full border p-2 rounded" placeholder="e.g. React, Node.js" />
          <div className="flex flex-wrap gap-2 mt-2">
            {skillsArr.map((sk, i) => (
              <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
                {sk}
                <button type="button" onClick={() => removeCulture(sk)} className="ml-2 text-indigo-500 hover:text-indigo-700">x</button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t mt-6 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50">
            {isSubmitting ? 'Posting...' : 'Post Internship'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostInternship
`);

write('src/pages/company/ManageInternships.jsx', `
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
                      className={\`px-3 py-1 rounded-full text-xs font-semibold \${intern.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}\`}
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
`);

console.log('M4 frontend files generated');
