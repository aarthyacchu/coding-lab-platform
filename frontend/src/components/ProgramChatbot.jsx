// frontend/src/components/ProgramChatbot.jsx
import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Loader2, Bot, User } from 'lucide-react'
import { askChatbot } from '../services/api'

export default function ProgramChatbot({ program }) {
  const [messages,   setMessages]   = useState([])   // { role, content }
  const [input,      setInput]      = useState('')
  const [isLoading,  setIsLoading]  = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const question = input.trim()
    if (!question || isLoading) return

    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await askChatbot(
        program.title,
        program.description,
        program.concepts || [],
        messages,          // prior history for context
        question
      )
      setMessages(prev => [...prev, { role: 'assistant', content: result.answer }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I could not process that. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-96'>

      {/* Header */}
      <div className='flex items-center gap-2 px-4 py-3 border-b border-gray-700'>
        <MessageCircle size={16} className='text-blue-400' />
        <span className='text-white font-semibold text-sm'>Ask about this program</span>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {messages.length === 0 && (
          <div className='text-center py-8'>
            <Bot size={28} className='text-gray-600 mx-auto mb-2' />
            <p className='text-gray-400 text-sm'>
              Ask anything about the logic -- I'll guide you, not solve it for you.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}
               className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <Bot size={16} className='text-blue-400 mt-1 flex-shrink-0' />
            )}
            <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%]
                             ${msg.role === 'user'
                                 ? 'bg-blue-600 text-white'
                                 : 'bg-gray-700 text-gray-200'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <User size={16} className='text-gray-400 mt-1 flex-shrink-0' />
            )}
          </div>
        ))}

        {isLoading && (
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <Loader2 size={14} className='animate-spin' /> Thinking...
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className='flex items-center gap-2 p-3 border-t border-gray-700'>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. Why does this need a loop?'
          className='flex-1 bg-gray-700 text-white text-sm rounded-lg px-3 py-2
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900
                     text-white rounded-lg p-2.5 transition'
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
