import * as THREE from 'three'
import { createRocketLivery } from '../rocketLivery'

// Illustrative competition rocket, split into the sections the exploded view pulls apart.
const BODY_BOTTOM = -1.25
const BODY_LENGTH = 2.5
const RADIUS = 0.125

function stripeTexture(colors, count) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 4
  const ctx = canvas.getContext('2d')
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[i % colors.length]
    ctx.fillRect(i * 256 / count, 0, 256 / count + 1, 4)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function radialTexture(stops) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  return new THREE.CanvasTexture(canvas)
}

// Soft exhaust plume: bright near the nozzle, widening and fading toward the ground.
function smokeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(64, 256)
  for (let y = 0; y < 256; y++) {
    const along = y / 255
    const fade = Math.pow(1 - along, 1.6) * (0.35 + 0.65 * Math.min(1, along * 12))
    const warm = Math.max(0, 1 - along * 9)
    for (let x = 0; x < 64; x++) {
      const across = (x / 63 - 0.5) / 0.24
      const puff = 0.82 + 0.18 * Math.sin(y * 0.21 + Math.sin(x * 0.4) * 2)
      const alpha = Math.exp(-across * across) * fade * puff
      const i = (y * 64 + x) * 4
      image.data[i] = 225 + 30 * warm
      image.data[i + 1] = 229 + 10 * warm
      image.data[i + 2] = 236 - 60 * warm
      image.data[i + 3] = Math.round(255 * Math.min(1, alpha))
    }
  }
  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createStoryRocket() {
  const object = new THREE.Group()
  const tilt = new THREE.Group()
  const spin = new THREE.Group()
  object.add(tilt)
  tilt.add(spin)

  const standard = (color, metalness, roughness, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const livery = createRocketLivery()
  const paint = new THREE.MeshStandardMaterial({ map: livery.body, metalness: 0, roughness: 0.6, envMapIntensity: 0.35 })
  const finPaint = new THREE.MeshStandardMaterial({ map: livery.fins, metalness: 0, roughness: 0.6, envMapIntensity: 0.35 })
  const nosePaint = standard('#cf142b', 0.15, 0.35)
  const lining = standard('#2b3038', 0.2, 0.85, { side: THREE.BackSide })
  const edge = standard('#e4e6e8', 0.1, 0.55, { side: THREE.DoubleSide })
  const dark = standard('#22272f', 0.55, 0.45, { side: THREE.DoubleSide })
  const carbon = standard('#1a1d23', 0.5, 0.35, { side: THREE.DoubleSide })
  const steel = standard('#b9c4cf', 0.9, 0.25)
  const motorCase = standard('#454b55', 0.85, 0.28)
  const motorCap = standard('#c23a2c', 0.6, 0.35)
  const graphite = standard('#17191d', 0.3, 0.75, { side: THREE.DoubleSide })
  const board = standard('#0c4a2f', 0.15, 0.55)
  const chip = standard('#0d1014', 0.35, 0.45)
  const gold = standard('#d8ad4c', 0.85, 0.3)
  const battery = standard('#2f6fe0', 0.25, 0.45)

  const mesh = (geometry, material, parent, position = [0, 0, 0]) => {
    const part = new THREE.Mesh(geometry, material)
    part.position.set(...position)
    parent.add(part)
    return part
  }
  const group = parent => {
    const part = new THREE.Group()
    parent.add(part)
    return part
  }
  const anchor = (parent, position) => {
    const point = new THREE.Object3D()
    point.position.set(...position)
    parent.add(point)
    return point
  }
  const disc = (parent, y, radius, material = dark) => {
    const part = mesh(new THREE.CircleGeometry(radius, 40), material, parent, [0, y, 0])
    part.rotation.x = -Math.PI / 2
    return part
  }
  // Painted airframe tube with a dark lining and cut edges, so separated sections read as hollow.
  const tube = (parent, y0, y1) => {
    const height = y1 - y0
    const geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, height, 56, 1, true)
    const uv = geometry.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setY(i, (y0 + uv.getY(i) * height - BODY_BOTTOM) / BODY_LENGTH)
    const outer = mesh(geometry, paint, parent, [0, (y0 + y1) / 2, 0])
    outer.rotation.y = -Math.PI / 2
    mesh(new THREE.CylinderGeometry(RADIUS * 0.93, RADIUS * 0.93, height, 40, 1, true), lining, parent, [0, (y0 + y1) / 2, 0])
    for (const y of [y0, y1]) {
      const rim = mesh(new THREE.RingGeometry(RADIUS * 0.93, RADIUS, 56), edge, parent, [0, y, 0])
      rim.rotation.x = -Math.PI / 2
    }
  }

  // Fin can with fins, motor mount and retainer.
  const finCan = group(spin)
  tube(finCan, -1.25, -0.35)
  disc(finCan, -0.37, RADIUS * 0.93)
  mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.9, 32, 1, true), dark, finCan, [0, -0.81, 0])
  const retainer = mesh(new THREE.TorusGeometry(0.094, 0.01, 8, 40), steel, finCan, [0, -1.26, 0])
  retainer.rotation.x = Math.PI / 2
  const finShape = new THREE.Shape()
  finShape.moveTo(0.12, -0.61)
  finShape.lineTo(0.51, -0.94)
  finShape.lineTo(0.51, -1.37)
  finShape.lineTo(0.12, -1.24)
  finShape.closePath()
  const finGeometry = new THREE.ExtrudeGeometry(finShape, { depth: 0.012, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 1, steps: 1 })
  finGeometry.translate(0, 0, -0.006)
  const finPositions = finGeometry.attributes.position
  const finUv = finGeometry.attributes.uv
  for (let i = 0; i < finPositions.count; i++) {
    finUv.setXY(i, (finPositions.getX(i) - 0.12) / 0.39, (finPositions.getY(i) + 1.37) / 0.76)
  }
  for (let i = 0; i < 4; i++) {
    const fin = mesh(finGeometry, finPaint, finCan)
    fin.rotation.y = i * Math.PI / 2
  }
  for (const y of [-0.45, -1.0]) {
    const button = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.024, 12), steel, finCan, [0, y, -0.133])
    button.rotation.x = Math.PI / 2
  }

  // Solid motor: casing, red forward closure and a graphite nozzle.
  const motor = group(spin)
  mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.84, 32), motorCase, motor, [0, -0.84, 0])
  mesh(new THREE.CylinderGeometry(0.087, 0.087, 0.05, 32), motorCap, motor, [0, -0.42, 0])
  mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.035, 32), steel, motor, [0, -1.27, 0])
  for (const y of [-0.62, -0.84, -1.06]) {
    const groove = mesh(new THREE.TorusGeometry(0.0855, 0.003, 6, 40), steel, motor, [0, y, 0])
    groove.rotation.x = Math.PI / 2
  }
  const nozzleProfile = [[0.052, 0], [0.034, -0.035], [0.042, -0.08], [0.064, -0.14]]
  mesh(new THREE.LatheGeometry(nozzleProfile.map(([x, y]) => new THREE.Vector2(x, y)), 32), graphite, motor, [0, -1.287, 0])

  // Avionics bay: switch band, carbon coupler, threaded rods and a sliding electronics sled.
  const avionics = group(spin)
  tube(avionics, -0.35, 0.05)
  mesh(new THREE.CylinderGeometry(0.116, 0.116, 0.64, 40, 1, true), carbon, avionics, [0, -0.15, 0])
  for (const y of [-0.47, 0.17]) {
    disc(avionics, y, 0.116, dark)
    const eye = mesh(new THREE.TorusGeometry(0.022, 0.006, 8, 20), steel, avionics, [0, y + (y < 0 ? -0.022 : 0.022), 0])
    eye.rotation.y = Math.PI / 2
  }
  for (const z of [-0.07, 0.07]) mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.62, 8), steel, avionics, [0.03, -0.15, z])
  const sled = group(avionics)
  sled.position.y = -0.15
  mesh(new THREE.BoxGeometry(0.012, 0.38, 0.17), board, sled)
  mesh(new THREE.BoxGeometry(0.008, 0.055, 0.055), chip, sled, [-0.01, 0.07, 0.02])
  for (const [y, z] of [[-0.02, -0.05], [-0.08, 0.04], [0.13, -0.045], [-0.13, 0.03]]) {
    mesh(new THREE.BoxGeometry(0.006, 0.026, 0.03), chip, sled, [-0.009, y, z])
  }
  for (const [y, z] of [[0.15, 0.05], [-0.16, -0.05]]) mesh(new THREE.BoxGeometry(0.004, 0.02, 0.02), gold, sled, [-0.008, y, z])
  const cell = mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.15, 20), battery, sled, [0.032, -0.06, 0])
  cell.rotation.z = 0
  mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.16, 8), gold, sled, [-0.01, 0.27, 0.06])

  // Recovery bay and the parachute that blooms out of it.
  const recovery = group(spin)
  tube(recovery, 0.05, 1.25)
  disc(recovery, 1.22, RADIUS * 0.93, dark)
  const chute = group(spin)
  const canopyProfile = [[0.27, 0], [0.255, 0.07], [0.215, 0.14], [0.15, 0.195], [0.075, 0.225], [0.018, 0.232]]
  const canopy = mesh(new THREE.LatheGeometry(canopyProfile.map(([x, y]) => new THREE.Vector2(x, y)), 48), new THREE.MeshStandardMaterial({ map: stripeTexture(['#ff5b24', '#f4f1ea'], 12), roughness: 0.8, side: THREE.DoubleSide }), chute)
  canopy.castShadow = false
  const lines = []
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * Math.PI * 2
    lines.push(new THREE.Vector3(Math.cos(angle) * 0.27, 0, Math.sin(angle) * 0.27), new THREE.Vector3(0, -0.34, 0))
  }
  chute.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines), new THREE.LineBasicMaterial({ color: '#d9dee6', transparent: true, opacity: 0.7 })))

  // Nose cone with its shoulder.
  const nose = group(spin)
  const noseProfile = [[0.125, 0], [0.12, 0.12], [0.101, 0.29], [0.07, 0.46], [0.034, 0.62], [0, 0.76]]
  mesh(new THREE.LatheGeometry(noseProfile.map(([x, y]) => new THREE.Vector2(x, y)), 48), nosePaint, nose, [0, 1.25, 0])
  mesh(new THREE.CylinderGeometry(0.118, 0.118, 0.14, 40, 1, true), carbon, nose, [0, 1.18, 0])
  disc(nose, 1.11, 0.118, dark)
  const noseRim = mesh(new THREE.RingGeometry(0.118, RADIUS, 56), edge, nose, [0, 1.25, 0])
  noseRim.rotation.x = -Math.PI / 2

  const anchors = {
    'rocket-nose': anchor(nose, [0, 1.58, 0]),
    'rocket-chute': anchor(chute, [0, 0.232, 0]),
    'rocket-avionics': anchor(sled, [-0.02, 0.05, 0]),
    'rocket-fins': anchor(finCan, [0.5, -1.15, 0]),
    'rocket-motor': anchor(motor, [0, -0.84, 0])
  }

  // Exhaust: flame cones, a glow sprite and a point light for the launch.
  const flame = group(tilt)
  flame.position.y = -1.42
  const flameMaterial = color => new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const outerFlame = mesh(new THREE.ConeGeometry(0.07, 0.75, 24, 1, true), flameMaterial('#ff7a2e'), flame, [0, -0.375, 0])
  outerFlame.rotation.x = Math.PI
  const coreFlame = mesh(new THREE.ConeGeometry(0.04, 0.38, 20, 1, true), flameMaterial('#fff0bd'), flame, [0, -0.19, 0])
  coreFlame.rotation.x = Math.PI
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture([[0, '#ffe2a8'], [0.25, '#ff8a3dcc'], [1, '#ff4d0000']]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  glow.scale.setScalar(1.1)
  glow.position.y = -0.12
  flame.add(glow)
  const light = new THREE.PointLight('#ff9a4a', 0, 4, 1.6)
  light.position.y = -0.2
  flame.add(light)

  // Trapezoid from the nozzle (y = 0) down to y = -1, scaled to the trail length each frame.
  const trailGeometry = new THREE.BufferGeometry()
  trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-0.06, 0, 0, 0.06, 0, 0, -0.75, -1, 0, 0.75, -1, 0], 3))
  trailGeometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 0, 0, 1, 0], 2))
  trailGeometry.setIndex([0, 2, 1, 1, 2, 3])
  const trailMaterial = new THREE.MeshBasicMaterial({ map: smokeTexture(), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
  const trail = new THREE.Mesh(trailGeometry, trailMaterial)
  trail.visible = false

  return {
    object,
    tilt,
    spin,
    trail,
    anchors,
    setExplode(explode, sledOut, chuteOpen) {
      motor.position.y = -1.8 * explode
      finCan.position.y = -0.85 * explode
      avionics.position.y = -0.3 * explode
      sled.position.x = -0.46 * sledOut
      recovery.position.y = 0.3 * explode
      nose.position.y = 1.2 * explode
      chute.position.y = 1.225 + 0.75 * explode
      chute.visible = chuteOpen > 0.001
      chute.scale.set(chuteOpen, chuteOpen * (0.6 + chuteOpen * 0.4), chuteOpen)
    },
    setBurn(burn, time, steady) {
      flame.visible = burn > 0.01
      if (!flame.visible) {
        light.intensity = 0
        return
      }
      const flicker = steady ? 0 : Math.sin(time * 47) * 0.08 + Math.sin(time * 31.3) * 0.06
      flame.scale.set(1 + flicker * 0.5, burn * (1 + flicker), 1 + flicker * 0.5)
      glow.material.opacity = burn
      light.intensity = 6 * burn
    },
    setTrail(top, bottom, x, opacity) {
      trail.visible = opacity > 0.01 && top > bottom
      if (!trail.visible) return
      trail.position.set(x, top, 0)
      trail.scale.set(1, top - bottom, 1)
      trailMaterial.opacity = opacity
    }
  }
}
