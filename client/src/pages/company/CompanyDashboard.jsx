import React, { useEffect, useState } from 'react'
import { dashboardApi } from '../../api/dashboardApi'
import { Users, Briefcase, Clock, FileCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CompanyDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getCompanyDashboard()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>

  const { stats, applicationsPerListing, recentApplicants } = data

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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Company Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Listings" value={stats.totalListings} icon={Briefcase} color="bg-blue-100 text-blue-600" />
        <StatCard title="Total Applicants" value={stats.totalApplicants} icon={Users} color="bg-purple-100 text-purple-600" />
        <StatCard title="Shortlisted" value={stats.shortlistedCount} icon={FileCheck} color="bg-green-100 text-green-600" />
        <StatCard title="Pending Review" value={stats.pendingReview} icon={Clock} color="bg-yellow-100 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Applications per Listing</h2>
          {applicationsPerListing.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationsPerListing}>
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="applicants" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Applicants</h2>
          {recentApplicants.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent applicants.</p>
          ) : (
            <div className="space-y-4">
              {recentApplicants.map(app => (
                <div key={app._id} className="flex justify-between items-center p-3 border-b last:border-0">
                  <div>
                    <p className="font-semibold text-gray-800">{app.studentId?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">Applied for {app.internshipId?.title || 'Unknown Role'}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard
