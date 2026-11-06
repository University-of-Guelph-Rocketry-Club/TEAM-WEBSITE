import { useLayoutEffect, useRef, useState } from 'react'
import { useSectionProgress } from './scrollStory'

const PATH = 'M 80 452 C 120 330, 250 120, 470 84 C 560 70, 620 120, 650 205 C 672 268, 700 330, 760 372 C 810 406, 860 430, 920 452'
const EVENTS = [
  { at: 0, title: 'Liftoff', text: 'The motor lights and the rocket leaves the launch rail', place: 'right' },
  { at: 0.1, title: 'Burnout', text: 'A few seconds later the motor is spent, but the rocket keeps coasting up', place: 'left' },
  { at: 0.46, title: 'Apogee', text: 'At the very top, the flight computer fires the drogue parachute', place: 'top' },
  { at: 0.74, title: 'Main chute', text: 'Closer to the ground, the main parachute opens for a soft landing', place: 'right' },
  { at: 1, title: 'Recovery', text: 'We walk it back, pull the flight data and get ready to fly again', place: 'top-left' }
]
const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)

export default function FlightProfile({ section }) {
  const pathRef = useRef(null)
  const dotRef = useRef(null)
  const [points, setPoints] = useState([])

  useLayoutEffect(() => {
    const path = pathRef.current
    const length = path.getTotalLength()
    setPoints(EVENTS.map(event => {
      const point = path.getPointAtLength(event.at * length)
      return { x: point.x / 10, y: point.y / 5 }
    }))
  }, [])

  useSectionProgress(section, ({ p }) => {
    const path = pathRef.current
    const draw = clamp01((p - 0.08) / 0.8)
    const point = path.getPointAtLength(draw * path.getTotalLength())
    dotRef.current.setAttribute('transform', `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`)
  })

  return <div className="flight-profile">
    <div className="flight-chart">
    <svg viewBox="0 0 1000 500" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="flight-line" x1="0" x2="1">
          <stop offset="0" stopColor="#ffcf28" />
          <stop offset="0.46" stopColor="#ff8a3d" />
          <stop offset="0.47" stopColor="#8bbff0" />
          <stop offset="1" stopColor="#8bbff0" />
        </linearGradient>
        <radialGradient id="flight-glow">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.35" stopColor="#ffcf28" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffcf28" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line className="flight-ground" x1="20" y1="452" x2="980" y2="452" />
      {[132, 212, 292, 372].map(y => <line key={y} className="flight-grid" x1="20" y1={y} x2="980" y2={y} />)}
      <path className="flight-ghost" d={PATH} />
      <path ref={pathRef} className="flight-path" d={PATH} pathLength="1" />
      <g ref={dotRef} className="flight-dot" transform="translate(80 452)">
        <circle r="26" fill="url(#flight-glow)" />
        <circle r="5" fill="#fff" />
      </g>
    </svg>
    <span className="flight-axis" aria-hidden="true">Altitude</span>
    <div className="flight-markers" aria-hidden="true">
      {EVENTS.map((event, i) => <span key={event.title} className="flight-marker" style={{ '--at': event.at, left: `${points[i]?.x ?? 0}%`, top: `${points[i]?.y ?? 0}%` }}><b>{i + 1}</b></span>)}
    </div>
    </div>
    <ol className="flight-events">
      {EVENTS.map((event, i) => <li key={event.title} className={`flight-event place-${event.place}`} style={{ '--at': event.at, left: `${points[i]?.x ?? 0}%`, top: `${points[i]?.y ?? 0}%` }}>
        <strong><span aria-hidden="true">{i + 1}</span>{event.title}</strong>{event.text}
      </li>)}
    </ol>
  </div>
}
