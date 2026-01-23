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
      {/* CLOSED: small floating button with Coming Soon badge */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
              title="Open assistant (Coming Soon)"
            >
              <span className="text-xl">🤖</span>
            </button>
            {/* Coming Soon Badge */}
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
              Soon
            </div>
          </div>
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
                    <h3 className="font-semibold">Rocketry AI Assistant</h3>
                    <p className="text-xs opacity-90">Coming Soon!</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">✕</button>
                </div>
              </div>

              {/* Coming Soon Body */}
              <div className="flex flex-col h-full items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Assistant Coming Soon!</h3>
                  <p className="text-gray-700 max-w-sm">
                    We're building an intelligent rocketry assistant powered by OpenAI. 
                    It will help answer questions about the club, our projects, and aerospace engineering!
                  </p>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <p className="text-sm text-gray-600 mb-3">In the meantime, reach out:</p>
                    <div className="space-y-2">
                      <a 
                        href="https://discord.gg/VRZE2923" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        💬 Join Discord
                      </a>
                      <a 
                        href="mailto:rocketry@uoguelph.ca"
                        className="block bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        📧 Email Us
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic">Expected launch: Winter 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatbotWidget