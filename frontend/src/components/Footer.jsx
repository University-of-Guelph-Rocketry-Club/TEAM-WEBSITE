import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import RocketGlyph, { ParachuteGlyph } from './RocketGlyph'

// A little rocket on the footer's pad. Launch it and it burns off the top of the screen, then
// comes back down under its main chute (nose cone and body hanging off the shock cord) at a
// steady descent rate, like the real thing.
function PadRocket() {
  const [phase, setPhase] = useState('idle')
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const launch = () => {
    if (phase !== 'idle') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const steps = [['burn', 0], ['coast', 1700], ['descent', 2600], ['landed', 7400], ['idle', 9200]]
    timers.current = steps.map(([next, at]) => setTimeout(() => setPhase(next), at))
  }

  return <div className={`pad-rocket is-${phase}`}>
    <span className="pad-smoke" aria-hidden="true" />
    <button type="button" className="pad-launch" onClick={launch} disabled={phase !== 'idle'} aria-label="Launch the little rocket">
      <RocketGlyph className="pad-flyer" flame />
    </button>
    <div className="pad-descent" aria-hidden="true">
      <ParachuteGlyph className="pad-chute" />
      <span className="pad-cord" />
      <RocketGlyph className="pad-nose" viewBox="-10 -1 20 63" />
      <RocketGlyph className="pad-body" viewBox="-32 60 64 284" />
    </div>
    <span className="pad-rail" aria-hidden="true" />
    <span className="pad-hint" aria-hidden="true">{phase === 'idle' ? 'Go on, click it' : ''}</span>
  </div>
}

export default function Footer() {
  return <footer className="club-footer">
    <div className="wrap footer-top">
      <div>
        <Link to="/" className="footer-brand">Guelph Rocketry</Link>
        <p>University of Guelph<br />Guelph, Ontario<br /><span className="footer-coords">43.53° N, 80.23° W</span></p>
      </div>
      <div><h2>Get in touch</h2><a href="mailto:rocketry@uoguelph.ca">rocketry@uoguelph.ca</a><a href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Join our Discord</a></div>
      <div><h2>Follow the builds</h2><a href="https://www.instagram.com/guelph_rockets" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.linkedin.com/company/uofg-rocketry-club/posts/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/University-of-Guelph-Rocketry-Club" target="_blank" rel="noopener noreferrer">GitHub</a></div>
    </div>
    <div className="wrap footer-ground">
      <PadRocket />
      <p className="footer-wordmark" aria-hidden="true">Guelph Rocketry</p>
    </div>
    <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} University of Guelph Rocketry Club</span><Link to="/privacy">Privacy & cookies</Link></div>
  </footer>
}
