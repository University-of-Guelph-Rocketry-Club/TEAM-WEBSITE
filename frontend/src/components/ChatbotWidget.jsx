import { 
  sendChatMessage, 
  getConversations, 
  createConversation, 
  getConversation,
  deleteConversation,
  getChatbotAnalytics
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
  
  // Initialize admin mode from localStorage immediately
  const [adminMode, setAdminMode] = useState(() => {
    return localStorage.getItem('chatbot_admin_mode') === 'true'
  })
  const [adminInfo, setAdminInfo] = useState(() => {
    const saved = localStorage.getItem('chatbot_admin_info')
    return saved ? JSON.parse(saved) : null
  })
  
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(null)
  
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

  // Global message limit using localStorage with 12-hour cooldown
  const MESSAGE_LIMIT = 12
  const COOLDOWN_HOURS = 12
  const STORAGE_KEY = 'chatbot_total_messages'
  const LOCKOUT_TIME_KEY = 'chatbot_lockout_time'
  
  const checkAndResetIfCooldownPassed = () => {
    const lockoutTime = localStorage.getItem(LOCKOUT_TIME_KEY)
    if (lockoutTime) {
      const lockoutDate = new Date(parseInt(lockoutTime, 10))
      const now = new Date()
      const hoursPassed = (now - lockoutDate) / (1000 * 60 * 60)
      if (hoursPassed >= COOLDOWN_HOURS) {
        // Reset after cooldown
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(LOCKOUT_TIME_KEY)
        return 0
      }
    }
    return null // No reset needed
  }
  
  const getTotalMessageCount = () => {
    const resetResult = checkAndResetIfCooldownPassed()
    if (resetResult === 0) return 0
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored, 10) : 0
  }
  
  const incrementMessageCount = () => {
    const current = getTotalMessageCount()
    const newCount = current + 1
    localStorage.setItem(STORAGE_KEY, newCount.toString())
    // Set lockout time when hitting the limit
    if (newCount >= MESSAGE_LIMIT) {
      localStorage.setItem(LOCKOUT_TIME_KEY, Date.now().toString())
    }
  }
  
  const getTimeUntilReset = () => {
    const lockoutTime = localStorage.getItem(LOCKOUT_TIME_KEY)
    if (!lockoutTime) return null
    const lockoutDate = new Date(parseInt(lockoutTime, 10))
    const resetTime = new Date(lockoutDate.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000)
    const now = new Date()
    const msRemaining = resetTime - now
    if (msRemaining <= 0) return null
    const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60))
    return `${hoursRemaining}h ${minutesRemaining}m`
  }
  
  const [totalMessageCount, setTotalMessageCount] = useState(getTotalMessageCount)
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset)
  const isLockedOut = totalMessageCount >= MESSAGE_LIMIT && !adminMode
  
  // Update time remaining every minute
  useEffect(() => {
    if (!isLockedOut) return
    const interval = setInterval(() => {
      const time = getTimeUntilReset()
      setTimeUntilReset(time)
      if (!time) {
        // Cooldown passed, reset
        setTotalMessageCount(0)
      }
    }, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [isLockedOut])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    // Skip limit check if admin mode is active
    if (!inputMessage.trim() || loading || (isLockedOut && !adminMode)) return
    
    // Only increment message count if not in admin mode
    if (!adminMode) {
      incrementMessageCount()
      setTotalMessageCount(prev => prev + 1)
    }

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

      const { message: aiMessage, conversation, admin_mode, admin_info } = response.data

      // Check for admin mode activation
      if (admin_mode && !adminMode) {
        setAdminMode(true)
        setAdminInfo(admin_info)
        localStorage.setItem('chatbot_admin_mode', 'true')
        localStorage.setItem('chatbot_admin_info', JSON.stringify(admin_info))
        // Reset message count when admin mode activates
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(LOCKOUT_TIME_KEY)
        setTotalMessageCount(0)
      }

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
      setMessages(prev => {
        const cleaned = prev.filter(m => m.id !== 'typing')
        return [
          ...cleaned,
          {
            id: Date.now(),
            content: '❌ Connection error. Please check your internet connection and try again.',
            is_user: false,
            timestamp: new Date().toISOString(),
            error: true
          }
        ]
      })
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
      setShowAnalytics(false)
      setTimeout(() => scrollToBottom(), 50)
    } catch (err) {
      console.error('Failed to create conversation:', err)
      alert('Could not create a new conversation.')
    }
  }
  
  const fetchAnalytics = async () => {
    if (!adminMode) return
    try {
      const res = await getChatbotAnalytics()
      setAnalyticsData(res.data)
      setShowAnalytics(true)
      setShowConversations(false)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
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

  const handleNewConversation = () => {
    startNewConversation()
  }

  const handleSelectConversation = (conv) => {
    loadConversation(conv.id)
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
      {/* CLOSED: small floating button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110"
              title="Chat with AI Assistant"
            >
              <span className="text-lg sm:text-xl">🤖</span>
            </button>
          </div>
        </div>
      )}

      {/* OPEN: constrained panel (render only when open) - responsive for mobile */}
      {isOpen && (
        <div className="fixed inset-4 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[420px] sm:h-[620px] pointer-events-auto">
          <div className="w-full h-full flex flex-col" style={{ pointerEvents: 'auto' }}>
            <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl chat-backdrop flex flex-col">
              {/* Header (sticky) */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white p-3 sm:p-4 flex justify-between items-center rounded-t-2xl sm:rounded-t-3xl sticky top-0 z-30 flex-shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl">🤖</span>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      Rocketry AI Assistant
                      {adminMode && <span className="ml-2 text-xs bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full font-bold">ADMIN</span>}
                    </h3>
                    <p className="text-xs opacity-90">
                      {adminMode ? `Executive: ${adminInfo?.name} - ${adminInfo?.role}` : 'Ask me anything!'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {adminMode && (
                    <button 
                      onClick={fetchAnalytics} 
                      className="p-1 hover:bg-white/10 rounded text-sm"
                      title="Analytics Dashboard"
                    >
                      📊
                    </button>
                  )}
                  <button 
                    onClick={() => setShowConversations(!showConversations)} 
                    className="p-1 hover:bg-white/10 rounded text-sm"
                    title="Conversation history"
                  >
                    📋
                  </button>
                  <button 
                    onClick={handleNewConversation} 
                    className="p-1 hover:bg-white/10 rounded text-sm"
                    title="New conversation"
                  >
                    ➕
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">✕</button>
                </div>
              </div>

              {/* Conversations List */}
              {showConversations && (
                <div className="bg-white border-b p-3 max-h-40 overflow-y-auto flex-shrink-0">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Conversations</h4>
                  {conversations.length === 0 ? (
                    <p className="text-xs text-gray-500">No conversations yet</p>
                  ) : (
                    <ul className="space-y-1">
                      {conversations.slice(0, 5).map(conv => (
                        <li key={conv.id} className="flex justify-between items-center">
                          <button
                            onClick={() => handleSelectConversation(conv)}
                            className={`text-xs text-left truncate flex-1 p-1 rounded hover:bg-gray-100 ${
                              currentConversation?.id === conv.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                            }`}
                          >
                            {conv.title || `Chat ${conv.id}`}
                          </button>
                          <button
                            onClick={() => handleDeleteConversation(conv.id)}
                            className="text-red-400 hover:text-red-600 p-1 text-xs"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Analytics Panel */}
              {showAnalytics && analyticsData && (
                <div className="absolute inset-0 bg-white z-20 overflow-y-auto p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">📊 Analytics Dashboard</h3>
                    <button onClick={() => setShowAnalytics(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-primary-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-primary-700">{analyticsData.total_conversations}</div>
                        <div className="text-xs text-gray-600">Total Conversations</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{analyticsData.total_messages}</div>
                        <div className="text-xs text-gray-600">Total Messages</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{analyticsData.messages_last_24h}</div>
                        <div className="text-xs text-gray-600">Last 24 Hours</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-purple-700">{analyticsData.messages_last_7d}</div>
                        <div className="text-xs text-gray-600">Last 7 Days</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-semibold mb-2">Message Breakdown</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>User Messages:</span>
                          <span className="font-medium">{analyticsData.user_messages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AI Messages:</span>
                          <span className="font-medium">{analyticsData.ai_messages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg per Conversation:</span>
                          <span className="font-medium">{analyticsData.avg_messages_per_conversation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-semibold mb-2">Recent Conversations</div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {analyticsData.recent_conversations.map(conv => (
                          <div key={conv.id} className="text-xs bg-white p-2 rounded border">
                            <div className="font-medium">{conv.title}</div>
                            <div className="text-gray-500 flex justify-between mt-1">
                              <span>{conv.message_count} messages</span>
                              <span>{new Date(conv.last_updated).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
              >
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="text-sm">Hi! Ask me about the UofG Rocketry Club, our projects, or how to join!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`flex ${msg.is_user ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                          msg.is_user
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-white shadow-sm border rounded-bl-md'
                        }`}
                      >
                        <div 
                          className={`text-sm whitespace-pre-wrap ${msg.is_user ? '' : 'prose prose-sm max-w-none'}`}
                          dangerouslySetInnerHTML={{ 
                            __html: msg.is_user ? msg.content : DOMPurify.sanitize(msg.content) 
                          }}
                        />
                        <p className={`text-xs mt-1 ${msg.is_user ? 'text-primary-200' : 'text-gray-400'}`}>
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-sm border rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t flex-shrink-0">
                {(isLockedOut && !adminMode) ? (
                  <div className="text-center py-3">
                    <div className="text-2xl mb-2">🔒</div>
                    <p className="text-sm text-gray-600 mb-1">
                      You've used all {MESSAGE_LIMIT} messages.
                    </p>
                    {timeUntilReset && (
                      <p className="text-xs text-primary-600 font-medium mb-1">
                        Resets in {timeUntilReset}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Contact us at <a href="mailto:rocketry@uoguelph.ca" className="text-primary-600 hover:underline">rocketry@uoguelph.ca</a> for more help!
                    </p>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={adminMode ? "Admin access - unlimited messages..." : "Ask about the club..."}
                        className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !inputMessage.trim()}
                        className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-full text-sm transition-colors"
                      >
                        Send
                      </button>
                    </form>
                    {adminMode ? (
                      <p className="text-xs text-green-600 font-medium text-center mt-1">
                        ✅ Executive Mode - Unlimited Messages
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 text-center mt-1">
                        {totalMessageCount}/{MESSAGE_LIMIT} messages used
                      </p>
                    )}
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