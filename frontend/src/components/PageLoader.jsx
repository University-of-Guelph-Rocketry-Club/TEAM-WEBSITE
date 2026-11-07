import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import RocketGlyph from './RocketGlyph'

// Quick launch between pages: our rocket lifts off through a dark curtain, which then clears.
// It accelerates the whole way (constant thrust, falling mass), so it eases in, never out.
export default function PageLoader() {
  const { pathname } = useLocation()
  const [run, setRun] = useState({ key: 0, first: true, visible: true })
  const firstRun = useRef(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRun(previous => ({ ...previous, visible: false }))
      return
    }
    const first = firstRun.current
    firstRun.current = false
    setRun(previous => ({ key: previous.key + 1, first, visible: true }))
    const t = setTimeout(() => setRun(previous => ({ ...previous, visible: false })), first ? 1050 : 560)
    return () => clearTimeout(t)
  }, [pathname])

  return <div key={run.key} className={`page-loader${run.visible ? ' is-visible' : ''}${run.first ? ' is-first' : ''}`} aria-hidden="true">
    <div className="page-loader-pad">
      <span className="page-loader-smoke" />
      <RocketGlyph className="page-loader-rocket" flame />
    </div>
  </div>
}
