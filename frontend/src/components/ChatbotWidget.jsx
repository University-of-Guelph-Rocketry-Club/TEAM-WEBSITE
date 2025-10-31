import { 
  sendChatMessage, 
  getConversations, 
  createConversation, 
  getConversation,
  deleteConversation 
} from '../lib/api'
import DOMPurify from 'dompurify'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConversations, setShowConversations] = useState(false)
  
  const navigate = useNavigate()
  const messagesContainerRef = useRef(null) // NEW: container ref for intercepting clicks
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Intercept anchor clicks inside the chatbot and navigate via react-router
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const onClick = (e) => {
      const a = e.target.closest('a')
      if (!a || !container.contains(a)) return

      const href = a.getAttribute('href')
      if (!href) return

      // allow external links (different origin) to behave normally
      try {
        const url = new URL(href, window.location.href)
        if (url.origin === window.location.origin) {
          e.preventDefault()
          // navigate to path + search + hash so SPA handles it
          const path = url.pathname + url.search + url.hash
          navigate(path)
        }
      } catch (err) {
        // if URL parsing fails, ignore and let browser handle it
      }
    }

    container.addEventListener('click', onClick)
    return () => container.removeEventListener('click', onClick)
  }, [navigate])

  useEffect(() => {
    if (isOpen) {
      fetchConversations()
    }
  }, [isOpen])

  useEffect(() => {
    // Listen for custom event to open chatbot
    const handleOpenChatbot = () => setIsOpen(true)
    window.addEventListener('openChatbot', handleOpenChatbot)
    return () => window.removeEventListener('openChatbot', handleOpenChatbot)
  }, [])

  // keep your hooks and refs above
  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (container) {
      // scroll container to bottom (use clientHeight to avoid odd jumps)
      container.scrollTop = container.scrollHeight - container.clientHeight
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Ensure we scroll after messages load or when panel opens
  useEffect(() => {
    if (!isOpen) return
    // slight delay to let layout complete
    const t = setTimeout(() => {
      scrollToBottom()
      // focus input so user can type immediately
      inputRef.current?.focus()
    }, 50)
    return () => clearTimeout(t)
  }, [isOpen, messages.length, currentConversation?.id])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setLoading(true)

    const tempUserMessage = {
      id: Date.now(),
      content: userMessage,
      is_user: true,
      timestamp: new Date().toISOString()
    }
    const typingIndicator = {
      id: 'typing',
      content: 'Assistant is typing…',
      is_user: false,
      timestamp: new Date().toISOString(),
      typing: true
    }

    setMessages(prev => [...prev, tempUserMessage, typingIndicator])
    scrollToBottom()

    try {
      const response = await sendChatMessage({
        content: userMessage,
        conversation_id: currentConversation?.id
      })

      const { message: aiMessage, conversation } = response.data

      if (!currentConversation) {
        setCurrentConversation(conversation)
        setConversations(prev => [conversation, ...prev])
      }

      setMessages(prev => {
        const cleaned = prev.filter(m => m.id !== 'typing')
        return [
          ...cleaned.slice(0, -1),
          { ...tempUserMessage, id: tempUserMessage.id },
          aiMessage
        ]
      })
      scrollToBottom()
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => prev.filter(m => m.id !== 'typing').slice(0, -1))
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {
      const res = await getConversations()
      setConversations(res.data || [])
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    }
  }

  const loadConversation = async (conversationId) => {
    try {
      // fetch conversation with full messages (backend endpoint returns messages)
      const res = await getConversation(conversationId)
      const conv = res.data
      setCurrentConversation(conv)
      setMessages(conv.messages || [])
      setShowConversations(false)
      // ensure scroll
      setTimeout(() => scrollToBottom(), 50)
    } catch (err) {
      console.error('Failed to load conversation:', err)
      alert('Could not load that conversation.')
    }
  }

  const startNewConversation = async () => {
    try {
      const res = await createConversation({ title: 'New Conversation' })
      const conv = res.data
      setConversations(prev => [conv, ...prev])
      setCurrentConversation(conv)
      setMessages([])
      setShowConversations(false)
      setTimeout(() => scrollToBottom(), 50)
    } catch (err) {
      console.error('Failed to create conversation:', err)
      alert('Could not create a new conversation.')
    }
  }

  function parseTimestampToDate(ts) {
    if (!ts) return new Date()
    if (typeof ts === 'string' && !/[zZ]|[+\-]\d{2}:\d{2}$/.test(ts)) ts = ts + 'Z'
    return new Date(ts)
  }

  function formatMessageTime(ts) {
    const date = parseTimestampToDate(ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      await deleteConversation(conversationId)
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      alert('Failed to delete conversation.')
    }
  }

  // keep existing parseTimestampToDate and formatMessageTime but ensure they parse ISO strings
  function parseTimestampToDate(ts) {
    if (!ts) return new Date()
    if (typeof ts === 'string' && !/[zZ]|[+\-]\d{2}:\d{2}$/.test(ts)) ts = ts + 'Z'
    return new Date(ts)
  }

  function formatMessageTime(ts) {
    const date = parseTimestampToDate(ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  return (
    <>
      {/* CLOSED: small floating button (only rendered when closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
            title="Open assistant"
          >
            <span className="text-xl">🤖</span>
          </button>
        </div>
      )}

      {/* OPEN: constrained panel (render only when open) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[620px] pointer-events-auto">
          <div className="w-full h-full flex flex-col" style={{ pointerEvents: 'auto' }}>
            <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl chat-backdrop flex flex-col">
              {/* Header (sticky) */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white p-4 flex justify-between items-center rounded-t-3xl sticky top-0 z-30 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-semibold">Rocketry Assistant</h3>
                    <p className="text-xs opacity-90">{currentConversation ? 'In conversation' : 'Ready to help!'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => setShowConversations(!showConversations)} className="p-1 hover:bg-white/10 rounded">📚</button>
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">✕</button>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col h-full">
                {showConversations ? (
                  <div className="p-4 overflow-y-auto h-full">
                    {/* conversations list */}
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Conversations</h4>
                      <button onClick={startNewConversation} className="text-primary-600 hover:text-primary-800 text-sm">+ New</button>
                    </div>
                    <div className="space-y-2">
                      {conversations.map(conv => (
                        <div key={conv.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer group">
                          <div onClick={() => loadConversation(conv.id)} className="flex-1">
                            <p className="text-sm font-medium truncate">{conv.title}</p>
                            <p className="text-xs text-gray-500">{new Date(conv.updated_at).toLocaleDateString()}</p>
                          </div>
                          <button onClick={() => handleDeleteConversation(conv.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs p-1">🗑️</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Messages (scrollable region) */}
                    <div
                      ref={messagesContainerRef}
                      className="chat-messages flex-1 p-4 overflow-y-auto space-y-4 bg-transparent"
                      style={{ backdropFilter: 'blur(6px)' }}>
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-400 mt-8">
                          <div className="text-5xl mb-4">🚀</div>
                          <p className="text-sm">Hi! I'm your rocketry assistant. Ask me anything.</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div key={message.id} className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[78%] rounded-2xl px-4 py-3 mb-2 ${message.is_user ? 'bg-primary-600 text-white' : 'bg-white/90 text-gray-900'}`} style={{ boxShadow: message.is_user ? '0 6px 18px rgba(99,102,241,0.12)' : '0 6px 18px rgba(0,0,0,0.06)' }}>
                              <div className="whitespace-pre-wrap break-words text-sm">
                                {message.is_user ? <p>{message.content}</p> : <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content || '', { ALLOWED_TAGS: ['a','b','i','strong','em','p','ul','ol','li','br'], ALLOWED_ATTR: ['href','class','target','rel'] }) }} />}
                              </div>
                              <p className={`text-xs mt-1 ${message.is_user ? 'text-white' : 'text-gray-500'} text-right`}>{formatMessageTime(message.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input footer */}
                    <div className="px-4 py-4 rounded-b-3xl bg-gradient-to-r from-primary-700 to-primary-600 flex-shrink-0">
                      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input ref={inputRef} type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask me anything about the club..." className="flex-1 px-4 py-3 water-input rounded-full text-sm placeholder-white/70 outline-none border border-white/10 text-white" disabled={loading} />
                        <button type="submit" disabled={loading || !inputMessage.trim()} className="ml-2 bg-white text-primary-700 px-4 py-2 rounded-full disabled:opacity-50 font-medium">🚀</button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatbotWidget