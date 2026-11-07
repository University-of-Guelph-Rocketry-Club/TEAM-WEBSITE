import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import { sponsorNeeds, sponsors } from '../content/sponsors'
import { site } from '../content/site'

// Type a name and it gets painted down the side of the 3D rocket.
function NameOnRocket() {
  const hostRef = useRef(null)
  const sceneRef = useRef(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    import('../components/sponsors/sponsorScene')
      .then(({ mountSponsorScene }) => {
        if (cancelled) return
        sceneRef.current = mountSponsorScene(hostRef.current, () => setStatus('failed'))
        setStatus(sceneRef.current ? 'ready' : 'failed')
      })
      .catch(() => !cancelled && setStatus('failed'))
    return () => {
      cancelled = true
      sceneRef.current?.release()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.setText(name.trim().toUpperCase())
  }, [name, status])

  return (
    <section className={`sponsor-hero is-${status}`}>
      <div className="wrap sponsor-hero-copy">
        <h1>Put your name on a rocket!</h1>
        <p>
          Type your company’s name and see how it’d look on ours. Your support buys parts and tools
          and gets our rocket to competition
        </p>
        <form className="sponsor-try" onSubmit={event => event.preventDefault()}>
          <label htmlFor="sponsor-name">Your company</label>
          <input
            id="sponsor-name"
            value={name}
            maxLength={28}
            autoComplete="organization"
            placeholder="Your name here"
            onChange={event => setName(event.target.value)}
          />
        </form>
      </div>
      <div ref={hostRef} className="sponsor-rocket" aria-hidden="true" />
    </section>
  )
}

export default function Sponsors() {
  return (
    <div className="club-page sponsors-page">
      <NameOnRocket />

      {sponsors.map((sponsor, i) => (
        <Reveal as="section" key={sponsor.name} className="wrap sponsor-feature">
          <div>
            {i === 0 && <p>Thanks to our sponsors!</p>}
            <h2>{sponsor.name}</h2>
          </div>
          <div>
            <h3>{sponsor.headline}</h3>
            <p>{sponsor.text}</p>
          </div>
        </Reveal>
      ))}

      <section className="wrap sponsor-needs" aria-labelledby="needs-title">
        <h2 id="needs-title">Where your support goes</h2>
        <ol className="parts-list">
          {sponsorNeeds.map((need, i) => (
            <Reveal as="li" key={need.item} delay={i * 50}>
              <strong>{need.item}</strong>
              <span className="parts-leader" aria-hidden="true" />
              <span className="parts-text">{need.text}</span>
            </Reveal>
          ))}
        </ol>
      </section>

      <Reveal as="section" className="club-invitation">
        <div className="wrap invitation-layout">
          <h2>Want your logo up there for real?</h2>
          <div>
            <p>
              We’d love to hear from you! We can use materials, equipment, software, or help with
              competition costs
            </p>
            <p>Email us and we’ll chat about what the team needs and how you’d like to help</p>
            <a className="club-button red" href={`mailto:${site.email}`}>
              Email {site.email}
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
