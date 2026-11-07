import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Hangar from '../components/home/Hangar'
import InterestPicker from '../components/home/InterestPicker'
import ProjectsSignpost from '../components/ProjectsSignpost'

export default function Home() {
  return <div className="club-home">
    <Hero />
    <Hangar />
    <InterestPicker />
    <section className="wrap supporter-strip"><div><p>Supporting the build</p><h2>SOLIDWORKS</h2></div><p>Design and simulation tools provided through the SOLIDWORKS Sponsorship for Student Teams program</p><Link className="text-link" to="/sponsors">Support the club</Link></section>
    <ProjectsSignpost />
  </div>
}
