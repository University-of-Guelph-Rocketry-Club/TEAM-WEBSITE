import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { getSection } from '../projects/scrollStory'
import { createStoryRocket } from '../projects/storyRocket'
import { createStoryCubeSat } from '../projects/storyCubeSat'
import { createStoryEngine, tSlotGeometry, MM } from '../projects/storyEngine'
import { STATIONS } from './hangarStations'

// The three projects standing in a row on a dark hangar floor, all at true scale to each other
// (1 unit = 564 mm). Scrolling walks the camera from the rocket on its rail, in to the CubeSat on
// its stand, and back out to the engine test stand, which lights up when you get there.
const FOV = 30
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
const CUBESAT_SCALE = MM / 0.003

const clamp01 = value => (value < 0 ? 0 : value > 1 ? 1 : value)
const smooth = (a, b, value) => {
  const t = clamp01((value - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function floorTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#7f8590'
  ctx.fillRect(0, 0, 512, 512)
  // Concrete speckle
  for (let i = 0; i < 9000; i++) {
    const tone = 110 + Math.random() * 40
    ctx.fillStyle = `rgba(${tone},${tone + 4},${tone + 10},${0.25 + Math.random() * 0.3})`
    ctx.fillRect(
      Math.random() * 512,
      Math.random() * 512,
      1 + Math.random() * 2,
      1 + Math.random() * 2
    )
  }
  // Saw-cut expansion joints every slab
  ctx.fillStyle = '#4d525b'
  ctx.fillRect(0, 0, 512, 3)
  ctx.fillRect(0, 0, 3, 512)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(16, 8)
  texture.anisotropy = 8
  return texture
}

// Painted floor markings: a hazard border around the test stand and a pad ring under the rocket.
function markingTexture(draw) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')
  draw(ctx, 512)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}
const hazardTexture = () =>
  markingTexture((ctx, size) => {
    const band = 34
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, size, size)
    ctx.rect(band, band, size - band * 2, size - band * 2)
    ctx.clip('evenodd')
    for (let i = -size; i < size * 2; i += 48) {
      ctx.fillStyle = '#e9b920'
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + 24, 0)
      ctx.lineTo(i + 24 + size, size)
      ctx.lineTo(i + size, size)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#1b1d21'
      ctx.beginPath()
      ctx.moveTo(i + 24, 0)
      ctx.lineTo(i + 48, 0)
      ctx.lineTo(i + 48 + size, size)
      ctx.lineTo(i + 24 + size, size)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  })
const padTexture = () =>
  markingTexture((ctx, size) => {
    ctx.strokeStyle = '#d9dde3'
    ctx.lineWidth = 10
    ctx.setLineDash([40, 22])
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.lineWidth = 6
    for (const [x, y, dx, dy] of [
      [size / 2, 30, 0, 50],
      [size / 2, size - 30, 0, -50],
      [30, size / 2, 50, 0],
      [size - 30, size / 2, -50, 0]
    ]) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx, y + dy)
      ctx.stroke()
    }
  })

function shadowBlob() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(0,0,0,.55)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

export function mountHangarScene(host, labelLayer, sectionId, onFailure) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const background = new THREE.Color('#060e1c')
  renderer.setClearColor(background, 1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(background, 9, 26)
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 80)
  const generator = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = generator.fromScene(room, 0.04)
  room.dispose()
  generator.dispose()
  scene.environment = environment.texture
  scene.environmentIntensity = 0.55

  scene.add(new THREE.HemisphereLight('#c9dbff', '#0a1220', 0.5))
  const key = new THREE.DirectionalLight('#fff0dc', 2.6)
  key.position.set(-4, 9, 7)
  key.target.position.set(3, 0, 0)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 })
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.02
  scene.add(key, key.target)
  const rim = new THREE.DirectionalLight('#7fb2ff', 1.6)
  rim.position.set(6, 4, -7)
  scene.add(rim)

  // Floor and a pool of light under each station
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#2a3140',
    map: floorTexture(),
    roughness: 0.82,
    metalness: 0.05
  })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(64, 32), floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.x = 3
  floor.receiveShadow = true
  scene.add(floor)
  const blob = shadowBlob()
  const pools = []
  const marking = (texture, size, x, y = 0.0015) => {
    const decal = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.9,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1
      })
    )
    decal.rotation.x = -Math.PI / 2
    decal.position.set(x, y, 0)
    decal.receiveShadow = true
    scene.add(decal)
  }
  marking(padTexture(), 2.3, 0)
  marking(hazardTexture(), 2.6, 5.6)

  const standard = (color, metalness, roughness) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness })
  const darkSteel = standard('#2f3338', 0.75, 0.5)
  const steel = standard('#7b828b', 0.85, 0.4)
  const aluminium = standard('#c9ced4', 1, 0.3)
  const anodised = standard('#20242b', 0.7, 0.45)

  const station = (x, spotHeight, spotColor = '#fff3e0') => {
    const group = new THREE.Group()
    group.position.x = x
    scene.add(group)
    const spot = new THREE.SpotLight(spotColor, 0, 14, 0.42, 0.75, 1.2)
    spot.position.set(x + 0.6, spotHeight, 2.2)
    spot.target.position.set(x, 0, 0)
    scene.add(spot, spot.target)
    pools.push(spot)
    return group
  }

  // Station 1: the rocket on its launch rail, over a blast deflector.
  const rocketStation = station(0, 8)
  const rocketTurn = new THREE.Group()
  rocketStation.add(rocketTurn)
  const rocket = createStoryRocket()
  rocket.setExplode(0, 0, 0)
  rocket.setBurn(0, 0, true)
  const nozzleClear = 0.32
  rocket.object.position.y = 1.801 + nozzleClear
  rocketTurn.add(rocket.object)
  // 1515 rail (38 mm square) behind the rail buttons, 10 ft tall, on a steel base with legs.
  const railGeometry = tSlotGeometry()
  const rail = new THREE.Mesh(railGeometry, aluminium)
  rail.scale.set((38 / 40) * MM, (38 / 40) * MM, 5.4)
  rail.rotation.x = -Math.PI / 2
  rail.position.set(0, 0.12, -0.09 - 0.028 - 0.034)
  rocketTurn.add(rail)
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.9), darkSteel)
  base.position.set(0, 0.03, -0.1)
  rocketTurn.add(base)
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + Math.PI / 2
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 12), steel)
    const foot = new THREE.Vector3(Math.cos(angle) * 0.95, 0.02, Math.sin(angle) * 0.95 - 0.1)
    const top = new THREE.Vector3(0, 1.3, -0.17)
    leg.position.copy(foot).add(top).multiplyScalar(0.5)
    leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(foot).normalize())
    leg.scale.y = foot.distanceTo(top) / 1.5
    rocketTurn.add(leg)
  }
  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.12), steel)
  collar.position.set(0, 1.3, -0.152)
  rocketTurn.add(collar)
  const deflector = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.42), darkSteel)
  deflector.position.set(0, 0.15, 0)
  deflector.rotation.x = 0.35
  rocketTurn.add(deflector)

  // Station 2: the CubeSat on a rotation stage, wings and antennas out.
  const cubesatStation = station(2.7, 5)
  const pedestal = new THREE.Group()
  cubesatStation.add(pedestal)
  const pedestalHeight = 1.55
  const part = (geometry, material, y) => {
    const piece = new THREE.Mesh(geometry, material)
    piece.position.y = y
    pedestal.add(piece)
  }
  part(new THREE.CylinderGeometry(0.34, 0.38, 0.05, 48), anodised, 0.025)
  part(
    new THREE.CylinderGeometry(0.045, 0.045, pedestalHeight - 0.1, 24),
    aluminium,
    pedestalHeight / 2
  )
  part(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 48), anodised, pedestalHeight - 0.03)
  part(new THREE.CylinderGeometry(0.11, 0.11, 0.012, 48), aluminium, pedestalHeight + 0.002)
  const cubesat = createStoryCubeSat({ onStand: true })
  cubesat.setDeploy(1, 1)
  const satSpin = new THREE.Group()
  satSpin.position.y = pedestalHeight + 0.008
  satSpin.scale.setScalar(CUBESAT_SCALE)
  cubesat.object.position.y = 0.51
  satSpin.add(cubesat.object)
  pedestal.add(satSpin)

  // Station 3: the engine on its test stand.
  const engineStation = station(5.6, 7)
  const engineTurn = new THREE.Group()
  engineStation.add(engineTurn)
  const engine = createStoryEngine()
  engineTurn.add(engine.object)

  for (const group of [rocketStation, cubesatStation, engineStation]) {
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.6),
      new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.003
    group.add(shadow)
  }

  scene.traverse(object => {
    if (!object.isMesh) return
    const material = object.material
    const transparent = Array.isArray(material)
      ? material.some(m => m.transparent)
      : material.transparent
    if (transparent || object === floor) return
    object.castShadow = true
    object.receiveShadow = true
  })

  // Camera framing for each station: target point, height to fit and width to fit.
  const framing = [
    { target: new THREE.Vector3(0, 1.95, 0), height: 4.3, width: 1.6 },
    { target: new THREE.Vector3(2.7, pedestalHeight + 0.28, 0), height: 1.25, width: 1.2 },
    { target: new THREE.Vector3(5.6, 1.2, 0), height: 2.9, width: 2.0 }
  ]
  const direction = new THREE.Vector3(0.32, 0.16, 1).normalize()

  const labels = [...labelLayer.querySelectorAll('[data-anchor]')]
    .map(element => ({
      element,
      station: Number(element.dataset.station),
      anchor: engine.anchors[element.dataset.anchor]
    }))
    .filter(label => label.anchor)

  const canvas = renderer.domElement
  host.appendChild(canvas)

  let width = 1
  let height = 1
  let compact = false
  let visible = true
  let disposed = false
  let frame = 0
  let progress = 0
  let previous = 0
  const position = new THREE.Vector3()
  const target = new THREE.Vector3()
  const projected = new THREE.Vector3()

  const resize = () => {
    const rect = host.getBoundingClientRect()
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    compact = width < 760
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Desktop: copy on the left, so centre the models in the right ~58%. Phones: copy along the
    // bottom, so centre them in the top half.
    if (compact) camera.setViewOffset(width, height, 0, height * 0.1, width, height)
    else camera.setViewOffset(width, height, -width * 0.19, 0, width, height)
    camera.updateProjectionMatrix()
  }

  // How far back the camera needs to be to fit a station into the free part of the frame.
  const distanceFor = frame => {
    const usableHeight = compact ? 0.46 : 0.86
    const usableWidth = compact ? 0.86 : 0.5
    const byHeight = frame.height / 2 / (TAN * usableHeight)
    const byWidth = frame.width / 2 / (TAN * camera.aspect * usableWidth)
    return Math.max(byHeight, byWidth)
  }

  const render = now => {
    frame = 0
    if (disposed || !visible) return
    const time = now / 1000
    const dt = previous ? Math.min(0.1, time - previous) : 0
    previous = time
    const state = getSection(sectionId)
    const goal = state ? state.p : 0
    progress = motion.matches ? goal : lerp(progress, goal, 1 - Math.exp(-dt * 7))
    if (Math.abs(goal - progress) < 0.0005) progress = goal

    // Station index as a smooth number: 0 → rocket, 1 → CubeSat, 2 → engine
    const s =
      easeInOut(smooth(STATIONS[0][1], STATIONS[1][0], progress)) +
      easeInOut(smooth(STATIONS[1][1], STATIONS[2][0], progress))
    const i = Math.min(1, Math.floor(s))
    const t = s - i
    const a = framing[i]
    const b = framing[i + 1]
    target.lerpVectors(a.target, b.target, t)
    // Pull back a little mid-move so the walk between stations reads as a camera move, not a zoom.
    const distance = lerp(distanceFor(a), distanceFor(b), t) * (1 + Math.sin(t * Math.PI) * 0.35)
    position.copy(direction).multiplyScalar(distance).add(target)
    camera.position.copy(position)
    camera.lookAt(target)

    const still = motion.matches
    rocketTurn.rotation.y = -0.5 + progress * 1.2 + (still ? 0 : Math.sin(time * 0.25) * 0.08)
    satSpin.rotation.y = still ? 0.6 : time * 0.35
    engineTurn.rotation.y = -0.55 + Math.sin(still ? 0 : time * 0.2) * 0.1 + progress * 0.3
    const fire = smooth(STATIONS[2][0] - 0.02, STATIONS[2][0] + 0.06, progress)
    engine.setFire(fire, still ? 0 : time)
    pools.forEach((spot, k) => {
      spot.intensity = 26 * clamp01(1.25 - Math.abs(s - k))
    })

    labels.forEach(label => {
      const shown =
        clamp01(1 - Math.abs(s - label.station) * 4) *
        (label.station === 2 ? smooth(0.86, 0.9, progress) : 1)
      label.element.style.opacity = shown.toFixed(3)
      if (shown < 0.01) return
      label.anchor.getWorldPosition(projected)
      projected.project(camera)
      const x = (projected.x * 0.5 + 0.5) * width
      const y = (-projected.y * 0.5 + 0.5) * height
      label.element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    })

    renderer.render(scene, camera)
    if (!document.hidden) frame = requestAnimationFrame(render)
  }

  const start = () => {
    if (!frame && visible && !disposed) {
      previous = 0
      frame = requestAnimationFrame(render)
    }
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else {
        cancelAnimationFrame(frame)
        frame = 0
      }
    },
    { rootMargin: '120px' }
  )
  observer.observe(host)
  const resizeObserver = new ResizeObserver(() => {
    resize()
    start()
  })
  resizeObserver.observe(host)
  const onVisibility = () => {
    if (!document.hidden) start()
  }
  document.addEventListener('visibilitychange', onVisibility)
  const lost = event => {
    event.preventDefault()
    disposed = true
    cancelAnimationFrame(frame)
    onFailure()
  }
  canvas.addEventListener('webglcontextlost', lost)
  resize()
  start()

  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    observer.disconnect()
    resizeObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    canvas.removeEventListener('webglcontextlost', lost)
    const textures = new Set()
    scene.traverse(object => {
      object.geometry?.dispose()
      const materials = [object.material].flat().filter(Boolean)
      materials.forEach(material => {
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value)
        material.dispose()
      })
    })
    textures.forEach(texture => texture.dispose())
    blob.dispose()
    environment.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}
