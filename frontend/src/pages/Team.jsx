import TeamPhoto from '../components/TeamPhoto'

const Team = () => {
  const executives = [
    { id: 1, name: 'Darren', position: 'Club President', image_url: '/Images/darren.jpg' },
    { id: 2, name: 'Marko', position: 'VP Operations', image_url: '/Images/rocketrylogo.png' },
    { id: 3, name: 'Rachel', position: 'VP Regulatory', image_url: '/Images/Rachel.jpg' },
    { id: 4, name: 'Julian', position: 'Finance', image_url: '/Images/Julian.png' },
    { id: 5, name: 'Juliet', position: 'Rocketry Team Lead', image_url: '/Images/rocketrylogo.png' },
    { id: 6, name: 'Nick', position: 'Software Team Lead', image_url: '/Images/IMG_6239.jpeg' },
    { id: 7, name: 'Aban', position: 'Avionics Team Lead', image_url: '/Images/aban.png' },
    { id: 8, name: 'Yassin', position: 'Outreach Lead', image_url: '/Images/rocketrylogo.png' }
  ]

  return <div className="club-page team-page">
    <section className="page-heading wrap"><h1>Meet the team.</h1><p>2025 executive team and department leads.</p></section>
    <section className="wrap team-roster" aria-label="Executive team"><TeamPhoto executives={executives} /></section>
    <section className="club-invitation"><div className="wrap invitation-layout"><h2>Build with us.</h2><div><p>Software, avionics, rocketry, and finance. Every department has a part to play, and every skill level is welcome.</p><a className="club-button red" href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Join our Discord</a></div></div></section>
  </div>
}

export default Team
