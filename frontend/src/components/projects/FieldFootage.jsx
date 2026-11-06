import { useEffect, useRef, useState } from 'react'
import { subscribe } from './scrollStory'

const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)

// Launch clip scrubbed by scroll: the rocket leaves the pad as the frame grows to full height.
export default function FieldFootage({ section }) {
  const videoRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (failed || !video) return
    let target = 0
    const seek = () => {
      if (video.seeking || video.readyState < 2 || !Number.isFinite(video.duration)) return
      const time = target * Math.max(0, video.duration - 1 / 30)
      if (Math.abs(video.currentTime - time) > 1 / 60) video.currentTime = time
    }
    const unsubscribe = subscribe(section, ({ p }) => {
      target = clamp01((p - 0.18) / 0.72)
      seek()
    })
    video.addEventListener('seeked', seek)
    video.addEventListener('loadeddata', seek)
    return () => {
      unsubscribe()
      video.removeEventListener('seeked', seek)
      video.removeEventListener('loadeddata', seek)
    }
  }, [failed, section])

  return <div className="field-stage">
    <div className="field-copy">
      <p className="eyebrow">From the field</p>
      <h2 id="field-title" className="giant">Fly, learn,<br />repeat</h2>
      <p>Every launch teaches us something we take back to the workshop. Scroll to send this one up</p>
      <p className="field-caption">*Footage from one of our club launches</p>
    </div>
    <div className="field-frame">
      <img src="/Images/projects-launch-poster.jpg" alt="" />
      {!failed && <video ref={videoRef} poster="/Images/projects-launch-poster.jpg" muted playsInline preload="auto" aria-hidden="true" onError={() => setFailed(true)}>
        <source src="/Videos/projects-launch.mp4" type="video/mp4" onError={() => setFailed(true)} />
      </video>}
      <span className="field-rec" aria-hidden="true">Launch day</span>
    </div>
  </div>
}
