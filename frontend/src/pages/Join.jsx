import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import GitHubJoin from '../components/GitHubJoin'
import LaunchChecklist from '../components/join/LaunchChecklist'
import { departments } from '../content/join'
import { site } from '../content/site'

export default function Join() {
  return (
    <div className="club-page join-page">
      <section className="page-heading wrap">
        <h1>
          There’s room
          <br />
          on the team!
        </h1>
        <p>
          Never built a rocket? Come build your first one with us! Students from every University of
          Guelph program can join
        </p>
      </section>

      <LaunchChecklist />

      <section id="departments" className="wrap departments" aria-labelledby="departments-title">
        <h2 id="departments-title">Where will you start?</h2>
        <div className="department-list">
          {departments.map((department, i) => (
            <Reveal as="article" key={department.name} delay={i * 60}>
              <h3>{department.name}</h3>
              <p>{department.summary}</p>
              <p className="department-more">{department.details}</p>
              <Link to={department.link}>See what they’re up to</Link>
            </Reveal>
          ))}
        </div>
        <p className="departments-note">
          Not sure which team to join? Come to a meeting and see what catches your interest, or{' '}
          <a href={`mailto:${site.email}`}>ask us a question</a>
        </p>
      </section>

      <GitHubJoin />
    </div>
  )
}
