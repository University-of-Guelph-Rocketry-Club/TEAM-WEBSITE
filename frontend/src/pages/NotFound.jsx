import { Link } from 'react-router-dom'
import RocketGlyph from '../components/RocketGlyph'

export default function NotFound() {
  return <div className="club-page lost-page">
    <section className="wrap lost-layout">
      <div className="lost-copy">
        <h1>Well, that was a rapid unscheduled disassembly</h1>
        <p>This page doesn’t exist, or it blew up on the pad. Either way, there’s nothing here!</p>
        <div className="lost-actions"><Link className="club-button gold" to="/">Take me home</Link><Link className="text-link" to="/projects">See what we’re building</Link></div>
      </div>
      <div className="lost-debris" aria-hidden="true">
        <RocketGlyph className="lost-rocket" />
      </div>
    </section>
  </div>
}
