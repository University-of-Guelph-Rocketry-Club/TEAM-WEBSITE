import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { getSection } from './scrollStory'
import { createStoryRocket } from './storyRocket'
import { createStoryCubeSat } from './storyCubeSat'
import { createEarth, createStars } from './storySpace'

const IDS = ['intro', 'competition', 'launch', 'cubesat', 'deploy', 'orbit', 'payload', 'systems']
const HALF_FOV = THREE.MathUtils.degToRad(17.5)

const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)
const smooth = (a, b, value) => {
  const t = clamp01((value - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeIn = t => t * t * t

// One WebGL canvas pinned behind the whole projects story. Each frame reads the scroll
// progress of the story sections and poses the rocket, Earth, CubeSat and camera from it.
export function mountStoryScene(host, labelLayer, onFailure) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  renderer.setClearColor('#03070f', 1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 400)
  const generator = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = generator.fromScene(room, 0.04)
  room.dispose()
  generator.dispose()
  scene.environment = environment.texture
  scene.add(new THREE.HemisphereLight('#dfe9ff', '#0b1626', 0.8))
  const sunLight = new THREE.DirectionalLight('#fff1dc', 3)
  sunLight.position.set(-4, 5, 6)
  scene.add(sunLight)
  const rimLight = new THREE.DirectionalLight('#7fb2ff', 2.2)
  rimLight.position.set(5, 1.5, -5)
  scene.add(rimLight)

  const stars = createStars()
  const rocket = createStoryRocket()
  const earth = createEarth()
  const sat = createStoryCubeSat()
  scene.add(stars.object, rocket.object, rocket.trail, earth.object, sat.object)
  earth.setDotScale(9)

  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)

  const anchorFor = name => rocket.anchors[name] || sat.anchors[name] || (name === 'guelph' ? earth.guelphAnchor : name === 'orbit-sat' ? sat.object : null)
  const labels = [...labelLayer.querySelectorAll('[data-anchor]')]
    .map(el => ({ el, name: el.dataset.anchor, anchor: anchorFor(el.dataset.anchor), shown: -1, textWidth: 0 }))
    .filter(label => label.anchor)
  const fades = { rocket: 0, sat: 0, orbit: 0 }
  const fadeFor = name => (name.startsWith('rocket-') ? fades.rocket : name.startsWith('sat-') ? fades.sat : fades.orbit)

  const damped = Object.fromEntries(IDS.map(id => [id, { p: 0, e: 0 }]))
  const camPos = new THREE.Vector3()
  const camLook = new THREE.Vector3()
  const satPos = new THREE.Vector3()
  const satHome = new THREE.Vector3()
  const satFrom = new THREE.Vector3(3.4, 2.8, -6)
  const orbitPos = new THREE.Vector3()
  const scratch = new THREE.Vector3()
  const origin = new THREE.Vector3()
  let width = 0
  let height = 0
  let shiftX = 0
  let shiftY = 0
  let spinAngle = 0.6
  let time = 0
  let firstFrame = true

  function poseRocket(wide, reduced, dt) {
    const { intro, competition: comp, launch } = damped
    const rise = easeInOut(clamp01(intro.p * 1.1))
    const side = easeInOut(comp.e)
    const explode = smooth(0.2, 0.46, comp.p) * (1 - smooth(0.8, 0.95, comp.p))
    const flat = wide ? smooth(0.1, 0.36, comp.p) * (1 - smooth(0.82, 0.99, comp.p)) : 0
    camPos.set(0, 0, wide ? lerp(9, 8, flat) : lerp(12.5, 13.5, explode))
    camLook.set(0, 0, 0)
    shiftX = 0
    shiftY = 0
    const scale = wide ? 1 : lerp(1, 0.86, explode)
    let x = lerp(0, wide ? 1.85 : 0, side)
    let y = lerp(wide ? -4.3 : -6.3, wide ? -0.1 : 1.1, rise)
    x = lerp(x, 0, flat)
    y = lerp(y, wide ? 0.05 : 0.15, wide ? flat : explode)

    // Launch: ignite, then accelerate out of the top of the frame.
    const ignite = smooth(0.05, 0.12, launch.p)
    const climb = easeIn(clamp01((launch.p - 0.1) / 0.78))
    const burn = ignite * (1 - smooth(0.92, 1, launch.p))
    y += climb * 13

    rocket.object.visible = launch.p < 0.995
    rocket.object.position.set(x, y, 0)
    rocket.object.scale.setScalar(scale)
    rocket.object.rotation.set(lerp(0.1, 0.32, flat), 0, (1 - flat) * (1 - ignite) * (wide ? -0.07 : 0))
    rocket.tilt.rotation.z = -flat * Math.PI / 2

    // Roll slowly, settling on a fixed angle while the rocket is pulled apart.
    if (!reduced) spinAngle += dt * 0.35 * (1 - explode)
    const toDisplay = Math.atan2(Math.sin(0.6 - spinAngle), Math.cos(0.6 - spinAngle))
    spinAngle += toDisplay * explode * Math.min(1, dt * 4 + (reduced ? 1 : 0))
    rocket.spin.rotation.y = spinAngle
    rocket.setExplode(explode, smooth(0.3, 1, explode), smooth(0.4, 1, explode))
    rocket.setBurn(burn, time, reduced)
    rocket.setTrail(y - 1.42 * scale, -9, x, burn * 0.5 * smooth(0.12, 0.24, launch.p))

    if (!reduced && burn > 0) {
      camPos.x += Math.sin(time * 63) * 0.018 * burn
      camPos.y += Math.cos(time * 57) * 0.018 * burn
    }
    camLook.y += climb * 1.1
    stars.object.rotation.x = -climb * 1.2
    fades.rocket = smooth(0.43, 0.52, comp.p) * (1 - smooth(0.77, 0.84, comp.p))
    fades.sat = 0
    fades.orbit = 0
  }

  function poseEarth(wide, reduced) {
    const { cubesat: cube, deploy, orbit, payload, systems } = damped
    const R = earth.radius
    const distance = wide ? 9 : 12
    rocket.object.visible = false
    rocket.setTrail(0, 0, 0, 0)
    rocket.setBurn(0, time, true)
    camPos.set(0, 0, distance)
    camLook.set(0, 0, 0)

    // 1. The Earth rises into the bottom of the frame under the chapter title.
    const rise = easeInOut(clamp01(cube.e * 0.55 + cube.p * 0.9))
    const hidden = -(R + distance * Math.tan(HALF_FOV) + 0.6)
    const horizon = wide ? -R - 0.95 : -R - 1.7
    earth.object.position.set(0, lerp(hidden, horizon, rise), 0)
    let spin = earth.displaySpin - 0.9 + rise * 0.45 + time * 0.006
    earth.tilt.rotation.set(0.42, 0, -0.12)

    // 2. The CubeSat drifts in and the composition opens room for the copy.
    const arrive = easeInOut(smooth(0.42, 1, cube.p))
    satHome.set(0, wide ? 0.2 : 0.55, 2.4)
    satPos.lerpVectors(satFrom, satHome, arrive)
    const compose = smooth(0.42, 0.7, cube.p)
    shiftX = wide ? 0.19 * compose : 0
    shiftY = wide ? 0 : -0.12 * compose
    let satScale = 1
    const tumble = (1 - arrive) * 2.6

    // 3. Close-up: panels and antennas unfold.
    const closeIn = easeInOut(smooth(0, 0.22, deploy.p))
    scratch.set(satHome.x + 0.25, satHome.y + 0.4, satHome.z + (wide ? 3.9 : 7.2))
    camPos.lerp(scratch, closeIn)
    camLook.lerp(satHome, closeIn)
    const wings = smooth(0.2, 0.5, deploy.p)
    const antennas = smooth(0.45, 0.64, deploy.p)
    const yaw = lerp(-0.75, 0.5, deploy.p) + (reduced ? 0 : Math.sin(time * 0.4) * 0.05)

    // 4. Pull back to the whole planet; the CubeSat joins its orbit and passes over Guelph.
    const pull = easeInOut(smooth(0, 0.38, orbit.p))
    earth.object.position.lerp(origin, pull)
    spin = lerp(spin, earth.displaySpin + (orbit.p - 0.5) * 0.1, pull)
    scratch.set(0, 0.7, wide ? 10.5 : 15)
    camPos.lerp(scratch, pull)
    camLook.lerp(earth.object.position, pull)
    shiftX = lerp(shiftX, wide ? 0.17 : 0, pull)
    shiftY = lerp(shiftY, wide ? 0 : -0.14, pull)
    const angle = lerp(-1.35, 1.25, smooth(0.08, 1, orbit.p))

    // 5. During the payload chapter the planet sinks to a horizon glow, then sets.
    const sink = easeInOut(payload.e)
    const setting = easeInOut(systems.e)
    earth.object.position.y = lerp(earth.object.position.y, -R - 2.2, sink) - setting * 5
    shiftX = lerp(shiftX, 0, sink)
    shiftY = lerp(shiftY, 0, sink)

    earth.spin.rotation.y = spin
    earth.object.updateMatrixWorld(true)
    earth.orbitWorld(angle, orbitPos)
    satPos.lerp(orbitPos, pull)
    satScale = lerp(1, 0.2, pull) * (1 - smooth(0, 0.6, payload.e))

    sat.object.visible = satScale > 0.002 && cube.p > 0.3
    sat.object.position.copy(satPos)
    sat.object.scale.setScalar(Math.max(satScale, 0.0001))
    sat.object.rotation.set(0.18 + tumble * 0.3 + pull * 0.4, yaw + tumble + pull * angle, -0.1 + tumble * 0.5)
    sat.setDeploy(Math.max(wings, pull), Math.max(antennas, pull))

    const orbitFade = pull * (1 - sink)
    earth.setRing(smooth(0.12, 0.5, orbit.p), orbitFade)
    earth.setBeam(satPos, (1 - smooth(0.12, 0.5, Math.abs(angle))) * orbitFade * 0.9)
    earth.pulse(time, smooth(0.2, 0.35, orbit.p) * (1 - sink))
    stars.object.rotation.x = -1.2

    fades.rocket = 0
    fades.sat = smooth(0.62, 0.7, deploy.p) * (1 - smooth(0.9, 0.98, deploy.p)) * (1 - pull)
    fades.orbit = smooth(0.32, 0.42, orbit.p) * (1 - smooth(0.85, 0.97, orbit.p))
  }

  function projectLabels(wide) {
    for (const label of labels) {
      const opacity = fadeFor(label.name)
      if (opacity < 0.01) {
        if (label.shown !== 0) label.el.style.opacity = '0'
        label.shown = 0
        continue
      }
      label.anchor.getWorldPosition(scratch).project(camera)
      const x = (scratch.x * 0.5 + 0.5) * width
      const y = (-scratch.y * 0.5 + 0.5) * height
      label.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      // Point the text back toward the middle when it would run off the right edge.
      if (!label.textWidth) label.textWidth = label.el.lastElementChild.offsetWidth + 16
      const sideways = !wide && label.name.startsWith('rocket-')
      label.el.classList.toggle('is-flipped', !sideways && x + label.textWidth > width - 8)
      label.el.style.opacity = opacity.toFixed(3)
      label.shown = opacity
    }
  }

  let running = false
  let frame = 0
  let last = 0
  const tick = now => {
    frame = 0
    if (!running) return
    const dt = last ? Math.min(now - last, 100) / 1000 : 1 / 60
    last = now
    const reduced = motion.matches
    if (!reduced) time += dt
    const follow = reduced || firstFrame ? 1 : 1 - Math.exp(-dt / 0.085)
    for (const id of IDS) {
      const section = getSection(id)
      const value = damped[id]
      value.p += ((section && section.p > 0 ? section.p : 0) - value.p) * follow
      value.e += ((section && section.e > 0 ? section.e : 0) - value.e) * follow
    }
    firstFrame = false
    const wide = width / height >= 1.05
    labelLayer.classList.toggle('is-vertical', !wide)
    stars.material.uniforms.uTime.value = time
    stars.object.rotation.y = time * 0.004
    const earthPhase = damped.cubesat.e > 0.001
    earth.object.visible = earthPhase
    if (earthPhase) poseEarth(wide, reduced)
    else {
      sat.object.visible = false
      poseRocket(wide, reduced, dt)
    }
    camera.position.copy(camPos)
    camera.lookAt(camLook)
    camera.setViewOffset(width, height, -shiftX * width, -shiftY * height, width, height)
    stars.object.position.copy(camera.position)
    renderer.render(scene, camera)
    projectLabels(wide)
    frame = requestAnimationFrame(tick)
  }
  const start = () => {
    if (running || document.hidden || !width) return
    running = true
    last = 0
    frame = requestAnimationFrame(tick)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(frame)
    frame = 0
  }

  const resize = () => {
    width = host.clientWidth
    height = host.clientHeight
    if (!width || !height) return
    const ratio = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.5 : 1.75)
    renderer.setPixelRatio(ratio)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    labels.forEach(label => { label.textWidth = 0 })
    stars.material.uniforms.uPixelRatio.value = ratio
    earth.setPixelRatio(ratio)
    if (visible) start()
  }
  let visible = false
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  })
  visibility.observe(host)
  const resizer = new ResizeObserver(resize)
  resizer.observe(host)
  resize()
  const handleVisibility = () => {
    if (document.hidden) stop()
    else if (visible) start()
  }
  document.addEventListener('visibilitychange', handleVisibility)
  const lost = event => {
    event.preventDefault()
    stop()
    onFailure()
  }
  canvas.addEventListener('webglcontextlost', lost)

  return () => {
    stop()
    visibility.disconnect()
    resizer.disconnect()
    document.removeEventListener('visibilitychange', handleVisibility)
    canvas.removeEventListener('webglcontextlost', lost)
    const geometries = new Set()
    const materials = new Set()
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry)
      if (object.material) materials.add(object.material)
    })
    geometries.forEach(geometry => geometry.dispose())
    materials.forEach(material => {
      for (const key of ['map', 'alphaMap']) material[key]?.dispose()
      material.dispose()
    })
    environment.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}
