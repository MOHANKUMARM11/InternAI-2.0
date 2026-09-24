import React, { useState, useEffect } from 'react'
import { progressApi } from '../../api/progressApi'
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react'

const ProgressTracker = () => {
  const [progresses, setProgresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [updateText, setUpdateText] = useState('')
  const [activeItem, setActiveItem] = useState(null)

  const fetchProgress = async () => {
    try {
      const res = await progressApi.getMyProgress()
      setProgresses(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!activeItem || !updateText.trim()) return

    try {
      await progressApi.submitUpdate(activeItem._id, { updateText })
      setUpdateText('')
      setActiveItem(null)
      fetchProgress()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-6">Loading progress tracker...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Internship Progress Companion</h1>
      <p className="text-gray-600">Submit your weekly updates and receive automated feedback.</p>

      {progresses.length === 0 ? (
        <div className="bg-white p-6 rounded shadow border text-center text-gray-500">
          No pending or submitted weekly updates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-lg text-gray-700">Weekly Tasks</h2>
            {progresses.map(p => (
              <div 
                key={p._id} 
                onClick={() => p.status === 'pending' ? setActiveItem(p) : setActiveItem(null)}
                className={`bg-white p-4 rounded shadow border cursor-pointer transition ${activeItem?._id === p._id ? 'ring-2 ring-indigo-500' : 'hover:border-indigo-300'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">Week {p.weekNumber}</span>
                  {p.status === 'pending' ? (
                    <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded"><Clock size={12} className="mr-1"/> Pending</span>
                  ) : (
                    <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded"><CheckCircle size={12} className="mr-1"/> Submitted</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Company: {p.company?.name || 'Unknown'}</p>
                {p.dueDate && <p className="text-xs text-gray-500">Due: {new Date(p.dueDate).toLocaleDateString()}</p>}
                
                {p.status === 'submitted' && p.aiFeedback && (
                  <div className="mt-3 p-2 bg-indigo-50 text-indigo-800 text-xs rounded border border-indigo-100">
                    <strong>Feedback:</strong> {p.aiFeedback}
                  </div>
                )}
                {p.status === 'submitted' && p.atRisk && (
                  <div className="mt-2 text-xs text-red-600 flex items-center">
                    <AlertTriangle size={12} className="mr-1"/> Flagged for review
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {activeItem ? (
              <div className="bg-white p-6 rounded shadow border">
                <h2 className="text-xl font-bold mb-4">Submit Update - Week {activeItem.weekNumber}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What did you accomplish this week? Any blockers?
                    </label>
                    <textarea 
                      value={updateText}
                      onChange={e => setUpdateText(e.target.value)}
                      className="w-full h-40 border p-3 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm"
                      placeholder="Write your update here..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700">
                    Submit Update
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded border border-dashed border-gray-300 flex items-center justify-center h-full min-h-[300px]">
                <p className="text-gray-500">Select a pending week to submit your update.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressTracker
