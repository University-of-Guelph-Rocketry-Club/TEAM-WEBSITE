import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Brief rocket loading screen shown on first load and between page transitions.
export default function PageLoader() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(true)
  const firstRun = useRef(true)

  useEffect(() => {
    const duration = firstRun.current ? 650 : 320
    firstRun.current = false
    setVisible(true)
    const t = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div className={`page-loader${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <svg className="page-loader-rocket" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L4 12h5v8h6v-8h5L12 2zm0 3.84L16.27 11H14v7h-4v-7H7.73L12 5.84z" />
      </svg>
    </div>
  )
}
