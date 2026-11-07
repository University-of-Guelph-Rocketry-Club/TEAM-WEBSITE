import { useState } from 'react'
import { Link } from 'react-router-dom'
import { interests } from '../../content/home'
import { eventFor, photoSrc } from '../../content/gallery'

// "New to this?" as a sentence you finish yourself. Each answer comes with a print from one of our
// trips, if the interest has a `photo`.
export default function InterestPicker() {
  const [pick, setPick] = useState(0)
  const { team, text, photo } = interests[pick]

  return (
    <section className="interest" aria-labelledby="interest-title">
      <div className="wrap interest-layout">
        <div>
          <h2 id="interest-title">New to this? Come give it a go!</h2>
          <p className="interest-sentence">
            <span>I’m into </span>
            {interests.map(({ label }, i) => (
              <button
                key={label}
                type="button"
                className={pick === i ? 'is-picked' : ''}
                aria-pressed={pick === i}
                onClick={() => setPick(i)}
              >
                {label}
              </button>
            ))}
          </p>
          <div className="interest-answer" aria-live="polite">
            <p key={pick}>
              <strong>You’d fit right in on {team}!</strong> {text}
            </p>
          </div>
          <p className="interest-small">
            Never done any of it before? That’s fine! Students from every Guelph program are welcome
          </p>
          <Link className="club-button gold" to="/join">
            I’m interested!
          </Link>
        </div>
        <div className="interest-print" aria-hidden="true">
          {photo && (
            <Link to={`/gallery/${eventFor(photo)?.slug ?? ''}`} key={photo} tabIndex={-1}>
              <img src={photoSrc(photo, true)} alt="" loading="lazy" decoding="async" />
              <span>{team}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
