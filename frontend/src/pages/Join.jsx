import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import GitHubJoin from '../components/GitHubJoin'
import LaunchChecklist from '../components/join/LaunchChecklist'

const departments = [
  ['Software', 'Flight computers, ground stations, simulations, and data visualization', 'Flight software, telemetry, and the ground station that tracks the CubeSat', '/projects#flight'],
  ['Avionics', 'Sensors, circuits, control systems, and PCB design', 'Everything in the av bay, plus the boards inside the CubeSat', '/projects#competition'],
  ['Rocketry', 'Propulsion, aerodynamics, structures, and composites', 'Airframe, fins, parachutes, the motor and the liquid engine', '/projects#propulsion'],
  ['Finance', 'Sponsorship, budgeting, and event coordination', 'Finding sponsors and getting the whole team to Launch Canada', '/sponsors']
]

export default function Join() {
  return (
    <div className="club-page join-page">
      <section className="page-heading wrap">
        <h1>There’s room<br />on the team!</h1>
        <p>Never built a rocket? Come build your first one with us! Students from every University of Guelph program can join</p>
      </section>

      <LaunchChecklist />

      <section id="departments" className="wrap departments" aria-labelledby="departments-title">
        <h2 id="departments-title">Where will you start?</h2>
        <div className="department-list">
          {departments.map(([name, desc, more, to], i) => (
            <Reveal as="article" key={name} delay={i * 60}>
              <h3>{name}</h3>
              <p>{desc}</p>
              <p className="department-more">{more}</p>
              <Link to={to}>See what they’re up to</Link>
            </Reveal>
          ))}
        </div>
        <p className="departments-note">Not sure which team to join? Come to a meeting and see what catches your interest, or <a href="mailto:rocketry@uoguelph.ca">ask us a question</a></p>
      </section>

      <GitHubJoin />
    </div>
  )
}
