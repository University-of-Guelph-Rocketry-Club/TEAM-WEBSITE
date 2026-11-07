import { useEffect, useRef, useState } from 'react'
import RocketGlyph from '../RocketGlyph'
import { checklist as STEPS } from '../../content/join'

const STORAGE = 'joinChecklist'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE) || '{}') || {}
  } catch {
    return {}
  }
}

// Pre-launch checklist for new members. Flip every switch and the rocket goes.
export default function LaunchChecklist() {
  const [armed, setArmed] = useState(load)
  const count = STEPS.filter(step => armed[step.id]).length
  const go = count === STEPS.length
  // Only fly when the last switch gets flipped, not every time the page loads with them all on.
  const wasGo = useRef(go)
  const [flew, setFlew] = useState(false)
  useEffect(() => {
    if (go && !wasGo.current) setFlew(true)
    if (!go) setFlew(false)
    wasGo.current = go
  }, [go])
  const launching = go && (flew || !wasGo.current)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(armed))
    } catch {
      // Not saving is fine, the switches still work for this visit.
    }
  }, [armed])

  const flip = (id, value) => setArmed(previous => ({ ...previous, [id]: value ?? !previous[id] }))

  return (
    <section
      className={`checklist wrap${go ? ' is-go' : ''}${go ? (launching ? ' is-launching' : ' is-gone') : ''}`}
      aria-labelledby="checklist-title"
    >
      <div className="checklist-panel">
        <div className="checklist-head">
          <h2 id="checklist-title">Your launch checklist</h2>
          <p className="checklist-status" aria-live="polite">
            {go ? 'All go! See you at the next meeting' : `${count} of ${STEPS.length} go`}
          </p>
        </div>
        <ol className="checklist-steps">
          {STEPS.map(step => (
            <li key={step.id} className={armed[step.id] ? 'is-armed' : ''}>
              <label className="arming">
                <input
                  type="checkbox"
                  checked={!!armed[step.id]}
                  onChange={event => flip(step.id, event.target.checked)}
                />
                <span className="arming-switch" aria-hidden="true">
                  <span className="arming-lever" />
                </span>
                <span className="arming-light" aria-hidden="true" />
                <span className="sr-only">{step.title}</span>
              </label>
              <div className="checklist-copy">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              {step.link && (
                <a
                  className="checklist-action"
                  href={step.link.href}
                  {...(step.link.external
                    ? {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        onClick: () => flip(step.id, true)
                      }
                    : {})}
                >
                  {step.link.text}
                </a>
              )}
            </li>
          ))}
        </ol>
        {count > 0 && (
          <button type="button" className="checklist-reset" onClick={() => setArmed({})}>
            Reset the switches
          </button>
        )}
      </div>
      <div className="checklist-pad" aria-hidden="true">
        <span className="checklist-smoke" />
        <RocketGlyph className="checklist-rocket" flame />
        <span className="checklist-tower" />
        <span className="checklist-ground" />
      </div>
    </section>
  )
}
