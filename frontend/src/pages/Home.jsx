import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProjectModel from '../components/ProjectModel'

export default function Home() {
  return <div className="club-home">
    <Hero />
    <section id="home-projects" className="project-preview wrap">
      <div className="section-intro"><h2>What we’re building</h2><Link className="text-link" to="/projects">See the projects</Link></div>
      <div className="project-columns">
        <article>
          <div className="project-heading"><div><span className="project-category">Rocketry</span><h3>Competition rocket</h3></div><ProjectModel kind="rocket" /></div>
          <p>We’re heading for Launch Canada 2027 with a rocket designed and built by our team<br />The goal? MACH 2.2</p><Link to="/projects#competition">Check out the rocket</Link>
        </article>
        <article>
          <div className="project-heading"><div><span className="project-category">Space systems</span><h3>CubeSat</h3></div><ProjectModel kind="cubesat" /></div>
          <p>Build a satellite with us! Help with the spacecraft structure, electronics, or onboard computing</p><Link to="/projects#cubesat">Check out the CubeSat</Link>
        </article>
        <article>
          <div className="project-heading"><div><span className="project-category">Propulsion</span><h3>Liquid engine</h3></div><ProjectModel kind="engine" /></div>
          <p>Let’s get this engine firing! We’re designing the liquid engine and its ground test stand</p><Link to="/projects#propulsion">Check out the engine</Link>
        </article>
      </div>
    </section>
    <section className="club-invitation"><div className="wrap invitation-layout"><h2>New to this?<br />Come give it a go!</h2><div><p>Write code, design a circuit, help build the rocket, or get us to competition with a budget and sponsors</p><p>Never done it before? That’s fine! Students from every Guelph program are welcome</p><Link className="club-button red" to="/join">I’m interested!</Link></div></div></section>
    <section className="wrap supporter-strip"><div><p>Supporting the build</p><h2>SOLIDWORKS</h2></div><p>Design and simulation tools provided through the SOLIDWORKS Sponsorship for Student Teams program</p><Link className="text-link" to="/sponsors">Support the club</Link></section>
  </div>
}
