import React, { useEffect, useState } from 'react'
import { marketApi } from '../../api/marketApi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

const MarketPulseWidget = () => {
  const [pulseData, setPulseData] = useState(null)
  const [activeDomain, setActiveDomain] = useState('Frontend Developer')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    marketApi.getPulse()
      .then(res => setPulseData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4 text-center">Loading Market Pulse...</div>
  if (!pulseData) return null

  const domains = Object.keys(pulseData)
  if (domains.length === 0) return <div className="p-4 text-gray-500">No market data available yet.</div>

  const currentDomainData = pulseData[activeDomain]
  
  if (!currentDomainData) return <div className="p-4 text-gray-500">Select a domain.</div>

  const chartData = currentDomainData.skills.slice(0, 10).map(s => ({
    name: s.skill,
    Demand: s.count
  }))

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        Live Market Intelligence <span className="ml-2 text-xs font-normal bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Last updated: {new Date(currentDomainData.fetchedAt).toLocaleDateString()}</span>
      </h2>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {domains.map(d => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${activeDomain === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="Demand" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">Top Trending Skills</h3>
          <div className="space-y-3">
            {currentDomainData.skills.slice(0, 5).map((skill, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-800 text-sm">{skill.skill}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{skill.count} mentions</span>
                  {skill.change > 0 ? (
                    <span className="text-green-500 flex items-center text-xs font-semibold"><TrendingUp size={12} className="mr-1"/> +{skill.change}%</span>
                  ) : skill.change < 0 ? (
                    <span className="text-red-500 flex items-center text-xs font-semibold"><TrendingDown size={12} className="mr-1"/> {skill.change}%</span>
                  ) : (
                    <span className="text-gray-400 text-xs font-semibold">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketPulseWidget
