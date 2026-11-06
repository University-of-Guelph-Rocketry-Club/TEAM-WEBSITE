import { useEffect, useRef } from 'react'
import { subscribe } from './scrollStory'

const format = (number, decimals) => number.toFixed(decimals)

// Counts up once, when its story section passes `at` (EnduroSat-style stat roll).
export default function CountUp({ value, section, at = 0, decimals = 0, duration = 1300 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = format(value, decimals)
      return
    }
    let frame = 0
    let done = false
    el.textContent = format(0, decimals)
    const run = () => {
      const start = performance.now()
      const step = now => {
        const t = Math.min(1, (now - start) / duration)
        el.textContent = format(value * (1 - (1 - t) ** 3), decimals)
        frame = t < 1 ? requestAnimationFrame(step) : 0
      }
      frame = requestAnimationFrame(step)
    }
    const unsubscribe = subscribe(section, ({ p }) => {
      if (done || p < at) return
      done = true
      run()
    })
    return () => {
      unsubscribe()
      cancelAnimationFrame(frame)
    }
  }, [value, section, at, decimals, duration])

  return <><span ref={ref} aria-hidden="true">{format(value, decimals)}</span><span className="sr-only">{format(value, decimals)}</span></>
}
