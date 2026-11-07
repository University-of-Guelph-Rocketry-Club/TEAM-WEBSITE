import { useState } from 'react'
import { useSectionProgress } from './scrollStory'
import { flight, sampleAt } from './flightSim'

// Altitude and speed against time from the flight sim. Scrolling plays the climb first,
// then zooms the time axis out to show the whole (much longer) trip back down.
const BOX = { left: 82, right: 918, top: 34, bottom: 470 }
const MAX_ALTITUDE = 10000
const MAX_MACH = 2.5
const { events, samples, maxMach } = flight
const T_APOGEE = events.apogee.t
const T_LAND = events.landing.t
const PHASES = {
  boost: 'Motor burning',
  coast: 'Coasting up',
  drogue: 'Falling under the drogue',
  main: 'Under the main chute',
  landed: 'Landed!'
}
const round = (value, step) => Math.round(value / step) * step
const EVENTS = [
  {
    t: 0,
    title: 'Liftoff',
    text: `Off the rail at about ${round(events.railExit.velocity * 3.6, 10)} km/h`
  },
  { t: events.mach1.t, title: 'Mach 1', text: `Supersonic just ${events.mach1.t.toFixed(1)} s in` },
  {
    t: events.burnout.t,
    title: 'Burnout',
    text: `The motor's done after ${events.burnout.t.toFixed(1)} s. Top speed: Mach ${maxMach.toFixed(1)}`
  },
  {
    t: T_APOGEE,
    title: 'Apogee',
    text: `Tops out at ${(events.apogee.altitude / 1000).toFixed(1)} km (about ${round(events.apogee.altitude * 3.28084, 100).toLocaleString()} ft) and the drogue comes out`
  },
  { t: events.main.t, title: 'Main chute', text: 'The big chute opens at 457 m (1,500 ft)' },
  {
    t: T_LAND,
    title: 'Touchdown',
    text: `Back on the ground about ${Math.round((T_LAND / 60) * 2) / 2} minutes after launch`
  }
]
const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)
const ease = t => t * t * (3 - 2 * t)

function timeline(q) {
  if (q < 0.5) return { now: T_APOGEE * (q / 0.5) ** 1.6, span: T_APOGEE * 1.1 }
  if (q < 0.62)
    return {
      now: T_APOGEE,
      span: T_APOGEE * 1.1 + (T_LAND * 1.03 - T_APOGEE * 1.1) * ease((q - 0.5) / 0.12)
    }
  return { now: T_APOGEE + ((T_LAND - T_APOGEE) * (q - 0.62)) / 0.38, span: T_LAND * 1.03 }
}

function tickStep(span) {
  return [1, 2, 5, 10, 20, 50, 100].find(step => span / step <= 8) || 100
}

export default function FlightProfile({ section }) {
  const [q, setQ] = useState(0)
  useSectionProgress(section, ({ p }) => setQ(clamp01((p - 0.06) / 0.88)))

  const { now, span } = timeline(q)
  const x = t => BOX.left + ((BOX.right - BOX.left) * t) / span
  const yAlt = altitude => BOX.bottom - ((BOX.bottom - BOX.top) * altitude) / MAX_ALTITUDE
  const yMach = mach => BOX.bottom - ((BOX.bottom - BOX.top) * mach) / MAX_MACH
  const current = sampleAt(now)
  const shown = samples.filter(s => s.t <= now).concat(current)
  const altitudeLine = shown
    .map((s, i) => `${i ? 'L' : 'M'}${x(s.t).toFixed(1)} ${yAlt(s.altitude).toFixed(1)}`)
    .join(' ')
  const machLine = shown
    .map((s, i) => `${i ? 'L' : 'M'}${x(s.t).toFixed(1)} ${yMach(s.mach).toFixed(1)}`)
    .join(' ')
  const step = tickStep(span)
  const timeTicks = Array.from({ length: Math.floor(span / step) + 1 }, (_, i) => i * step)
  let lastX = -Infinity
  const badges = EVENTS.map((event, i) => {
    const bx = x(event.t)
    const visible = now >= event.t && bx - lastX > 22
    if (visible) lastX = bx
    return { ...event, i, bx, by: yAlt(sampleAt(event.t).altitude), visible }
  })

  return (
    <div className="flight-profile">
      <div className="flight-chart">
        <svg
          viewBox="0 0 1000 540"
          role="img"
          aria-label={`Simulated example flight: altitude and speed against time. Top speed Mach ${maxMach.toFixed(1)}, apogee ${(events.apogee.altitude / 1000).toFixed(1)} km at ${T_APOGEE.toFixed(0)} seconds, landing after ${Math.round(T_LAND)} seconds.`}
        >
          <defs>
            <linearGradient id="flight-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#8bbff0" stopOpacity="0.32" />
              <stop offset="1" stopColor="#8bbff0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 2000, 4000, 6000, 8000, 10000].map(a => (
            <g key={a}>
              <line
                className="flight-grid"
                x1={BOX.left}
                x2={BOX.right}
                y1={yAlt(a)}
                y2={yAlt(a)}
              />
              <text className="flight-tick" x={BOX.left - 12} y={yAlt(a) + 4} textAnchor="end">
                {a / 1000}
              </text>
            </g>
          ))}
          {[0.5, 1, 1.5, 2, 2.5].map(m => (
            <text key={m} className="flight-tick mach" x={BOX.right + 12} y={yMach(m) + 4}>
              {m}
            </text>
          ))}
          <line className="flight-mach1" x1={BOX.left} x2={BOX.right} y1={yMach(1)} y2={yMach(1)} />
          <text className="flight-tick mach" x={BOX.right - 6} y={yMach(1) - 8} textAnchor="end">
            Mach 1
          </text>
          {timeTicks.map(t => (
            <g key={t}>
              <line
                className="flight-axis-line"
                x1={x(t)}
                x2={x(t)}
                y1={BOX.bottom}
                y2={BOX.bottom + 6}
              />
              <text className="flight-tick" x={x(t)} y={BOX.bottom + 24} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          <line
            className="flight-axis-line"
            x1={BOX.left}
            x2={BOX.right}
            y1={BOX.bottom}
            y2={BOX.bottom}
          />
          <text className="flight-axis-title" x={BOX.left - 12} y={BOX.top - 14}>
            Altitude (km)
          </text>
          <text
            className="flight-axis-title mach"
            x={BOX.right + 12}
            y={BOX.top - 14}
            textAnchor="end"
          >
            Speed (Mach)
          </text>
          <text
            className="flight-axis-title"
            x={(BOX.left + BOX.right) / 2}
            y={BOX.bottom + 52}
            textAnchor="middle"
          >
            Seconds after liftoff
          </text>
          <path
            d={`${altitudeLine} L${x(now).toFixed(1)} ${BOX.bottom} L${BOX.left} ${BOX.bottom} Z`}
            fill="url(#flight-fill)"
          />
          <path className="flight-altitude" d={altitudeLine} />
          <path className="flight-speed" d={machLine} />
          <circle className="flight-head" cx={x(now)} cy={yAlt(current.altitude)} r="6" />
          <circle className="flight-head mach" cx={x(now)} cy={yMach(current.mach)} r="4.5" />
          {badges
            .filter(b => b.visible)
            .map(b => (
              <g
                key={b.title}
                className="flight-badge"
                transform={`translate(${b.bx.toFixed(1)} ${b.by.toFixed(1)})`}
              >
                <circle r="12" />
                <text y="4.5" textAnchor="middle">
                  {b.i + 1}
                </text>
              </g>
            ))}
        </svg>
        <dl className="flight-readout" aria-hidden="true">
          <div>
            <dt>Time</dt>
            <dd>T+{now.toFixed(now < 100 ? 1 : 0)} s</dd>
          </div>
          <div>
            <dt>Altitude</dt>
            <dd>{Math.round(current.altitude).toLocaleString()} m</dd>
          </div>
          <div>
            <dt>Speed</dt>
            <dd>Mach {current.mach.toFixed(2)}</dd>
          </div>
          <div className="flight-phase">
            <dt>Now</dt>
            <dd>{PHASES[current.phase]}</dd>
          </div>
        </dl>
      </div>
      <ol className="flight-events">
        {EVENTS.map((event, i) => (
          <li key={event.title} className={now >= event.t ? 'is-done' : ''}>
            <span aria-hidden="true">{i + 1}</span>
            <strong>{event.title}</strong>{' '}
            <em>T+{event.t < 100 ? event.t.toFixed(1) : Math.round(event.t)} s</em>
            <p>{event.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
