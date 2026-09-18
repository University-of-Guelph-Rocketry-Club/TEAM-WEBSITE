const departments = [
  ['Software', 'Flight computers, ground stations, simulations, and data visualization'],
  ['Avionics', 'Sensors, circuits, control systems, and PCB design'],
  ['Rocketry', 'Propulsion, aerodynamics, structures, and composites'],
  ['Finance', 'Sponsorship, budgeting, and event coordination']
]
export default function Join() {
  return <div className="club-page"><section className="page-heading wrap"><h1>There’s room<br />on the team!</h1><p>Never built a rocket? Come build your first one with us! Students from every University of Guelph program can join</p></section><section className="join-panel wrap"><div><h2>Come say hi!</h2><p>Hop into our Discord and introduce yourself</p><p>You’ll find meeting times and updates on what we’re building</p><a className="club-button gold" href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Join our Discord</a></div><div className="join-note"><h3>Not sure which team to join?</h3><p>Come to a meeting and see what catches your interest</p><p>Try a department or work with a couple of teams</p><a href="mailto:rocketry@uoguelph.ca">Ask us a question</a></div></section><section className="wrap departments"><h2>Where will you start?</h2><div className="department-list">{departments.map(([name, desc]) => <article key={name}><h3>{name}</h3><p>{desc}</p></article>)}</div></section></div>
}
