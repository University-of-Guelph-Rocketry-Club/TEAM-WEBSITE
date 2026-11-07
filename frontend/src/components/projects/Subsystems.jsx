import { useEffect, useRef, useState } from 'react'
import { cutawayLabels } from '../../content/projects'

// 3D cross-section of the CubeSat next to the list of subsystems. Hovering (or tapping) a
// subsystem lights up its parts in the model.
export default function Subsystems({ items }) {
  const stageRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [active, setActive] = useState(null)

  useEffect(() => {
    let cancelled = false
    let release
    import('./satCutawayScene')
      .then(({ mountSatCutaway }) => {
        if (cancelled) return
        release = mountSatCutaway(stageRef.current, () => setStatus('failed'))
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
    <div className="systems-layout">
      <figure className={`cutaway is-${status}`}>
        <div
          ref={stageRef}
          className={`cutaway-stage${active ? ' has-active' : ''}`}
          data-active={active || undefined}
          aria-hidden="true"
        >
          <div className="cutaway-canvas" />
          <svg className="cutaway-lines" />
          {cutawayLabels.map(callout => (
            <div
              key={callout.part}
              className={`cutaway-label side-${callout.side}${active === callout.key ? ' is-active' : ''}`}
              data-part={callout.part}
              data-key={callout.key}
              data-side={callout.side}
            >
              <strong>{callout.title}</strong>
              {callout.text && <small>{callout.text}</small>}
            </div>
          ))}
        </div>
        <figcaption>
          A 3U CubeSat cut in half so you can see inside (drag it to turn it). This is an example
          layout, ours will change as the design comes together
        </figcaption>
      </figure>
      <dl className="system-list" onMouseLeave={() => setActive(null)}>
        {items.map(({ key, title, text }) => (
          <div
            key={key}
            className={active === key ? 'is-active' : ''}
            onMouseEnter={() => setActive(key)}
            onClick={() => setActive(active === key ? null : key)}
          >
            <dt>{title}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
