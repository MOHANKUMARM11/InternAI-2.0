const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/api/dashboardApi.js', `
import api from './axiosInstance'

export const dashboardApi = {
  getStudentDashboard: () => api.get('/dashboard/student'),
  getCompanyDashboard: () => api.get('/dashboard/company'),
  getAdminDashboard: () => api.get('/dashboard/admin')
}
`);

write('src/pages/student/StudentDashboard.jsx', `
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi } from '../../api/dashboardApi'
import { FileText, Github, Target, Briefcase, ChevronRight } from 'lucide-react'

const StudentDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStudentDashboard()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>

  const { applicationStats, recentApplications, recommendations, resumeScore, githubScore, interviewScore } = data

  const ScoreCard = ({ title, score, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
      <div className={\`p-4 rounded-full \${color}\`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className="flex items-end space-x-2">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className="text-gray-400 text-sm mb-1">/ 100</span>
        </div>
      </div>
    </div>
  )

  const StatBox = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>

      {/* Scores Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard title="Resume Score" score={resumeScore} icon={FileText} color="bg-blue-100 text-blue-600" />
        <ScoreCard title="GitHub Score" score={githubScore} icon={Github} color="bg-gray-200 text-gray-700" />
        <ScoreCard title="Interview Readiness" score={interviewScore} icon={Target} color="bg-green-100 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Application Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox label="Applied" value={applicationStats.applied} />
              <StatBox label="Shortlisted" value={applicationStats.shortlisted} />
              <StatBox label="Selected" value={applicationStats.selected} />
              <StatBox label="Rejected" value={applicationStats.rejected} />
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Applications</h2>
              <Link to="/student/applications" className="text-sm text-indigo-600 font-medium hover:underline">View All</Link>
            </div>
            {recentApplications.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent applications.</p>
            ) : (
              <div className="space-y-4">
                {recentApplications.map(app => (
                  <div key={app._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{app.internshipId?.title}</p>
                        <p className="text-sm text-gray-500">{app.internshipId?.companyId?.companyName}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recommended for You</h2>
            {recommendations.length === 0 ? (
              <p className="text-gray-500 text-sm">Update your skills to get recommendations.</p>
            ) : (
              <div className="space-y-4">
                {recommendations.map(job => (
                  <Link key={job._id} to={\`/internships/\${job._id}\`} className="block group">
                    <div className="border rounded-lg p-4 hover:border-indigo-500 transition">
                      <p className="font-semibold text-gray-800 group-hover:text-indigo-600">{job.title}</p>
                      <p className="text-sm text-gray-500 mb-2">{job.companyId?.companyName}</p>
                      <div className="flex items-center text-xs text-indigo-600 font-medium">
                        View Details <ChevronRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
`);

write('src/pages/company/CompanyDashboard.jsx', `
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
      <div className={\`p-4 rounded-full \${color}\`}>
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
`);

write('src/pages/admin/AdminDashboard.jsx', `
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
      <div className={\`p-4 rounded-full \${color}\`}>
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
        <StatCard title="Placement Rate" value={\`\${stats.placementRate}%\`} icon={AlertTriangle} color="bg-yellow-100 text-yellow-600" />
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
                      <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
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
`);

console.log('M6 frontend files generated');
