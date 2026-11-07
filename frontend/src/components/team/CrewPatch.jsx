import { Fragment } from 'react'
import RocketGlyph from '../RocketGlyph'

const C = 200
const STARS = [[150, 90], [232, 72], [302, 152], [84, 212], [314, 222], [176, 130]]

const star = (x, y, r) => {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + i * Math.PI / 5
    const radius = i % 2 ? r * 0.42 : r
    return `${(x + Math.cos(angle) * radius).toFixed(1)},${(y + Math.sin(angle) * radius).toFixed(1)}`
  })
  return points.join(' ')
}

// An embroidered crew patch, like the ones every space mission gets: the club up top, everyone's
// name around the bottom, one star each. The rocket flies a gravity turn off the Earth's limb.
export default function CrewPatch({ crew, active, onHover }) {
  return <svg className="crew-patch" viewBox="0 0 400 400" role="img" aria-label={`Crew patch with ${crew.map(person => person.name).join(', ')}`}>
    <defs>
      <path id="patch-top" d={`M ${C - 163} ${C} A 163 163 0 0 1 ${C + 163} ${C}`} />
      <path id="patch-bottom" d={`M ${C - 185} ${C} A 185 185 0 0 0 ${C + 185} ${C}`} />
      <clipPath id="patch-field"><circle cx={C} cy={C} r="148" /></clipPath>
      <radialGradient id="patch-earth" cx="50%" cy="0%" r="80%">
        <stop offset="0" stopColor="#3f86c9" />
        <stop offset="1" stopColor="#163c6e" />
      </radialGradient>
    </defs>

    {/* Merrowed edge and red twill border */}
    <circle cx={C} cy={C} r="197" className="patch-edge" />
    <circle cx={C} cy={C} r="197" className="patch-edge-thread" />
    <circle cx={C} cy={C} r="190" fill="#a8132a" />
    <circle cx={C} cy={C} r="186" className="patch-stitch" />

    <g clipPath="url(#patch-field)">
      <rect width="400" height="400" fill="#0a1528" />
      {/* Earth's limb with a thin line of atmosphere */}
      <circle cx={C} cy="560" r="300" fill="url(#patch-earth)" />
      <path d="M 70 300 Q 110 285 150 292 Q 170 296 180 286 Q 205 266 236 274 Q 262 281 280 268" fill="none" stroke="#3f8f5e" strokeWidth="9" strokeLinecap="round" opacity=".8" />
      <circle cx={C} cy="560" r="303" fill="none" stroke="#8fd3ff" strokeWidth="3" opacity=".8" />
      {/* Gravity-turn trail */}
      <path className="patch-trail" d="M 132 266 C 148 210, 178 170, 222 140" pathLength="1" />
      <path className="patch-trail-stitch" d="M 132 266 C 148 210, 178 170, 222 140" />
      <g transform="translate(257 117) rotate(56)" className="patch-rocket">
        <RocketGlyph x="-7.7" y="-42" width="15.4" height="84" />
      </g>
      {/* The CubeSat in orbit, wings out */}
      <g transform="translate(110 148) rotate(-18)" className="patch-sat">
        <rect x="-16" y="-5" width="10" height="10" fill="#1d4f9a" stroke="#c9d6e8" strokeWidth=".8" />
        <rect x="6" y="-5" width="10" height="10" fill="#1d4f9a" stroke="#c9d6e8" strokeWidth=".8" />
        <rect x="-5" y="-7" width="10" height="14" fill="#b9c1cc" />
        <line x1="0" y1="-7" x2="0" y2="-14" stroke="#e7d9a8" strokeWidth="1" />
      </g>
      {STARS.map(([x, y], i) => <polygon key={i} points={star(x, y, 8)} className={`patch-star${active === crew[i]?.id ? ' is-active' : ''}`} style={{ '--i': i }} />)}
    </g>
    <circle cx={C} cy={C} r="148" className="patch-stitch patch-stitch-inner" />

    <text className="patch-title"><textPath href="#patch-top" startOffset="50%" textAnchor="middle">GUELPH ROCKETRY</textPath></text>
    <text className="patch-names">
      <textPath href="#patch-bottom" startOffset="50%" textAnchor="middle">
        {crew.map((person, i) => <Fragment key={person.id}>
          {i > 0 && <tspan className="patch-sep">{'  ★  '}</tspan>}
          <tspan className={active === person.id ? 'is-active' : ''} onMouseEnter={() => onHover?.(person.id)} onMouseLeave={() => onHover?.(null)}>{person.name.toUpperCase()}</tspan>
        </Fragment>)}
      </textPath>
    </text>
  </svg>
}
