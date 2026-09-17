import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('cookieConsent'))
  const save = (analytics) => {
    localStorage.setItem('cookieConsent', JSON.stringify({ necessary: true, analytics, functional: false }))
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    window.gtag?.('consent', 'update', { analytics_storage: analytics ? 'granted' : 'denied' })
    setVisible(false)
  }
  if (!visible) return null
  return <aside className="cookie-notice" aria-label="Cookie preferences"><p>Allow analytics cookies to help us understand how the site is used? <Link to="/privacy">Privacy policy</Link></p><div className="cookie-actions"><button onClick={() => save(false)}>Essential only</button><button onClick={() => save(true)}>Allow analytics</button></div></aside>
}
