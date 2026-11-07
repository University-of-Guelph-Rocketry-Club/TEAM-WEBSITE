import Reveal from '../components/Reveal'
import { team, teamIntro } from '../content/team'
import { site } from '../content/site'

export default function Team() {
  return (
    <div className="club-page team-page">
      <section className="crew-hero wrap">
        <h1>Meet the crew!</h1>
        <p>{teamIntro}</p>
      </section>
      <section className="wrap crew-roster" aria-label="Executive team">
        {team.map((person, i) => (
          <Reveal as="article" key={`${person.name}-${person.role}`} delay={i * 60}>
            <div className="crew-photo">
              {person.photo ? (
                <img src={person.photo} alt={person.name} loading="lazy" />
              ) : (
                <span className="crew-monogram" aria-hidden="true">
                  {person.name[0]}
                </span>
              )}
            </div>
            <h3>{person.name}</h3>
            <p>{person.role}</p>
          </Reveal>
        ))}
      </section>
      <section className="club-invitation">
        <div className="wrap invitation-layout">
          <h2>
            Make cool stuff
            <br />
            with us!
          </h2>
          <div>
            <p>
              See a team you’d like to join? Come say hi on Discord! Ask what’s being built and how
              you can get involved
            </p>
            <a
              className="club-button red"
              href={site.discord}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join our Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
