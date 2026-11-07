import { useState } from 'react'
import CrewPatch from '../components/team/CrewPatch'
import Reveal from '../components/Reveal'

const crew = [
  { id: 1, name: 'Julian', position: 'Club President', image_url: '/Images/Julian.png' },
  { id: 2, name: 'Marko', position: 'VP Operations' },
  { id: 3, name: 'Rachel', position: 'VP Regulatory', image_url: '/Images/Rachel.jpg' },
  { id: 4, name: 'Nick', position: 'Software Team Lead', image_url: '/Images/IMG_6239.jpeg' },
  { id: 5, name: 'Aban', position: 'Avionics Team Lead', image_url: '/Images/aban.png' },
  { id: 6, name: 'Sohum', position: 'Outreach Lead' }
]

const Team = () => {
  const [active, setActive] = useState(null)

  return <div className="club-page team-page">
    <section className="crew-hero wrap">
      <div className="crew-intro">
        <h1>Meet the crew!</h1>
        <p>Say hi to our 2025 execs and department leads. Every mission gets a patch, so we made one with all our names on it</p>
      </div>
      <CrewPatch crew={crew} active={active} onHover={setActive} />
    </section>
    <section className="wrap crew-roster" aria-label="Executive team" onMouseLeave={() => setActive(null)}>
      {crew.map((person, i) => <Reveal as="article" key={person.id} delay={i * 60} className={active === person.id ? 'is-active' : ''} onMouseEnter={() => setActive(person.id)} onFocus={() => setActive(person.id)}>
        <div className="crew-photo">
          {person.image_url
            ? <img src={person.image_url} alt={person.name} loading="lazy" />
            : <span className="crew-monogram" aria-hidden="true">{person.name[0]}</span>}
        </div>
        <h3>{person.name}</h3>
        <p>{person.position}</p>
      </Reveal>)}
    </section>
    <section className="club-invitation"><div className="wrap invitation-layout"><h2>Make cool stuff<br />with us!</h2><div><p>See a team you’d like to join? Come say hi on Discord! Ask what’s being built and how you can get involved</p><a className="club-button red" href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Join our Discord</a></div></div></section>
  </div>
}

export default Team
