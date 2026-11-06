import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// End-of-home signpost to the projects page. The arrow is a climbing flight path that draws
// itself once, the first time the section comes into view.
export default function ProjectsSignpost() {
  const ref = useRef(null)

  useEffect(() => {
    const section = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      section.classList.add('is-drawn')
      observer.disconnect()
    }, { threshold: 0.4 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return <section ref={ref} className="signpost" aria-labelledby="signpost-title">
    <Link to="/projects" className="signpost-link wrap">
      <span className="signpost-copy">
        <span id="signpost-title" className="signpost-title">There’s way more on the projects page</span>
        <span className="signpost-text">Take our rocket apart, watch a whole flight play out and follow our CubeSat into orbit</span>
        <span className="signpost-cta">See our projects</span>
      </span>
      <svg className="signpost-arrow" viewBox="0 0 320 200" aria-hidden="true">
        <path className="signpost-path" d="M 8 192 C 96 188, 176 150, 232 80 S 292 20, 300 14" pathLength="1" />
        <path className="signpost-head" d="M 274.9 20.7 L 300 14 L 293.3 39.1" pathLength="1" />
      </svg>
    </Link>
  </section>
}
