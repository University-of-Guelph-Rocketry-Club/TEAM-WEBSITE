import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

// 3U CubeSat (100 x 100 x 340.5 mm) at 0.003 units per mm: hard-anodised rails with the
// separation springs and deployment switches on the feet, solar panels on every side held on
// with M3 button heads, two hinged deployable wings on torsion springs, a UHF antenna deployer
// on top with four tape antennas, GPS patch, camera and sun sensor. `onStand` adds the
// remove-before-flight tag for when it's sat on the bench.
const W = 0.3
const H = 1.02
const RAIL = 0.0255
const PANEL_W = W - 2 * RAIL + 0.004
const PANEL_H = H - 0.05
const UP = new THREE.Vector3(0, 1, 0)

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  return texture
}

// Triple-junction cells (2 x 4) on a black PCB: cropped corners, busbars, grid fingers,
// interconnect tabs, the silkscreen outline, corner mounting holes and a sun sensor.
export function solarTexture() {
  const scale = 2800
  return canvasTexture(Math.round(PANEL_W * scale), Math.round(PANEL_H * scale), (ctx, w, h) => {
    ctx.fillStyle = '#121518'
    ctx.fillRect(0, 0, w, h)
    const margin = 0.007 * scale
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
        // The cell itself, with the slight purple-blue shift the coverglass gives it
        const gradient = ctx.createLinearGradient(x, y, x + cw, y + ch)
        gradient.addColorStop(0, '#1b3a7d')
        gradient.addColorStop(0.45, '#10265a')
        gradient.addColorStop(0.7, '#1a2f6e')
        gradient.addColorStop(1, '#241f5e')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x + crop, y)
        ctx.lineTo(x + cw, y)
        ctx.lineTo(x + cw, y + ch)
        ctx.lineTo(x, y + ch)
        ctx.lineTo(x, y + crop)
        ctx.closePath()
        ctx.fill()
        // Grid fingers
        ctx.strokeStyle = 'rgba(200, 212, 230, 0.42)'
        ctx.lineWidth = 1
        for (let f = y + 5; f < y + ch - 2; f += 5) {
          ctx.beginPath()
          ctx.moveTo(x + 3, f)
          ctx.lineTo(x + cw - 3, f)
          ctx.stroke()
        }
        // Two busbars down the cell and the top contact strip
        ctx.fillStyle = '#d2d9e2'
        ctx.fillRect(x + crop, y + 2, cw - crop - 2, 5)
        for (const bx of [0.3, 0.7]) ctx.fillRect(x + cw * bx - 2, y, 4, ch)
        // Interconnect tabs to the next cell
        ctx.fillStyle = '#e6e9ee'
        for (const tx of [0.3, 0.7]) ctx.fillRect(x + cw * tx - 7, y + ch - 1, 14, gap + 2)
        // Coverglass edge catch
        ctx.strokeStyle = 'rgba(255,255,255,0.18)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x + crop, y + 1)
        ctx.lineTo(x + cw - 1, y + 1)
        ctx.lineTo(x + cw - 1, y + ch - 1)
        ctx.stroke()
      }
    }
    // Silkscreen outline and labels
    ctx.strokeStyle = 'rgba(235, 238, 242, 0.55)'
    ctx.lineWidth = 2
    ctx.strokeRect(margin * 0.5, margin * 0.5, w - margin, h - margin)
    ctx.fillStyle = '#c8ccd0'
    ctx.font = `${0.011 * scale}px Saira, Arial, sans-serif`
    ctx.fillText('SP-3U  REV C', margin, 0.028 * scale)
    ctx.fillText('+Y', w - margin - 0.02 * scale, 0.028 * scale)
    // Corner mounting holes with their pads
    for (const [hx, hy] of [
      [margin * 0.9, margin * 0.9],
      [w - margin * 0.9, margin * 0.9],
      [margin * 0.9, h - margin * 0.9],
      [w - margin * 0.9, h - margin * 0.9]
    ]) {
      ctx.fillStyle = '#b8bec6'
      ctx.beginPath()
      ctx.arc(hx, hy, 0.0045 * scale, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#05070a'
      ctx.beginPath()
      ctx.arc(hx, hy, 0.0022 * scale, 0, Math.PI * 2)
      ctx.fill()
    }
    // Sun sensor and a temperature sensor at the top of the panel
    ctx.fillStyle = '#d6b25a'
    ctx.fillRect(w * 0.5 - 0.012 * scale, 0.013 * scale, 0.024 * scale, 0.024 * scale)
    ctx.fillStyle = '#05070a'
    ctx.fillRect(w * 0.5 - 0.008 * scale, 0.017 * scale, 0.016 * scale, 0.016 * scale)
    ctx.fillStyle = '#2b2b2b'
    ctx.fillRect(w * 0.72, 0.02 * scale, 0.006 * scale, 0.004 * scale)
    // Connector footprint along the bottom edge
    ctx.fillStyle = '#1e2126'
    ctx.fillRect(w * 0.35, h - margin * 0.9, w * 0.3, margin * 0.6)
    ctx.fillStyle = '#c9b56a'
    for (let i = 0; i < 8; i++)
      ctx.fillRect(w * 0.37 + (i * w * 0.26) / 8, h - margin * 0.8, 3, margin * 0.4)
  })
}

// The back of a deployable wing: bare substrate with the flex harness running down it.
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
    ctx.fillStyle = '#c48a2a'
    ctx.fillRect(w * 0.42, 30, 18, h - 60)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '14px Saira, Arial, sans-serif'
    ctx.fillText('DSA-3U  REV C', 16, 40)
  })
}

// Tape-measure antenna: a strip of beryllium copper with a curved cross-section, that curls up a
// little along its length the way the real ones do once they're out.
function tapeGeometry() {
  const along = 28
  const across = 8
  const radius = 0.03
  const positions = []
  const uvs = []
  const indices = []
  for (let i = 0; i <= along; i++) {
    const t = i / along
    for (let j = 0; j <= across; j++) {
      const a = (j / across - 0.5) * 1.0
      positions.push(t, 0.03 * t * t + radius * (1 - Math.cos(a)), radius * Math.sin(a))
      uvs.push(t, j / across)
    }
  }
  for (let i = 0; i < along; i++) {
    for (let j = 0; j < across; j++) {
      const a = i * (across + 1) + j
      const b = a + across + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

// Torsion spring around a hinge pin.
export function springGeometry(turns, length, radius, wire) {
  const points = []
  const steps = turns * 16
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * turns * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(a) * radius, (t - 0.5) * length, Math.sin(a) * radius))
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), steps * 2, wire, 6)
}

export function createStoryCubeSat(options = {}) {
  const object = new THREE.Group()
  const body = new THREE.Group()
  object.add(body)

  const standard = (color, metalness, roughness, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const anodised = standard('#6d737b', 0.85, 0.36)
  const bareAluminium = standard('#cfd4da', 1, 0.28)
  const blackAnodised = standard('#1f2329', 0.7, 0.45)
  const pcb = standard('#121518', 0.2, 0.5)
  const solar = new THREE.MeshPhysicalMaterial({
    map: solarTexture(),
    metalness: 0.3,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.4
  })
  const back = standard('#ffffff', 0.4, 0.55, { map: backTexture() })
  const edge = standard('#b7a86a', 0.1, 0.65)
  const tape = standard('#d8c58f', 0.85, 0.3, { side: THREE.DoubleSide })
  const delrin = standard('#efefea', 0, 0.55)
  const ceramic = standard('#cdb98a', 0.1, 0.5)
  const steel = standard('#b6bec7', 1, 0.25)
  const darkSteel = standard('#3a3f46', 0.9, 0.4)
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#0b1020',
    metalness: 0,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.02
  })
  const red = standard('#c8232c', 0.1, 0.6, { side: THREE.DoubleSide })

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
  // M3 button head screws, drawn in one instanced batch for the body (wings get their own, since
  // they move).
  const screwHead = new THREE.CylinderGeometry(0.0042, 0.0045, 0.0022, 14)
  const screwSocket = new THREE.CylinderGeometry(0.0016, 0.0016, 0.0008, 6)
  const screwSpots = []
  const screw = (position, normal) => screwSpots.push([position, normal])
  const placeScrews = parent => {
    const heads = new THREE.InstancedMesh(screwHead, steel, screwSpots.length)
    const sockets = new THREE.InstancedMesh(screwSocket, darkSteel, screwSpots.length)
    const matrix = new THREE.Matrix4()
    const quaternion = new THREE.Quaternion()
    const scratch = new THREE.Vector3()
    screwSpots.forEach(([position, normal], i) => {
      const n = new THREE.Vector3(...normal)
      quaternion.setFromUnitVectors(UP, n)
      scratch.set(...position).addScaledVector(n, 0.0011)
      matrix.compose(scratch, quaternion, new THREE.Vector3(1, 1, 1))
      heads.setMatrixAt(i, matrix)
      scratch.addScaledVector(n, 0.0011)
      matrix.compose(scratch, quaternion, new THREE.Vector3(1, 1, 1))
      sockets.setMatrixAt(i, matrix)
    })
    parent.add(heads, sockets)
  }
  const singleScrew = (parent, position, normal) => {
    const n = new THREE.Vector3(...normal)
    const head = mesh(screwHead, steel, parent, position)
    head.position.addScaledVector(n, 0.0011)
    head.quaternion.setFromUnitVectors(UP, n)
    const socket = mesh(screwSocket, darkSteel, parent, position)
    socket.position.addScaledVector(n, 0.0022)
    socket.quaternion.setFromUnitVectors(UP, n)
  }

  // A solar panel facing local +Z: cells on the front, substrate on the back, FR4 on the edges.
  const panelGeometry = new THREE.BoxGeometry(PANEL_W, PANEL_H, 0.006)
  const panel = (parent, position, rotation) =>
    mesh(panelGeometry, [edge, edge, edge, edge, solar, back], parent, position, rotation)
  const panelCorners = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1]
  ].map(([x, y]) => [x * (PANEL_W / 2 - 0.0065), y * (PANEL_H / 2 - 0.0065)])

  // ── Structure: four rails with their feet, the frame bars at each 1U boundary, the core ──
  const railGeometry = new RoundedBoxGeometry(RAIL, H, RAIL, 3, 0.003)
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const rx = (x * (W - RAIL)) / 2
      const rz = (z * (W - RAIL)) / 2
      mesh(railGeometry, anodised, body, [rx, 0, rz])
      // The rail feet are the only thing that touches the deployer: springs push off the
      // bottom pair of diagonal feet, switches sit on the other diagonal.
      for (const end of [-1, 1]) {
        const y = (end * H) / 2
        if (x === z) {
          mesh(new THREE.CylinderGeometry(0.0062, 0.0062, 0.004, 16), steel, body, [
            rx,
            y + end * 0.002,
            rz
          ])
          if (end < 0)
            mesh(springGeometry(4, 0.012, 0.004, 0.0007), steel, body, [rx, y - 0.009, rz])
        } else {
          mesh(new THREE.BoxGeometry(0.012, 0.004, 0.012), darkSteel, body, [
            rx,
            y + end * 0.002,
            rz
          ])
          mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.006, 12), steel, body, [
            rx,
            y + end * 0.006,
            rz
          ])
        }
      }
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
      // Screws through the rails into each bar end, on the outside faces
      for (const end of [-1, 1]) {
        const along = end * (W / 2 - RAIL / 2)
        if (rx) screw([Math.sign(x) * (W / 2), y, along], [Math.sign(x), 0, 0])
        else screw([along, y, Math.sign(z) * (W / 2)], [0, 0, Math.sign(z)])
      }
    }
  }
  mesh(new THREE.BoxGeometry(W - 0.03, H - 0.03, W - 0.03), blackAnodised, body)

  // ── Body-mounted panels on all four sides, each on four screws ──
  const offset = W / 2 - 0.001
  const sides = [
    [
      [0, 0, offset],
      [0, 0, 0],
      [0, 0, 1]
    ],
    [
      [0, 0, -offset],
      [0, Math.PI, 0],
      [0, 0, -1]
    ],
    [
      [offset, 0, 0],
      [0, Math.PI / 2, 0],
      [1, 0, 0]
    ],
    [
      [-offset, 0, 0],
      [0, -Math.PI / 2, 0],
      [-1, 0, 0]
    ]
  ]
  for (const [position, rotation, normal] of sides) {
    const side = panel(body, position, rotation)
    const face = new THREE.Vector3(...normal)
    for (const [cx, cy] of panelCorners) {
      const local = new THREE.Vector3(cx, cy, 0.003)
      side.localToWorld(local)
      screw([local.x, local.y, local.z], [face.x, face.y, face.z])
    }
  }
  // Access port on the -X panel: a cutout with the umbilical connector and a charge jack inside
  const port = mesh(new THREE.BoxGeometry(0.004, 0.05, 0.08), pcb, body, [
    -W / 2 - 0.0005,
    -H / 2 + 0.12,
    0
  ])
  mesh(new THREE.BoxGeometry(0.006, 0.018, 0.04), darkSteel, port, [-0.002, 0.008, -0.01])
  mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.006, 12),
    steel,
    port,
    [-0.003, -0.012, 0.02],
    [0, 0, Math.PI / 2]
  )

  // ── Top: antenna deployer, GPS patch, camera and sun sensor ──
  const top = mesh(new THREE.BoxGeometry(W - 0.035, 0.008, W - 0.035), pcb, body, [
    0,
    H / 2 - 0.004,
    0
  ])
  const deployer = mesh(new THREE.BoxGeometry(0.25, 0.034, 0.25), blackAnodised, top, [0, 0.021, 0])
  // Doors on the four sides of the deployer, each held by its burn wire posts
  for (const [x, z] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ]) {
    const door = mesh(
      new THREE.BoxGeometry(x ? 0.003 : 0.12, 0.024, z ? 0.003 : 0.12),
      bareAluminium,
      deployer,
      [x * 0.1265, 0, z * 0.1265]
    )
    for (const s of [-1, 1])
      mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.012, 10), delrin, door, [
        x ? 0 : s * 0.045,
        0.012,
        z ? 0 : s * 0.045
      ])
  }
  const patch = mesh(
    new THREE.BoxGeometry(0.07, 0.012, 0.07),
    ceramic,
    deployer,
    [-0.06, 0.023, -0.06]
  )
  mesh(new THREE.BoxGeometry(0.044, 0.002, 0.044), bareAluminium, patch, [0, 0.0065, 0])
  // Camera: a lens barrel with its glass, looking out the top
  const lens = mesh(
    new THREE.CylinderGeometry(0.016, 0.018, 0.02, 24),
    blackAnodised,
    deployer,
    [0.065, 0.027, 0.065]
  )
  mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.002, 24), glass, lens, [0, 0.011, 0])
  // Sun sensor: a little gold pyramid with a dark aperture
  const sun = mesh(
    new THREE.BoxGeometry(0.02, 0.008, 0.02),
    ceramic,
    deployer,
    [0.06, 0.021, -0.06]
  )
  mesh(new THREE.BoxGeometry(0.01, 0.002, 0.01), pcb, sun, [0, 0.005, 0])
  for (const [x, z] of [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ])
    screw([x * 0.11, H / 2 + 0.034, z * 0.11], [0, 1, 0])

  // ── Bottom: end plate with the screws, and the RBF tag if it's on the bench ──
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
    screw([x * 0.09, -H / 2, z * 0.09], [0, -1, 0])
  mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.002, 24), darkSteel, base, [0.06, -0.004, -0.04])
  if (options.onStand) {
    // The pin sticks out of the -X face; its local +y points outward and local -x hangs down.
    const pin = mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.03, 10),
      steel,
      body,
      [-W / 2 - 0.012, -H / 2 + 0.135, 0.02],
      [0, 0, Math.PI / 2]
    )
    mesh(new THREE.TorusGeometry(0.006, 0.0015, 6, 16), steel, pin, [0, 0.018, 0])
    const streamer = new THREE.BoxGeometry(0.09, 0.024, 0.0015)
    streamer.translate(-0.05, 0, 0)
    mesh(streamer, red, pin, [0, 0.018, 0])
  }

  // ── Deployable wings, hinged on the front edges with torsion springs ──
  const spring = springGeometry(6, 0.026, 0.009, 0.0009)
  const wings = [-1, 1].map(side => {
    const pivot = new THREE.Group()
    pivot.position.set(side * (W / 2 + 0.006), 0, W / 2 + 0.008)
    body.add(pivot)
    const reach = W / 2 + 0.008
    const leaf = new THREE.Group()
    leaf.position.x = side * reach
    pivot.add(leaf)
    const wing = panel(leaf, [0, 0, 0])
    for (const [cx, cy] of panelCorners) singleScrew(wing, [cx, cy, 0.003], [0, 0, 1])
    // Stiffener ribs on the back of the wing
    for (const x of [-0.08, 0.08])
      mesh(new THREE.BoxGeometry(0.012, PANEL_H - 0.04, 0.005), bareAluminium, leaf, [
        x,
        0,
        -0.0055
      ])
    for (const y of [-0.36, 0, 0.36]) {
      mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.05, 14), bareAluminium, pivot, [0, y, -0.002])
      mesh(spring, steel, pivot, [0, y, -0.002])
      mesh(new THREE.BoxGeometry(reach - PANEL_W / 2 + 0.01, 0.03, 0.004), bareAluminium, pivot, [
        (side * (reach - PANEL_W / 2)) / 2,
        y,
        -0.004
      ])
    }
    // Burn wire release lug at the tip, and the body side bracket it latched to
    mesh(new THREE.BoxGeometry(0.014, 0.03, 0.01), delrin, leaf, [
      side * (PANEL_W / 2 - 0.01),
      PANEL_H / 2 - 0.05,
      -0.008
    ])
    return { pivot, side, tip: anchor(leaf, [side * (PANEL_W / 2 - 0.03), -0.12, 0.004]) }
  })

  // ── Four tape antennas (UHF quarter-wave, ~17 cm), unrolling out of the deployer doors ──
  const tapeShape = tapeGeometry()
  const antennas = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ].map(([x, z]) => {
    const pivot = new THREE.Group()
    pivot.position.set(x * 0.128, H / 2 + 0.026, z * 0.128)
    pivot.rotation.y = Math.atan2(-z, x)
    body.add(pivot)
    const strip = new THREE.Mesh(tapeShape, tape)
    pivot.add(strip)
    return { pivot, strip }
  })
  const antennaTip = anchor(antennas[0].pivot, [0.5, 0, 0])

  placeScrews(body)

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
