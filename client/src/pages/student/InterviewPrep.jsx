import React, { useState } from 'react'
import { aiApi } from '../../api/aiApi'
import { MessageSquare, CheckCircle, XCircle, ChevronRight, Award } from 'lucide-react'

const InterviewPrep = () => {
  const [domain, setDomain] = useState('Frontend')
  const [level, setLevel] = useState('Beginner')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [sessionScore, setSessionScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleStart = async () => {
    try {
      const { data } = await aiApi.generateQuestions({ domain, level })
      setQuestions(data.data.questions)
      setCurrentIndex(0)
      setCompleted(false)
      setSessionScore(0)
      setFeedback(null)
      setAnswer('')
    } catch (err) {
      alert('Failed to generate questions')
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return
    setEvaluating(true)
    try {
      const currentQ = questions[currentIndex]
      const { data } = await aiApi.evaluateAnswer({
        question: currentQ.question,
        answer,
        domain
      })
      
      const newFeedback = data.data
      setFeedback(newFeedback)
      
      const updatedQuestions = [...questions]
      updatedQuestions[currentIndex] = { ...currentQ, answer, feedback: newFeedback }
      setQuestions(updatedQuestions)
      
      setSessionScore(prev => prev + (newFeedback.score || 0))
    } catch (err) {
      alert('Evaluation failed')
    } finally {
      setEvaluating(false)
    }
  }

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1)
      setFeedback(null)
      setAnswer('')
    } else {
      // Save session
      setCompleted(true)
      try {
        const answersPayload = questions.map(q => ({
          questionId: q.id,
          answer: q.answer,
          score: q.feedback?.score,
          feedback: q.feedback
        }))
        await aiApi.saveSession({ domain, level, questions, answers: answersPayload })
      } catch (err) {
        console.error('Failed to save session')
      }
    }
  }

  if (completed) {
    const avg = (sessionScore / questions.length).toFixed(1)
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white rounded-2xl shadow-xl mt-12 border border-gray-100">
        <Award className="mx-auto text-yellow-500 mb-6" size={80} />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Practice Complete!</h2>
        <p className="text-gray-500 mb-8">You've completed 10 questions in {domain} ({level})</p>
        
        <div className="text-5xl font-black text-indigo-600 mb-4">{avg}/10</div>
        <p className="text-gray-600 font-medium uppercase tracking-wider mb-8">Average Score</p>
        
        <button onClick={() => setQuestions([])} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
          Start New Session
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="mr-3 text-indigo-600" />
            AI Mock Interview
          </h1>
          <p className="text-gray-500 mt-1">Practice answering technical and behavioral questions</p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center max-w-lg mx-auto">
          <div className="space-y-4 mb-6 text-left">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Domain</label>
              <select value={domain} onChange={e => setDomain(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50">
                <option>Frontend</option>
                <option>Backend</option>
                <option>Full-Stack</option>
                <option>Data Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <button onClick={handleStart} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Start Practice
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <span className="font-semibold text-gray-600">Question {currentIndex + 1} of {questions.length}</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">
              {questions[currentIndex].type}
            </span>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
              {questions[currentIndex].question}
            </h3>

            {!feedback ? (
              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-gray-50"
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !answer.trim()}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {evaluating ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <p className="text-gray-600 italic">Your answer: "{answer}"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                    <h4 className="flex items-center font-bold text-green-800 mb-2">
                      <CheckCircle className="mr-2" size={18}/> What went well
                    </h4>
                    <p className="text-green-700 text-sm">{feedback.whatWasGood}</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                    <h4 className="flex items-center font-bold text-red-800 mb-2">
                      <XCircle className="mr-2" size={18}/> What was missing
                    </h4>
                    <p className="text-red-700 text-sm">{feedback.whatWasMissing}</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-800 mb-2">Better Answer Example</h4>
                  <p className="text-indigo-700 text-sm leading-relaxed">{feedback.betterAnswer}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2 font-medium">AI Score:</span>
                    <span className={`text-2xl font-black ${feedback.score >= 7 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {feedback.score}/10
                    </span>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="flex items-center bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition"
                  >
                    {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'} <ChevronRight className="ml-2" size={18}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewPrep
