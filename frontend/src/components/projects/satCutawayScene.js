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
const BOARD = 0.27 // PC/104 footprint, ~90 mm
const PCB = 0.0048 // 1.6 mm
const PITCH = 0.00762 // 2.54 mm header pitch
const HOLE = 0.115 // stack mounting holes
const SECTION_COLOR = '#ff7a45'
const UP = new THREE.Vector3(0, 1, 0)

const standard = (color, metalness, roughness, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })

function seeded(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

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

// Board artwork: solder mask, copper pours, routed traces with vias, pad rows, silkscreen and plated holes.
function pcbTexture(seed, mask, label) {
  const rand = seeded(seed)
  return canvasTexture(1024, 1024, (ctx, size) => {
    const base = new THREE.Color(mask)
    const tint = amount => `#${base.clone().offsetHSL(0, 0, amount).getHexString()}`
    ctx.fillStyle = mask
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = tint(0.035)
    for (let i = 0; i < 6; i++)
      ctx.fillRect(rand() * size, rand() * size, 90 + rand() * 220, 70 + rand() * 170)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 0; i < 190; i++) {
      ctx.strokeStyle = tint(0.07 + rand() * 0.05)
      ctx.lineWidth = rand() < 0.12 ? 8 : 2.4 + rand() * 1.6
      let x = Math.round((rand() * size) / 8) * 8
      let y = Math.round((rand() * size) / 8) * 8
      ctx.beginPath()
      ctx.moveTo(x, y)
      const turns = 2 + Math.floor(rand() * 4)
      for (let k = 0; k < turns; k++) {
        const pick = rand()
        const length = 24 + rand() * 170
        const sign = rand() < 0.5 ? -1 : 1
        if (pick < 0.42) x += sign * length
        else if (pick < 0.84) y += sign * length
        else {
          x += sign * length * 0.6
          y += (rand() < 0.5 ? -1 : 1) * length * 0.6
        }
        ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.fillStyle = '#c9a65c'
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#121212'
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#d6b25e'
    for (let i = 0; i < 34; i++) {
      const x = rand() * (size - 80)
      const y = rand() * (size - 20)
      const count = 3 + Math.floor(rand() * 8)
      for (let k = 0; k < count; k++) ctx.fillRect(x + k * 9, y, 5, 10)
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.72)'
    ctx.fillStyle = 'rgba(255,255,255,0.78)'
    ctx.lineWidth = 2
    ctx.font = '600 17px Saira, Arial, sans-serif'
    const refs = ['U', 'C', 'R', 'L', 'J', 'Q', 'D', 'TP']
    for (let i = 0; i < 30; i++) {
      const x = 40 + rand() * (size - 140)
      const y = 40 + rand() * (size - 100)
      ctx.strokeRect(x, y, 24 + rand() * 70, 16 + rand() * 50)
      ctx.fillText(
        `${refs[Math.floor(rand() * refs.length)]}${1 + Math.floor(rand() * 48)}`,
        x,
        y - 5
      )
    }
    for (const hx of [size / 2 + (HOLE / BOARD) * size, size / 2 - (HOLE / BOARD) * size]) {
      for (const hy of [size / 2 + (HOLE / BOARD) * size, size / 2 - (HOLE / BOARD) * size]) {
        ctx.fillStyle = '#d4b05c'
        ctx.beginPath()
        ctx.arc(hx, hy, 27, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#0c0c0c'
        ctx.beginPath()
        ctx.arc(hx, hy, 13, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = '700 30px Saira, Arial, sans-serif'
    ctx.fillText(label, 150, size - 70)
    ctx.font = '500 20px Saira, Arial, sans-serif'
    ctx.fillText('GUELPH ROCKETRY CLUB', 150, size - 42)
    ctx.strokeStyle = tint(-0.06)
    ctx.lineWidth = 8
    ctx.strokeRect(4, 4, size - 8, size - 8)
  })
}

function stripeTexture(width, height, colors, count, vertical = true) {
  return canvasTexture(width, height, (ctx, w, h) => {
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = colors[i % colors.length]
      if (vertical) ctx.fillRect(0, Math.floor((i * h) / count), w, Math.ceil(h / count) + 1)
      else ctx.fillRect(Math.floor((i * w) / count), 0, Math.ceil(w / count) + 1, h)
    }
  })
}

// Enamelled copper winding: fine bands with a dark gap between turns. `across` runs the bands
// along u (for a torus) instead of v (for a rod).
function windingTexture(turns, across = false) {
  return canvasTexture(across ? 2048 : 16, across ? 16 : 1024, (ctx, w, h) => {
    const length = across ? w : h
    const band = length / turns
    for (let i = 0; i < turns; i++) {
      const start = i * band
      ctx.fillStyle = `hsl(24, 62%, ${46 + Math.sin(i * 1.7) * 6}%)`
      if (across) ctx.fillRect(start, 0, band * 0.8, h)
      else ctx.fillRect(0, start, w, band * 0.8)
      ctx.fillStyle = 'hsl(22, 55%, 22%)'
      if (across) ctx.fillRect(start + band * 0.8, 0, band * 0.2 + 0.5, h)
      else ctx.fillRect(0, start + band * 0.8, w, band * 0.2 + 0.5)
    }
  })
}

// Etched serpentine heater trace on amber polyimide.
function heaterTexture() {
  return canvasTexture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#c9781f'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#ecaa5c'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(10, 14)
    for (let x = 10; x < w - 20; x += 22) {
      ctx.lineTo(x, h - 14)
      ctx.lineTo(x + 11, h - 14)
      ctx.lineTo(x + 11, 14)
      ctx.lineTo(x + 22, 14)
    }
    ctx.stroke()
  })
}

function perforatedTexture() {
  return canvasTexture(256, 256, (ctx, w) => {
    ctx.fillStyle = '#c8ced5'
    ctx.fillRect(0, 0, w, w)
    ctx.fillStyle = '#6d747c'
    for (let x = 12; x < w; x += 18) {
      for (let y = 12; y < w; y += 18) {
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  })
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
  const curve = points => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const cable = (parent, points, radius, material, segments = 64) =>
    mesh(new THREE.TubeGeometry(curve(points), segments, radius, 10), material, parent)
  // Two insulated wires twisted around each other along a path.
  const twisted = (parent, points, radius, colors, turns = 14) => {
    const path = curve(points)
    const frames = path.computeFrenetFrames(160, false)
    colors.forEach((color, w) => {
      const along = []
      for (let i = 0; i <= 160; i++) {
        const angle = (i / 160) * turns * Math.PI * 2 + w * Math.PI
        along.push(
          path
            .getPointAt(i / 160)
            .addScaledVector(frames.normals[i], Math.cos(angle) * radius)
            .addScaledVector(frames.binormals[i], Math.sin(angle) * radius)
        )
      }
      mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(along), 320, radius * 0.95, 8),
        standard(color, 0.1, 0.45),
        parent
      )
    })
  }
  // Flat ribbon, flex or braid swept along a path.
  const ribbon = (parent, points, width, material, thickness = 0.0012) => {
    const shape = new THREE.Shape()
    shape.moveTo(-thickness / 2, -width / 2)
    shape.lineTo(thickness / 2, -width / 2)
    shape.lineTo(thickness / 2, width / 2)
    shape.lineTo(-thickness / 2, width / 2)
    shape.closePath()
    return mesh(
      new THREE.ExtrudeGeometry(shape, {
        steps: 80,
        bevelEnabled: false,
        extrudePath: curve(points)
      }),
      material,
      parent
    )
  }

  // Instanced batches for the hundreds of pins, passives and screws.
  const batchMaterials = {
    pin: () => standard('#d3d8de', 1, 0.3),
    gold: () => standard('#d8b25a', 1, 0.28),
    mlcc: () => standard('#b89a6a', 0.1, 0.55),
    end: () => standard('#d5d9dd', 1, 0.3),
    res: () => standard('#1c1c1e', 0.2, 0.5),
    hole: () => standard('#050505', 0, 1),
    screw: () => standard('#b9c1ca', 1, 0.25)
  }
  const batches = (parent, clipped = false) => {
    const lists = {}
    const euler = new THREE.Euler()
    const rotation = new THREE.Quaternion()
    return {
      add(kind, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) {
        rotation.setFromEuler(euler.set(rx, ry, rz))
        ;(lists[kind] ||= []).push(
          new THREE.Matrix4().compose(
            new THREE.Vector3(x, y, z),
            rotation,
            new THREE.Vector3(sx, sy, sz)
          )
        )
      },
      finish() {
        for (const [kind, matrices] of Object.entries(lists)) {
          const material = batchMaterials[kind]()
          if (clipped) clip(material)
          const geometry =
            kind === 'screw'
              ? new THREE.CylinderGeometry(0.5, 0.5, 1, 14)
              : new THREE.BoxGeometry(1, 1, 1)
          const instanced = new THREE.InstancedMesh(geometry, material, matrices.length)
          matrices.forEach((m, i) => instanced.setMatrixAt(i, m))
          parent.add(instanced)
        }
      }
    }
  }

  // ── Board kit ─────────────────────────────────────────────────────────────
  const createBoard = (parent, y, mask, seed, label) => {
    const group = new THREE.Group()
    group.position.y = y
    parent.add(group)
    const top = new THREE.MeshStandardMaterial({
      map: pcbTexture(seed, mask, label),
      roughness: 0.4,
      metalness: 0.12
    })
    const edge = standard('#cdbf86', 0.25, 0.55)
    mesh(new THREE.BoxGeometry(BOARD, PCB, BOARD), [edge, edge, top, top, edge, edge], group)
    const reserved = [[-0.135, -0.088, -0.115, 0.115]]
    for (const x of [-HOLE, HOLE])
      for (const z of [-HOLE, HOLE]) reserved.push([x - 0.016, x + 0.016, z - 0.016, z + 0.016])
    return {
      group,
      top: PCB / 2,
      rand: seeded(seed * 13 + 5),
      parts: batches(group),
      reserve(x, z, w, d) {
        reserved.push([x - w / 2, x + w / 2, z - d / 2, z + d / 2])
      },
      free(x, z, w, d) {
        return !reserved.some(
          ([x0, x1, z0, z1]) => x + w / 2 > x0 && x - w / 2 < x1 && z + d / 2 > z0 && z - d / 2 < z1
        )
      }
    }
  }
  // Gull-wing packages: square QFPs and two-sided SOIC/TSOPs.
  const qfp = (b, x, z, size, perSide) => {
    b.reserve(x, z, size + 0.012, size + 0.012)
    const body = mesh(
      new RoundedBoxGeometry(size, 0.0019, size, 1, 0.0005),
      standard('#18191c', 0.25, 0.42),
      b.group,
      [x, b.top + 0.0011, z]
    )
    mesh(
      new THREE.CylinderGeometry(size * 0.06, size * 0.06, 0.0003, 12),
      standard('#2f3135', 0.2, 0.6),
      body,
      [-size * 0.36, 0.001, -size * 0.36]
    )
    const pitch = (size * 0.84) / perSide
    for (let i = 0; i < perSide; i++) {
      const o = (i - (perSide - 1) / 2) * pitch
      b.parts.add('pin', x + size / 2 + 0.0016, b.top + 0.0004, z + o, 0.0032, 0.0006, pitch * 0.5)
      b.parts.add('pin', x - size / 2 - 0.0016, b.top + 0.0004, z + o, 0.0032, 0.0006, pitch * 0.5)
      b.parts.add('pin', x + o, b.top + 0.0004, z + size / 2 + 0.0016, pitch * 0.5, 0.0006, 0.0032)
      b.parts.add('pin', x + o, b.top + 0.0004, z - size / 2 - 0.0016, pitch * 0.5, 0.0006, 0.0032)
    }
  }
  const dualRow = (b, x, z, length, width, perSide, alongX = false) => {
    const [sx, sz] = alongX ? [length, width] : [width, length]
    b.reserve(x, z, sx + 0.008, sz + 0.008)
    mesh(
      new RoundedBoxGeometry(sx, 0.0017, sz, 1, 0.0004),
      standard('#18191c', 0.25, 0.45),
      b.group,
      [x, b.top + 0.001, z]
    )
    const pitch = (length * 0.84) / perSide
    for (let i = 0; i < perSide; i++) {
      const o = (i - (perSide - 1) / 2) * pitch
      for (const s of [-1, 1]) {
        if (alongX)
          b.parts.add(
            'pin',
            x + o,
            b.top + 0.0004,
            z + s * (width / 2 + 0.0015),
            pitch * 0.5,
            0.0006,
            0.003
          )
        else
          b.parts.add(
            'pin',
            x + s * (width / 2 + 0.0015),
            b.top + 0.0004,
            z + o,
            0.003,
            0.0006,
            pitch * 0.5
          )
      }
    }
  }
  const qfn = (b, x, z, size) => {
    b.reserve(x, z, size + 0.004, size + 0.004)
    mesh(new THREE.BoxGeometry(size, 0.0012, size), standard('#1d1e21', 0.25, 0.45), b.group, [
      x,
      b.top + 0.0006,
      z
    ])
  }
  // 0603/0805 capacitors and resistors wherever there's room.
  const passives = (b, count) => {
    let placed = 0
    for (let tries = 0; placed < count && tries < count * 12; tries++) {
      const length = b.rand() < 0.3 ? 0.006 : 0.0048
      const width = length * 0.5
      const turn = b.rand() < 0.5
      const x = -0.08 + b.rand() * 0.205
      const z = -0.125 + b.rand() * 0.25
      const [w, d] = turn ? [length, width] : [width, length]
      if (!b.free(x, z, w, d)) continue
      b.reserve(x, z, w + 0.001, d + 0.001)
      const resistor = b.rand() < 0.35
      const h = resistor ? 0.0012 : 0.0018
      b.parts.add(
        resistor ? 'res' : 'mlcc',
        x,
        b.top + h / 2,
        z,
        turn ? length * 0.62 : width,
        h,
        turn ? width : length * 0.62
      )
      for (const s of [-1, 1]) {
        if (turn)
          b.parts.add(
            'end',
            x + s * length * 0.4,
            b.top + h / 2,
            z,
            length * 0.2,
            h + 0.0002,
            width
          )
        else
          b.parts.add(
            'end',
            x,
            b.top + h / 2,
            z + s * length * 0.4,
            width,
            h + 0.0002,
            length * 0.2
          )
      }
      placed++
    }
  }
  const header = (b, x, z, rows, cols, height) => {
    b.reserve(x, z, rows * PITCH, cols * PITCH)
    mesh(
      new THREE.BoxGeometry(rows * PITCH, height, cols * PITCH),
      standard('#141517', 0.1, 0.55),
      b.group,
      [x, b.top + height / 2, z]
    )
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++)
        b.parts.add(
          'gold',
          x + (r - (rows - 1) / 2) * PITCH,
          b.top + height + 0.003,
          z + (c - (cols - 1) / 2) * PITCH,
          0.0019,
          0.006,
          0.0019
        )
    }
  }
  const smallConnector = (b, x, z, pins) => {
    const length = pins * 0.0036 + 0.004
    b.reserve(x, z, length, 0.012)
    const body = mesh(
      new THREE.BoxGeometry(length, 0.009, 0.012),
      standard('#f1f0ea', 0.05, 0.6),
      b.group,
      [x, b.top + 0.0045, z]
    )
    mesh(
      new THREE.BoxGeometry(length - 0.004, 0.006, 0.004),
      standard('#2c2c2a', 0.1, 0.7),
      body,
      [0, 0.001, 0.004]
    )
  }
  const inductor = (b, x, z, size) => {
    b.reserve(x, z, size, size)
    const body = mesh(
      new RoundedBoxGeometry(size, size * 0.55, size, 2, size * 0.08),
      standard('#3c4046', 0.35, 0.55),
      b.group,
      [x, b.top + size * 0.275, z]
    )
    mesh(
      new THREE.CylinderGeometry(size * 0.18, size * 0.18, 0.0004, 16),
      standard('#e8e8e8', 0, 0.6),
      body,
      [size * 0.22, size * 0.276, size * 0.22]
    )
  }
  const electrolytic = (b, x, z, radius, height) => {
    b.reserve(x, z, radius * 2.2, radius * 2.2)
    mesh(
      new THREE.BoxGeometry(radius * 2.1, 0.0015, radius * 2.1),
      standard('#1c1c1c', 0.1, 0.6),
      b.group,
      [x, b.top + 0.00075, z]
    )
    const can = mesh(
      new THREE.CylinderGeometry(radius, radius, height, 24),
      standard('#cdd2d8', 0.9, 0.28),
      b.group,
      [x, b.top + 0.0015 + height / 2, z]
    )
    mesh(
      new THREE.CylinderGeometry(
        radius * 1.004,
        radius * 1.004,
        height * 0.92,
        24,
        1,
        true,
        0,
        1.2
      ),
      standard('#1d2e64', 0.2, 0.5),
      can
    )
    mesh(new THREE.BoxGeometry(radius * 1.2, 0.0003, 0.0006), standard('#5c636b', 0.8, 0.4), can, [
      0,
      height / 2,
      0
    ])
  }
  const dpak = (b, x, z) => {
    b.reserve(x, z, 0.022, 0.026)
    mesh(new THREE.BoxGeometry(0.02, 0.0007, 0.016), standard('#d1d6dc', 1, 0.3), b.group, [
      x,
      b.top + 0.00035,
      z - 0.003
    ])
    mesh(
      new RoundedBoxGeometry(0.019, 0.0072, 0.015, 1, 0.0006),
      standard('#18191c', 0.25, 0.45),
      b.group,
      [x, b.top + 0.0036, z]
    )
    for (const o of [-0.0068, 0.0068])
      b.parts.add('pin', x + o, b.top + 0.0006, z + 0.0105, 0.0022, 0.0008, 0.007)
  }
  const crystal = (b, x, z) => {
    b.reserve(x, z, 0.035, 0.016)
    mesh(
      new RoundedBoxGeometry(0.033, 0.011, 0.013, 2, 0.005),
      standard('#d4d9df', 1, 0.24),
      b.group,
      [x, b.top + 0.0055, z]
    )
  }
  const sma = (parent, position, direction) => {
    const unit = new THREE.Group()
    unit.position.set(...position)
    unit.quaternion.setFromUnitVectors(UP, new THREE.Vector3(...direction).normalize())
    parent.add(unit)
    const gold = standard('#d8b25a', 1, 0.26)
    mesh(new THREE.BoxGeometry(0.019, 0.004, 0.019), gold, unit)
    mesh(new THREE.CylinderGeometry(0.0095, 0.0095, 0.006, 6), gold, unit, [0, 0.005, 0])
    mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.016, 20), gold, unit, [0, 0.016, 0])
    mesh(
      new THREE.CylinderGeometry(0.0022, 0.0022, 0.004, 10),
      standard('#f2f2ee', 0, 0.5),
      unit,
      [0, 0.025, 0]
    )
  }
  // PC/104 stack connector (H1 + H2, 4 x 26 at 2.54 mm): socket body up to the next board, pin tails below.
  const stackConnector = (b, height, socketTop) => {
    const x = -0.108
    mesh(
      new THREE.BoxGeometry(4 * PITCH, height, 26 * PITCH),
      standard('#121315', 0.1, 0.55),
      b.group,
      [x, b.top + height / 2, 0]
    )
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 26; c++) {
        const px = x + (r - 1.5) * PITCH
        const pz = (c - 12.5) * PITCH
        b.parts.add('pin', px, -PCB / 2 - 0.0016, pz, 0.0016, 0.0032, 0.0016)
        if (socketTop) b.parts.add('hole', px, b.top + height + 0.0002, pz, 0.0022, 0.0004, 0.0022)
      }
    }
  }
  const standoffs = (parent, y0, y1) => {
    const material = standard('#c3cad2', 1, 0.3)
    for (const x of [-HOLE, HOLE]) {
      for (const z of [-HOLE, HOLE])
        mesh(new THREE.CylinderGeometry(0.0072, 0.0072, y1 - y0 - PCB, 6), material, parent, [
          x,
          (y0 + y1) / 2,
          z
        ])
    }
  }
  const nuts = (parent, y) => {
    for (const x of [-HOLE, HOLE]) {
      for (const z of [-HOLE, HOLE]) {
        mesh(
          new THREE.CylinderGeometry(0.0078, 0.0078, 0.0045, 6),
          standard('#c3cad2', 1, 0.3),
          parent,
          [x, y, z]
        )
        mesh(
          new THREE.CylinderGeometry(0.0034, 0.0034, 0.0048, 12),
          standard('#9aa2ab', 1, 0.35),
          parent,
          [x, y + 0.0004, z]
        )
      }
    }
  }

  // ── Structure: rails, frame and side panels, all cut by the section plane ──
  const structure = part('structure')
  const railMaterial = clip(standard('#858c95', 0.85, 0.38))
  const frameMaterial = clip(standard('#cdd3da', 1, 0.3))
  for (const x of [-1, 1]) {
    for (const z of [-1, 1])
      mesh(new RoundedBoxGeometry(RAIL, H, RAIL, 2, 0.0035), railMaterial, structure, [
        (x * (W - RAIL)) / 2,
        0,
        (z * (W - RAIL)) / 2
      ])
  }
  const sectionMaterial = standard(SECTION_COLOR, 0.1, 0.6)
  for (const y of [-H / 2 + 0.012, -H / 6, H / 6, H / 2 - 0.012]) {
    for (const z of [-1, 1])
      mesh(new THREE.BoxGeometry(W - RAIL * 2, 0.012, 0.012), frameMaterial, structure, [
        0,
        y,
        (z * (W - RAIL)) / 2
      ])
    for (const x of [-1, 1]) {
      mesh(new THREE.BoxGeometry(0.012, 0.012, W - RAIL * 2), frameMaterial, structure, [
        (x * (W - RAIL)) / 2,
        y,
        0
      ])
      mesh(new THREE.BoxGeometry(0.013, 0.013, 0.0025), sectionMaterial, structure, [
        (x * (W - RAIL)) / 2,
        y,
        0.001
      ])
    }
  }
  const solar = clip(
    new THREE.MeshPhysicalMaterial({
      map: solarTexture(),
      metalness: 0.3,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.4
    })
  )
  const panelBack = clip(standard('#ffffff', 0.4, 0.55, { map: backTexture() }))
  const panelEdge = clip(standard('#3a3a2e', 0.1, 0.7))
  const panel = (height, position, rotation) =>
    mesh(
      new THREE.BoxGeometry(PANEL_W, height, 0.006),
      [panelEdge, panelEdge, panelEdge, panelEdge, solar, panelBack],
      structure,
      position,
      rotation
    )
  const offset = W / 2 - 0.001
  panel(PANEL_H, [0, 0, offset])
  panel(PANEL_H, [offset, 0, 0], [0, Math.PI / 2, 0])
  panel(PANEL_H, [-offset, 0, 0], [0, -Math.PI / 2, 0])
  panel(PANEL_H * 0.62, [0, PANEL_H * 0.19, -offset], [0, Math.PI, 0])
  mesh(
    new THREE.BoxGeometry(W - 0.035, 0.006, W - 0.035),
    clip(standard('#1f2329', 0.7, 0.45)),
    structure,
    [0, -H / 2 + 0.003, 0]
  )
  for (const x of [-1, 1])
    mesh(new THREE.BoxGeometry(0.008, PANEL_H, 0.0025), sectionMaterial, structure, [
      x * offset,
      0,
      0.001
    ])
  mesh(new THREE.BoxGeometry(W - 0.035, 0.008, 0.0025), sectionMaterial, structure, [
    0,
    -H / 2 + 0.003,
    0.001
  ])
  // Countersunk screws holding the panels to the rails
  const screws = batches(structure, true)
  for (const y of [-0.42, -0.14, 0.14, 0.42]) {
    for (const s of [-1, 1]) {
      const along = s * (W / 2 - RAIL / 2)
      screws.add('screw', W / 2 + 0.0035, y, along, 0.009, 0.002, 0.009, 0, 0, Math.PI / 2)
      screws.add('screw', -W / 2 - 0.0035, y, along, 0.009, 0.002, 0.009, 0, 0, Math.PI / 2)
      screws.add('screw', along, y, W / 2 + 0.0035, 0.009, 0.002, 0.009, Math.PI / 2)
      screws.add('screw', along, y, -W / 2 - 0.0035, 0.009, 0.002, 0.009, Math.PI / 2)
    }
  }
  screws.finish()
  anchor('structure', structure, [-(W - RAIL) / 2, 0.3, -(W - RAIL) / 2])
  anchor('solar', structure, [W / 2 + 0.004, 0.18, -0.07])

  // ── Power: battery pack and power board, with harnesses from the solar panels ──
  const power = part('power')
  const battery = createBoard(power, 0.245, '#16181b', 41, 'BAT 2S2P')
  const cellWrap = new THREE.MeshStandardMaterial({
    map: stripeTexture(
      8,
      256,
      [
        '#2f64c8',
        '#2f64c8',
        '#2f64c8',
        '#2f64c8',
        '#2f64c8',
        '#2f64c8',
        '#2f64c8',
        '#2f64c8',
        '#2f64c8',
        '#e9eef5',
        '#2f64c8',
        '#2f64c8'
      ],
      12
    ),
    metalness: 0.25,
    roughness: 0.38
  })
  const nickel = standard('#d8dce0', 1, 0.32)
  const shift = 0.015
  for (const y of [0.027, 0.082]) {
    for (const z of [-0.048, 0.048]) {
      const cell = mesh(
        new THREE.CylinderGeometry(0.027, 0.027, 0.195, 40),
        cellWrap,
        battery.group,
        [shift, y, z],
        [0, 0, Math.PI / 2]
      )
      mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.004, 20), nickel, cell, [0, 0.0995, 0])
    }
  }
  // Spot-welded nickel strips: across each layer at one end, up each column at the other
  for (const y of [0.027, 0.082])
    mesh(new THREE.BoxGeometry(0.0015, 0.018, 0.112), nickel, battery.group, [shift + 0.0998, y, 0])
  for (const z of [-0.048, 0.048])
    mesh(new THREE.BoxGeometry(0.0015, 0.072, 0.018), nickel, battery.group, [
      shift - 0.0998,
      0.0545,
      z
    ])
  const welds = batches(battery.group)
  for (const end of [-1, 1]) {
    for (const y of [0.027, 0.082]) {
      for (const z of [-0.048, 0.048]) {
        for (const d of [-0.004, 0.004])
          welds.add('end', shift + end * 0.1008, y + d, z + d, 0.0012, 0.0022, 0.0022)
      }
    }
  }
  welds.finish()
  for (const end of [-1, 1]) {
    const holder = mesh(
      new THREE.BoxGeometry(0.008, 0.118, 0.16),
      standard('#15161a', 0.1, 0.6),
      battery.group,
      [shift + end * 0.104, 0.058, 0]
    )
    for (const z of [-0.06, 0.06])
      mesh(
        new THREE.CylinderGeometry(0.0045, 0.0045, 0.0085, 12),
        standard('#b9c1ca', 1, 0.3),
        holder,
        [0, 0.055, z],
        [0, 0, Math.PI / 2]
      )
  }
  // Kapton tape bands around the pack
  for (const x of [-0.045, 0.075]) {
    for (const [y, h, z, d] of [
      [0.0005, 0.001, 0, 0.152],
      [0.1095, 0.001, 0, 0.152],
      [0.0545, 0.11, 0.0765, 0.001],
      [0.0545, 0.11, -0.0765, 0.001]
    ]) {
      mesh(new THREE.BoxGeometry(0.018, h, d), standard('#c9822a', 0.2, 0.35), battery.group, [
        x,
        y + PCB / 2,
        z
      ])
    }
  }
  mesh(
    new THREE.SphereGeometry(0.003, 10, 8),
    standard('#2a2a2a', 0.2, 0.5),
    battery.group,
    [0.05, 0.0545, 0]
  )
  cable(
    battery.group,
    [
      [0.05, 0.0545, 0.0],
      [0.07, 0.05, 0.03],
      [0.1, 0.03, 0.08],
      [0.11, 0.005, 0.11]
    ],
    0.0011,
    standard('#e4e4e4', 0.1, 0.5)
  )
  stackConnector(battery, 0.12 - PCB, false)
  battery.parts.finish()
  standoffs(power, 0.245, 0.365)
  nuts(power, 0.245 - PCB / 2 - 0.0024)

  const eps = createBoard(power, 0.365, '#16181b', 37, 'EPS REV B')
  stackConnector(eps, 0.045 - PCB, false)
  for (let i = 0; i < 4; i++) inductor(eps, -0.05 + i * 0.04, 0.06, 0.022)
  for (let i = 0; i < 3; i++) dpak(eps, -0.05 + i * 0.035, 0.0)
  for (let i = 0; i < 3; i++) electrolytic(eps, 0.1, -0.07 + i * 0.03, 0.0075, 0.017)
  qfp(eps, 0.04, -0.07, 0.024, 12)
  dualRow(eps, -0.03, -0.075, 0.016, 0.01, 4)
  smallConnector(eps, -0.06, 0.1, 2)
  smallConnector(eps, -0.02, 0.118, 2)
  smallConnector(eps, 0.1, 0.112, 4)
  passives(eps, 140)
  eps.parts.finish()
  standoffs(power, 0.365, 0.41)
  // Battery leads, twisted pair up to the power board
  twisted(
    power,
    [
      [0.11, 0.252, 0.112],
      [0.124, 0.29, 0.122],
      [0.125, 0.34, 0.118],
      [0.104, 0.374, 0.112]
    ],
    0.0024,
    ['#c62828', '#121212'],
    9
  )
  // Solar panel harnesses from the left and back panels, plugged into the panels' inner faces
  twisted(
    power,
    [
      [-0.138, 0.3, -0.06],
      [-0.126, 0.33, -0.02],
      [-0.112, 0.374, 0.06],
      [-0.06, 0.374, 0.1]
    ],
    0.0016,
    ['#e94a3f', '#202020'],
    12
  )
  twisted(
    power,
    [
      [0.04, 0.3, -0.139],
      [0.1, 0.31, -0.133],
      [0.134, 0.33, -0.08],
      [0.134, 0.37, 0.05],
      [-0.02, 0.377, 0.118]
    ],
    0.0016,
    ['#f2b134', '#202020'],
    16
  )
  for (const [x, y, z, ry] of [
    [-0.141, 0.3, -0.06, Math.PI / 2],
    [0.04, 0.3, -0.141, 0]
  ]) {
    const plug = mesh(
      new THREE.BoxGeometry(0.018, 0.009, 0.008),
      standard('#f1f0ea', 0.05, 0.6),
      power,
      [x, y, z],
      [0, ry, 0]
    )
    mesh(
      new THREE.BoxGeometry(0.014, 0.004, 0.0085),
      standard('#2c2c2a', 0.1, 0.7),
      plug,
      [0, 0.003, 0]
    )
  }
  anchor('power', power, [0.1, 0.33, 0.07])

  // ── Flight computer ──
  const computer = part('computer')
  const obc = createBoard(computer, 0.41, '#0e5a3a', 23, 'OBC V2')
  stackConnector(obc, 0.045 - PCB, false)
  qfp(obc, -0.02, 0.03, 0.06, 36)
  dualRow(obc, 0.06, 0.06, 0.054, 0.034, 27, true)
  dualRow(obc, 0.065, 0.005, 0.016, 0.01, 4)
  dualRow(obc, 0.065, -0.025, 0.016, 0.01, 4)
  crystal(obc, -0.02, -0.03)
  const sd = mesh(
    new THREE.BoxGeometry(0.036, 0.005, 0.04),
    standard('#cfd5db', 1, 0.3),
    obc.group,
    [0.08, PCB / 2 + 0.0025, -0.085]
  )
  mesh(new THREE.BoxGeometry(0.03, 0.0006, 0.03), standard('#9aa1a8', 1, 0.4), sd, [0, 0.0028, 0])
  obc.reserve(0.08, -0.085, 0.04, 0.044)
  header(obc, -0.035, -0.095, 2, 5, 0.0085)
  for (const [x, color] of [
    [0.02, '#ff3b30'],
    [0.028, '#34c759'],
    [0.036, '#ffcc00']
  ]) {
    mesh(new THREE.BoxGeometry(0.004, 0.0015, 0.0025), standard(color, 0.1, 0.4), obc.group, [
      x,
      PCB / 2 + 0.00075,
      0.11
    ])
  }
  passives(obc, 170)
  obc.parts.finish()
  standoffs(computer, 0.41, 0.455)
  // Ribbon cable down the corner to the attitude board
  const ribbonMap = stripeTexture(256, 8, ['#c8c8c8', '#b8b8b8', '#cfcfcf', '#b2b2b2'], 16, false)
  ribbonMap.wrapS = THREE.RepeatWrapping
  ribbon(
    computer,
    [
      [0.12, 0.414, 0.1],
      [0.137, 0.39, 0.112],
      [0.138, 0.3, 0.116],
      [0.138, 0.15, 0.116],
      [0.132, 0.06, 0.112],
      [0.112, 0.06, 0.1]
    ],
    0.02,
    new THREE.MeshStandardMaterial({ map: ribbonMap, roughness: 0.6, side: THREE.DoubleSide })
  )
  anchor('computer', computer, [-0.02, 0.418, 0.03])

  // ── Radio: UHF transceiver under a perforated shield, coax up to the antenna deployer ──
  const radio = part('radio')
  const uhf = createBoard(radio, 0.455, '#174a8c', 11, 'UHF TRX')
  stackConnector(uhf, 0.009, true)
  uhf.reserve(0.03, -0.01, 0.13, 0.1)
  const shieldSide = standard('#c3c9d0', 1, 0.3)
  const shieldTop = standard('#ffffff', 1, 0.3, { map: perforatedTexture() })
  const shield = mesh(
    new THREE.BoxGeometry(0.12, 0.018, 0.09),
    [shieldSide, shieldSide, shieldTop, shieldTop, shieldSide, shieldSide],
    uhf.group,
    [0.03, PCB / 2 + 0.009, -0.01]
  )
  mesh(
    new THREE.BoxGeometry(0.002, 0.0185, 0.088),
    standard('#aab2bb', 1, 0.3),
    shield,
    [0.01, 0, 0]
  )
  qfn(uhf, -0.05, 0.07, 0.016)
  qfn(uhf, -0.02, 0.085, 0.01)
  crystal(uhf, -0.045, 0.035)
  passives(uhf, 120)
  uhf.parts.finish()
  sma(radio, [0.124, 0.455 + PCB / 2 + 0.002, 0.07], [1, 0, 0])
  cable(
    radio,
    [
      [0.15, 0.459, 0.07],
      [0.165, 0.47, 0.06],
      [0.15, 0.488, 0.035],
      [0.11, 0.499, 0.02]
    ],
    0.0028,
    standard('#18191c', 0.25, 0.55)
  )
  standoffs(radio, 0.455, 0.497)
  const deployer = createBoard(radio, 0.497, '#121518', 59, 'ANT DEPLOY')
  for (const [x, z] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ]) {
    const housing = mesh(
      new THREE.BoxGeometry(x ? 0.03 : 0.08, 0.016, z ? 0.03 : 0.08),
      standard('#ecece6', 0, 0.55),
      deployer.group,
      [x * 0.1, PCB / 2 + 0.008, z * 0.1]
    )
    mesh(
      new THREE.CylinderGeometry(0.011, 0.011, 0.012, 24),
      standard('#cdbd8f', 0.8, 0.35),
      housing,
      [0, 0.003, 0]
    )
    mesh(
      new THREE.BoxGeometry(0.006, 0.003, 0.012),
      standard('#26282b', 0.2, 0.4),
      deployer.group,
      [x * 0.07 + z * 0.03, PCB / 2 + 0.0015, z * 0.07 + x * 0.03]
    )
    cable(
      deployer.group,
      [
        [x * 0.07 + z * 0.03, PCB / 2 + 0.003, z * 0.07 + x * 0.03],
        [x * 0.085, PCB / 2 + 0.012, z * 0.085],
        [x * 0.1, PCB / 2 + 0.016, z * 0.1]
      ],
      0.0006,
      standard('#f5f5f0', 0, 0.6),
      16
    )
  }
  const gps = mesh(
    new THREE.BoxGeometry(0.07, 0.01, 0.07),
    standard('#cdb98a', 0.1, 0.5),
    deployer.group,
    [0, PCB / 2 + 0.005, 0]
  )
  mesh(
    new THREE.BoxGeometry(0.045, 0.0015, 0.045),
    standard('#cfd4da', 1, 0.3),
    gps,
    [0, 0.0055, 0]
  )
  mesh(
    new THREE.CylinderGeometry(0.002, 0.002, 0.003, 10),
    standard('#d8b25a', 1, 0.3),
    gps,
    [0.008, 0.007, 0.008]
  )
  deployer.parts.finish()
  nuts(radio, 0.497 + PCB / 2 + 0.0024)
  anchor('radio', radio, [0.07, 0.476, 0.03])

  // ── Attitude control ──
  const attitude = part('attitude')
  const adcs = createBoard(attitude, 0.05, '#13325e', 53, 'ADCS')
  qfp(adcs, -0.07, -0.06, 0.03, 16)
  qfn(adcs, -0.03, -0.09, 0.009)
  qfn(adcs, -0.012, -0.09, 0.012)
  for (let i = 0; i < 3; i++) dualRow(adcs, 0.02 + i * 0.028, -0.1, 0.016, 0.01, 4)
  for (let i = 0; i < 3; i++) smallConnector(adcs, 0.105, -0.05 + i * 0.03, 3)
  passives(adcs, 90)
  adcs.parts.finish()
  // Air-core torquer coil on the board, held down with cable ties
  mesh(
    new THREE.TorusGeometry(0.106, 0.0055, 14, 180),
    standard('#ffffff', 0.9, 0.35, { map: windingTexture(220, true) }),
    attitude,
    [0, 0.058, 0],
    [Math.PI / 2, 0, 0]
  )
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2
    mesh(
      new THREE.TorusGeometry(0.0066, 0.0012, 6, 16),
      standard('#161616', 0.1, 0.6),
      attitude,
      [Math.cos(a) * 0.106, 0.058, Math.sin(a) * 0.106],
      [0, -a, 0]
    )
  }
  // Reaction wheel: machined housing with a quarter cut away, motor stator, spoked flywheel.
  const flywheelWeb = (() => {
    const shape = new THREE.Shape()
    shape.absarc(0, 0, 0.029, 0, Math.PI * 2, false)
    const hub = new THREE.Path()
    hub.absarc(0, 0, 0.0055, 0, Math.PI * 2, true)
    shape.holes.push(hub)
    for (let i = 0; i < 6; i++) {
      const lightening = new THREE.Path()
      const a = (i / 6) * Math.PI * 2
      lightening.absarc(Math.cos(a) * 0.0175, Math.sin(a) * 0.0175, 0.0058, 0, Math.PI * 2, true)
      shape.holes.push(lightening)
    }
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.0028,
      bevelEnabled: false,
      curveSegments: 24
    })
    geometry.rotateX(-Math.PI / 2)
    return geometry
  })()
  const lathe = (profile, segments = 64, start = 0, length = Math.PI * 2) =>
    new THREE.LatheGeometry(
      profile.map(([x, y]) => new THREE.Vector2(x, y)),
      segments,
      start,
      length
    )
  const reactionWheel = (position, rotation, gapAt) => {
    const unit = new THREE.Group()
    unit.position.set(...position)
    unit.rotation.set(...rotation)
    attitude.add(unit)
    const housing = standard('#2b3038', 0.8, 0.36, { side: THREE.DoubleSide })
    mesh(
      new RoundedBoxGeometry(0.092, 0.004, 0.092, 1, 0.003),
      standard('#9aa3ad', 1, 0.32),
      unit,
      [0, -0.019, 0]
    )
    for (const x of [-1, 1])
      for (const z of [-1, 1])
        mesh(
          new THREE.CylinderGeometry(0.0034, 0.0034, 0.0022, 12),
          standard('#c8ced5', 1, 0.25),
          unit,
          [x * 0.038, -0.0162, z * 0.038]
        )
    const start = gapAt + Math.PI / 4
    const wall = Math.PI * 1.5
    mesh(
      lathe(
        [
          [0.0405, -0.017],
          [0.043, -0.017],
          [0.043, 0.012],
          [0.0415, 0.0145],
          [0.0405, 0.0145],
          [0.0405, -0.017]
        ],
        64,
        start,
        wall
      ),
      housing,
      unit
    )
    mesh(
      lathe(
        [
          [0.013, 0.0145],
          [0.0415, 0.0145],
          [0.0415, 0.0175],
          [0.013, 0.0175],
          [0.013, 0.0145]
        ],
        64,
        start,
        wall
      ),
      housing,
      unit
    )
    mesh(
      new THREE.CylinderGeometry(0.0125, 0.0125, 0.006, 32),
      standard('#b9c1ca', 1, 0.28),
      unit,
      [0, 0.016, 0]
    )
    mesh(
      new THREE.CylinderGeometry(0.0432, 0.0432, 0.012, 64, 1, true, start + 0.4, 0.9),
      standard('#f2f2ee', 0, 0.55),
      unit,
      [0, -0.002, 0]
    )
    // Stator: twelve wound teeth around the bearing post
    mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.026, 16),
      standard('#cfd5db', 1, 0.25),
      unit,
      [0, -0.004, 0]
    )
    mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.007, 24),
      standard('#5d646c', 0.9, 0.35),
      unit,
      [0, -0.012, 0]
    )
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      mesh(
        new THREE.BoxGeometry(0.0085, 0.006, 0.0045),
        standard('#b87333', 1, 0.38),
        unit,
        [Math.cos(a) * 0.0125, -0.012, Math.sin(a) * 0.0125],
        [0, -a, 0]
      )
    }
    const flywheel = new THREE.Group()
    unit.add(flywheel)
    const steel = standard('#d0d5db', 1, 0.22)
    mesh(
      lathe([
        [0.029, -0.006],
        [0.0375, -0.006],
        [0.0375, 0.008],
        [0.029, 0.008],
        [0.029, -0.006]
      ]),
      steel,
      flywheel
    )
    mesh(flywheelWeb, steel, flywheel, [0, -0.0014, 0])
    mesh(new THREE.CylinderGeometry(0.0062, 0.0062, 0.012, 24), steel, flywheel)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      mesh(
        new THREE.CylinderGeometry(0.0014, 0.0014, 0.0015, 8),
        standard('#2a2c30', 0.4, 0.5),
        flywheel,
        [Math.cos(a) * 0.0333, 0.0083, Math.sin(a) * 0.0333]
      )
    }
    spinners.push(flywheel)
  }
  reactionWheel([0.045, 0.087, 0.045], [0, 0, 0], 0)
  reactionWheel([-0.06, 0.14, 0.052], [0, 0, Math.PI / 2], 0)
  reactionWheel([0.062, 0.15, -0.058], [Math.PI / 2, 0, 0], Math.PI / 2)
  // Motor leads to the board connectors
  const lead = standard('#2a2a2a', 0.2, 0.5)
  for (const [from, to] of [
    [
      [0.06, 0.068, 0.09],
      [0.105, 0.064, -0.05]
    ],
    [
      [-0.04, 0.12, 0.096],
      [0.105, 0.064, -0.02]
    ],
    [
      [0.1, 0.12, -0.04],
      [0.105, 0.064, 0.01]
    ]
  ]) {
    cable(
      attitude,
      [
        from,
        [(from[0] + to[0]) / 2 + 0.02, (from[1] + to[1]) / 2 + 0.012, (from[2] + to[2]) / 2],
        to
      ],
      0.0016,
      lead,
      32
    )
  }
  // Wound torque rods with end caps and saddle clamps
  const rodTexture = windingTexture(260)
  const torqueRod = (position, rotation) => {
    const unit = new THREE.Group()
    unit.position.set(...position)
    unit.rotation.set(...rotation)
    attitude.add(unit)
    mesh(
      new THREE.CylinderGeometry(0.0088, 0.0088, 0.15, 28),
      standard('#ffffff', 0.9, 0.35, { map: rodTexture }),
      unit
    )
    for (const end of [-1, 1]) {
      mesh(
        new THREE.CylinderGeometry(0.0102, 0.0102, 0.014, 24),
        standard('#16171a', 0.2, 0.5),
        unit,
        [0, end * 0.082, 0]
      )
      mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.005, 10), standard('#c8ced5', 1, 0.3), unit, [
        0,
        end * 0.091,
        0
      ])
      mesh(
        new THREE.TorusGeometry(0.0098, 0.0018, 8, 20, Math.PI),
        standard('#b9c1ca', 1, 0.3),
        unit,
        [0, end * 0.055, 0],
        [Math.PI / 2, 0, Math.PI]
      )
    }
    cable(
      unit,
      [
        [0, 0.09, 0],
        [0.006, 0.1, 0.004],
        [0.012, 0.11, 0.01]
      ],
      0.0009,
      standard('#b03030', 0.2, 0.5),
      12
    )
  }
  torqueRod([0, 0.206, -0.1], [0, 0, Math.PI / 2])
  torqueRod([-0.105, 0.206, 0], [Math.PI / 2, 0, 0])
  for (const x of [-HOLE, HOLE])
    for (const z of [-HOLE, HOLE])
      mesh(
        new THREE.CylinderGeometry(0.0055, 0.0055, 0.17, 6),
        standard('#c3cad2', 1, 0.3),
        attitude,
        [x, 0.135, z]
      )
  anchor('attitude', attitude, [-0.045, 0.165, 0.09])

  // ── Experiment: payload board and the sealed biology payload pod in gold insulation ──
  const payload = part('payload')
  const payloadBoard = createBoard(payload, -0.035, '#0e5a3a', 67, 'PAYLOAD')
  qfp(payloadBoard, 0.03, 0.04, 0.026, 12)
  dualRow(payloadBoard, -0.03, 0.06, 0.02, 0.01, 4)
  dualRow(payloadBoard, -0.03, 0.03, 0.02, 0.01, 4)
  smallConnector(payloadBoard, -0.02, -0.08, 8)
  smallConnector(payloadBoard, 0.1, 0.09, 6)
  passives(payloadBoard, 90)
  payloadBoard.parts.finish()
  // Gold MLI blanket: foil with sharp random creases. A handful of waves at random frequencies and
  // phases (so nothing lines up into a weave), folded so the ridges are sharp, on a coarse mesh with
  // flat shading so it breaks into facets like real crinkled foil.
  const podAround = 96
  const podRows = 44
  const podGeometry = new THREE.CylinderGeometry(0.105, 0.105, 0.33, podAround, podRows)
  const podPosition = podGeometry.attributes.position
  const foilRand = seeded(91)
  const waves = Array.from({ length: 12 }, () => [
    1 + Math.floor(foilRand() * 9),
    (foilRand() - 0.5) * 160,
    foilRand() * Math.PI * 2,
    0.3 + foilRand() * 0.7
  ])
  // The side vertices come first, row by row, with the seam vertex repeated at the end of each
  // row. Jitter them around the surface (same amount for both seam copies) so the facets aren't a
  // neat grid. The end rows stay put because the clamp rings sit over them.
  const sideCount = (podAround + 1) * (podRows + 1)
  const jitter = Array.from({ length: sideCount }, () => [foilRand() - 0.5, foilRand() - 0.5])
  for (let i = 0; i < podPosition.count; i++) {
    const x = podPosition.getX(i)
    let y = podPosition.getY(i)
    const z = podPosition.getZ(i)
    if (Math.hypot(x, z) < 0.104) continue
    let a = Math.atan2(z, x)
    let bump = 0
    if (i < sideCount) {
      const row = Math.floor(i / (podAround + 1))
      const col = i % (podAround + 1) === podAround ? 0 : i % (podAround + 1)
      const [ja, jy] = jitter[row * (podAround + 1) + col]
      if (row > 0 && row < podRows) {
        a += (ja * 0.9 * Math.PI * 2) / podAround
        y += (jy * 0.9 * 0.33) / podRows
      }
      bump = (ja + jy) * 0.0028
    }
    let d = 0
    for (const [fa, fy, phase, amp] of waves) d += amp * Math.sin(fa * a + fy * y + phase)
    d /= 6
    const r = 0.105 * (1 + 0.03 * d - 0.02 * Math.abs(d)) + bump
    podPosition.setXYZ(i, Math.cos(a) * r, y + 0.004 * d, Math.sin(a) * r)
  }
  podGeometry.computeVertexNormals()
  mesh(
    podGeometry,
    standard('#e1a83e', 1, 0.22, { flatShading: true, envMapIntensity: 1.3 }),
    payload,
    [0, -0.24, 0]
  )
  mesh(
    new THREE.CylinderGeometry(0.1078, 0.1078, 0.33, 48, 1, true, 2.2, 0.12),
    standard('#d7dbe0', 1, 0.35, { side: THREE.DoubleSide }),
    payload,
    [0, -0.24, 0]
  )
  for (const y of [-0.072, -0.408]) {
    mesh(
      new THREE.CylinderGeometry(0.109, 0.109, 0.012, 72),
      standard('#c3c9d0', 1, 0.3),
      payload,
      [0, y, 0]
    )
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      mesh(
        new THREE.CylinderGeometry(0.0034, 0.0034, 0.003, 12),
        standard('#b9c1ca', 1, 0.25),
        payload,
        [Math.cos(a) * 0.098, y + (y > -0.2 ? 0.0075 : -0.0075), Math.sin(a) * 0.098]
      )
    }
  }
  const connector = mesh(
    new THREE.CylinderGeometry(0.019, 0.019, 0.02, 32),
    standard('#c9cfd6', 1, 0.28),
    payload,
    [0.04, -0.056, 0.02]
  )
  mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.004, 6),
    standard('#b0b7bf', 1, 0.3),
    connector,
    [0, -0.006, 0]
  )
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2
    mesh(
      new THREE.CylinderGeometry(0.0016, 0.0016, 0.004, 8),
      standard('#d6ad4f', 1, 0.3),
      connector,
      [Math.cos(a) * 0.011, 0.011, Math.sin(a) * 0.011]
    )
  }
  ribbon(
    payload,
    [
      [0.04, -0.045, 0.03],
      [0.06, -0.03, 0.06],
      [0.085, -0.025, 0.08],
      [0.1, -0.023, 0.09]
    ],
    0.012,
    standard('#c6862a', 0.3, 0.45, { side: THREE.DoubleSide }),
    0.0008
  )
  for (const [x, y, z] of [
    [0.074, -0.12, 0.074],
    [-0.1, -0.26, 0.02]
  ])
    mesh(new THREE.SphereGeometry(0.0035, 10, 8), standard('#1d1d1d', 0.2, 0.6), payload, [x, y, z])
  anchor('payload', payload, [0.076, -0.21, 0.076])

  // ── Thermal: serpentine heaters, a braided copper strap to the radiator on the back wall ──
  const thermal = part('thermal')
  const heaterMap = heaterTexture()
  heaterMap.wrapS = THREE.RepeatWrapping
  heaterMap.repeat.set(2, 1)
  for (const y of [-0.15, -0.32]) {
    mesh(
      new THREE.CylinderGeometry(0.1115, 0.1115, 0.05, 120, 1, true, -0.3, Math.PI * 1.3),
      standard('#ffffff', 0.2, 0.4, { map: heaterMap, side: THREE.DoubleSide }),
      thermal,
      [0, y, 0]
    )
    cable(
      thermal,
      [
        [Math.sin(-0.3) * 0.112, y + 0.02, Math.cos(-0.3) * 0.112],
        [-0.06, y + 0.06, 0.1],
        [-0.02, -0.04, 0.08]
      ],
      0.0009,
      standard('#e0e0e0', 0.1, 0.5),
      24
    )
  }
  const braidMap = stripeTexture(64, 64, ['#c98a52', '#9c5e2e', '#d79a63', '#a8693a'], 16, false)
  braidMap.wrapS = braidMap.wrapT = THREE.RepeatWrapping
  braidMap.repeat.set(30, 2)
  ribbon(
    thermal,
    [
      [-0.07, -0.078, -0.07],
      [-0.09, -0.11, -0.1],
      [-0.07, -0.18, -0.128],
      [-0.03, -0.22, -0.139]
    ],
    0.016,
    new THREE.MeshStandardMaterial({
      map: braidMap,
      metalness: 1,
      roughness: 0.42,
      side: THREE.DoubleSide
    }),
    0.003
  )
  for (const [x, y, z] of [
    [-0.07, -0.076, -0.07],
    [-0.03, -0.22, -0.138]
  ]) {
    mesh(new THREE.BoxGeometry(0.02, 0.003, 0.02), standard('#c27a43', 1, 0.35), thermal, [x, y, z])
    mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.004, 12),
      standard('#b9c1ca', 1, 0.25),
      thermal,
      [x, y + 0.002, z]
    )
  }
  mesh(
    new THREE.BoxGeometry(0.11, 0.08, 0.006),
    standard('#c27a43', 1, 0.4),
    thermal,
    [-0.02, -0.22, -0.143]
  )
  const radiator = mesh(
    new THREE.BoxGeometry(PANEL_W, PANEL_H * 0.36, 0.006),
    standard('#f1f3f5', 0.05, 0.5),
    thermal,
    [0, -PANEL_H * 0.31, -offset]
  )
  for (let i = 0; i < 7; i++)
    mesh(
      new THREE.BoxGeometry(PANEL_W - 0.02, 0.004, 0.003),
      standard('#c9ced4', 0.6, 0.4),
      radiator,
      [0, (i - 3) * 0.045, -0.004]
    )
  anchor('thermal', thermal, [-0.098, -0.15, 0.06])

  // ── Deorbit: a drag sail cassette at the bottom end ──
  const deorbit = part('deorbit')
  const cassette = mesh(
    new RoundedBoxGeometry(0.255, 0.035, 0.255, 2, 0.003),
    standard('#aeb6bf', 1, 0.32),
    deorbit,
    [0, -0.487, 0]
  )
  mesh(
    new THREE.BoxGeometry(0.2, 0.0015, 0.2),
    standard('#5b636c', 0.8, 0.4),
    cassette,
    [0, 0.018, 0]
  )
  for (const x of [-1, 1])
    mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.2, 12),
      standard('#d6ad4f', 1, 0.3),
      cassette,
      [x * 0.1, 0.02, 0],
      [Math.PI / 2, 0, 0]
    )
  for (const x of [-1, 1])
    for (const z of [-1, 1])
      mesh(
        new THREE.CylinderGeometry(0.0035, 0.0035, 0.003, 12),
        standard('#c8ced5', 1, 0.25),
        cassette,
        [x * 0.11, 0.0185, z * 0.11]
      )
  mesh(
    new THREE.BoxGeometry(0.012, 0.004, 0.006),
    standard('#26282b', 0.2, 0.4),
    cassette,
    [0.06, 0.0195, 0.09]
  )
  anchor('deorbit', deorbit, [0.1, -0.47, 0.1])

  return { model, parts, anchors, spinners }
}

// Renders the cutaway and lays out the callout labels (DOM) and leader lines (SVG) around it.
export function mountSatCutaway(stage, onFailure) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
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
  const labels = [...stage.querySelectorAll('[data-part]')]
    .map(el => {
      const line = document.createElementNS(ns, 'line')
      const dot = document.createElementNS(ns, 'circle')
      dot.setAttribute('r', '3.5')
      svg.append(line, dot)
      return {
        el,
        line,
        dot,
        key: el.dataset.key,
        side: el.dataset.side,
        anchor: anchors[el.dataset.part],
        w: 0,
        h: 0
      }
    })
    .filter(label => label.anchor)

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
      object.material = Array.isArray(object.material)
        ? object.material.map(copy)
        : copy(object.material)
      ;[].concat(object.material).forEach(m => m.emissive && highlightable[name].push(m))
    })
  }

  let width = 0
  let height = 0
  // Face the open side toward the camera; the sway never lets the right panel cover the inside.
  const yaw = -0.3
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

  let frame = 0
  let last = 0
  let running = false
  const resize = () => {
    width = host.clientWidth
    height = host.clientHeight
    if (!width || !height) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Keep the satellite inside the middle ~40% so the callouts have room on both sides.
    const fit =
      Math.max(1.14 / 0.88, 0.5 / (0.4 * camera.aspect)) /
      (2 * Math.tan(THREE.MathUtils.degToRad(15)))
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

  const tick = now => {
    frame = 0
    const dt = last ? Math.min(now - last, 100) / 1000 : 1 / 60
    last = now
    const reduced = motion.matches
    if (!reduced) time += dt
    const sway = reduced || touched ? 0 : Math.sin(time * 0.35) * 0.15
    pivot.rotation.y = yaw + dragYaw + sway
    pivot.updateMatrixWorld(true)
    sectionPlane.copy(localPlane).applyMatrix4(model.matrixWorld)
    spinners.forEach((wheel, i) => {
      wheel.rotation.y = time * (2.2 + i * 0.7)
    })
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
    dragYaw = THREE.MathUtils.clamp(
      dragging.start + (event.clientX - dragging.x) * 0.008,
      -0.9,
      1.2
    )
    if (!running && !frame) frame = requestAnimationFrame(tick)
  }
  const up = () => {
    dragging = null
  }
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
    labels.forEach(label => {
      label.line.remove()
      label.dot.remove()
    })
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
