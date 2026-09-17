import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

export default function Home() {
  return <div className="club-home">
    <Hero />
    <section id="home-projects" className="project-preview wrap">
      <div className="section-intro"><h2>What we’re building</h2><Link className="text-link" to="/projects">See the projects</Link></div>
      <div className="project-columns">
        <article><span className="project-category">Rocketry</span><h3>Competition rocket</h3><p>Airframe, avionics, and recovery systems for our Launch Canada competition build.</p><Link to="/projects#competition">Explore the rocket</Link></article>
        <article><span className="project-category">Space systems</span><h3>CubeSat</h3><p>A small satellite project exploring spacecraft design, electronics, and onboard computing.</p><Link to="/projects#cubesat">Explore the satellite</Link></article>
        <article><span className="project-category">Propulsion</span><h3>Liquid engine</h3><p>Student-designed liquid propulsion, from engine design and simulation to test stand development.</p><Link to="/projects#propulsion">Explore the engine</Link></article>
      </div>
    </section>
    <section className="club-invitation"><div className="wrap invitation-layout"><h2>You don’t need to<br />be a rocket scientist.</h2><div><p>Start with a question, a bit of curiosity, or something you want to make. Our teams work on software, electronics, rocketry, and the finances that keep it all moving.</p><p>No previous experience needed. All University of Guelph students are welcome.</p><Link className="club-button red" to="/join">Find your team</Link></div></div></section>
    <section className="wrap supporter-strip"><div><p>Supporting the build</p><h2>SOLIDWORKS</h2></div><p>Design and simulation tools provided through the SOLIDWORKS Sponsorship for Student Teams program.</p><Link className="text-link" to="/sponsors">Support the club</Link></section>
  </div>
}
