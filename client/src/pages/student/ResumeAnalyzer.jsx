import React, { useState } from 'react'
import { aiApi } from '../../api/aiApi'
import { FileText, CheckCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

const ResumeAnalyzer = () => {
  const { user } = useAuthStore()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await aiApi.analyzeResume()
      setAnalysis(data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  const ScoreRing = ({ score, label }) => {
    const radius = 36
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference
    const color = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'

    return (
      <div className="flex flex-col items-center">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
            <circle
              className={`${color} transition-all duration-1000 ease-in-out`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
          </svg>
          <span className="absolute text-2xl font-bold text-gray-700">{score}</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-600">{label}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-3 text-indigo-600" size={32} />
            AI Resume Analyzer
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl">
            Get instant feedback on your resume. Our AI evaluates ATS compatibility, extracts skills, and provides actionable improvements.
          </p>
        </div>
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center"
        >
          {loading ? <><RefreshCw className="animate-spin mr-2" size={20}/> Analyzing...</> : 'Analyze My Resume'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg font-medium">{error}</div>}

      {analysis && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Executive Summary</h2>
              <p className="text-gray-600">{analysis.summary}</p>
            </div>
            <div className="flex justify-around col-span-1 lg:col-span-2">
              <ScoreRing score={analysis.overallScore} label="Overall Score" />
              <ScoreRing score={analysis.atsScore} label="ATS Match" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Strengths */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold text-green-700 flex items-center mb-4">
                <CheckCircle className="mr-2" size={20}/> Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold text-yellow-600 flex items-center mb-4">
                <AlertTriangle className="mr-2" size={20}/> Areas to Improve
              </h3>
              <div className="space-y-4">
                {analysis.improvements.map((imp, i) => (
                  <div key={i} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800 text-sm">{imp.issue}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        imp.priority === 'high' ? 'bg-red-100 text-red-700' : 
                        imp.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {imp.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">{imp.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold text-red-600 flex items-center mb-4">
                <AlertCircle className="mr-2" size={20}/> Missing Keywords
              </h3>
              {analysis.missingKeywords.length === 0 ? (
                <p className="text-gray-500 text-sm">Your resume has excellent keyword coverage!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="text-lg font-bold text-indigo-600 flex items-center mt-6 mb-4">
                <CheckCircle className="mr-2" size={20}/> Extracted Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.extractedSkills.map((sk, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium border border-indigo-100">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeAnalyzer
