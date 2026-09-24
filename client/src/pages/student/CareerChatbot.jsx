import React, { useState, useRef, useEffect } from 'react'
import { aiApi } from '../../api/aiApi'
import { Send, Bot, User, Trash2 } from 'lucide-react'

const CareerChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your AI Career Coach. Ask me anything about skills, resume improvement, or interview prep.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async (text) => {
    if (!text.trim()) return
    
    const userMsg = text.trim()
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const historyPayload = messages.filter(m => m.role !== 'assistant' || m.content !== 'Hi! I am your AI Career Coach. Ask me anything about skills, resume improvement, or interview prep.')
      const { data } = await aiApi.chatWithBot({ message: userMsg, history: historyPayload })
      setMessages([...newMessages, { role: 'assistant', content: data.data }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }])
    } finally {
      setLoading(false)
    }
  }

  const quickPrompts = [
    "Which skills should I learn next?",
    "How do I improve my resume?",
    "What salary should I expect?"
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 rounded-t-2xl shadow-sm border-b">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-full mr-3">
            <Bot className="text-indigo-600" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">AI Career Coach</h1>
            <p className="text-xs text-green-600 font-medium">● Online</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="text-gray-400 hover:text-red-500 transition"
          title="Clear History"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6 border-x shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-gray-800 text-white ml-3' : 'bg-indigo-600 text-white mr-3'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-gray-800 text-white rounded-tr-none' : 'bg-white border shadow-sm text-gray-700 rounded-tl-none'}`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-indigo-600 text-white mr-3">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white border shadow-sm rounded-tl-none flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 border rounded-b-2xl shadow-sm">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
          {quickPrompts.map((p, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(p)}
              className="whitespace-nowrap bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-indigo-100 transition border border-indigo-100"
            >
              {p}
            </button>
          ))}
        </div>
        <form 
          onSubmit={e => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center w-12"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default CareerChatbot
