import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  sendChatMessage, 
  getConversations, 
  createConversation, 
  getConversation,
  deleteConversation 
} from '../lib/api'

const ChatbotWidget = () => {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConversations, setShowConversations] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchConversations()
    }
  }, [isAuthenticated, isOpen])

  useEffect(() => {
    // Listen for custom event to open chatbot
    const handleOpenChatbot = () => setIsOpen(true)
    window.addEventListener('openChatbot', handleOpenChatbot)
    return () => window.removeEventListener('openChatbot', handleOpenChatbot)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async () => {
    try {
      const response = await getConversations()
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const startNewConversation = async () => {
    try {
      const response = await createConversation({ title: "New Conversation" })
      const newConversation = response.data
      setCurrentConversation(newConversation)
      setMessages([])
      setConversations(prev => [newConversation, ...prev])
      setShowConversations(false)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const loadConversation = async (conversationId) => {
    try {
      const response = await getConversation(conversationId)
      const conversation = response.data
      setCurrentConversation(conversation)
      setMessages(conversation.messages || [])
      setShowConversations(false)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setLoading(true)

    // Add user message to display immediately
    const tempUserMessage = {
      id: Date.now(),
      content: userMessage,
      is_user: true,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const response = await sendChatMessage({
        content: userMessage,
        conversation_id: currentConversation?.id
      })

      const { message: aiMessage, conversation } = response.data
      
      // Update current conversation if it was created
      if (!currentConversation) {
        setCurrentConversation(conversation)
        setConversations(prev => [conversation, ...prev])
      }

      // Replace temp message and add AI response
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove temp message
        { ...tempUserMessage, id: tempUserMessage.id }, // Confirmed user message
        aiMessage
      ])
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove temp message on error
      setMessages(prev => prev.slice(0, -1))
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => alert('Please log in to use the AI assistant.')}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-colors"
        >
          <span className="text-xl">🤖</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Widget */}
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[32rem] flex flex-col">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-semibold">Rocketry Assistant</h3>
                <p className="text-xs text-primary-100">
                  {currentConversation ? 'In conversation' : 'Ready to help!'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConversations(!showConversations)}
                className="p-1 hover:bg-primary-700 rounded"
                title="Conversation history"
              >
                📚
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-primary-700 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Conversations List */}
          {showConversations ? (
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Conversations</h4>
                <button
                  onClick={startNewConversation}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  + New
                </button>
              </div>
              <div className="space-y-2">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer group"
                  >
                    <div
                      onClick={() => loadConversation(conv.id)}
                      className="flex-1"
                    >
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteConversation(conv.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs p-1"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="text-4xl mb-4">🚀</div>
                    <p className="text-sm">
                      Hi! I'm your rocketry assistant. Ask me anything about:
                    </p>
                    <ul className="text-xs mt-2 space-y-1 text-left">
                      <li>• Rocket design and engineering</li>
                      <li>• Club activities and projects</li>
                      <li>• Competition information</li>
                      <li>• Technical questions</li>
                    </ul>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.is_user
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.is_user ? 'text-primary-200' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about rocketry..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputMessage.trim()}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm">🚀</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Closed Button */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <span className="text-xl">🤖</span>
        </button>
      )}
    </div>
  )
}

export default ChatbotWidget