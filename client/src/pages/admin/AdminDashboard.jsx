import React, { useEffect, useState } from 'react'
import { dashboardApi } from '../../api/dashboardApi'
import { Users, Building, Briefcase, AlertTriangle } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getAdminDashboard()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>

  const { stats, topStudents, domainDistribution, monthWisePlacement } = data

  const COLORS = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#6366f1']

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="bg-blue-100 text-blue-600" />
        <StatCard title="Total Companies" value={stats.totalCompanies} icon={Building} color="bg-purple-100 text-purple-600" />
        <StatCard title="Total Internships" value={stats.totalInternships} icon={Briefcase} color="bg-green-100 text-green-600" />
        <StatCard title="Placement Rate" value={`${stats.placementRate}%`} icon={AlertTriangle} color="bg-yellow-100 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Domain Distribution</h2>
          {domainDistribution.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No data</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={domainDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {domainDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {domainDistribution.map((d, i) => (
                  <div key={i} className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Placement Trend (Coming Soon)</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed">
            <p className="text-gray-400">Not enough data points yet.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Top Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-600 text-sm">
              <tr>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Resume Score</th>
                <th className="p-3 font-semibold">GitHub Score</th>
                <th className="p-3 font-semibold">Interview Score</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topStudents.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.resumeScore || 'N/A'}</td>
                  <td className="p-3">{s.githubScore || 'N/A'}</td>
                  <td className="p-3">{s.interviewScore || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {topStudents.length === 0 && <p className="p-4 text-center text-gray-500">No students found.</p>}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
