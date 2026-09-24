import React, { useState, useEffect } from 'react'
import { aiApi } from '../../api/aiApi'
import { Target, CheckCircle, ExternalLink, Calendar, PlusCircle } from 'lucide-react'

const SkillGap = () => {
  const [targetRole, setTargetRole] = useState('')
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoadmap()
  }, [])

  const fetchRoadmap = async () => {
    try {
      const { data } = await aiApi.getRoadmap()
      if (data.data) {
        setRoadmap(data.data)
        setTargetRole(data.data.targetRole)
      }
    } catch (err) {}
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!targetRole.trim()) return
    
    setLoading(true)
    setError('')
    try {
      const { data } = await aiApi.generateRoadmap({ targetRole })
      setRoadmap(data.data)
    } catch (err) {
      setError('Failed to generate roadmap')
    } finally {
      setLoading(false)
    }
  }

  const toggleStep = async (stepId) => {
    try {
      await aiApi.completeRoadmapStep({ stepId })
      // Local update
      const updatedSteps = roadmap.steps.map(s => s.id === stepId ? { ...s, completed: true } : s)
      setRoadmap({ ...roadmap, steps: updatedSteps })
    } catch (err) {}
  }

  const completedCount = roadmap?.steps?.filter(s => s.completed).length || 0
  const progressPercent = roadmap?.steps?.length ? Math.round((completedCount / roadmap.steps.length) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl p-8 shadow-xl text-white">
        <h1 className="text-3xl font-bold flex items-center mb-4">
          <Target className="mr-3 text-indigo-400" size={32}/> 
          AI Skill Gap Analysis
        </h1>
        <p className="text-gray-300 max-w-2xl mb-8">
          Tell us your dream job. We'll analyze your current profile and generate a week-by-week learning roadmap to get you there.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 max-w-2xl">
          <input 
            type="text" 
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Frontend Developer, Data Scientist..."
            className="flex-1 p-4 rounded-xl text-gray-900 focus:ring-4 focus:ring-indigo-500 outline-none font-medium"
          />
          <button 
            type="submit" 
            disabled={loading || !targetRole.trim()}
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-bold transition disabled:opacity-50 whitespace-nowrap flex items-center"
          >
            {loading ? 'Generating...' : 'Build Roadmap'}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>

      {roadmap && (
        <div className="space-y-8 animate-fade-in">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Target Role</div>
              <div className="text-xl font-black text-gray-800">{roadmap.targetRole}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Time</div>
              <div className="text-xl font-black text-gray-800">{roadmap.estimatedWeeks} Weeks</div>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Progress</div>
              <div className="flex items-center">
                <div className="text-xl font-black text-indigo-600 mr-3">{progressPercent}%</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills to Acquire</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {roadmap.gapSkills.map((sk, i) => (
                <span key={i} className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-red-100">
                  {sk}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Custom Timeline</h2>
            
            <div className="relative border-l-2 border-indigo-100 ml-4 space-y-8">
              {roadmap.steps.map((step, i) => (
                <div key={step.id} className="relative pl-8">
                  <div className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-indigo-100 text-indigo-600'}`}>
                    {step.completed ? <CheckCircle size={16} className="text-white"/> : <span className="text-xs font-bold">{i+1}</span>}
                  </div>
                  
                  <div className={`bg-gray-50 p-6 rounded-xl border transition ${step.completed ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-white px-3 py-1 rounded-md text-xs font-bold text-gray-500 border shadow-sm">Week {step.week}</span>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                          step.type === 'course' ? 'bg-blue-100 text-blue-700' :
                          step.type === 'project' ? 'bg-purple-100 text-purple-700' :
                          step.type === 'practice' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {step.type}
                        </span>
                      </div>
                      {!step.completed && (
                        <button onClick={() => toggleStep(step.id)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                          <CheckCircle size={16} className="mr-1"/> Mark Complete
                        </button>
                      )}
                    </div>
                    
                    <h3 className={`text-lg font-bold text-gray-900 mb-2 ${step.completed ? 'line-through' : ''}`}>{step.skill}</h3>
                    
                    <a href={step.resourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline">
                      <ExternalLink size={14} className="mr-1"/> {step.resource}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillGap
