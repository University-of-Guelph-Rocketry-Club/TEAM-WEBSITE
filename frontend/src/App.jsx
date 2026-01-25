import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import CookieConsent from './components/CookieConsent'
import MaintenanceMode from './components/MaintenanceMode'
import { initGA, trackPageView } from './utils/analytics'

// Public pages
import Home from './pages/Home'
import Projects from './pages/Projects'
import Team from './pages/Team'
import Sponsors from './pages/Sponsors'
import Join from './pages/Join'
import Privacy from './pages/Privacy'

// Previously protected pages - now public
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
    // Track page views
    trackPageView(pathname)
  }, [pathname])
  
  return null
}

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (gaId) {
      initGA(gaId)
    }
  }, [])
  
  // Check if maintenance mode is enabled
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true'

  // If maintenance mode is on, show only the maintenance screen
  if (isMaintenanceMode) {
    return <MaintenanceMode />
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* All routes are now public */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team" element={<Team />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/join" element={<Join />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ChatbotWidget />
        <CookieConsent />
      </div>
    </Router>
  )
}

export default App