import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi } from '../../api/dashboardApi'
import { FileText, Code, Target, Briefcase, ChevronRight } from 'lucide-react'

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
      <div className={`p-4 rounded-full ${color}`}>
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
        <ScoreCard title="GitHub Score" score={githubScore} icon={Code} color="bg-gray-200 text-gray-700" />
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
          {/* AI Tools Quick Links */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-bold text-gray-800 mb-4">AI Tools</h2>
            <div className="flex flex-col space-y-3">
              <Link to="/student/recommendations" className="text-indigo-600 font-medium hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" /> AI Recommendations
              </Link>
              <Link to="/student/interview-prep" className="text-indigo-600 font-medium hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" /> Interview Prep
              </Link>
              <Link to="/student/career-chatbot" className="text-indigo-600 font-medium hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" /> Career Chatbot
              </Link>
              <Link to="/student/skill-gap" className="text-indigo-600 font-medium hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" /> Skill Gap Analysis
              </Link>
              <Link to="/student/resume-analyzer" className="text-indigo-600 font-medium hover:underline flex items-center">
                <ChevronRight size={16} className="mr-1" /> Resume Analyzer
              </Link>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recommended for You</h2>
            {recommendations.length === 0 ? (
              <p className="text-gray-500 text-sm">Update your skills to get recommendations.</p>
            ) : (
              <div className="space-y-4">
                {recommendations.map(job => (
                  <Link key={job._id} to={`/internships/${job._id}`} className="block group">
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
