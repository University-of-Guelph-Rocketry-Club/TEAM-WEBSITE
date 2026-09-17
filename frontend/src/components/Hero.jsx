import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const sceneRef = useRef(null)
  const videoRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const scene = sceneRef.current
    const video = videoRef.current
    if (failed || !video) {
      scene.style.setProperty('--travel', '0')
      return
    }
    let frame = 0
    let target = 0
    const seek = () => {
      if (!video.seeking && video.readyState >= 2 && Number.isFinite(video.duration)) {
        const time = target * Math.max(0, video.duration - 0.04)
        if (Math.abs(video.currentTime - time) > 0.025) video.currentTime = time
      }
    }
    const update = () => {
      frame = 0
      const rect = scene.getBoundingClientRect()
      const distance = scene.offsetHeight - scene.firstElementChild.offsetHeight
      target = Math.min(1, Math.max(0, -rect.top / Math.max(1, distance)))
      scene.style.setProperty('--travel', String(target))
      seek()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // Finish the latest requested seek before issuing another, even on fast scrolls.
    video.addEventListener('seeked', seek)
    video.addEventListener('loadeddata', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      video.removeEventListener('seeked', seek)
      video.removeEventListener('loadeddata', schedule)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [failed])

  const animated = !failed

  return <section ref={sceneRef} className={`launch-scene ${animated ? 'is-animated' : ''}`} aria-label="Guelph Rocketry launch">
    <div className="launch-stage">
      <div className="launch-stars" aria-hidden="true" />
      <div className="launch-visual" aria-hidden="true">
        <img src="/Images/launch-scroll.jpg" alt="" fetchpriority="high" />
        {animated && <video ref={videoRef} src="/Videos/launch-scroll.mp4" poster="/Images/launch-scroll.jpg" muted playsInline preload="auto" onError={() => setFailed(true)} />}
      </div>
      <div className="hero-copy">
        <p className="hero-intro">University of Guelph Rocketry Club</p>
        <h1>Built here<br />Bound for<br />the beyond!</h1>
        <p className="hero-description">We’re students building rockets, flight computers, and satellite systems — come find your part in the next build</p>
        <div className="hero-actions"><Link className="club-button gold" to="/join">Join the club</Link><Link className="hero-project-link" to="/projects">Explore our projects</Link></div>
        <div className="hero-footnote"><span className="brand-stripe" aria-hidden="true" />Student-run and open to every discipline</div>
      </div>
      <div className="launch-bottom">
        <a href="#home-projects" className="launch-scroll-cue"><span aria-hidden="true">↓</span>{animated ? 'Scroll for more' : 'Discover the projects'}</a>
      </div>
      <p className="launch-footage-caption">*actual footage from one of our launches</p>
      <div className="launch-progress" aria-hidden="true"><span /></div>
    </div>
  </section>
}
