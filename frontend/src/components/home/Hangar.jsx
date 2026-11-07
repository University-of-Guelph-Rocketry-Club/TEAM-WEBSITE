import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStorySection, useSectionProgress } from '../projects/scrollStory'
import { STATIONS } from './hangarStations'

const PROJECTS = [
  {
    name: 'Rocket',
    title: 'Competition rocket',
    text: 'We’re heading for Launch Canada 2027 with a rocket designed and built by our team. The goal? Mach 2.2!',
    to: '/projects#competition',
    cta: 'Check out the rocket'
  },
  {
    name: 'CubeSat',
    title: 'CubeSat',
    text: 'Build a satellite with us! Help with the spacecraft structure, electronics, or onboard computing',
    to: '/projects#cubesat',
    cta: 'Check out the CubeSat'
  },
  {
    name: 'Engine',
    title: 'Liquid engine',
    text: 'Let’s get this engine firing! We’re designing the liquid engine and its ground test stand',
    to: '/projects#propulsion',
    cta: 'Check out the engine'
  }
]

const LABELS = [
  { anchor: 'engine-loadcell', title: 'Load cell', text: 'Measures the thrust' },
  { anchor: 'engine-chamber', title: 'Copper chamber', text: 'Soaks up the heat on short burns' },
  { anchor: 'engine-valve', title: 'Run valves', text: 'Open them and it lights', side: 'left' }
]

// Copy fades in while its station is in view: a little before it arrives, a little after it leaves.
const windows = STATIONS.map(([arrive, leave], i) => [i === 0 ? -1 : arrive - 0.03, i === STATIONS.length - 1 ? 2 : leave + 0.03])

// "What we're building": a pinned walk down the hangar, past our three projects.
export default function Hangar() {
  const sectionRef = useStorySection('hangar')
  const hostRef = useRef(null)
  const labelRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [current, setCurrent] = useState(0)

  useSectionProgress('hangar', ({ p }) => {
    setCurrent(p < (STATIONS[0][1] + STATIONS[1][0]) / 2 ? 0 : p < (STATIONS[1][1] + STATIONS[2][0]) / 2 ? 1 : 2)
  })

  useEffect(() => {
    let cancelled = false
    let release
    import('./hangarScene')
      .then(({ mountHangarScene }) => {
        if (cancelled) return
        release = mountHangarScene(hostRef.current, labelRef.current, 'hangar', () => setStatus('failed'))
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

  // Jump to the middle of a station's hold
  const go = index => {
    const section = sectionRef.current
    const [arrive, leave] = STATIONS[index]
    const travel = section.offsetHeight - window.innerHeight
    const top = section.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + travel * Math.min(0.99, (arrive + leave) / 2), behavior: 'smooth' })
  }

  return <section ref={sectionRef} id="home-projects" className={`hangar is-${status}`} style={{ '--h': 460 }} aria-labelledby="hangar-title">
    <div className="hangar-pin">
      <div ref={hostRef} className="hangar-canvas" aria-hidden="true" />
      <div ref={labelRef} className="hangar-labels" aria-hidden="true">
        {LABELS.map(label => <div key={label.anchor} className={`hangar-label side-${label.side || 'right'}`} data-anchor={label.anchor} data-station="2">
          <span className="hangar-label-dot" />
          <span className="hangar-label-text"><strong>{label.title}</strong><small>{label.text}</small></span>
        </div>)}
      </div>
      <div className="hangar-head wrap">
        <h2 id="hangar-title">What we’re building</h2>
        <ol className="hangar-stops">
          {PROJECTS.map((project, i) => <li key={project.name}><button type="button" className={current === i ? 'is-current' : ''} aria-current={current === i ? 'step' : undefined} onClick={() => go(i)}>{project.name}</button></li>)}
        </ol>
      </div>
      {PROJECTS.map((project, i) => <article key={project.name} className={`hangar-card${current === i ? ' is-current' : ''}`} style={{ '--in': windows[i][0], '--out': windows[i][1] }} inert={current === i ? undefined : ''}>
        <h3>{project.title}</h3>
        <p>{project.text}</p>
        <Link to={project.to}>{project.cta}</Link>
      </article>)}
      <p className="hangar-note">Everything here is to scale with everything else. The engine and test stand are an example, ours are still being designed</p>
    </div>
  </section>
}
