import { useState } from 'react'
import { API_BASE_URL } from '../lib/api'

const ORG = 'University-of-Guelph-Rocketry-Club'

const messages = {
  invited: (u) => ({ ok: true, text: `Invite sent to @${u}!`, accept: true }),
  member: (u) => ({ ok: true, text: `@${u} is already in the org. You're all set.` }),
  badcode: () => ({ ok: false, text: "That join code isn't right. Check the Discord for the current one." }),
  expired: () => ({ ok: false, text: 'Sign-in timed out or was cancelled. Please try again.' }),
  error: () => ({ ok: false, text: 'Something went wrong sending your invite. Ask a team lead to add you.' }),
}

// Read the result GitHub sign-in sent us back with, once, then tidy the URL
// without telling the router (so the page doesn't jump back to the top).
function readStatus() {
  const params = new URLSearchParams(window.location.search)
  const status = params.get('github')
  if (!messages[status]) return null
  window.history.replaceState(null, '', `${window.location.pathname}#github`)
  return messages[status](params.get('u') || '')
}

export default function GitHubJoin() {
  const [result] = useState(readStatus)
  const done = result?.ok

  return (
    <section id="github" className="github-join wrap">
      <div>
        <h2>Get on our GitHub</h2>
        <p>Our flight software, PCB designs, and ground station code all live on GitHub.</p>
        <p>Enter the join code from the Discord and sign in with GitHub. Your invite is sent automatically.</p>
      </div>

      <div>
        {result && (
          <p className={`github-join-msg ${result.ok ? 'ok' : 'bad'}`} role="status">
            {result.text}{' '}
            {result.accept && (
              <a href={`https://github.com/orgs/${ORG}/invitation`} target="_blank" rel="noopener noreferrer">
                Accept it here
              </a>
            )}
          </p>
        )}

        {!done && (
          <form method="POST" action={`${API_BASE_URL}/github/join`} className="github-join-form">
            <label htmlFor="github-code">Join code</label>
            <input id="github-code" name="code" autoComplete="off" required />
            <button type="submit" className="club-button red">Continue with GitHub</button>
            <small>No account? You can make one on the next screen. We only see your public username.</small>
          </form>
        )}
      </div>
    </section>
  )
}
