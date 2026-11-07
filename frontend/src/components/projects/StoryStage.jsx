import { useEffect, useRef, useState } from 'react'

// Sticky full-screen WebGL backdrop for the projects story, plus labels pinned to 3D parts.
export default function StoryStage({ labels }) {
  const hostRef = useRef(null)
  const labelRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    let release
    import('./storyScene')
      .then(({ mountStoryScene }) => {
        if (cancelled) return
        release = mountStoryScene(hostRef.current, labelRef.current, () => setStatus('failed'))
        setStatus(release ? 'ready' : 'failed')
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })
    return () => {
      cancelled = true
      release?.()
    }
  }, [])

  return (
    <div className="story-stage-track" aria-hidden="true">
      <div className={`story-stage is-${status}`}>
        <div ref={hostRef} className="story-canvas" />
        <div ref={labelRef} className="story-labels">
          {labels.map(label => (
            <div
              key={label.anchor}
              className={`story-label side-${label.side || 'up'} vside-${label.vside || 'right'}${label.anchor.startsWith('rocket-') ? ' rocket-label' : ''}`}
              data-anchor={label.anchor}
            >
              <span className="story-label-dot" />
              <span className="story-label-text">
                <strong>{label.title}</strong>
                {label.text && <small>{label.text}</small>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
