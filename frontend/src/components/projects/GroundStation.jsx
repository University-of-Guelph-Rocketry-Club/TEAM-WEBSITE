import { useEffect, useRef } from 'react'

// A simulated flight replayed on a loop, drawn like our ground station's live view.
const FLIGHT_SECONDS = 14
const LOOP_SECONDS = 17
const STATES = [[0.95, 'LANDED'], [0.7, 'MAIN'], [0.4, 'DROGUE'], [0.37, 'APOGEE'], [0.08, 'COAST'], [0.02, 'BOOST'], [0, 'ON PAD']]

const noise = i => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}
const altitude = u => {
  if (u < 0.02) return 0
  if (u < 0.08) return 0.14 * ((u - 0.02) / 0.06) ** 2
  if (u < 0.38) return 1 - 0.86 * ((0.38 - u) / 0.3) ** 2
  if (u < 0.7) return 1 - (u - 0.38) / 0.32 * 0.78
  if (u < 0.95) return 0.22 * (1 - (u - 0.7) / 0.25)
  return 0
}
const acceleration = (u, i) => {
  const jitter = noise(i) * 0.03
  if (u < 0.02) return jitter
  if (u < 0.08) return 0.82 + jitter * 3
  if (u < 0.375) return -0.2 + jitter
  if (u < 0.4) return 0.5 + jitter * 4
  if (u < 0.7) return jitter
  if (u < 0.72) return 0.42 + jitter * 4
  if (u < 0.95) return jitter * 0.6
  if (u < 0.965) return 0.3 + jitter * 3
  return jitter * 0.3
}
const stateAt = u => STATES.find(([start]) => u >= start)[1]

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

    const draw = now => {
      frame = 0
      const elapsed = reduced ? FLIGHT_SECONDS * 0.56 : ((now - started) / 1000) % LOOP_SECONDS
      const u = Math.min(1, elapsed / FLIGHT_SECONDS)
      const compact = width < 470
      const pad = compact ? 14 : 18
      ctx.clearRect(0, 0, width, height)

      // Header
      ctx.fillStyle = '#c7d3e4'
      ctx.font = '600 11px Barlow, Arial, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText('GROUND STATION', pad, 22)
      const blink = reduced || Math.floor(now / 500) % 2 === 0
      ctx.fillStyle = blink ? '#ff5a4d' : '#5a2a2a'
      ctx.beginPath()
      ctx.arc(width - pad - 50, 22, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#c7d3e4'
      ctx.fillText('REPLAY', width - pad - 40, 22)
      ctx.strokeStyle = '#ffffff14'
      ctx.beginPath()
      ctx.moveTo(0, 42)
      ctx.lineTo(width, 42)
      ctx.stroke()

      const chartRight = compact ? width - pad : width * 0.66
      const altTop = 62
      const altBottom = compact ? height * 0.46 : height * 0.5
      const accTop = altBottom + 30
      const accBottom = compact ? height * 0.66 : height * 0.72
      const chartWidth = chartRight - pad
      const samples = Math.max(2, Math.round(220 * u))

      const grid = (top, bottom, label) => {
        ctx.strokeStyle = '#ffffff0f'
        for (let i = 0; i <= 3; i++) {
          const y = top + (bottom - top) * i / 3
          ctx.beginPath()
          ctx.moveTo(pad, y)
          ctx.lineTo(chartRight, y)
          ctx.stroke()
        }
        ctx.fillStyle = '#6f84a3'
        ctx.font = '600 10px Barlow, Arial, sans-serif'
        ctx.fillText(label, pad, top - 10)
      }
      grid(altTop, altBottom, 'ALTITUDE')
      grid(accTop, accBottom, 'ACCELERATION')

      // Altitude area
      const altGradient = ctx.createLinearGradient(0, altTop, 0, altBottom)
      altGradient.addColorStop(0, '#8bbff066')
      altGradient.addColorStop(1, '#8bbff000')
      ctx.beginPath()
      ctx.moveTo(pad, altBottom)
      for (let i = 0; i <= samples; i++) {
        const s = u * i / samples
        ctx.lineTo(pad + chartWidth * s, altBottom - (altBottom - altTop) * altitude(s))
      }
      ctx.lineTo(pad + chartWidth * u, altBottom)
      ctx.closePath()
      ctx.fillStyle = altGradient
      ctx.fill()
      ctx.beginPath()
      for (let i = 0; i <= samples; i++) {
        const s = u * i / samples
        const x = pad + chartWidth * s
        const y = altBottom - (altBottom - altTop) * altitude(s)
        if (i) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
      }
      ctx.strokeStyle = '#8bbff0'
      ctx.lineWidth = 2
      ctx.stroke()

      // Acceleration line
      const accMid = accTop + (accBottom - accTop) * 0.7
      ctx.beginPath()
      for (let i = 0; i <= samples; i++) {
        const s = u * i / samples
        const x = pad + chartWidth * s
        const y = accMid - (accBottom - accTop) * 0.62 * acceleration(s, i)
        if (i) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
      }
      ctx.strokeStyle = '#ffcf28'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.lineWidth = 1

      // Cursor
      const cursor = pad + chartWidth * u
      ctx.strokeStyle = '#ffffff40'
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.moveTo(cursor, altTop - 4)
      ctx.lineTo(cursor, accBottom + 4)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(cursor, altBottom - (altBottom - altTop) * altitude(u), 3.5, 0, Math.PI * 2)
      ctx.fill()

      // Status readouts
      const packet = Math.floor(elapsed * 10)
      const state = stateAt(u)
      const rssi = Math.round(-71 - 24 * altitude(u) + noise(packet) * 2)
      const status = [['STATE', state], ['PACKETS', String(packet).padStart(4, '0')], ['RSSI', `${rssi} dBm`], ['GPS', `${u > 0.37 && u < 0.42 ? 7 : 9} sats`], ['BATTERY', `${(8.1 - u * 0.25).toFixed(2)} V`]]
      if (compact) {
        const top = accBottom + 22
        status.slice(0, 3).forEach(([label, value], i) => {
          const x = pad + (width - pad * 2) * i / 3
          ctx.fillStyle = '#6f84a3'
          ctx.font = '600 10px Barlow, Arial, sans-serif'
          ctx.fillText(label, x, top)
          ctx.fillStyle = i ? '#eef3fb' : '#ffcf28'
          ctx.font = '700 17px Barlow, Arial, sans-serif'
          ctx.fillText(value, x, top + 20)
        })
      } else {
        const x = width * 0.7
        status.forEach(([label, value], i) => {
          const y = altTop + i * 44
          ctx.fillStyle = '#6f84a3'
          ctx.font = '600 10px Barlow, Arial, sans-serif'
          ctx.fillText(label, x, y)
          ctx.fillStyle = i ? '#eef3fb' : '#ffcf28'
          ctx.font = i ? '600 18px Barlow, Arial, sans-serif' : '700 22px Barlow, Arial, sans-serif'
          ctx.fillText(value, x, y + 19)
        })
      }

      // Packet log
      const logTop = compact ? accBottom + 66 : accBottom + 28
      ctx.strokeStyle = '#ffffff14'
      ctx.beginPath()
      ctx.moveTo(0, logTop - 14)
      ctx.lineTo(width, logTop - 14)
      ctx.stroke()
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      const lines = Math.max(1, Math.floor((height - logTop - 6) / 17))
      for (let i = 0; i < lines; i++) {
        const n = packet - i
        if (n < 0) break
        const s = Math.min(1, Math.max(0, n / 10 / FLIGHT_SECONDS))
        ctx.fillStyle = i ? '#6f84a3' : '#c7d3e4'
        const text = `#${String(n).padStart(4, '0')}  ${stateAt(s).padEnd(7)} ALT ${(altitude(s) * 100).toFixed(1).padStart(5)}%  ACC ${acceleration(s, n).toFixed(2).padStart(5)}  CRC OK`
        ctx.fillText(compact ? text.slice(0, 38) : text, pad, logTop + i * 17)
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

  return <figure className="ground-station">
    <canvas ref={canvasRef} role="img" aria-label="Animated ground station display replaying a simulated flight: altitude and acceleration charts, flight state and incoming radio packets" />
    <figcaption>Simulated flight, not real data</figcaption>
  </figure>
}
