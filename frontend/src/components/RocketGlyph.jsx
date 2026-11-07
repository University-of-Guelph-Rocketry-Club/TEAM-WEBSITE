import { useId } from 'react'

// Side view of our solid rocket, drawn to the same proportions as the 3D model on the projects
// page (4 in airframe, about 18.5 calibers long). Units are 100 per model unit, y down from the tip.
// Each section is its own group (rg-nose, rg-upper, rg-av, rg-booster, rg-motor) so it can be
// pulled apart or rearranged with CSS.
const R = 9
const NOSE = 61.4
const UPPER = 142.4
const AV = 164
const BOTTOM = 333
const FIN_TOP = BOTTOM - 43.2
const SPAN = 21.6
const SWEEP = 28.8
const TIP_CHORD = 6.3

// Tangent ogive: r(h) = sqrt(rho² - h²) + R - rho, h measured up from the base of the nose.
const rho = (R * R + NOSE * NOSE) / (2 * R)
const ogive = Array.from({ length: 25 }, (_, i) => {
  const h = (i / 24) * NOSE
  return [Math.max(0, Math.sqrt(rho * rho - h * h) + R - rho), NOSE - h]
})
const nosePath = `M ${-R} ${NOSE} ${ogive.map(([r, y]) => `L ${-r.toFixed(2)} ${y.toFixed(2)}`).join(' ')} ${ogive.slice().reverse().map(([r, y]) => `L ${r.toFixed(2)} ${y.toFixed(2)}`).join(' ')} Z`
const fin = side => `M ${side * R} ${FIN_TOP} L ${side * (R + SPAN)} ${FIN_TOP + SWEEP} L ${side * (R + SPAN)} ${FIN_TOP + SWEEP + TIP_CHORD} L ${side * R} ${BOTTOM} Z`

export default function RocketGlyph({ className = '', flame = false, title, viewBox = '-32 -2 64 350', ...rest }) {
  const id = `rg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return <svg {...rest} className={`rocket-glyph ${className}`} viewBox={viewBox} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : 'true'}>
    <defs>
      {[1, -1].map(side => <pattern key={side} id={`${id}-chev${side}`} width="6.8" height="6.8" patternUnits="userSpaceOnUse" patternTransform={`rotate(${side * -36.87})`}>
        <rect width="6.8" height="6.8" fill="#f3f3ef" />
        <rect width="3.4" height="6.8" fill="#cc1029" />
      </pattern>)}
      <linearGradient id={`${id}-shade`} x1="0" x2="1">
        <stop offset="0" stopColor="#000" stopOpacity=".22" />
        <stop offset=".35" stopColor="#fff" stopOpacity=".18" />
        <stop offset=".6" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".32" />
      </linearGradient>
    </defs>
    {flame && <g className="rg-flame">
      <path d="M -6 341 Q -7 362 0 392 Q 7 362 6 341 Z" fill="#ff7a2e" />
      <path d="M -3.4 341 Q -4 354 0 372 Q 4 354 3.4 341 Z" fill="#fff1c4" />
    </g>}
    <g className="rg-motor">
      <path d="M -3 333 L -2.2 335 L -5.2 341.5 L 5.2 341.5 L 2.2 335 L 3 333 Z" fill="#2b2c2f" />
    </g>
    <g className="rg-booster">
      <path d={fin(1)} fill={`url(#${id}-chev1)`} />
      <path d={fin(-1)} fill={`url(#${id}-chev-1)`} />
      <rect x={-R} y={AV} width={R * 2} height={BOTTOM - AV} fill="#f3f3ef" />
      <rect x={-R} y={AV} width={R * 2} height="0.6" fill="#2a2a2a" />
      <text x="0" y="0" transform={`translate(0.2 ${AV + 0.34 * (BOTTOM - AV)}) rotate(-90)`} textAnchor="middle" dominantBaseline="central" fontSize="7.2" fontWeight="700" fill="#1c1c1e" style={{ fontStretch: '125%', letterSpacing: '1.3px' }}>GUELPH ROCKETRY</text>
      <rect x="-1" y={FIN_TOP} width="2" height={BOTTOM - FIN_TOP} fill={`url(#${id}-chev1)`} />
      <rect x={-R} y={AV} width={R * 2} height={BOTTOM - AV} fill={`url(#${id}-shade)`} />
    </g>
    <g className="rg-av">
      <rect x={-R} y={UPPER} width={R * 2} height={AV - UPPER} fill="#f3f3ef" />
      <rect x={-R} y={UPPER} width={R * 2} height="2.6" fill="#141414" />
      <rect x="-7" y={UPPER + 7.5} width="4" height="2.2" fill="#141414" />
      <rect x="3" y={UPPER + 13} width="4" height="2.2" fill="#141414" />
      <rect x={-R} y={UPPER} width={R * 2} height={AV - UPPER} fill={`url(#${id}-shade)`} />
    </g>
    <g className="rg-upper">
      <rect x={-R} y={NOSE} width={R * 2} height={UPPER - NOSE} fill="#f3f3ef" />
      <path d={`M -8.5 ${NOSE + 13.5} L 0 ${NOSE + 20} L -8.5 ${NOSE + 26.5} Z M 8.5 ${NOSE + 13.5} L 0 ${NOSE + 20} L 8.5 ${NOSE + 26.5} Z`} fill="#cc1029" />
      <circle cx="0" cy={NOSE + 57} r="4.2" fill="#3b3b3b" />
      <circle cx="0" cy={NOSE + 57} r="2.4" fill="#d8d8d8" />
      <rect x={-R} y={NOSE} width={R * 2} height={UPPER - NOSE} fill={`url(#${id}-shade)`} />
    </g>
    <g className="rg-nose">
      <path d={nosePath} fill="#cf0f2a" />
      <path d={nosePath} fill={`url(#${id}-shade)`} />
    </g>
  </svg>
}

// Red-and-white main canopy (12 gores, so about six show from the side) with its shroud lines
// meeting at the swivel, drawn in the same units as the rocket.
export function ParachuteGlyph({ className = '' }) {
  const gores = 6
  const width = 120
  return <svg className={`chute-glyph ${className}`} viewBox="-64 -4 128 120" aria-hidden="true">
    {Array.from({ length: gores + 1 }, (_, i) => {
      const x = -width / 2 + (i * width) / gores
      return <line key={i} x1={x} y1={34} x2="0" y2="112" stroke="#e7e9ee" strokeOpacity=".75" strokeWidth=".8" />
    })}
    {Array.from({ length: gores }, (_, i) => {
      const x0 = -width / 2 + (i * width) / gores
      const x1 = x0 + width / gores
      // Each gore bulges out between its seams; the canopy is a flattened dome.
      const top = x => 34 - Math.sqrt(Math.max(0, 1 - (x / (width / 2)) ** 2)) * 32
      return <path key={i} d={`M ${x0} ${top(x0)} Q ${(x0 + x1) / 2} ${top((x0 + x1) / 2) - 3} ${x1} ${top(x1)} L ${x1} 34 Q ${(x0 + x1) / 2} 39 ${x0} 34 Z`} fill={i % 2 ? '#f5f3ee' : '#e0142e'} />
    })}
  </svg>
}
