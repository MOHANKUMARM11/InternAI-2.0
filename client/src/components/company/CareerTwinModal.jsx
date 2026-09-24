import React, { useState, useEffect, useRef } from 'react'
import { aiApi } from '../../api/aiApi'
import { X, Send, Bot, Building2 } from 'lucide-react'

const CareerTwinModal = ({ applicationId, studentName, onClose }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const fetchHistory = async () => {
    try {
      const { data } = await aiApi.getTwinHistory(applicationId)
      if (data.data && data.data.length > 0) {
        setMessages(data.data)
      } else {
        setMessages([{ role: 'twin', content: `Hello! I am the AI Career Twin of ${studentName}. I can answer questions about their skills, experience, and background based on their profile.` }])
      }
    } catch (err) {}
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    const newHistory = [...messages, { role: 'company', content: userMsg }]
    setMessages(newHistory)
    setInput('')
    setLoading(true)

    try {
      const { data } = await aiApi.chatWithTwin(applicationId, { message: userMsg, history: messages })
      setMessages([...newHistory, { role: 'twin', content: data.data }])
    } catch (err) {
      setMessages([...newHistory, { role: 'twin', content: 'Sorry, I am offline right now.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center">
            <div className="bg-gray-800 p-2 rounded-full mr-3 border border-gray-700">
              <Bot className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{studentName}'s Career Twin</h2>
              <p className="text-xs text-gray-400">AI Screening Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-800 hover:bg-red-500 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'company' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${m.role === 'company' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  m.role === 'company' ? 'bg-indigo-600 text-white ml-3' : 'bg-gray-800 text-indigo-400 mr-3'
                }`}>
                  {m.role === 'company' ? <Building2 size={16}/> : <Bot size={16}/>}
                </div>
                <div className={`p-3.5 rounded-2xl text-sm ${
                  m.role === 'company' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border shadow-sm text-gray-700 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                  <Bot size={16} className="text-indigo-400"/>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border shadow-sm rounded-tl-none flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask ${studentName}'s twin about their background...`}
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="bg-gray-900 text-white p-3 rounded-xl hover:bg-black transition disabled:opacity-50 flex items-center justify-center w-12"
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default CareerTwinModal
