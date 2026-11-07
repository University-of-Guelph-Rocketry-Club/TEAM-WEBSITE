import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { solarTexture, backTexture } from './storyCubeSat'

// A 3U CubeSat (100 x 100 x 340.5 mm at 0.003 units/mm) with its shell sliced in half lengthwise,
// showing a typical internal layout. Illustrative: our real layout isn't final.
const W = 0.3
const H = 1.02
const RAIL = 0.0255
const PANEL_W = W - 2 * RAIL + 0.004
const PANEL_H = H - 0.05
const BOARD = 0.27
const PCB = 0.0048
const SECTION_COLOR = '#ff7a45'

const standard = (color, metalness, roughness, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })

function seeded(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function buildCutaway(sectionPlane) {
  const model = new THREE.Group()
  const parts = {}
  const anchors = {}
  const spinners = []

  const part = key => {
    const group = new THREE.Group()
    model.add(group)
    parts[key] = group
    return group
  }
  const mesh = (geometry, material, parent, position = [0, 0, 0], rotation) => {
    const item = new THREE.Mesh(geometry, material)
    item.position.set(...position)
    if (rotation) item.rotation.set(...rotation)
    parent.add(item)
    return item
  }
  const anchor = (name, parent, position) => {
    const point = new THREE.Object3D()
    point.position.set(...position)
    parent.add(point)
    anchors[name] = point
  }
  const clip = material => {
    material.clippingPlanes = [sectionPlane]
    material.side = THREE.DoubleSide
    return material
  }
  const tube = (parent, points, radius, material) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 40, radius, 8), material, parent)

  // Tiny surface-mount parts scattered over a board (one instanced mesh per colour).
  const sprinkle = (parent, count, rand, color, area = [[-0.09, 0.12], [-0.12, 0.12]]) => {
    const parts = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(color, 0.25, 0.5), count)
    const matrix = new THREE.Matrix4()
    const rotation = new THREE.Quaternion()
    const size = new THREE.Vector3()
    const place = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const long = 0.004 + rand() * 0.007
      const short = 0.002 + rand() * 0.003
      const tall = 0.0015 + rand() * 0.0025
      const flip = rand() > 0.5
      size.set(flip ? long : short, tall, flip ? short : long)
      place.set(area[0][0] + rand() * (area[0][1] - area[0][0]), PCB / 2 + tall / 2, area[1][0] + rand() * (area[1][1] - area[1][0]))
      parts.setMatrixAt(i, matrix.compose(place, rotation, size))
    }
    parent.add(parts)
  }
  // A PC/104-size board with its stack connector, corner pads and scattered parts.
  const board = (parent, y, color, seed) => {
    const group = new THREE.Group()
    group.position.y = y
    parent.add(group)
    const rand = seeded(seed)
    mesh(new THREE.BoxGeometry(BOARD, PCB, BOARD), standard(color, 0.1, 0.45), group)
    const header = mesh(new THREE.BoxGeometry(0.018, 0.012, 0.2), standard('#121315', 0.1, 0.5), group, [-0.112, PCB / 2 + 0.006, 0])
    mesh(new THREE.BoxGeometry(0.012, 0.002, 0.19), standard('#d9b45a', 1, 0.3), header, [0, 0.007, 0])
    for (const x of [-1, 1]) {
      for (const z of [-1, 1]) mesh(new THREE.CylinderGeometry(0.009, 0.009, PCB + 0.001, 16), standard('#d6b25c', 1, 0.3), group, [x * 0.115, 0, z * 0.115])
    }
    sprinkle(group, 70, rand, '#2a2724')
    sprinkle(group, 26, rand, '#b49766')
    return group
  }
  const chip = (parent, size, position, color = '#141518') => mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), standard(color, 0.3, 0.45), parent, [position[0], PCB / 2 + size[1] / 2 + (position[1] || 0), position[2]])

  // ── Structure: rails, frame and side panels, all cut by the section plane ──
  const structure = part('structure')
  const railMaterial = clip(standard('#858c95', 0.85, 0.38))
  const frameMaterial = clip(standard('#cdd3da', 1, 0.3))
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) mesh(new RoundedBoxGeometry(RAIL, H, RAIL, 2, 0.0035), railMaterial, structure, [x * (W - RAIL) / 2, 0, z * (W - RAIL) / 2])
  }
  for (const y of [-H / 2 + 0.012, -H / 6, H / 6, H / 2 - 0.012]) {
    for (const z of [-1, 1]) mesh(new THREE.BoxGeometry(W - RAIL * 2, 0.012, 0.012), frameMaterial, structure, [0, y, z * (W - RAIL) / 2])
    for (const x of [-1, 1]) {
      mesh(new THREE.BoxGeometry(0.012, 0.012, W - RAIL * 2), frameMaterial, structure, [x * (W - RAIL) / 2, y, 0])
      mesh(new THREE.BoxGeometry(0.013, 0.013, 0.0025), standard(SECTION_COLOR, 0.1, 0.6), structure, [x * (W - RAIL) / 2, y, 0.001])
    }
  }
  const solar = clip(new THREE.MeshPhysicalMaterial({ map: solarTexture(), metalness: 0.3, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.4 }))
  const panelBack = clip(standard('#ffffff', 0.4, 0.55, { map: backTexture() }))
  const panelEdge = clip(standard('#3a3a2e', 0.1, 0.7))
  const panel = (height, position, rotation) => mesh(new THREE.BoxGeometry(PANEL_W, height, 0.006), [panelEdge, panelEdge, panelEdge, panelEdge, solar, panelBack], structure, position, rotation)
  const offset = W / 2 - 0.001
  panel(PANEL_H, [0, 0, offset])
  panel(PANEL_H, [offset, 0, 0], [0, Math.PI / 2, 0])
  panel(PANEL_H, [-offset, 0, 0], [0, -Math.PI / 2, 0])
  panel(PANEL_H * 0.62, [0, PANEL_H * 0.19, -offset], [0, Math.PI, 0])
  mesh(new THREE.BoxGeometry(W - 0.035, 0.006, W - 0.035), clip(standard('#1f2329', 0.7, 0.45)), structure, [0, -H / 2 + 0.003, 0])
  // Orange section edges where the cut passes through the side panels and base
  const sectionMaterial = standard(SECTION_COLOR, 0.1, 0.6)
  for (const x of [-1, 1]) mesh(new THREE.BoxGeometry(0.008, PANEL_H, 0.0025), sectionMaterial, structure, [x * offset, 0, 0.001])
  mesh(new THREE.BoxGeometry(W - 0.035, 0.008, 0.0025), sectionMaterial, structure, [0, -H / 2 + 0.003, 0.001])
  // Stack rods and the wiring harness down the back corner
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.27, 8), standard('#b9c1ca', 1, 0.25), structure, [x * 0.115, 0.36, z * 0.115])
  }
  const wires = [['#c62828', 0], ['#141414', 0.008], ['#eeeeee', 0.016]]
  for (const [color, shift] of wires) {
    tube(structure, [[-0.1 + shift, 0.36, -0.1], [-0.11 + shift, 0.24, -0.112], [-0.108 + shift, 0.1, -0.115], [-0.1 + shift, -0.02, -0.105], [-0.07 + shift, -0.06, -0.08]], 0.0032, standard(color, 0.1, 0.5))
  }
  anchor('structure', structure, [-(W - RAIL) / 2, 0.3, -(W - RAIL) / 2])
  anchor('solar', structure, [W / 2 + 0.004, 0.18, -0.07])

  // ── Radio: UHF transceiver under an RF shield, coax up to the antenna deployer on top ──
  const radio = part('radio')
  const radioBoard = board(radio, 0.455, '#174a8c', 11)
  const shield = chip(radioBoard, [0.12, 0.018, 0.09], [0.03, 0, -0.01], '#c9cfd6')
  shield.material.metalness = 1
  shield.material.roughness = 0.28
  mesh(new THREE.BoxGeometry(0.1, 0.0015, 0.07), standard('#aab2bb', 1, 0.35), shield, [0, 0.0095, 0])
  mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.018, 12), standard('#d6ad4f', 1, 0.3), radio, [0.128, 0.465, 0.07], [0, 0, Math.PI / 2])
  tube(radio, [[0.137, 0.465, 0.07], [0.15, 0.475, 0.05], [0.12, 0.49, 0.02]], 0.0025, standard('#1b1c1f', 0.2, 0.6))
  const deployer = new THREE.Group()
  deployer.position.y = 0.497
  radio.add(deployer)
  mesh(new THREE.BoxGeometry(W - 0.03, 0.008, W - 0.03), standard('#121518', 0.2, 0.5), deployer)
  for (const [x, z] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const housing = mesh(new THREE.BoxGeometry(x ? 0.03 : 0.08, 0.016, z ? 0.03 : 0.08), standard('#ecece6', 0, 0.55), deployer, [x * 0.1, 0.012, z * 0.1])
    mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.012, 20), standard('#cdbd8f', 0.8, 0.35), housing, [0, 0.003, 0])
    mesh(new THREE.BoxGeometry(0.006, 0.004, 0.012), standard('#2b2b2b', 0.2, 0.4), deployer, [x * 0.07 + z * 0.03, 0.006, z * 0.07 + x * 0.03])
  }
  const gps = mesh(new THREE.BoxGeometry(0.07, 0.01, 0.07), standard('#cdb98a', 0.1, 0.5), deployer, [0, 0.009, 0])
  mesh(new THREE.BoxGeometry(0.045, 0.002, 0.045), standard('#cfd4da', 1, 0.3), gps, [0, 0.006, 0])
  anchor('radio', radio, [0.07, 0.476, 0.03])

  // ── Flight computer ──
  const computer = part('computer')
  const obc = board(computer, 0.41, '#0e5a3a', 23)
  chip(obc, [0.034, 0.003, 0.034], [-0.02, 0, 0.03])
  chip(obc, [0.022, 0.0025, 0.014], [0.04, 0, 0.04])
  chip(obc, [0.022, 0.0025, 0.014], [0.04, 0, 0.065])
  chip(obc, [0.03, 0.004, 0.026], [0.07, 0, -0.07], '#c9cfd6')
  chip(obc, [0.008, 0.003, 0.005], [-0.045, 0, 0.06], '#c9cfd6')
  chip(obc, [0.05, 0.007, 0.008], [0.02, 0, -0.105], '#d6b25c')
  anchor('computer', computer, [-0.02, 0.418, 0.03])

  // ── Power: power board and the battery pack under it ──
  const power = part('power')
  const eps = board(power, 0.365, '#17191c', 37)
  for (let i = 0; i < 6; i++) {
    mesh(new RoundedBoxGeometry(0.022, 0.012, 0.022, 2, 0.002), standard('#3b3f45', 0.4, 0.5), eps, [-0.06 + (i % 3) * 0.04, PCB / 2 + 0.006, i < 3 ? 0.06 : -0.02])
  }
  for (let i = 0; i < 4; i++) {
    const cap = mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.016, 16), standard('#c7ccd2', 0.9, 0.3), eps, [0.08, PCB / 2 + 0.008, -0.08 + i * 0.03])
    mesh(new THREE.CylinderGeometry(0.0072, 0.0072, 0.002, 16), standard('#1b1b1b', 0.2, 0.5), cap, [0, 0.008, 0])
  }
  for (const z of [0.1, 0.12]) chip(eps, [0.02, 0.006, 0.008], [0.06, 0, z], '#f1f1ea')
  const batteryBoard = board(power, 0.245, '#17191c', 41)
  const wrap = standard('#2f64c8', 0.3, 0.38)
  for (const y of [0.027, 0.082]) {
    for (const z of [-0.048, 0.048]) {
      const cell = mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.195, 32), wrap, batteryBoard, [0, y, z], [0, 0, Math.PI / 2])
      for (const end of [-1, 1]) mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.003, 24), standard('#d4d8dc', 1, 0.3), cell, [0, end * 0.099, 0])
    }
  }
  for (const x of [-1, 1]) mesh(new THREE.BoxGeometry(0.014, 0.12, 0.16), standard('#16171a', 0.1, 0.6), batteryBoard, [x * 0.104, 0.058, 0])
  for (const [color, z] of [['#c62828', 0.11], ['#141414', 0.118]]) tube(power, [[0.1, 0.37, z], [0.125, 0.33, z], [0.125, 0.27, z], [0.1, 0.25, z]], 0.003, standard(color, 0.1, 0.5))
  anchor('power', power, [0.1, 0.33, 0.07])

  // ── Attitude control: three reaction wheels, two torque rods and an air-core coil ──
  const attitude = part('attitude')
  const adcs = board(attitude, 0.05, '#13325e', 53)
  chip(adcs, [0.016, 0.003, 0.016], [-0.08, 0, -0.07])
  chip(adcs, [0.012, 0.003, 0.012], [-0.05, 0, -0.08])
  mesh(new THREE.TorusGeometry(0.105, 0.005, 10, 96), standard('#b87333', 1, 0.32), attitude, [0, 0.062, 0], [Math.PI / 2, 0, 0])
  const wheel = (position, rotation) => {
    const unit = new THREE.Group()
    unit.position.set(...position)
    unit.rotation.set(...rotation)
    attitude.add(unit)
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 40, 1, true), standard('#2a2e35', 0.8, 0.35, { side: THREE.DoubleSide }), unit)
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.004, 40), standard('#2a2e35', 0.8, 0.35), unit, [0, -0.015, 0])
    const flywheel = new THREE.Group()
    unit.add(flywheel)
    mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.012, 40), standard('#c9a24a', 1, 0.28), flywheel, [0, 0.002, 0])
    for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(0.03, 0.013, 0.006), standard('#1a1b1e', 0.4, 0.5), flywheel, [Math.cos(i * 2.09) * 0.016, 0.002, Math.sin(i * 2.09) * 0.016], [0, -i * 2.09, 0])
    mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.016, 16), standard('#cfd4da', 1, 0.25), flywheel, [0, 0.003, 0])
    spinners.push(flywheel)
    mesh(new THREE.BoxGeometry(0.05, 0.006, 0.014), standard('#9aa3ad', 1, 0.35), unit, [0, -0.02, 0.03])
  }
  wheel([0.045, 0.085, 0.045], [0, 0, 0])
  wheel([-0.06, 0.14, 0.05], [0, 0, Math.PI / 2])
  wheel([0.06, 0.15, -0.06], [Math.PI / 2, 0, 0])
  const rod = (position, rotation) => {
    const unit = mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.17, 20), standard('#b87333', 1, 0.36), attitude, position, rotation)
    for (const end of [-1, 1]) mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.012, 20), standard('#18191c', 0.2, 0.5), unit, [0, end * 0.088, 0])
  }
  rod([0, 0.205, -0.1], [0, 0, Math.PI / 2])
  rod([-0.105, 0.205, 0], [Math.PI / 2, 0, 0])
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.17, 8), standard('#b9c1ca', 1, 0.25), attitude, [x * 0.115, 0.135, z * 0.115])
  }
  anchor('attitude', attitude, [-0.045, 0.165, 0.09])

  // ── Experiment: the payload board and the sealed seed chamber pod in gold insulation ──
  const payload = part('payload')
  const payloadBoard = board(payload, -0.035, '#0e5a3a', 67)
  chip(payloadBoard, [0.026, 0.003, 0.026], [0.03, 0, 0.04])
  chip(payloadBoard, [0.04, 0.006, 0.01], [-0.02, 0, -0.08], '#f1f1ea')
  const podGeometry = new THREE.CylinderGeometry(0.105, 0.105, 0.33, 96, 30)
  const podPosition = podGeometry.attributes.position
  for (let i = 0; i < podPosition.count; i++) {
    const x = podPosition.getX(i)
    const y = podPosition.getY(i)
    const z = podPosition.getZ(i)
    const radius = Math.hypot(x, z)
    if (radius < 0.104) continue
    const angle = Math.atan2(z, x)
    const crinkle = 1 + 0.018 * Math.sin(angle * 9 + y * 41) * Math.sin(angle * 23 - y * 67) + 0.008 * Math.sin(angle * 41 + y * 113)
    podPosition.setXYZ(i, x * crinkle, y, z * crinkle)
  }
  podGeometry.computeVertexNormals()
  mesh(podGeometry, standard('#d9ae4f', 1, 0.3), payload, [0, -0.24, 0])
  for (const y of [-0.072, -0.408]) mesh(new THREE.CylinderGeometry(0.109, 0.109, 0.012, 64), standard('#c3c9d0', 1, 0.3), payload, [0, y, 0])
  const connector = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 24), standard('#c9cfd6', 1, 0.28), payload, [0.04, -0.056, 0.02])
  for (let i = 0; i < 6; i++) mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.004, 8), standard('#d6ad4f', 1, 0.3), connector, [Math.cos(i * 1.05) * 0.009, 0.011, Math.sin(i * 1.05) * 0.009])
  tube(payload, [[0.04, -0.045, 0.02], [0.05, -0.035, 0.0], [0.03, -0.03, -0.03]], 0.004, standard('#c58a2a', 0.2, 0.5))
  anchor('payload', payload, [0.076, -0.21, 0.076])

  // ── Thermal: heater films on the pod, a copper strap to the radiator on the back wall ──
  const thermal = part('thermal')
  for (const y of [-0.15, -0.32]) {
    mesh(new THREE.CylinderGeometry(0.1105, 0.1105, 0.05, 96, 1, true, -0.3, Math.PI * 1.3), standard('#d9772a', 0.2, 0.4, { side: THREE.DoubleSide }), thermal, [0, y, 0])
  }
  tube(thermal, [[-0.07, -0.078, -0.07], [-0.09, -0.11, -0.1], [-0.06, -0.19, -0.13], [-0.03, -0.22, -0.139]], 0.006, standard('#c27a43', 1, 0.45))
  mesh(new THREE.BoxGeometry(0.11, 0.08, 0.006), standard('#c27a43', 1, 0.4), thermal, [-0.02, -0.22, -0.143])
  const radiator = mesh(new THREE.BoxGeometry(PANEL_W, PANEL_H * 0.36, 0.006), standard('#f1f3f5', 0.05, 0.5), thermal, [0, -PANEL_H * 0.31, -offset])
  for (let i = 0; i < 7; i++) mesh(new THREE.BoxGeometry(PANEL_W - 0.02, 0.004, 0.003), standard('#c9ced4', 0.6, 0.4), radiator, [0, (i - 3) * 0.045, -0.004])
  anchor('thermal', thermal, [-0.098, -0.15, 0.06])

  // ── Deorbit: a drag sail cassette at the bottom end ──
  const deorbit = part('deorbit')
  const cassette = mesh(new THREE.BoxGeometry(0.255, 0.035, 0.255), standard('#aeb6bf', 1, 0.32), deorbit, [0, -0.487, 0])
  mesh(new THREE.BoxGeometry(0.2, 0.0015, 0.2), standard('#5b636c', 0.8, 0.4), cassette, [0, 0.018, 0])
  for (const x of [-1, 1]) mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.2, 10), standard('#d6ad4f', 1, 0.3), cassette, [x * 0.1, 0.02, 0], [Math.PI / 2, 0, 0])
  anchor('deorbit', deorbit, [0.1, -0.47, 0.1])

  return { model, parts, anchors, spinners }
}

// Renders the cutaway and lays out the callout labels (DOM) and leader lines (SVG) around it.
export function mountSatCutaway(stage, onFailure) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  const host = stage.querySelector('.cutaway-canvas')
  const svg = stage.querySelector('.cutaway-lines')
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  renderer.setClearColor(0x000000, 0)
  renderer.localClippingEnabled = true
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50)
  const generator = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = generator.fromScene(room, 0.04)
  room.dispose()
  generator.dispose()
  scene.environment = environment.texture
  scene.add(new THREE.HemisphereLight('#e2ecff', '#101a2c', 0.9))
  const key = new THREE.DirectionalLight('#fff3e2', 2.6)
  key.position.set(2, 3, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight('#7fb2ff', 1.6)
  rim.position.set(-3, 1, -3)
  scene.add(rim)

  const localPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
  const sectionPlane = new THREE.Plane()
  const { model, parts, anchors, spinners } = buildCutaway(sectionPlane)
  const pivot = new THREE.Group()
  pivot.add(model)
  scene.add(pivot)
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)

  const ns = 'http://www.w3.org/2000/svg'
  const labels = [...stage.querySelectorAll('[data-part]')].map(el => {
    const line = document.createElementNS(ns, 'line')
    const dot = document.createElementNS(ns, 'circle')
    dot.setAttribute('r', '3.5')
    svg.append(line, dot)
    return { el, line, dot, key: el.dataset.key, side: el.dataset.side, anchor: anchors[el.dataset.part], w: 0, h: 0 }
  }).filter(label => label.anchor)

  // Copies of each part's materials so highlighting one subsystem leaves the others alone.
  const glow = new THREE.Color('#ffcf28')
  const highlightable = {}
  for (const [name, group] of Object.entries(parts)) {
    highlightable[name] = []
    group.traverse(object => {
      if (!object.material) return
      // Material.clone() copies clipping planes, so point the copies back at the live section plane.
      const copy = material => {
        const clone = material.clone()
        if (material.clippingPlanes) clone.clippingPlanes = [sectionPlane]
        return clone
      }
      object.material = Array.isArray(object.material) ? object.material.map(copy) : copy(object.material)
      ;[].concat(object.material).forEach(m => m.emissive && highlightable[name].push(m))
    })
  }

  let width = 0
  let height = 0
  let yaw = -0.5
  let dragYaw = 0
  let touched = false
  let time = 0
  let lit = null
  const point = new THREE.Vector3()

  const layout = active => {
    const left = width * 0.27
    const right = width * 0.73
    for (const side of ['left', 'right']) {
      const column = labels.filter(label => label.side === side)
      for (const label of column) {
        label.anchor.getWorldPosition(point).project(camera)
        label.ax = (point.x * 0.5 + 0.5) * width
        label.ay = (-point.y * 0.5 + 0.5) * height
      }
      column.sort((a, b) => a.ay - b.ay)
      let cursor = 4
      for (const label of column) {
        label.y = Math.max(label.ay - 10, cursor)
        cursor = label.y + label.h + 12
      }
      let limit = height - 4
      for (let i = column.length - 1; i >= 0; i--) {
        const label = column[i]
        if (label.y + label.h > limit) label.y = limit - label.h
        limit = label.y - 12
      }
      for (const label of column) {
        const x = side === 'left' ? left - label.w : right
        label.el.style.transform = `translate3d(${x.toFixed(1)}px, ${label.y.toFixed(1)}px, 0)`
        const lineX = side === 'left' ? left + 6 : right - 6
        const lineY = label.y + 10
        label.line.setAttribute('x1', lineX.toFixed(1))
        label.line.setAttribute('y1', lineY.toFixed(1))
        label.line.setAttribute('x2', label.ax.toFixed(1))
        label.line.setAttribute('y2', label.ay.toFixed(1))
        label.dot.setAttribute('cx', label.ax.toFixed(1))
        label.dot.setAttribute('cy', label.ay.toFixed(1))
        const on = label.key === active
        label.line.classList.toggle('is-active', on)
        label.dot.classList.toggle('is-active', on)
      }
    }
  }

  const resize = () => {
    width = host.clientWidth
    height = host.clientHeight
    if (!width || !height) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Keep the satellite inside the middle ~40% so the callouts have room on both sides.
    const fit = Math.max(1.14 / 0.88, 0.5 / (0.4 * camera.aspect)) / (2 * Math.tan(THREE.MathUtils.degToRad(15)))
    camera.position.set(0, fit * 0.3, fit)
    camera.lookAt(0, -0.015, 0)
    camera.updateProjectionMatrix()
    labels.forEach(label => {
      label.w = label.el.offsetWidth
      label.h = label.el.offsetHeight
    })
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    if (!frame) frame = requestAnimationFrame(tick)
  }

  let frame = 0
  let last = 0
  let running = false
  const tick = now => {
    frame = 0
    const dt = last ? Math.min(now - last, 100) / 1000 : 1 / 60
    last = now
    const reduced = motion.matches
    if (!reduced) time += dt
    const sway = reduced || touched ? 0 : Math.sin(time * 0.35) * 0.22
    pivot.rotation.y = yaw + dragYaw + sway
    model.updateMatrixWorld(true)
    pivot.updateMatrixWorld(true)
    sectionPlane.copy(localPlane).applyMatrix4(model.matrixWorld)
    spinners.forEach((wheel, i) => { wheel.rotation.y = time * (2.2 + i * 0.7) })
    const active = stage.dataset.active || null
    if (active !== lit || active) {
      const pulse = 0.35 + 0.2 * Math.sin(time * 4)
      for (const [name, materials] of Object.entries(highlightable)) {
        const on = name === active
        for (const material of materials) {
          if (on) material.emissive.copy(glow)
          else material.emissive.setRGB(0, 0, 0)
          material.emissiveIntensity = on ? pulse : 0
        }
      }
      lit = active
    }
    renderer.render(scene, camera)
    layout(active)
    if (running) frame = requestAnimationFrame(tick)
  }

  const visibility = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting && !document.hidden
    if (running && !frame) {
      last = 0
      frame = requestAnimationFrame(tick)
    }
  })
  visibility.observe(stage)
  const resizer = new ResizeObserver(resize)
  resizer.observe(host)
  resize()

  // Drag sideways to turn it.
  let dragging = null
  const down = event => {
    dragging = { x: event.clientX, start: dragYaw }
    touched = true
    stage.setPointerCapture?.(event.pointerId)
  }
  const move = event => {
    if (!dragging) return
    dragYaw = THREE.MathUtils.clamp(dragging.start + (event.clientX - dragging.x) * 0.008, -1.1, 1.1)
    if (!running && !frame) frame = requestAnimationFrame(tick)
  }
  const up = () => { dragging = null }
  stage.addEventListener('pointerdown', down)
  stage.addEventListener('pointermove', move)
  stage.addEventListener('pointerup', up)
  stage.addEventListener('pointercancel', up)
  const lost = event => {
    event.preventDefault()
    running = false
    onFailure()
  }
  canvas.addEventListener('webglcontextlost', lost)

  return () => {
    running = false
    cancelAnimationFrame(frame)
    visibility.disconnect()
    resizer.disconnect()
    stage.removeEventListener('pointerdown', down)
    stage.removeEventListener('pointermove', move)
    stage.removeEventListener('pointerup', up)
    stage.removeEventListener('pointercancel', up)
    canvas.removeEventListener('webglcontextlost', lost)
    labels.forEach(label => { label.line.remove(); label.dot.remove() })
    const geometries = new Set()
    const materials = new Set()
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry)
      if (object.material) [].concat(object.material).forEach(material => materials.add(material))
    })
    geometries.forEach(geometry => geometry.dispose())
    materials.forEach(material => {
      material.map?.dispose()
      material.dispose()
    })
    environment.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}
