import { useRef } from 'react'
import { useSectionProgress } from './scrollStory'

// Scroll-driven sketch of the proposed payload: wet the chambers, watch seedlings sprout
// in the dark and the gas readings move. Numbers are illustrative, within the ranges in our study.
const CHAMBERS = [
  { x: 30, name: 'Design A', seeds: true, o2: 52, co2: 4.9 },
  { x: 225, name: 'Design B', seeds: true, o2: 38, co2: 3.6 },
  { x: 420, name: 'Control', note: 'no seeds', seeds: false, o2: 0.6, co2: 0.02 }
]
const STEPS = [
  [-1, 0.2, 'Launch and wait', 'Seeds ride up dry and dormant'],
  [0.2, 0.38, 'Just add water', 'Each chamber is wetted on command'],
  [0.38, 0.82, 'Sprouting in the dark', 'Oxygen drops, carbon dioxide climbs'],
  [0.82, 2, 'Data home', 'Readings go down to Guelph']
]
const ROOTS = [
  'M 0 0 C 4 10 -6 22 2 34 S 12 52 4 60',
  'M 0 0 C -8 8 -16 4 -22 14 S -26 34 -34 38',
  'M 0 0 C 10 6 18 16 16 28 S 26 44 34 46'
]
const SHOOTS = [
  'M 0 0 C -2 -22 8 -40 2 -62 C 0 -72 -10 -76 -14 -68',
  'M 0 0 C 6 -18 -10 -34 -4 -56 C -2 -66 8 -70 12 -62',
  'M 0 0 C -6 -16 12 -30 6 -50 C 4 -60 -6 -62 -8 -54'
]
const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)

export default function SeedChambers({ section }) {
  const readouts = useRef([])

  useSectionProgress(section, ({ p }) => {
    const grow = clamp01((p - 0.38) / 0.44)
    const amount = grow * grow * (3 - 2 * grow)
    CHAMBERS.forEach((chamber, i) => {
      const nodes = readouts.current[i]
      if (!nodes?.o2 || !nodes?.co2) return
      nodes.o2.textContent = `${Math.round(210 - chamber.o2 * amount)} mbar`
      nodes.co2.textContent = `${(0.04 + chamber.co2 * amount).toFixed(2)} %`
    })
  })

  return <div className="seed-lab">
    <ol className="seed-steps">
      {STEPS.map(([start, end, title, text], i) => <li key={title} style={{ '--in': start, '--out': end }}><span aria-hidden="true">{i + 1}</span><strong>{title}</strong>{text}</li>)}
    </ol>
    <svg className="seed-chambers" viewBox="0 0 600 440" role="img" aria-label="Three sealed chambers: two with seeds that sprout after water is added, and one control chamber with no seeds. Oxygen readings fall and carbon dioxide readings rise in the seeded chambers.">
      <defs>
        <linearGradient id="seed-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#1a2e4d" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#0d1a2e" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1a2e4d" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {CHAMBERS.map((chamber, i) => <g key={chamber.name} transform={`translate(${chamber.x} 0)`} className="seed-chamber">
        <text className="seed-name" x="75" y="24" textAnchor="middle">{chamber.name}{chamber.note && <tspan className="seed-note"> · {chamber.note}</tspan>}</text>
        <rect className="seed-lid" x="0" y="38" width="150" height="34" rx="8" />
        <rect className="seed-sensor" x="16" y="47" width="48" height="16" rx="3" />
        <text className="seed-sensor-label" x="40" y="59" textAnchor="middle">O₂</text>
        <rect className="seed-sensor" x="86" y="47" width="48" height="16" rx="3" />
        <text className="seed-sensor-label" x="110" y="59" textAnchor="middle">CO₂</text>
        <rect className="seed-body" x="6" y="72" width="138" height="252" rx="14" fill="url(#seed-glass)" />
        <rect className="seed-bag" x="112" y="90" width="20" height="92" rx="10" />
        <rect className="seed-water" x="115" y="94" width="14" height="84" rx="7" />
        <path className="seed-flow" d="M 122 182 L 122 250 Q 122 262 110 262 L 100 262" />
        <rect className="seed-pad" x="18" y="292" width="92" height="22" rx="4" />
        <rect className="seed-pad-wet" x="18" y="292" width="92" height="22" rx="4" />
        {chamber.seeds && [38, 64, 90].map((x, j) => <g key={x} transform={`translate(${x} 291) scale(1.35)`}>
          <path className="seed-root" d={ROOTS[j]} pathLength="1" />
          <path className="seed-shoot" d={SHOOTS[j]} pathLength="1" />
          <ellipse className="seed" rx="6.5" ry="4.2" transform={`rotate(${(j - 1) * 20})`} />
        </g>)}
        <text className="seed-reading-label" x="8" y="356">O₂</text>
        <text className="seed-reading" x="8" y="378" ref={node => { readouts.current[i] = { ...readouts.current[i], o2: node } }}>210 mbar</text>
        <text className="seed-reading-label" x="80" y="356">CO₂</text>
        <text className="seed-reading co2" x="80" y="378" ref={node => { readouts.current[i] = { ...readouts.current[i], co2: node } }}>0.04 %</text>
      </g>)}
      <text className="seed-fine" x="300" y="426" textAnchor="middle">Illustrative readings · seedlings drawn larger than life</text>
    </svg>
  </div>
}
