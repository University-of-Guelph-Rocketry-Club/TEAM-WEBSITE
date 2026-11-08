import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Hangar from '../components/home/Hangar'
import InterestPicker from '../components/home/InterestPicker'
import Postcards from '../components/home/Postcards'
import ProjectsSignpost from '../components/ProjectsSignpost'
import { sponsors } from '../content/sponsors'

export default function Home() {
  const [sponsor] = sponsors
  return (
    <div className="club-home">
      <Hero />
      <Hangar />
      <Postcards />
      <InterestPicker />
      {sponsor && (
        <section className="wrap supporter-strip">
          <div>
            <p>Supporting the build</p>
            <h2>{sponsor.name}</h2>
          </div>
          <p>{sponsor.homeText}</p>
          <Link className="text-link" to="/sponsors">
            Support the club
          </Link>
        </section>
      )}
      <ProjectsSignpost />
    </div>
  )
}
