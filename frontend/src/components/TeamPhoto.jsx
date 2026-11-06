import Reveal from './Reveal'

export default function TeamPhoto({ executives = [] }) {
  return <div className="people-grid">{executives.map((person, i) => <Reveal as="article" key={person.id} delay={i * 60}>
    <img src={person.image_url || '/Images/rocketrylogo.png'} alt={person.image_url?.includes('rocketrylogo') ? 'Guelph Rocketry club emblem' : person.name} loading="lazy" className={person.image_url?.includes('rocketrylogo') ? 'person-placeholder' : ''} />
    <h3>{person.name}</h3><p>{person.position}</p>
  </Reveal>)}</div>
}
