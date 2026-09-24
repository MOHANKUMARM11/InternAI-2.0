import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { peerApi } from '../../api/peerApi'
import { useAuthStore } from '../../store/useAuthStore'
import { io } from 'socket.io-client'

const PeerInterview = () => {
  const { user } = useAuthStore()
  const { register, handleSubmit } = useForm()
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMsg, setInputMsg] = useState('')
  const [role, setRole] = useState('')
  const [partner, setPartner] = useState('')

  const fetchSessions = async () => {
    try {
      const res = await peerApi.getSessions()
      setSessions(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const onBook = async (data) => {
    try {
      await peerApi.bookSession(data)
      fetchSessions()
    } catch (err) {
      console.error(err)
    }
  }

  const joinSession = (session) => {
    const newSocket = io('http://localhost:5000') // or import from env
    setSocket(newSocket)

    newSocket.on('connect', () => {
      newSocket.emit('join_session', { sessionId: session._id, studentId: user.id })
    })

    newSocket.on('session_ready', (data) => {
      setActiveSession(session)
      setRole(data.role)
      setPartner(data.partnerName)
    })

    newSocket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    newSocket.on('session_ended', () => {
      endSessionLocally()
    })
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!inputMsg.trim() || !socket || !activeSession) return
    socket.emit('send_message', {
      roomId: activeSession.roomId,
      text: inputMsg,
      speaker: role
    })
    setInputMsg('')
  }

  const endSession = async () => {
    if (socket && activeSession) {
      socket.emit('end_session', { roomId: activeSession.roomId })
      // Evaluate session
      try {
         await peerApi.evaluateSession(activeSession._id, messages)
      } catch (err) {
         console.error(err)
      }
      endSessionLocally()
    }
  }

  const endSessionLocally = () => {
    if (socket) socket.disconnect()
    setActiveSession(null)
    setSocket(null)
    setMessages([])
    setRole('')
    setPartner('')
    fetchSessions()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Peer Mock Interview Exchange</h1>

      {!activeSession ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow border">
            <h2 className="text-lg font-semibold mb-4">Book / Find Match</h2>
            <form onSubmit={handleSubmit(onBook)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Domain</label>
                <select {...register('domain')} className="w-full border p-2 rounded">
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Find Match</button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Your Sessions</h2>
            {sessions.map(s => (
              <div key={s._id} className="bg-white p-4 rounded shadow border flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{s.domain}</p>
                  <p className="text-sm text-gray-500">Status: <span className="font-medium">{s.status}</span></p>
                </div>
                {s.status === 'matched' && (
                  <button onClick={() => joinSession(s)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                    Join Room
                  </button>
                )}
                {s.status === 'completed' && (
                  <div className="text-sm text-gray-500">
                    {s.evaluation?.interviewerScore && `Scores: ${s.evaluation.interviewerScore} / ${s.evaluation.intervieweeScore}`}
                  </div>
                )}
              </div>
            ))}
            {sessions.length === 0 && <p className="text-gray-500">No sessions booked.</p>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <div className="lg:col-span-2 bg-white rounded shadow border flex flex-col">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold">Interview Room - {activeSession.domain}</h2>
              <button onClick={endSession} className="text-sm bg-red-600 text-white px-3 py-1 rounded">End Session</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.speaker === role ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${m.speaker === role ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-800'}`}>
                    <span className="text-xs opacity-75 block mb-1">{m.speaker === role ? 'You' : partner}</span>
                    <p className="text-sm">{m.text}</p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-center text-gray-400 mt-10">Chat started. Say hi!</p>}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t bg-white flex">
              <input 
                type="text" 
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-l px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-6 rounded-r font-medium hover:bg-indigo-700">Send</button>
            </form>
          </div>

          <div className="bg-white rounded shadow border p-4 space-y-4 overflow-y-auto">
            <h3 className="font-bold border-b pb-2">Session Info</h3>
            <div>
              <p className="text-sm text-gray-500">Your Role</p>
              <p className="font-medium capitalize">{role}</p>
            </div>
            {role === 'interviewer' && activeSession.questions && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Suggested Questions</p>
                <ul className="space-y-3">
                  {activeSession.questions.map(q => (
                    <li key={q.id} className="text-sm bg-gray-50 p-2 rounded border border-gray-100">
                      {q.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PeerInterview
