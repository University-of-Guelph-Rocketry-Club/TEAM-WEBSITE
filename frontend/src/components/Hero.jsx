import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const sceneRef = useRef(null)
  const videoRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const scene = sceneRef.current
    const video = videoRef.current
    const header = document.querySelector('.club-header')
    const measureHeader = () => {
      scene.style.setProperty('--launch-header-height', `${header?.offsetHeight || 0}px`)
    }
    measureHeader()
    if (failed || !video) {
      scene.style.setProperty('--travel', '0')
      return
    }
    let frame = 0
    let target = 0
    let progress = 0
    let previousTime = 0
    let scrollChanged = true
    const seek = () => {
      if (!video.seeking && video.readyState >= 2 && Number.isFinite(video.duration)) {
        const time = progress * Math.max(0, video.duration - 1 / 30)
        if (Math.abs(video.currentTime - time) > 1 / 60) video.currentTime = time
      }
    }
    const update = (now) => {
      frame = 0
      if (scrollChanged) {
        const rect = scene.getBoundingClientRect()
        const distance = scene.offsetHeight - scene.firstElementChild.offsetHeight
        // The stage is pinned below the header from the first scroll pixel.
        target = Math.min(1, Math.max(0, ((header?.offsetHeight || 0) - rect.top) / Math.max(1, distance)))
        scrollChanged = false
      }
      const elapsed = previousTime ? Math.min(now - previousTime, 64) : 16
      previousTime = now
      progress += (target - progress) * (1 - Math.exp(-elapsed / 65))
      if (Math.abs(target - progress) < 0.001) progress = target
      scene.style.setProperty('--travel', String(progress))
      seek()
      if (progress !== target) frame = requestAnimationFrame(update)
      else previousTime = 0
    }
    const schedule = () => {
      scrollChanged = true
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(() => {
      measureHeader()
      schedule()
    })
    // Finish the latest requested seek before issuing another, even on fast scrolls.
    video.addEventListener('seeked', seek)
    video.addEventListener('loadeddata', schedule)
    if (header) observer.observe(header)
    observer.observe(scene)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
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
        {animated && <video ref={videoRef} poster="/Images/launch-scroll.jpg" muted playsInline preload="auto" onError={event => {
          if (event.target === event.currentTarget) setFailed(true)
        }}>
          <source src="/Videos/launch-scrub-mobile.mp4" type="video/mp4" media="(max-width: 760px)" />
          <source src="/Videos/launch-scrub.mp4" type="video/mp4" onError={() => setFailed(true)} />
        </video>}
      </div>
      <div className="hero-copy">
        <p className="hero-intro">University of Guelph Rocketry Club</p>
        <h1>Built here<br />Bound for<br />the beyond!</h1>
        <p className="hero-description">Come build rockets and satellites with us at Guelph! We’re getting ready for Launch Canada 2027</p>
        <div className="hero-actions"><Link className="club-button gold" to="/join">Join the club</Link><Link className="hero-project-link" to="/projects">Explore our projects</Link></div>
        <div className="hero-footnote"><span className="brand-stripe" aria-hidden="true" />Run by students, open to every major</div>
      </div>
      <div className="launch-bottom">
        <a href="#home-projects" className="launch-scroll-cue"><span aria-hidden="true">↓</span>{animated ? 'Scroll for more' : 'Discover the projects'}</a>
      </div>
      <p className="launch-footage-caption">*actual footage from one of our launches</p>
      <div className="launch-progress" aria-hidden="true"><span /></div>
    </div>
  </section>
}
