import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Reveal from '../components/Reveal'

const projects = [
  { id: 'competition', category: 'Rocketry', title: 'Competition rocket', description: 'Next stop: Launch Canada 2027! We’re building the airframe, flight computer, and radio telemetry, plus the recovery system that brings our rocket safely back to the ground', work: 'Airframe · Flight computer · Telemetry · Recovery', target: 'Launch Canada 2027' },
  { id: 'cubesat', category: 'Space systems', title: 'CubeSat', description: 'Want to work on a spacecraft? Help us build the structure, electronics, and onboard computing for our small satellite mission', work: 'Satellite design · FPGA / ASIC · Onboard computing', target: 'CubeSat competition 2028' },
  { id: 'propulsion', category: 'Propulsion', title: 'Liquid engine', description: 'We want to fire an engine we designed ourselves! The work starts with engine design and fluid simulation, plus a test stand for running it on the ground', work: 'Engine design · Fluid dynamics · Test stand', target: 'Flight demonstration at Launch Canada 2027' }
]

export default function Projects() {
  const [openId, setOpenId] = useState(null)
  const location = useLocation()

  // Opens and scrolls to the project targeted by a #hash link (e.g. from the home page)
  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!id || !projects.some(p => p.id === id)) return
    setOpenId(id)
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => clearTimeout(t)
  }, [location.hash])

  return (
    <div className="club-page">
      <section className="page-heading wrap">
        <h1>What we’re<br />working on</h1>
        <p>A rocket for Launch Canada 2027, a CubeSat, and a liquid engine</p>
      </section>

      <section className="wrap project-list" aria-label="Our projects">
        {projects.map((p, i) => {
          const isOpen = openId === p.id
          return (
            <Reveal as="article" key={p.id} id={p.id} className={`project-row${isOpen ? ' is-open' : ''}`} delay={i * 80}>
              <button
                type="button"
                className="project-row-toggle"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : p.id)}
              >
                <span>
                  <span className="project-category">{p.category}</span>
                  <h2>{p.title}</h2>
                </span>
                <span className="project-row-chevron" aria-hidden="true">⌄</span>
              </button>
              <div className="project-row-body">
                <div className="project-row-body-inner">
                  <p>{p.description}</p>
                  <p className="project-work">{p.work}</p>
                  <p className="project-target">Project target: {p.target}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </section>
    </div>
  )
}
