import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { events, photoSrc } from '../content/gallery'

const pad = n => String(n).padStart(2, '0')

// Full-screen viewer. Arrow keys and swipes move between photos, Escape (or the backdrop) closes.
function Lightbox({ photos, index, onClose, onMove }) {
  const dialogRef = useRef(null)
  const touch = useRef(null)
  const photo = index >= 0 ? photos[index] : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (photo && !dialog.open) dialog.showModal()
    if (!photo && dialog.open) dialog.close()
  }, [photo])

  useEffect(() => {
    if (!photo) return
    const onKey = event => {
      if (event.key === 'ArrowRight') onMove(1)
      if (event.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    // Warm up the neighbours so the next click doesn't wait on the network.
    ;[index + 1, index - 1].forEach(i => {
      if (photos[i]) new Image().src = photoSrc(photos[i].src)
    })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [photo, photos, index, onMove])

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Photo viewer"
      onClose={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
      onTouchStart={event => {
        touch.current = event.touches[0].clientX
      }}
      onTouchEnd={event => {
        if (touch.current === null) return
        const dx = event.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 48) onMove(dx < 0 ? 1 : -1)
      }}
    >
      {photo && (
        <figure className="lightbox-figure" key={photo.src}>
          <img
            src={photoSrc(photo.src)}
            alt={photo.caption}
            style={{ aspectRatio: photo.ratio }}
            draggable="false"
          />
          <figcaption>
            <span className="lightbox-count">
              {pad(index + 1)} / {pad(photos.length)}
            </span>
            <span className="lightbox-caption">{photo.caption}</span>
            <span className="lightbox-chapter">{photo.chapter}</span>
          </figcaption>
        </figure>
      )}
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button
        type="button"
        className="lightbox-arrow is-prev"
        onClick={() => onMove(-1)}
        aria-label="Previous photo"
      >
        ←
      </button>
      <button
        type="button"
        className="lightbox-arrow is-next"
        onClick={() => onMove(1)}
        aria-label="Next photo"
      >
        →
      </button>
    </dialog>
  )
}

const eventPhotos = event =>
  event.chapters.flatMap(chapter =>
    chapter.photos.map(photo => ({
      ...photo,
      src: `${event.slug}/${photo.name}`,
      chapter: chapter.title
    }))
  )

const stamp = event => [event.when, event.where].filter(Boolean).join(' · ')

// /gallery: one cover per event, newest first, each with a peek at what's inside.
function GalleryIndex() {
  return (
    <div className="club-page gallery-page">
      <section className="wrap gallery-index-head">
        <p className="gallery-eyebrow">Photos</p>
        <h1>Where we’ve been</h1>
        <p>Competitions, conferences and everything in between. Pick a roll</p>
      </section>
      <section className="wrap gallery-covers" aria-label="Events">
        {events.map((event, i) => {
          const photos = eventPhotos(event)
          const peek = photos.filter(photo => photo.name !== event.hero).slice(0, 4)
          return (
            <Reveal key={event.slug} delay={i * 90}>
              <Link to={`/gallery/${event.slug}`} className="gallery-cover">
                <span className="gallery-cover-photo">
                  <img src={photoSrc(`${event.slug}/${event.hero}`)} alt="" />
                </span>
                <span className="gallery-cover-copy">
                  <span className="gallery-eyebrow">{stamp(event)}</span>
                  <span className="gallery-cover-title">{event.title}</span>
                  <span className="gallery-cover-intro">{event.intro}</span>
                  <span className="gallery-cover-peek" aria-hidden="true">
                    {peek.map(photo => (
                      <img key={photo.src} src={photoSrc(photo.src, true)} alt="" loading="lazy" />
                    ))}
                    <span>+{photos.length - peek.length}</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          )
        })}
      </section>
    </div>
  )
}

function EventPage({ event }) {
  const photos = eventPhotos(event)
  const [open, setOpen] = useState(-1)
  const onMove = useCallback(
    step => setOpen(i => (i < 0 ? i : (i + step + photos.length) % photos.length)),
    [photos.length]
  )
  const onClose = useCallback(() => setOpen(-1), [])
  const others = events.filter(other => other.slug !== event.slug)
  const { chapters } = event
  let counter = 0

  return (
    <div className="club-page gallery-page">
      <section className="gallery-hero" aria-labelledby="gallery-title">
        <img
          className="gallery-hero-photo"
          src={photoSrc(`${event.slug}/${event.hero}`)}
          alt=""
          fetchpriority="high"
        />
        <div className="wrap gallery-hero-copy">
          <Link className="gallery-back" to="/gallery">
            ← All photos
          </Link>
          <p className="gallery-eyebrow">{stamp(event)}</p>
          <h1 id="gallery-title">{event.title}</h1>
          <p className="gallery-intro">{event.intro}</p>
        </div>
      </section>

      <section className="wrap gallery-lead">
        <p>{event.text}</p>
        <nav className="gallery-roll" aria-label="Chapters">
          {chapters.map((chapter, i) => (
            <a key={chapter.id} href={`#${chapter.id}`}>
              <small>{pad(i + 1)}</small>
              {chapter.title}
              <span>{chapter.photos.length}</span>
            </a>
          ))}
        </nav>
      </section>

      {chapters.map((chapter, c) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className="wrap gallery-chapter"
          aria-labelledby={`${chapter.id}-title`}
        >
          <Reveal className="gallery-chapter-head">
            <p className="gallery-eyebrow">
              {pad(c + 1)} / {pad(chapters.length)}
            </p>
            <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
            <p>{chapter.text}</p>
          </Reveal>
          <div className="gallery-grid">
            {chapter.photos.map((photo, i) => {
              const index = counter++
              return (
                <Reveal
                  as="button"
                  type="button"
                  key={photo.name}
                  delay={Math.min(i, 5) * 60}
                  className={`gallery-tile${photo.size ? ` is-${photo.size}` : ''}`}
                  onClick={() => setOpen(index)}
                  aria-label={`${photo.caption}. Open photo ${index + 1} of ${photos.length}`}
                >
                  <img
                    src={photoSrc(`${event.slug}/${photo.name}`, true)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ '--ratio': photo.ratio, objectPosition: photo.focus }}
                  />
                  <span className="gallery-tile-caption" aria-hidden="true">
                    <small>{pad(index + 1)}</small>
                    {photo.caption}
                  </span>
                </Reveal>
              )
            })}
          </div>
        </section>
      ))}

      {others.length > 0 && (
        <section className="wrap gallery-more" aria-label="More photos">
          {others.map(other => (
            <Link key={other.slug} to={`/gallery/${other.slug}`} className="gallery-more-link">
              <img src={photoSrc(`${other.slug}/${other.hero}`, true)} alt="" loading="lazy" />
              <span>
                <small>Next roll</small>
                {other.title}
              </span>
            </Link>
          ))}
        </section>
      )}

      <section className="gallery-next">
        <div className="wrap">
          <h2>Want in on the next one?</h2>
          <p>Come build with us, and get yourself in these photos</p>
          <div className="gallery-next-actions">
            <Link className="club-button gold" to="/join">
              Join the club
            </Link>
            <Link className="text-link" to="/projects">
              See what we’re building
            </Link>
          </div>
        </div>
      </section>

      <Lightbox photos={photos} index={open} onClose={onClose} onMove={onMove} />
    </div>
  )
}

export default function Gallery() {
  const { slug } = useParams()
  if (!slug) return <GalleryIndex />
  const event = events.find(event => event.slug === slug)
  if (!event) return <Navigate to="/gallery" replace />
  // key resets the viewer and scroll-reveals when hopping from one event to another.
  return <EventPage key={event.slug} event={event} />
}
