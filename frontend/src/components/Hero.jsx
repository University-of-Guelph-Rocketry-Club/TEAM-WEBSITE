import { Link } from 'react-router-dom'

export default function Hero() {
  return <section className="launch-hero">
    <div className="hero-copy">
      <p className="hero-intro">University of Guelph Rocketry Club</p>
      <h1>Built here.<br />Flown together.</h1>
      <p className="hero-description">We’re students building rockets, flight computers, and satellite systems. Come find your part in the next build.</p>
      <div className="hero-actions"><Link className="club-button gold" to="/join">Join the club</Link><Link className="hero-project-link" to="/projects">Explore our projects</Link></div>
      <div className="hero-footnote"><span className="brand-stripe" aria-hidden="true" />Student-run. Open to every discipline.</div>
    </div>
    <figure className="hero-photo">
      <img src="/Images/launch-field.jpg" alt="A rocket lifting off from a grassy launch field as spectators watch" fetchPriority="high" />
      <figcaption>Out of the workshop. Off the launch pad.</figcaption>
    </figure>
  </section>
}
