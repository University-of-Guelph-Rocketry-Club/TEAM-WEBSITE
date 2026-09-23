import { NavLink, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  return <header className={`club-header${pathname === '/' ? ' home-header' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="club-nav wrap">
      <Link to="/" className="club-brand" onClick={() => setOpen(false)}>
        <img src="/Images/rocketrylogo.png" alt="" />
        <span>Guelph Rocketry<small>University of Guelph</small></span>
      </Link>
      <button className="menu-toggle" aria-expanded={open} aria-controls="club-links" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      <nav id="club-links" aria-label="Main navigation" className={`club-links ${open ? 'is-open' : ''}`}>
        {[['/', 'Home'], ['/projects', 'Projects'], ['/team', 'Our team'], ['/sponsors', 'Sponsors'], ['/join', 'Join the club']].map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
        <a className="nav-discord" href="https://discord.gg/asjHsm7DVj" target="_blank" rel="noopener noreferrer">Discord</a>
      </nav>
    </div>
  </header>
}
