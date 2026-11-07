import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gallery, photoSrc, postcards } from '../../content/gallery'

// A row of prints from the last competition that slides sideways as you scroll past it, like a
// strip of photos being pulled across a table. Every print links to the gallery.
export default function Postcards() {
  const ref = useRef(null)

  useEffect(() => {
    const section = ref.current
    const strip = section.querySelector('.postcards-strip')
    // Small screens scroll the strip by hand instead, and so does anyone who'd rather not have
    // things move on their own.
    const still = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 760px)')
    let frame = 0
    const update = () => {
      frame = 0
      if (still.matches) {
        section.style.removeProperty('--shift')
        return
      }
      const rect = section.getBoundingClientRect()
      const height = window.innerHeight || 1
      // 0 as the strip comes in at the bottom of the screen, 1 as it leaves at the top. The
      // middle 70% of that is the bit people actually look at, so the sliding happens there.
      const p = (height - rect.top) / (height + rect.height)
      const eased = Math.min(1, Math.max(0, (p - 0.15) / 0.7))
      const overflow = Math.max(0, strip.scrollWidth - section.clientWidth)
      section.style.setProperty('--shift', `${(-eased * overflow).toFixed(1)}px`)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(strip)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section ref={ref} className="postcards" aria-labelledby="postcards-title">
      <div className="wrap postcards-head">
        <div>
          <p className="postcards-eyebrow">
            {gallery.when} · {gallery.where}
          </p>
          <h2 id="postcards-title">Postcards from {gallery.title}</h2>
        </div>
        <Link className="text-link" to="/gallery">
          See the whole roll
        </Link>
      </div>
      <div className="postcards-strip">
        {postcards.map((card, i) => (
          <Link
            key={card.name}
            to="/gallery"
            className="postcard"
            style={{ '--tilt': `${card.tilt}deg`, '--i': i }}
            aria-label={`${card.caption}, open the photo gallery`}
          >
            <img src={photoSrc(card.name, true)} alt="" loading="lazy" decoding="async" />
            <span>{card.caption}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
