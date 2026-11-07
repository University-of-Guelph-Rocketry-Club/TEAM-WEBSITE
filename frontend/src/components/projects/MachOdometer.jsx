import { useRef } from 'react'
import { useSectionProgress } from './scrollStory'

const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)

// Rolling Mach number tied to scroll: each digit column slides, carrying like an odometer.
export default function MachOdometer({ section, from = 0.1, to = 0.82, goal = 2.2 }) {
  const rootRef = useRef(null)
  const onesRef = useRef(null)
  const tenthsRef = useRef(null)

  useSectionProgress(section, ({ p }) => {
    const value = goal * clamp01((p - from) / (to - from))
    const raw = Math.round(value * 1000) / 100
    const whole = Math.floor(raw)
    const roll = clamp01((raw - whole - 0.55) / 0.45)
    const tenths = whole + roll * roll * (3 - 2 * roll)
    const tenthsDigit = tenths % 10
    const ones = Math.floor(tenths / 10) + Math.max(0, tenthsDigit - 9)
    tenthsRef.current.style.transform = `translateY(calc(${-tenthsDigit} * var(--row)))`
    onesRef.current.style.transform = `translateY(calc(${-ones} * var(--row)))`
    rootRef.current.classList.toggle('is-supersonic', value >= 1)
    rootRef.current.style.setProperty('--mach', (value / goal).toFixed(4))
  })

  return (
    <div ref={rootRef} className="mach">
      <div className="mach-readout" aria-hidden="true">
        <span className="mach-unit">Mach</span>
        <span className="odo">
          <span ref={onesRef} className="odo-col">
            {[0, 1, 2, 3].map(n => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
        <span className="odo-dot">.</span>
        <span className="odo">
          <span ref={tenthsRef} className="odo-col">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => (
              <span key={i}>{n}</span>
            ))}
          </span>
        </span>
      </div>
      <div className="mach-track" aria-hidden="true">
        <span className="mach-fill" />
        <span className="mach-one">Mach 1</span>
        <span className="mach-badge">Supersonic!</span>
      </div>
    </div>
  )
}
