import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Projects
export const getProjects = () => api.get('/projects')
export const getProject = (id) => api.get(`/projects/${id}`)

// News
export const getNews = () => api.get('/news')
export const getNewsArticle = (id) => api.get(`/news/${id}`)

// Executives
export const getExecutives = () => api.get('/execs')
export const getExecutive = (id) => api.get(`/execs/${id}`)

// Sponsors
export const getSponsors = () => api.get('/sponsors')
export const getSponsor = (id) => api.get(`/sponsors/${id}`)

// Contact
export const submitContactMessage = (data) => api.post('/contact', data)

// Sponsor Inquiries
export const submitSponsorInquiry = (data) => api.post('/sponsor-inquiries', data)

// Discord
export const getDiscordInvite = () => api.get('/discord/invite')
export const submitJoinRequest = (data) => api.post('/discord/join-request', data)

// Authentication
export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (userData) => api.post('/auth/register', userData)
export const getCurrentUser = () => api.get('/auth/me')
export const updateCurrentUser = (userData) => api.patch('/auth/me', userData)

// Teams
export const getTeams = () => api.get('/teams')
export const getMyTeams = () => api.get('/teams/my-teams')
export const getTeam = (id) => api.get(`/teams/${id}`)
export const joinTeam = (teamId) => api.post(`/teams/${teamId}/join`)
export const leaveTeam = (teamId) => api.post(`/teams/${teamId}/leave`)
export const getTeamMembers = (teamId) => api.get(`/teams/${teamId}/members`)

// Project Updates
export const getProjectUpdates = (params = {}) => api.get('/project-updates', { params })
export const getMyUpdates = () => api.get('/project-updates/my-updates')
export const createProjectUpdate = (data) => api.post('/project-updates', data)
export const getTeamUpdates = (teamId) => api.get(`/project-updates/team/${teamId}`)

// Chatbot
export const getConversations = () => api.get('/chatbot/conversations')
export const createConversation = (data) => api.post('/chatbot/conversations', data)
export const getConversation = (id) => api.get(`/chatbot/conversations/${id}`)
export const sendChatMessage = (data) => api.post('/chatbot/chat', data)
export const deleteConversation = (id) => api.delete(`/chatbot/conversations/${id}`)
export const getConversationMessages = (id) => api.get(`/chatbot/conversations/${id}/messages`)

// Set up request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Set up response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api