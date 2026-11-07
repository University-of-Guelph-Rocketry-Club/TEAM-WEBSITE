import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { allPhotos, chapters, gallery, photoSrc } from '../content/gallery'
import { site } from '../content/site'

const pad = n => String(n).padStart(2, '0')

// Full-screen viewer. Arrow keys and swipes move between photos, Escape (or the backdrop) closes.
function Lightbox({ index, onClose, onMove }) {
  const dialogRef = useRef(null)
  const touch = useRef(null)
  const photo = index >= 0 ? allPhotos[index] : null

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
      if (allPhotos[i]) new Image().src = photoSrc(allPhotos[i].name)
    })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [photo, index, onMove])

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
        <figure className="lightbox-figure" key={photo.name}>
          <img
            src={photoSrc(photo.name)}
            alt={photo.caption}
            style={{ aspectRatio: photo.ratio }}
            draggable="false"
          />
          <figcaption>
            <span className="lightbox-count">
              {pad(index + 1)} / {pad(allPhotos.length)}
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

export default function Gallery() {
  const [open, setOpen] = useState(-1)
  const onMove = useCallback(
    step => setOpen(i => (i < 0 ? i : (i + step + allPhotos.length) % allPhotos.length)),
    []
  )
  const onClose = useCallback(() => setOpen(-1), [])
  let counter = 0

  return (
    <div className="club-page gallery-page">
      <section className="gallery-hero" aria-labelledby="gallery-title">
        <img
          className="gallery-hero-photo"
          src={photoSrc(gallery.hero)}
          alt=""
          fetchpriority="high"
        />
        <div className="wrap gallery-hero-copy">
          <p className="gallery-eyebrow">
            {gallery.when} · {gallery.where}
          </p>
          <h1 id="gallery-title">{gallery.title}</h1>
          <p className="gallery-intro">{gallery.intro}</p>
        </div>
      </section>

      <section className="wrap gallery-lead">
        <p>{gallery.text}</p>
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
                  aria-label={`${photo.caption}. Open photo ${index + 1} of ${allPhotos.length}`}
                >
                  <img
                    src={photoSrc(photo.name, true)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ '--ratio': photo.ratio }}
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

      <section className="gallery-next">
        <div className="wrap">
          <h2>Want in on the next one?</h2>
          <p>
            We’re already building for {site.competition}. Come help, and get yourself in these
            photos
          </p>
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

      <Lightbox index={open} onClose={onClose} onMove={onMove} />
    </div>
  )
}
