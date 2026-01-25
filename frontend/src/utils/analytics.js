// Google Analytics initialization and tracking utilities

export const initGA = (measurementId) => {
  if (!measurementId) return

  // Load Google Analytics script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script1)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  
  // Default to denied until user consents
  gtag('consent', 'default', {
    analytics_storage: 'denied'
  })

  gtag('config', measurementId, {
    anonymize_ip: true, // Anonymize IP addresses
    cookie_flags: 'SameSite=None;Secure'
  })
}

export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path
    })
  }
}

export const trackEvent = (eventName, params = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Helper to check if analytics is enabled
export const isAnalyticsEnabled = () => {
  const consent = localStorage.getItem('cookieConsent')
  if (!consent) return false
  const prefs = JSON.parse(consent)
  return prefs.analytics === true
}
