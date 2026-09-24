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
              <Link to={`/internships/${intern._id}`} key={intern._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition group">
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
                  <div className="flex items-center"><DollarSign size={16} className="mr-2 text-gray-400"/> {intern.stipend ? `₹${intern.stipend}/mo` : 'Unpaid'}</div>
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
