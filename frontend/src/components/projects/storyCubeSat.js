import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

// 3U CubeSat (100 x 100 x 340.5 mm) at 0.003 units per mm: anodised rails, solar panels on every
// side, two hinged deployable wings, a UHF antenna module with four tape antennas, GPS patch on top.
const W = 0.3
const H = 1.02
const RAIL = 0.0255
const PANEL_W = W - 2 * RAIL + 0.004
const PANEL_H = H - 0.05

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

// Triple-junction cells (2 x 4) on a dark PCB, with cropped corners, busbars, fingers and a sun sensor.
export function solarTexture() {
  const scale = 1600
  return canvasTexture(Math.round(PANEL_W * scale), Math.round(PANEL_H * scale), (ctx, w, h) => {
    ctx.fillStyle = '#16191c'
    ctx.fillRect(0, 0, w, h)
    const margin = 0.006 * scale
    const top = 0.05 * scale
    const cols = 2
    const rows = 4
    const gap = 0.006 * scale
    const cw = (w - margin * 2 - gap) / cols
    const ch = (h - top - margin - gap * (rows - 1)) / rows
    const crop = 0.012 * scale
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = margin + c * (cw + gap)
        const y = top + r * (ch + gap)
        const gradient = ctx.createLinearGradient(x, y, x + cw, y + ch)
        gradient.addColorStop(0, '#1d3f86')
        gradient.addColorStop(0.5, '#132c63')
        gradient.addColorStop(1, '#1a3878')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x + crop, y)
        ctx.lineTo(x + cw, y)
        ctx.lineTo(x + cw, y + ch)
        ctx.lineTo(x, y + ch)
        ctx.lineTo(x, y + crop)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = 'rgba(190, 205, 225, 0.35)'
        ctx.lineWidth = 1
        for (let f = y + 6; f < y + ch - 2; f += 7) {
          ctx.beginPath()
          ctx.moveTo(x + 3, f)
          ctx.lineTo(x + cw - 3, f)
          ctx.stroke()
        }
        ctx.fillStyle = '#c9d2dc'
        ctx.fillRect(x + crop, y + 2, cw - crop - 2, 4)
        ctx.fillRect(x + cw * 0.5 - 1.5, y, 3, ch)
        ctx.fillStyle = '#e8e8e8'
        for (const tx of [0.25, 0.75]) ctx.fillRect(x + cw * tx - 5, y + ch, 10, gap)
      }
    }
    // Sun sensor and silkscreen at the top of the panel
    ctx.fillStyle = '#d6b25a'
    ctx.fillRect(w * 0.5 - 0.012 * scale, 0.014 * scale, 0.024 * scale, 0.024 * scale)
    ctx.fillStyle = '#05070a'
    ctx.fillRect(w * 0.5 - 0.008 * scale, 0.018 * scale, 0.016 * scale, 0.016 * scale)
    ctx.fillStyle = '#c8ccd0'
    ctx.font = `${0.011 * scale}px Saira, Arial, sans-serif`
    ctx.fillText('SP-3U', margin, 0.03 * scale)
  })
}

export function backTexture() {
  return canvasTexture(256, 820, (ctx, w, h) => {
    ctx.fillStyle = '#23272c'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    for (let y = 20; y < h; y += 40) {
      ctx.beginPath()
      ctx.moveTo(10, y)
      ctx.lineTo(w - 10, y)
      ctx.stroke()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '14px Saira, Arial, sans-serif'
    ctx.fillText('DSA-3U  REV C', 16, 40)
  })
}

export function createStoryCubeSat() {
  const object = new THREE.Group()
  const body = new THREE.Group()
  object.add(body)

  const standard = (color, metalness, roughness, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const anodised = standard('#858c95', 0.85, 0.38)
  const bareAluminium = standard('#cfd4da', 1, 0.28)
  const blackAnodised = standard('#1f2329', 0.7, 0.45)
  const pcb = standard('#121518', 0.2, 0.5)
  const solar = new THREE.MeshPhysicalMaterial({
    map: solarTexture(),
    metalness: 0.3,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.4
  })
  const back = standard('#ffffff', 0.4, 0.55, { map: backTexture() })
  const edge = standard('#3a3a2e', 0.1, 0.7)
  const tape = standard('#d4c79c', 0.75, 0.32, { side: THREE.DoubleSide })
  const delrin = standard('#efefea', 0, 0.55)
  const ceramic = standard('#cdb98a', 0.1, 0.5)
  const steel = standard('#b6bec7', 1, 0.25)

  const mesh = (geometry, material, parent, position = [0, 0, 0], rotation) => {
    const part = new THREE.Mesh(geometry, material)
    part.position.set(...position)
    if (rotation) part.rotation.set(...rotation)
    parent.add(part)
    return part
  }
  const anchor = (parent, position) => {
    const point = new THREE.Object3D()
    point.position.set(...position)
    parent.add(point)
    return point
  }
  // A solar panel facing local +Z: cells on the front, plain substrate on the back and edges.
  const panelGeometry = new THREE.BoxGeometry(PANEL_W, PANEL_H, 0.006)
  const panel = (parent, position, rotation) =>
    mesh(panelGeometry, [edge, edge, edge, edge, solar, back], parent, position, rotation)

  // Structure: four rails, end frames and the frame bars at each 1U boundary.
  const railGeometry = new RoundedBoxGeometry(RAIL, H, RAIL, 2, 0.0035)
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const rail = mesh(railGeometry, anodised, body, [
        (x * (W - RAIL)) / 2,
        0,
        (z * (W - RAIL)) / 2
      ])
      // Separation spring plungers and kill switch at the rail feet
      if (x === z)
        mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.012, 12), steel, rail, [
          0,
          -H / 2 - 0.004,
          0
        ])
      if (x === -z)
        mesh(new THREE.BoxGeometry(0.01, 0.01, 0.006), steel, rail, [0, -H / 2 - 0.003, 0])
    }
  }
  for (const y of [-H / 2 + 0.012, -H / 6, H / 6, H / 2 - 0.012]) {
    for (const [x, z, rx] of [
      [0, (W - RAIL) / 2, 0],
      [0, -(W - RAIL) / 2, 0],
      [(W - RAIL) / 2, 0, 1],
      [-(W - RAIL) / 2, 0, 1]
    ]) {
      mesh(
        new THREE.BoxGeometry(rx ? 0.012 : W - RAIL * 2, 0.012, rx ? W - RAIL * 2 : 0.012),
        bareAluminium,
        body,
        [x, y, z]
      )
    }
  }
  mesh(new THREE.BoxGeometry(W - 0.03, H - 0.03, W - 0.03), blackAnodised, body)

  // Body-mounted panels on all four sides
  const offset = W / 2 - 0.001
  panel(body, [0, 0, offset])
  panel(body, [0, 0, -offset], [0, Math.PI, 0])
  panel(body, [offset, 0, 0], [0, Math.PI / 2, 0])
  panel(body, [-offset, 0, 0], [0, -Math.PI / 2, 0])

  // Top: antenna deployment board with the GPS patch; bottom: end plate with screws.
  const top = mesh(new THREE.BoxGeometry(W - 0.035, 0.008, W - 0.035), pcb, body, [
    0,
    H / 2 - 0.004,
    0
  ])
  const patch = mesh(new THREE.BoxGeometry(0.08, 0.012, 0.08), ceramic, top, [0, 0.009, 0])
  mesh(new THREE.BoxGeometry(0.05, 0.002, 0.05), bareAluminium, patch, [0, 0.0065, 0])
  for (const [x, z] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ]) {
    mesh(new THREE.BoxGeometry(x ? 0.03 : 0.07, 0.014, z ? 0.03 : 0.07), delrin, top, [
      x * 0.1,
      0.009,
      z * 0.1
    ])
    mesh(new THREE.BoxGeometry(0.006, 0.004, 0.012), standard('#2b2b2b', 0.2, 0.4), top, [
      x * 0.07 + z * 0.03,
      0.006,
      z * 0.07 + x * 0.03
    ])
  }
  const base = mesh(new THREE.BoxGeometry(W - 0.035, 0.006, W - 0.035), blackAnodised, body, [
    0,
    -H / 2 + 0.003,
    0
  ])
  for (const [x, z] of [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ])
    mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.004, 12), steel, base, [
      x * 0.09,
      -0.004,
      z * 0.09
    ])

  // Deployable wings, hinged on the front edges. Folded, they lie flat over the side panels.
  const wings = [-1, 1].map(side => {
    const pivot = new THREE.Group()
    pivot.position.set(side * (W / 2 + 0.006), 0, W / 2 + 0.008)
    body.add(pivot)
    // Leaf centred on the side face when folded; hinge arms bridge the gap to the pivot.
    const reach = W / 2 + 0.008
    const leaf = new THREE.Group()
    leaf.position.x = side * reach
    pivot.add(leaf)
    panel(leaf, [0, 0, 0])
    for (const y of [-0.36, 0, 0.36]) {
      mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.05, 12), bareAluminium, pivot, [0, y, -0.002])
      mesh(new THREE.BoxGeometry(reach - PANEL_W / 2 + 0.01, 0.03, 0.004), bareAluminium, pivot, [
        (side * (reach - PANEL_W / 2)) / 2,
        y,
        -0.004
      ])
    }
    mesh(new THREE.BoxGeometry(0.014, 0.03, 0.01), delrin, leaf, [
      side * (PANEL_W / 2 - 0.01),
      PANEL_H / 2 - 0.05,
      -0.008
    ])
    return { pivot, side, tip: anchor(leaf, [side * (PANEL_W / 2 - 0.03), -0.12, 0.004]) }
  })

  // Four tape antennas (UHF quarter-wave, ~17 cm), unrolling out of the top board.
  const antennas = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ].map(([x, z]) => {
    const pivot = new THREE.Group()
    pivot.position.set(x * 0.115, H / 2 + 0.012, z * 0.115)
    pivot.rotation.y = Math.atan2(-z, x)
    body.add(pivot)
    const strip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 1, 10, 1, true, -0.5, 1),
      tape
    )
    strip.geometry.rotateZ(-Math.PI / 2)
    strip.geometry.translate(0.5, 0.012, 0)
    pivot.add(strip)
    return { pivot, strip }
  })
  const antennaTip = anchor(antennas[0].pivot, [0.5, 0, 0])

  const anchors = {
    'sat-wing': wings[1].tip,
    'sat-antenna': antennaTip,
    'sat-payload': anchor(body, [-W / 2, -H / 2 + 0.06, W / 2])
  }

  return {
    object,
    body,
    anchors,
    setDeploy(wingAmount, antennaAmount) {
      for (const wing of wings) wing.pivot.rotation.y = (wing.side * (1 - wingAmount) * Math.PI) / 2
      const length = 0.02 + antennaAmount * 0.55
      for (const antenna of antennas) {
        antenna.strip.scale.x = length
        antenna.strip.visible = antennaAmount > 0.001
      }
      antennaTip.position.x = length
    }
  }
}
