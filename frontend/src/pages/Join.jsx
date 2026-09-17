const departments = [
  ['Software', 'Flight computers, ground stations, simulations, and data visualization.'],
  ['Avionics', 'Sensors, circuits, control systems, and PCB design.'],
  ['Rocketry', 'Propulsion, aerodynamics, structures, and composites.'],
  ['Finance', 'Sponsorship, budgeting, and event coordination.']
]
export default function Join() {
  return <div className="club-page"><section className="page-heading wrap"><h1>There’s room<br />on the team.</h1><p>Open to all University of Guelph students. You don’t need experience, a particular major, or your own equipment to get started.</p></section><section className="join-panel wrap"><div><h2>Start on Discord.</h2><p>Introduce yourself, see what the teams are working on, and find the next meeting. Meeting details and project updates are posted there.</p><a className="club-button gold" href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Join our Discord</a></div><div className="join-note"><h3>Not sure where you fit?</h3><p>That’s fine. Come to a meeting and ask questions. You can try a department or contribute to more than one.</p><a href="mailto:rocketry@uoguelph.ca">Email us a question</a></div></section><section className="wrap departments"><h2>Find something you want to build.</h2><div className="department-list">{departments.map(([name, desc]) => <article key={name}><h3>{name}</h3><p>{desc}</p></article>)}</div></section></div>
}
