import { useState } from 'react'
import { Link } from 'react-router-dom'

const INTERESTS = [
  ['writing code', 'Software', 'Flight software, the ground station, flight sims and even this website'],
  ['circuits', 'Avionics', 'Flight computers, sensors, radios and designing our own PCBs'],
  ['building stuff', 'Rocketry', 'Airframes, fins, parachutes, the motor and the liquid engine'],
  ['plants', 'the CubeSat team', 'There’s a seed experiment going up on the CubeSat (yes, really)'],
  ['money stuff', 'Finance', 'Sponsors, budgets and getting the whole team to competition'],
  ['social media', 'Outreach', 'Running our Instagram and LinkedIn, taking photos at launches and telling everyone what we’re up to']
]

// "New to this?" as a sentence you finish yourself.
export default function InterestPicker() {
  const [pick, setPick] = useState(0)
  const [, team, text] = INTERESTS[pick]

  return <section className="interest" aria-labelledby="interest-title">
    <div className="wrap">
      <h2 id="interest-title">New to this? Come give it a go!</h2>
      <p className="interest-sentence">
        <span>I’m into </span>
        {INTERESTS.map(([label], i) => <button key={label} type="button" className={pick === i ? 'is-picked' : ''} aria-pressed={pick === i} onClick={() => setPick(i)}>{label}</button>)}
      </p>
      <div className="interest-answer" aria-live="polite">
        <p key={pick}><strong>You’d fit right in on {team}!</strong> {text}</p>
      </div>
      <p className="interest-small">Never done any of it before? That’s fine! Students from every Guelph program are welcome</p>
      <Link className="club-button gold" to="/join">I’m interested!</Link>
    </div>
  </section>
}
