import { useEffect, useRef } from 'react'
import { flight, sampleAt } from './flightSim'

// Replays the simulated flight like our ground station would show it live: auto-scaling plots,
// flight state, link stats and the packet log. Plays the climb at 3.5x and the descent at 40x.
const T_SLOW = flight.events.apogee.t + 4
const T_LAND = flight.events.landing.t
const CLIMB_RATE = 3.5
const FALL_RATE = 40
const HOLD = 2.5
const LOOP = T_SLOW / CLIMB_RATE + (T_LAND - T_SLOW) / FALL_RATE + HOLD
const STATES = { boost: 'BOOST', coast: 'COAST', drogue: 'DROGUE', main: 'MAIN', landed: 'LANDED' }

const noise = i => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}
const flightTime = wall => {
  if (wall < T_SLOW / CLIMB_RATE) return wall * CLIMB_RATE
  return Math.min(T_LAND, T_SLOW + (wall - T_SLOW / CLIMB_RATE) * FALL_RATE)
}
// Accelerometer reading: specific force in g (reads +1 g sitting on the pad).
const accelerometer = s => (s.phase === 'landed' ? 1 : s.acceleration + 1)

export default function GroundStation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let frame = 0
    let running = false
    let started = 0

    const plot = (top, bottom, left, right, span, low, high, value, color, fill, label, unit) => {
      ctx.strokeStyle = '#ffffff0f'
      ctx.lineWidth = 1
      for (let i = 0; i <= 4; i++) {
        const y = top + ((bottom - top) * i) / 4
        ctx.beginPath()
        ctx.moveTo(left, y)
        ctx.lineTo(right, y)
        ctx.stroke()
      }
      ctx.fillStyle = '#6f84a3'
      ctx.font = '600 10px Saira, Arial, sans-serif'
      ctx.fillText(`${label} (${unit})`, left, top - 10)
      ctx.textAlign = 'right'
      ctx.fillText(String(high), right, top - 10)
      ctx.textAlign = 'left'
      const mapX = t => left + ((right - left) * t) / span
      const mapY = v =>
        bottom - ((bottom - top) * (Math.min(high, Math.max(low, v)) - low)) / (high - low)
      return (now, steps) => {
        ctx.beginPath()
        for (let i = 0; i <= steps; i++) {
          const t = (now * i) / steps
          const px = mapX(t)
          const py = mapY(value(sampleAt(t)))
          if (i) ctx.lineTo(px, py)
          else ctx.moveTo(px, py)
        }
        if (fill) {
          ctx.lineTo(mapX(now), bottom)
          ctx.lineTo(left, bottom)
          const gradient = ctx.createLinearGradient(0, top, 0, bottom)
          gradient.addColorStop(0, fill)
          gradient.addColorStop(1, '#8bbff000')
          ctx.fillStyle = gradient
          ctx.fill()
          ctx.beginPath()
          for (let i = 0; i <= steps; i++) {
            const t = (now * i) / steps
            if (i) ctx.lineTo(mapX(t), mapY(value(sampleAt(t))))
            else ctx.moveTo(mapX(t), mapY(value(sampleAt(t))))
          }
        }
        ctx.strokeStyle = color
        ctx.lineWidth = 1.8
        ctx.stroke()
        ctx.lineWidth = 1
      }
    }

    const draw = timestamp => {
      frame = 0
      const wall = reduced ? (T_SLOW / CLIMB_RATE) * 0.9 : ((timestamp - started) / 1000) % LOOP
      const now = flightTime(wall)
      const s = sampleAt(now)
      const compact = width < 470
      const pad = compact ? 14 : 18
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = '#c7d3e4'
      ctx.font = '600 11px Saira, Arial, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText('GROUND STATION', pad, 22)
      const rate = now < T_SLOW ? CLIMB_RATE : FALL_RATE
      ctx.textAlign = 'right'
      ctx.fillText(`REPLAY ${rate}x`, width - pad, 22)
      ctx.textAlign = 'left'
      ctx.fillStyle = reduced || Math.floor(timestamp / 500) % 2 === 0 ? '#ff5a4d' : '#5a2a2a'
      ctx.beginPath()
      ctx.arc(width - pad - (compact ? 76 : 80), 22, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff14'
      ctx.beginPath()
      ctx.moveTo(0, 42)
      ctx.lineTo(width, 42)
      ctx.stroke()

      // Plots auto-scale their time axis like a live view
      const span = Math.max(20, now * 1.08)
      const right = compact ? width - pad : width * 0.66
      const altTop = 64
      const altBottom = compact ? height * 0.44 : height * 0.48
      const accTop = altBottom + 32
      const accBottom = compact ? height * 0.64 : height * 0.7
      const steps = Math.min(260, Math.max(8, Math.round(now * 4)))
      plot(
        altTop,
        altBottom,
        pad,
        right,
        span,
        0,
        10000,
        v => v.altitude,
        '#8bbff0',
        '#8bbff055',
        'ALTITUDE',
        'm'
      )(now, steps)
      plot(
        accTop,
        accBottom,
        pad,
        right,
        span,
        -10,
        30,
        accelerometer,
        '#ffcf28',
        null,
        'ACCEL',
        'g'
      )(now, steps)
      ctx.fillStyle = '#6f84a3'
      ctx.font = '600 10px Saira, Arial, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${Math.round(span)} s`, right, accBottom + 14)
      ctx.textAlign = 'left'

      const packet = Math.floor(now * 10)
      const rssi = Math.round(-70 - s.altitude / 380 + noise(packet) * 2)
      const status = [
        ['STATE', STATES[s.phase]],
        ['ALTITUDE', `${Math.round(s.altitude).toLocaleString()} m`],
        ['VELOCITY', `${Math.round(s.velocity)} m/s`],
        ['PACKETS', String(packet).padStart(4, '0')],
        ['RSSI', `${rssi} dBm`]
      ]
      if (compact) {
        status.slice(0, 3).forEach(([label, value], i) => {
          const x = pad + ((width - pad * 2) * i) / 3
          ctx.fillStyle = '#6f84a3'
          ctx.font = '600 10px Saira, Arial, sans-serif'
          ctx.fillText(label, x, accBottom + 34)
          ctx.fillStyle = i ? '#eef3fb' : '#ffcf28'
          ctx.font = '700 16px Saira, Arial, sans-serif'
          ctx.fillText(value, x, accBottom + 54)
        })
      } else {
        status.forEach(([label, value], i) => {
          const x = width * 0.7
          const y = altTop + i * 46
          ctx.fillStyle = '#6f84a3'
          ctx.font = '600 10px Saira, Arial, sans-serif'
          ctx.fillText(label, x, y)
          ctx.fillStyle = i ? '#eef3fb' : '#ffcf28'
          ctx.font = i ? '600 18px Saira, Arial, sans-serif' : '700 22px Saira, Arial, sans-serif'
          ctx.fillText(value, x, y + 19)
        })
      }

      // Packet log, newest first
      const logTop = compact ? accBottom + 84 : accBottom + 34
      ctx.strokeStyle = '#ffffff14'
      ctx.beginPath()
      ctx.moveTo(0, logTop - 14)
      ctx.lineTo(width, logTop - 14)
      ctx.stroke()
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      const lines = Math.max(1, Math.floor((height - logTop - 6) / 17))
      for (let i = 0; i < lines; i++) {
        const n = packet - i * 3
        if (n < 0) break
        const p = sampleAt(n / 10)
        ctx.fillStyle = i ? '#6f84a3' : '#c7d3e4'
        const text = `#${String(n).padStart(4, '0')} ${STATES[p.phase].padEnd(6)} ${String(Math.round(p.altitude)).padStart(5)} m ${String(Math.round(p.velocity)).padStart(4)} m/s ${accelerometer(p).toFixed(1).padStart(5)} g`
        ctx.fillText(compact ? text.slice(0, 36) : text, pad, logTop + i * 17)
      }

      if (running && !reduced) frame = requestAnimationFrame(draw)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running && !frame) {
        if (!started) started = performance.now()
        frame = requestAnimationFrame(draw)
      }
    })
    const resizer = new ResizeObserver(resize)
    resizer.observe(canvas)
    visibility.observe(canvas)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      resizer.disconnect()
      visibility.disconnect()
    }
  }, [])

  return (
    <figure className="ground-station">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Ground station display replaying the simulated flight: altitude and acceleration plots, flight state, link stats and incoming radio packets"
      />
      <figcaption>Replaying the simulated flight from above (not real data)</figcaption>
    </figure>
  )
}
