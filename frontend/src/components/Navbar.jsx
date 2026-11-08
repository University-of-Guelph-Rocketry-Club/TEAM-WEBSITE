import { NavLink, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { site } from '../content/site'

// Add a page here and give it a route in App.jsx.
const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/team', label: 'Our team' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/gallery', label: 'Photos' },
  { to: '/join', label: 'Join the club' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  return (
    <header className={`club-header${pathname === '/' ? ' home-header' : ''}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="club-nav wrap">
        <Link to="/" className="club-brand" onClick={() => setOpen(false)}>
          <img src="/Images/rocketrylogo.png" alt="" />
          <span>
            Guelph Rocketry<small>University of Guelph</small>
          </span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="club-links"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav
          id="club-links"
          aria-label="Main navigation"
          className={`club-links ${open ? 'is-open' : ''}`}
        >
          {PAGES.map(page => (
            <NavLink
              key={page.to}
              to={page.to}
              end={page.to === '/'}
              onClick={() => setOpen(false)}
            >
              {page.label}
            </NavLink>
          ))}
          <a className="nav-discord" href={site.discord} target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </nav>
      </div>
    </header>
  )
}
