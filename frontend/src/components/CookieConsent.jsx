import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000)
    } else {
      // Load saved preferences
      const saved = JSON.parse(consent)
      setPreferences(saved)
      initializeAnalytics(saved.analytics)
    }
  }, [])

  const initializeAnalytics = (enabled) => {
    if (enabled && window.gtag) {
      // Initialize Google Analytics if enabled
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  const handleAcceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      functional: true
    }
    savePreferences(newPrefs)
  }

  const handleRejectAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      functional: false
    }
    savePreferences(newPrefs)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
  }

  const savePreferences = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs))
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    initializeAnalytics(prefs.analytics)
    setShowBanner(false)
    setShowSettings(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {!showSettings ? (
              // Main Banner
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="text-4xl">🍪</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      We Use Cookies
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
                      By clicking "Accept All", you consent to our use of cookies. 
                      <a href="/privacy" className="text-blue-600 hover:underline ml-1">
                        Read our Privacy Policy
                      </a>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleAcceptAll}
                        className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm"
                      >
                        Accept All
                      </button>
                      <button
                        onClick={handleRejectAll}
                        className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        Reject All
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-6 py-2.5 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Settings Panel
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Cookie Preferences</h3>
                  <p className="text-slate-600 text-sm">
                    Choose which cookies you want to allow. You can change these settings at any time.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">Necessary Cookies</h4>
                        <span className="px-2 py-0.5 bg-slate-700 text-white text-xs rounded-full">Required</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Essential for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-5 h-5 rounded cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">Analytics Cookies</h4>
                      <p className="text-sm text-slate-600">
                        Help us understand how visitors interact with our website by collecting anonymous data.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="w-5 h-5 rounded cursor-pointer accent-slate-900"
                      />
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">Functional Cookies</h4>
                      <p className="text-sm text-slate-600">
                        Remember your preferences and provide enhanced features like chat history.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                        className="w-5 h-5 rounded cursor-pointer accent-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent
