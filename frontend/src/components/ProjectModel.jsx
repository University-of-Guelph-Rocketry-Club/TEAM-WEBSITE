import { useEffect, useRef, useState } from 'react'

const names = { rocket: 'competition rocket', cubesat: 'CubeSat with solar panels', engine: 'liquid engine test stand' }

export default function ProjectModel({ kind }) {
  const hostRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let release
    setReady(false)
    setFailed(false)
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      try {
        const { mountProjectRenderer } = await import('./projectRenderer')
        if (cancelled) return
        release = mountProjectRenderer(hostRef.current, kind, () => setFailed(true))
        setReady(true)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }, { rootMargin: '250px' })
    observer.observe(hostRef.current)
    return () => {
      cancelled = true
      observer.disconnect()
      release?.()
    }
  }, [kind])

  return <div className={`project-model ${ready && !failed ? 'is-ready' : ''}`} role="img" aria-label={`3D illustration of a ${names[kind]}`}>
    <div ref={hostRef} className="project-model-canvas" />
    <svg className="project-model-fallback" viewBox="0 0 160 180" aria-hidden="true" fill="none" stroke="#abc2da" strokeWidth="2">
      {kind === 'rocket' ? <g><path d="M70 135V50Q70 28 80 12Q90 28 90 50V135Z" fill="#dce4ed" /><path d="M70 111L52 145L70 139M90 111L108 145L90 139" fill="#b51d30" /><path d="M70 50H90M70 119H90" stroke="#b51d30" strokeWidth="6" /></g> : kind === 'cubesat' ? <g><path d="M58 59L82 45L105 59V112L80 128L58 113Z" fill="#be9546" /><path d="M12 57L58 70V110L12 96ZM105 70L148 55V94L105 110Z" fill="#183965" /><path d="M28 62V101M43 66V106M119 65V105M133 60V99M58 59L80 73L105 59M80 73V128" /></g> : <g><path d="M38 158V60H123V158M38 94H123M38 151H123M38 94L123 151M123 94L38 151" /><rect x="48" y="23" width="23" height="57" rx="10" fill="#c2cbd5" /><rect x="91" y="23" width="23" height="57" rx="10" fill="#c2cbd5" /><path d="M69 83H91V102L100 126H60L69 102Z" fill="#b77950" /><path d="M59 23V14M102 23V14" stroke="#c22b3b" strokeWidth="5" /></g>}
    </svg>
  </div>
}
