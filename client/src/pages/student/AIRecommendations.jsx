import React, { useState, useEffect } from 'react'
import { aiApi } from '../../api/aiApi'
import { Sparkles, MapPin, Building, Info, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const { data } = await aiApi.getRecommendations()
      setRecommendations(data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <Sparkles className="mr-3" size={32} />
            AI Matched Internships
          </h1>
          <p className="text-indigo-100 max-w-xl">
            We've analyzed your skills, projects, and goals to find the best opportunities for you. These aren't just keyword matches — they're semantic fits.
          </p>
        </div>
        <button onClick={fetchRecommendations} disabled={loading} className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition disabled:opacity-50">
          Refresh Matches
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-700">No new matches right now</h3>
          <p className="text-gray-500 mt-2">Try updating your profile or check back later.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
              <div className="flex flex-col md:flex-row gap-6 ml-2">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{rec.internship?.title}</h3>
                      <div className="flex items-center text-gray-500 mt-1 space-x-4">
                        <span className="flex items-center"><Building size={16} className="mr-1"/> {rec.internship?.companyId?.companyName}</span>
                        <span className="flex items-center"><MapPin size={16} className="mr-1"/> {rec.internship?.companyId?.location || 'Remote'}</span>
                      </div>
                    </div>
                    <div className="text-center bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                      <div className="text-2xl font-black text-indigo-600">{rec.matchScore}%</div>
                      <div className="text-xs font-semibold text-indigo-800 uppercase">Match</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-indigo-50/50 p-4 rounded-lg border border-indigo-50 flex items-start">
                    <Info className="text-indigo-500 mr-3 shrink-0 mt-0.5" size={20} />
                    <p className="text-gray-700 text-sm">{rec.matchReason}</p>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                  <Link 
                    to={`/internships/${rec.internship?._id}`}
                    className="w-full text-center bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIRecommendations
