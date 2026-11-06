// 1D vertical flight simulation used by the flight graph and the ground station replay.
// It's an example flight for a rocket that tops out around Mach 2.2, not our final design:
// standard atmosphere, Mach-dependent drag, a solid motor thrust curve, then a drogue at
// apogee and a main chute at 457 m (1,500 ft) above the ground.
const G = 9.80665
const SITE_ALTITUDE = 300 // m above sea level, roughly northern Ontario
const DIAMETER = 0.1016 // 4 in airframe
const AREA = Math.PI * (DIAMETER / 2) ** 2
const DRY_MASS = 12.2 // kg, everything except propellant
const PROPELLANT = 6.2 // kg, about 222 s specific impulse
const BURN_TIME = 3.4 // s
const TOTAL_IMPULSE = 13550 // N·s, an N-class motor
const GROUND_DENSITY = 1.19 // kg/m³ at the launch site
// Parachutes sized for ~25 m/s under the drogue and ~6 m/s under the main, near the ground.
const DROGUE_CDA = 2 * DRY_MASS * G / (GROUND_DENSITY * 25 ** 2)
const MAIN_CDA = 2 * DRY_MASS * G / (GROUND_DENSITY * 6 ** 2)
const MAIN_ALTITUDE = 457 // m above ground

export function atmosphere(height) {
  const h = Math.max(0, height)
  const troposphere = h < 11000
  const temperature = troposphere ? 288.15 - 0.0065 * h : 216.65
  const pressure = troposphere ? 101325 * (temperature / 288.15) ** 5.25588 : 22632.1 * Math.exp(-0.000157688 * (h - 11000))
  return { density: pressure / (287.053 * temperature), sound: Math.sqrt(1.4 * 287.053 * temperature) }
}

// Body drag coefficient against Mach number: flat subsonic, a transonic bump, falling off supersonic.
export function dragCoefficient(mach) {
  const points = [[0, 0.42], [0.8, 0.44], [1.0, 0.62], [1.15, 0.66], [1.5, 0.56], [2.0, 0.47], [2.5, 0.42], [3, 0.4]]
  for (let i = 1; i < points.length; i++) {
    const [m1, c1] = points[i]
    const [m0, c0] = points[i - 1]
    if (mach <= m1) return c0 + (c1 - c0) * (mach - m0) / (m1 - m0)
  }
  return points[points.length - 1][1]
}

// Slightly regressive burn with a quick start-up and tail-off; integrates to TOTAL_IMPULSE.
function thrust(t) {
  if (t < 0 || t > BURN_TIME) return 0
  const x = t / BURN_TIME
  const shape = Math.min(1, t / 0.08) * (1.12 - 0.24 * x) * Math.min(1, (BURN_TIME - t) / 0.15)
  return shape * TOTAL_IMPULSE / BURN_TIME / 0.985
}

function simulate() {
  const samples = []
  const events = {}
  let t = 0
  let altitude = 0
  let velocity = 0
  let burned = 0
  let phase = 'boost'
  let maxMach = 0
  let maxSpeed = 0
  let sampleClock = 0
  let lastAcceleration = 0
  while (t < 2000) {
    const dt = phase === 'boost' || phase === 'coast' ? 0.002 : 0.02
    const air = atmosphere(SITE_ALTITUDE + altitude)
    const F = thrust(t)
    const flow = F / TOTAL_IMPULSE * PROPELLANT
    const mass = DRY_MASS + PROPELLANT - burned
    const mach = Math.abs(velocity) / air.sound
    let cda = dragCoefficient(mach) * AREA
    if (phase === 'drogue') cda += DROGUE_CDA
    if (phase === 'main') cda += MAIN_CDA * Math.min(1, (t - events.main.t) / 1.5)
    const drag = 0.5 * air.density * velocity * Math.abs(velocity) * cda
    const onRail = phase === 'boost' && altitude < 5.2 && F < mass * G
    const acceleration = onRail ? 0 : (F - drag) / mass - G
    lastAcceleration = acceleration
    velocity += acceleration * dt
    altitude += velocity * dt
    burned = Math.min(PROPELLANT, burned + flow * dt)
    t += dt
    if (mach > maxMach) maxMach = mach
    if (velocity > maxSpeed) maxSpeed = velocity
    if (!events.railExit && altitude >= 5.2) events.railExit = { t, altitude, velocity }
    if (!events.mach1 && mach >= 1 && velocity > 0) events.mach1 = { t, altitude, mach }
    if (phase === 'boost' && t >= BURN_TIME) {
      phase = 'coast'
      events.burnout = { t, altitude, velocity, mach: velocity / atmosphere(SITE_ALTITUDE + altitude).sound }
    }
    if (phase === 'coast' && velocity <= 0) {
      phase = 'drogue'
      events.apogee = { t, altitude }
    }
    if (phase === 'drogue' && altitude <= MAIN_ALTITUDE) {
      phase = 'main'
      events.main = { t, altitude, velocity }
    }
    sampleClock += dt
    if (sampleClock >= (phase === 'boost' || phase === 'coast' ? 0.05 : 0.5)) {
      sampleClock = 0
      samples.push({ t, altitude, velocity, mach: Math.abs(velocity) / atmosphere(SITE_ALTITUDE + altitude).sound, acceleration: lastAcceleration / G, phase })
    }
    if (altitude <= 0 && phase !== 'boost') {
      events.landing = { t, velocity }
      samples.push({ t, altitude: 0, velocity: 0, mach: 0, acceleration: 0, phase: 'landed' })
      break
    }
  }
  return { samples, events, maxMach, maxSpeed }
}

export const flight = simulate()

// Linear interpolation of the samples at time t.
export function sampleAt(t) {
  const { samples } = flight
  if (t <= samples[0].t) return samples[0]
  let lo = 0
  let hi = samples.length - 1
  if (t >= samples[hi].t) return samples[hi]
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (samples[mid].t <= t) lo = mid
    else hi = mid
  }
  const a = samples[lo]
  const b = samples[hi]
  const k = (t - a.t) / (b.t - a.t)
  return {
    t,
    altitude: a.altitude + (b.altitude - a.altitude) * k,
    velocity: a.velocity + (b.velocity - a.velocity) * k,
    mach: a.mach + (b.mach - a.mach) * k,
    acceleration: a.acceleration + (b.acceleration - a.acceleration) * k,
    phase: k < 0.5 ? a.phase : b.phase
  }
}
