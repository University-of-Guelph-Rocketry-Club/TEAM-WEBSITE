import * as THREE from 'three'

// Modelled on our solid rocket (4 in airframe, about 18.5 calibers long): red ogive nose cone
// with an aluminium tip, parachute bay with the red bow tie and club logo, av bay with the black
// switch band, booster with "GUELPH ROCKETRY" down the side, and four red-and-white chevron fins.
// It's a dual-deploy rocket, so pulled apart you get the main chute under the nose cone, the
// drogue between the av bay and the booster, and the shock cords tying it all together.
const D = 0.18
const R = D / 2
const BOTTOM = -1.665
const BOOSTER_TOP = 0.025
const AV_TOP = 0.241
const UPPER_TOP = 1.051
const TIP = 1.665
const NOSE_LENGTH = TIP - UPPER_TOP
const CIRCUMFERENCE = Math.PI * D
const TEXTURE_WIDTH = 1280
const PX = TEXTURE_WIDTH / CIRCUMFERENCE // texture pixels per unit, the same along and around the tube
const FIN = { root: 0.432, span: 0.216, tip: 0.063, sweep: 0.288, thickness: 0.008 }
const FIN_TOP = BOTTOM + FIN.root
const AROUND = 128 // radial segments on the airframe
const UP = new THREE.Vector3(0, 1, 0)

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  const paint = () => {
    ctx.save()
    draw(ctx, width, height)
    ctx.restore()
    texture.needsUpdate = true
  }
  paint()
  return { texture, paint }
}

// Draws a decal at the front (u = 0.5) and the back (wrapping across u = 0 / 1).
const aroundBody = (width, drawAt) => [width / 2, 0, width].forEach(drawAt)

// Fine fibreglass weave as a tiling normal map. Barely there, but it gives the clearcoat
// highlights the texture of a real layup instead of a perfect cylinder.
function weaveNormalTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(size, size)
  const height = (x, y) => {
    const u = ((x % size) + size) % size
    const v = ((y % size) + size) % size
    const cell = 16
    const over = (Math.floor(u / cell) + Math.floor(v / cell)) % 2 === 0
    const fx = (u % cell) / cell
    const fy = (v % cell) / cell
    return over ? Math.sin(fx * Math.PI) * 0.6 + 0.4 : Math.sin(fy * Math.PI) * 0.6 + 0.4
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = height(x + 1, y) - height(x - 1, y)
      const dy = height(x, y + 1) - height(x, y - 1)
      const i = (y * size + x) * 4
      image.data[i] = 128 - dx * 60
      image.data[i + 1] = 128 - dy * 60
      image.data[i + 2] = 255
      image.data[i + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 8
  return texture
}

// Parachute gores: alternating colours with a stitched seam between each one.
function goreTexture(colors, count) {
  return canvasTexture(2048, 64, (ctx, w, h) => {
    const gore = w / count
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(Math.floor(i * gore), 0, Math.ceil(gore) + 1, h)
    }
    ctx.strokeStyle = 'rgba(40, 30, 30, 0.45)'
    ctx.lineWidth = 3
    ctx.setLineDash([6, 4])
    for (let i = 0; i < count; i++) {
      ctx.beginPath()
      ctx.moveTo(i * gore, 0)
      ctx.lineTo(i * gore, h)
      ctx.stroke()
    }
  }).texture
}

function radialTexture(stops) {
  return canvasTexture(128, 128, (ctx, w) => {
    const gradient = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, w)
  }).texture
}

// The sticker on the motor case: reads along the case, like the real certification labels.
function motorLabelTexture() {
  return canvasTexture(256, 640, (ctx, w, h) => {
    ctx.fillStyle = '#f4f1e6'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#c8102e'
    ctx.fillRect(0, 0, w, 54)
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, h - 40, w, 40)
    for (let x = 0; x < w; x += 24) {
      ctx.fillStyle = '#f2c230'
      ctx.fillRect(x, h - 40, 12, 40)
    }
    ctx.save()
    ctx.translate(w / 2, h / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#1a1a1a'
    ctx.font = '700 72px Saira, Arial, sans-serif'
    ctx.fillText('98 mm RELOAD', 0, -40)
    ctx.font = '500 34px Saira, Arial, sans-serif'
    ctx.fillText('EXAMPLE MOTOR  ·  SOLID PROPELLANT', 0, 30)
    ctx.font = '500 26px Saira, Arial, sans-serif'
    ctx.fillStyle = '#5a5a5a'
    ctx.fillText('KEEP AWAY FROM HEAT AND FLAME', 0, 70)
    ctx.restore()
  }).texture
}

// The decal on the real rocket is a wide sans; Saira at its expanded width (the site's own
// heading face) matches it. Older canvases without fontStretch get a horizontal stretch instead.
function wideText(ctx, text, length, size) {
  ctx.font = `700 ${size}px Saira, Arial, sans-serif`
  const native = 'fontStretch' in ctx
  if (native) ctx.fontStretch = 'expanded'
  const stretch = native ? 1 : 1.3
  const widths = [...text].map(ch => ctx.measureText(ch).width * stretch)
  const gap = (length - widths.reduce((a, b) => a + b, 0)) / (text.length - 1)
  let x = -length / 2
  ;[...text].forEach((ch, i) => {
    ctx.save()
    ctx.translate(x + widths[i] / 2, 0)
    ctx.scale(stretch, 1)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
    x += widths[i] + gap
  })
}

// A sponsor decal down each side of the parachute bay (u = 0.25 and 0.75), reading tail to nose.
// With no text it shows a dashed "your name here" box.
function drawDecal(ctx, cx, text) {
  const length = 0.56 * PX
  ctx.save()
  ctx.translate(cx, 0.42 * PX)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const setFont = size => {
    ctx.font = `700 ${size}px Saira, Arial, sans-serif`
    if ('fontStretch' in ctx) ctx.fontStretch = 'expanded'
  }
  if (text) {
    let size = 0.064 * PX
    setFont(size)
    const width = ctx.measureText(text).width
    if (width > length) setFont((size *= length / width))
    ctx.fillStyle = '#1c1c1e'
    ctx.fillText(text, 0, 0)
  } else {
    ctx.setLineDash([24, 16])
    ctx.lineWidth = 8
    ctx.strokeStyle = '#7b8189'
    ctx.strokeRect(-length / 2, -0.045 * PX, length, 0.09 * PX)
    setFont(0.04 * PX)
    ctx.fillStyle = '#7b8189'
    ctx.fillText('YOUR NAME HERE', 0, 0)
  }
  ctx.restore()
}

// Small screw heads painted into the livery where the real hardware is.
function screwHeads(ctx, points, radius) {
  for (const [x, y] of points) {
    ctx.fillStyle = '#9ea3aa'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#4b5057'
    ctx.lineWidth = Math.max(1, radius * 0.22)
    ctx.beginPath()
    ctx.moveTo(x - radius * 0.6, y)
    ctx.lineTo(x + radius * 0.6, y)
    ctx.stroke()
  }
}

function liveries(options) {
  const white = '#f3f3ef'
  const logo = new Image()
  const upper = canvasTexture(TEXTURE_WIDTH, Math.round((UPPER_TOP - AV_TOP) * PX), (ctx, w, h) => {
    ctx.fillStyle = white
    ctx.fillRect(0, 0, w, h)
    const cy = 0.2 * PX
    const half = 0.065 * PX
    const spread = 0.085 * PX
    aroundBody(w, cx => {
      // Red bow tie under the nose cone
      ctx.fillStyle = '#cc1029'
      ctx.beginPath()
      ctx.moveTo(cx - spread, cy - half)
      ctx.lineTo(cx, cy)
      ctx.lineTo(cx - spread, cy + half)
      ctx.closePath()
      ctx.moveTo(cx + spread, cy - half)
      ctx.lineTo(cx, cy)
      ctx.lineTo(cx + spread, cy + half)
      ctx.closePath()
      ctx.fill()
      if (logo.complete && logo.naturalWidth) {
        const size = 0.13 * PX
        ctx.save()
        ctx.filter = 'grayscale(1) brightness(1.25) contrast(2.2)'
        ctx.drawImage(logo, cx - size * 0.43, 0.57 * PX - size * 0.58, size * 0.86, size)
        ctx.restore()
      }
    })
    if (options.decal) [0.25, 0.75].forEach(u => drawDecal(ctx, u * w, options.decalText))
  })
  logo.onload = upper.paint
  logo.src = '/Images/rocketrylogo.png'

  const avBay = canvasTexture(
    TEXTURE_WIDTH,
    Math.round((AV_TOP - BOOSTER_TOP) * PX),
    (ctx, w, h) => {
      ctx.fillStyle = white
      ctx.fillRect(0, 0, w, h)
      // Black switch band at the top, the hairline joint at the bottom
      ctx.fillStyle = '#141414'
      ctx.fillRect(0, 0, w, 0.026 * PX)
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, h - 4, w, 4)
      aroundBody(w, cx => {
        ctx.fillStyle = '#141414'
        ctx.fillRect(cx - 0.07 * PX, 0.075 * PX, 0.04 * PX, 0.022 * PX)
        ctx.fillRect(cx + 0.03 * PX, 0.13 * PX, 0.04 * PX, 0.022 * PX)
      })
      // Static ports for the barometers, and the screws holding the band to the coupler
      ctx.fillStyle = '#1b1b1b'
      for (const u of [0.25, 0.58, 0.91]) {
        ctx.beginPath()
        ctx.arc(u * w, 0.11 * PX, 0.005 * PX, 0, Math.PI * 2)
        ctx.fill()
      }
      screwHeads(
        ctx,
        [0.04, 0.373, 0.707].flatMap(u => [
          [u * w, 0.05 * PX],
          [u * w, h - 0.03 * PX]
        ]),
        0.0045 * PX
      )
    }
  )

  const booster = canvasTexture(
    TEXTURE_WIDTH,
    Math.round((BOOSTER_TOP - BOTTOM) * PX),
    (ctx, w, h) => {
      ctx.fillStyle = white
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, 0, w, 4)
      ctx.fillStyle = '#1c1c1e'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      aroundBody(w, cx => {
        ctx.save()
        ctx.translate(cx, 0.34 * h)
        ctx.rotate(-Math.PI / 2)
        wideText(ctx, 'GUELPH ROCKETRY', 0.98 * PX, 0.072 * PX)
        ctx.restore()
      })
    }
  )
  document.fonts
    ?.load('700 80px Saira')
    .then(booster.paint)
    .catch(() => {})

  // Red and white bands parallel to the leading edge; neighbouring fins make the chevrons.
  const fin = canvasTexture(
    Math.round(FIN.span * PX * 2),
    Math.round(FIN.root * PX * 2),
    (ctx, w, h) => {
      ctx.fillStyle = white
      ctx.fillRect(0, 0, w, h)
      ctx.rotate(Math.atan2(FIN.sweep, FIN.span))
      ctx.fillStyle = '#cc1029'
      const band = 0.034 * PX * 2
      for (let k = 0; k < 14; k += 2) ctx.fillRect(-w * 2, k * band, w * 6, band)
    }
  )
  if (options.decal)
    document.fonts
      ?.load('700 80px Saira')
      .then(upper.paint)
      .catch(() => {})
  return {
    upper: upper.texture,
    avBay: avBay.texture,
    booster: booster.texture,
    fin: fin.texture,
    setDecal(text) {
      options.decalText = text
      upper.paint()
    }
  }
}

export function createStoryRocket(options = {}) {
  const object = new THREE.Group()
  const tilt = new THREE.Group()
  const spin = new THREE.Group()
  object.add(tilt)
  tilt.add(spin)

  const textures = liveries({ ...options })
  const weave = weaveNormalTexture()
  const paint = (map, height) => {
    const normalMap = weave.clone()
    normalMap.repeat.set(CIRCUMFERENCE / 0.02, (height || 0.2) / 0.02)
    return new THREE.MeshPhysicalMaterial({
      map,
      color: map ? '#ffffff' : '#f1f1ed',
      roughness: 0.38,
      normalMap,
      normalScale: new THREE.Vector2(0.12, 0.12),
      clearcoat: 1,
      clearcoatRoughness: 0.07,
      envMapIntensity: 0.9
    })
  }
  const standard = (color, metalness, roughness, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const noseRed = new THREE.MeshPhysicalMaterial({
    color: '#cf0f2a',
    roughness: 0.34,
    clearcoat: 1,
    clearcoatRoughness: 0.05
  })
  const lining = standard('#3a3d42', 0.1, 0.85, { side: THREE.BackSide })
  const cutEdge = standard('#e9e7df', 0.05, 0.7, { side: THREE.DoubleSide })
  const fiberglass = standard('#d9d6c0', 0.05, 0.5, { side: THREE.DoubleSide })
  const phenolic = standard('#8a5a32', 0.05, 0.6, { side: THREE.DoubleSide })
  const plywood = standard('#c79a62', 0, 0.75, { side: THREE.DoubleSide })
  const aluminium = standard('#c9ced4', 1, 0.3)
  const brightAluminium = standard('#e3e7ea', 1, 0.18)
  const darkAluminium = standard('#4a4f57', 0.9, 0.38, { side: THREE.DoubleSide })
  const redAnodized = standard('#b0172b', 0.85, 0.32)
  const graphite = standard('#2b2c2f', 0.2, 0.65, { side: THREE.DoubleSide })
  const steel = standard('#aeb6bf', 1, 0.25)
  const blackPlastic = standard('#141518', 0.1, 0.55)
  const nylon = standard('#e8e6dc', 0, 0.6)
  const pcbGreen = standard('#0f5a36', 0.15, 0.45)
  const pcbBlue = standard('#1c4c8f', 0.15, 0.45)
  const chip = standard('#111316', 0.3, 0.4)
  const gold = standard('#d6ad4f', 1, 0.3)
  const lipo = standard('#3d6fc8', 0.3, 0.35)
  const strap = standard('#f2a40e', 0, 0.8)
  const kevlar = standard('#e0b64a', 0, 0.75)
  const redWire = standard('#c8232c', 0.1, 0.5)
  const blackWire = standard('#1b1b1d', 0.1, 0.5)
  const yellowWire = standard('#e5c531', 0.1, 0.5)
  const greenTerminal = standard('#1f7a3a', 0.1, 0.5)
  const filletPaint = paint(null, FIN.root)
  const lineMaterial = standard('#e7e9ee', 0, 0.7)

  const mesh = (geometry, material, parent, position = [0, 0, 0], rotation) => {
    const part = new THREE.Mesh(geometry, material)
    part.position.set(...position)
    if (rotation) part.rotation.set(...rotation)
    parent.add(part)
    return part
  }
  const group = (parent, position) => {
    const part = new THREE.Group()
    if (position) part.position.set(...position)
    parent.add(part)
    return part
  }
  const anchor = (parent, position) => {
    const point = new THREE.Object3D()
    point.position.set(...position)
    parent.add(point)
    return point
  }
  // A unit cylinder stretched between two points (shroud lines, rods, cords).
  const unitRod = new THREE.CylinderGeometry(1, 1, 1, 8)
  const placeRod = (rod, a, b, radius) => {
    rod.position.copy(a).add(b).multiplyScalar(0.5)
    const direction = b.clone().sub(a)
    rod.scale.set(radius, direction.length(), radius)
    rod.quaternion.setFromUnitVectors(UP, direction.normalize())
  }
  const rod = (parent, a, b, radius, material) => {
    const part = new THREE.Mesh(unitRod, material)
    placeRod(part, a, b, radius)
    parent.add(part)
    return part
  }
  const disc = (parent, y, radius, material, thickness = 0.012) =>
    mesh(new THREE.CylinderGeometry(radius, radius, thickness, 64), material, parent, [0, y, 0])
  // Forged eyebolt through a bulkhead: the eye, its shank and a nut on the other side.
  const eyebolt = (parent, y, up) => {
    const sign = up ? 1 : -1
    mesh(
      new THREE.TorusGeometry(0.014, 0.0032, 10, 28),
      steel,
      parent,
      [0, y + sign * 0.02, 0],
      [0, Math.PI / 2, 0]
    )
    mesh(new THREE.CylinderGeometry(0.0032, 0.0032, 0.03, 10), steel, parent, [
      0,
      y + sign * 0.004,
      0
    ])
    mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 6), steel, parent, [0, y - sign * 0.01, 0])
    return anchor(parent, [0, y + sign * 0.028, 0])
  }
  const hexNut = (parent, position, radius = 0.0065, height = 0.005) =>
    mesh(new THREE.CylinderGeometry(radius, radius, height, 6), steel, parent, position)
  // Painted airframe tube with a dark inside and cut edges, so separated sections read as hollow.
  const tube = (parent, y0, y1, map) => {
    const height = y1 - y0
    const outer = mesh(
      new THREE.CylinderGeometry(R, R, height, AROUND, 1, true),
      paint(map, height),
      parent,
      [0, (y0 + y1) / 2, 0]
    )
    outer.rotation.y = Math.PI
    mesh(new THREE.CylinderGeometry(R * 0.95, R * 0.95, height, 64, 1, true), lining, parent, [
      0,
      (y0 + y1) / 2,
      0
    ])
    for (const y of [y0, y1])
      mesh(
        new THREE.RingGeometry(R * 0.95, R, AROUND),
        cutEdge,
        parent,
        [0, y, 0],
        [-Math.PI / 2, 0, 0]
      )
  }
  // Nylon shear pin heads standing just proud of the paint.
  const shearPins = (parent, y, offset) => {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + offset
      const outward = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
      const pin = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.002, 12), nylon, parent, [
        outward.x * (R + 0.0005),
        y,
        outward.z * (R + 0.0005)
      ])
      pin.quaternion.setFromUnitVectors(UP, outward)
    }
  }

  // ── Booster: the bottom airframe with fins, rail buttons, motor mount and retainer ──
  const booster = group(spin)
  tube(booster, BOTTOM, BOOSTER_TOP, textures.booster)
  const finShape = new THREE.Shape()
  finShape.moveTo(R - 0.004, FIN_TOP)
  finShape.lineTo(R + FIN.span, FIN_TOP - FIN.sweep)
  finShape.lineTo(R + FIN.span, FIN_TOP - FIN.sweep - FIN.tip)
  finShape.lineTo(R - 0.004, BOTTOM)
  finShape.closePath()
  const finGeometry = new THREE.ExtrudeGeometry(finShape, {
    depth: FIN.thickness,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 6,
    steps: 1
  })
  finGeometry.translate(0, 0, -FIN.thickness / 2)
  const finPosition = finGeometry.attributes.position
  const finUv = finGeometry.attributes.uv
  for (let i = 0; i < finPosition.count; i++) {
    finUv.setXY(i, (finPosition.getX(i) - R) / FIN.span, (finPosition.getY(i) - BOTTOM) / FIN.root)
  }
  const finMaterial = paint(textures.fin, FIN.root)
  // Epoxy fillets along each side of the root: a concave quarter-round, extruded down the root.
  const filletRadius = 0.009
  const filletLength = FIN.root - 0.018
  const filletGeometries = [1, -1].map(side => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, side * filletRadius)
    shape.absarc(
      filletRadius,
      side * filletRadius,
      filletRadius,
      Math.PI,
      side > 0 ? Math.PI * 1.5 : Math.PI / 2,
      side < 0
    )
    shape.lineTo(filletRadius, 0)
    shape.closePath()
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: filletLength, bevelEnabled: false })
    geometry.rotateX(Math.PI / 2)
    return geometry
  })
  const fins = [0, 1, 2, 3].map(i => {
    const fin = mesh(finGeometry, finMaterial, booster)
    fin.rotation.y = Math.PI / 4 + (i * Math.PI) / 2
    filletGeometries.forEach((geometry, k) => {
      const side = k === 0 ? 1 : -1
      mesh(geometry, filletPaint, fin, [R - 0.002, FIN_TOP - 0.014, (side * FIN.thickness) / 2])
    })
    return fin
  })
  // Rail buttons on the 1515 rail, each with its screw
  for (const y of [-1.52, -0.42]) {
    const button = group(booster, [0, y, -R])
    mesh(
      new THREE.CylinderGeometry(0.014, 0.016, 0.012, 24),
      blackPlastic,
      button,
      [0, 0, -0.006],
      [Math.PI / 2, 0, 0]
    )
    mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.006, 24),
      blackPlastic,
      button,
      [0, 0, -0.015],
      [Math.PI / 2, 0, 0]
    )
    mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.002, 12),
      steel,
      button,
      [0, 0, -0.019],
      [Math.PI / 2, 0, 0]
    )
  }
  // Inside: phenolic motor mount tube on three plywood centering rings, and the eyebolt the
  // drogue harness hangs from.
  const caseRadius = R * 0.93
  const mountRadius = caseRadius + 0.004
  mesh(new THREE.CylinderGeometry(mountRadius, mountRadius, 1.44, 48, 1, true), phenolic, booster, [
    0,
    BOTTOM + 0.72,
    0
  ])
  for (const y of [BOTTOM + 0.06, FIN_TOP + 0.02, BOTTOM + 1.42])
    mesh(
      new THREE.RingGeometry(mountRadius, R * 0.95, 64),
      plywood,
      booster,
      [0, y, 0],
      [-Math.PI / 2, 0, 0]
    )
  disc(booster, BOTTOM + 1.465, R * 0.95, plywood, 0.01)
  const boosterEye = eyebolt(booster, BOTTOM + 1.47, true)
  shearPins(booster, BOOSTER_TOP - 0.03, 0.4)
  // Screw-on aluminium motor retainer, knurled around the outside
  mesh(new THREE.CylinderGeometry(R * 0.99, R * 0.96, 0.03, 48, 1, true), darkAluminium, booster, [
    0,
    BOTTOM - 0.015,
    0
  ])
  mesh(
    new THREE.CylinderGeometry(R * 0.985, R * 0.985, 0.022, 36),
    standard('#5b6169', 0.95, 0.3, { flatShading: true }),
    booster,
    [0, BOTTOM - 0.035, 0]
  )
  mesh(
    new THREE.RingGeometry(caseRadius * 1.04, R * 0.985, 48),
    darkAluminium,
    booster,
    [0, BOTTOM - 0.046, 0],
    [Math.PI / 2, 0, 0]
  )

  // ── Solid motor: aluminium case, red forward closure, aft closure and graphite nozzle ──
  const motor = group(spin)
  const caseTop = -0.3
  const caseBottom = -1.68
  mesh(
    new THREE.CylinderGeometry(caseRadius, caseRadius, caseTop - caseBottom, 64),
    brightAluminium,
    motor,
    [0, (caseTop + caseBottom) / 2, 0]
  )
  // Snap ring grooves near each end
  for (const y of [caseTop - 0.045, caseBottom + 0.045])
    mesh(
      new THREE.CylinderGeometry(caseRadius * 0.985, caseRadius * 0.985, 0.006, 64),
      darkAluminium,
      motor,
      [0, y, 0]
    )
  // Forward closure with the ejection charge well
  mesh(
    new THREE.CylinderGeometry(caseRadius * 1.01, caseRadius * 1.01, 0.05, 64),
    redAnodized,
    motor,
    [0, caseTop + 0.025, 0]
  )
  mesh(
    new THREE.CylinderGeometry(caseRadius * 0.9, caseRadius * 1.01, 0.012, 64),
    redAnodized,
    motor,
    [0, caseTop + 0.056, 0]
  )
  mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.026, 6), redAnodized, motor, [
    0,
    caseTop + 0.07,
    0
  ])
  mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.004, 16), chip, motor, [0, caseTop + 0.084, 0])
  // Aft closure, then the nozzle: a convergent-divergent bell with a graphite throat
  mesh(
    new THREE.CylinderGeometry(caseRadius * 1.01, caseRadius * 1.01, 0.045, 64),
    darkAluminium,
    motor,
    [0, caseBottom - 0.0225, 0]
  )
  for (const y of [caseTop + 0.002, caseBottom - 0.002])
    mesh(
      new THREE.TorusGeometry(caseRadius, 0.0025, 8, 64),
      steel,
      motor,
      [0, y, 0],
      [Math.PI / 2, 0, 0]
    )
  const nozzleProfile = [
    [0.036, 0],
    [0.03, -0.008],
    [0.024, -0.018],
    [0.021, -0.028],
    [0.022, -0.036],
    [0.028, -0.05],
    [0.038, -0.064],
    [0.048, -0.078],
    [0.055, -0.09],
    [0.058, -0.096]
  ]
  const nozzleInner = new THREE.LatheGeometry(
    nozzleProfile.map(([x, y]) => new THREE.Vector2(x, y)),
    64
  )
  mesh(nozzleInner, graphite, motor, [0, caseBottom - 0.045, 0])
  const nozzleOuter = new THREE.LatheGeometry(
    [
      [0.068, 0],
      [0.068, -0.03],
      [0.065, -0.07],
      [0.062, -0.096],
      [0.058, -0.096]
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    64
  )
  mesh(nozzleOuter, darkAluminium, motor, [0, caseBottom - 0.045, 0])
  mesh(
    new THREE.CylinderGeometry(
      caseRadius * 1.003,
      caseRadius * 1.003,
      0.3,
      48,
      1,
      true,
      Math.PI - 0.7,
      1.4
    ),
    standard('#ffffff', 0, 0.6, { map: motorLabelTexture() }),
    motor,
    [0, -0.75, 0]
  )

  // ── Av bay: painted switch band, fibreglass coupler, bulkheads, threaded rods and a sled ──
  const avionics = group(spin)
  tube(avionics, BOOSTER_TOP, AV_TOP, textures.avBay)
  const couplerBottom = BOOSTER_TOP - 0.17
  const couplerTop = AV_TOP + 0.17
  const couplerMid = (couplerTop + couplerBottom) / 2
  mesh(
    new THREE.CylinderGeometry(R * 0.94, R * 0.94, couplerTop - couplerBottom, 64, 1, true),
    fiberglass,
    avionics,
    [0, couplerMid, 0]
  )
  const rodOffsets = [
    [0.03, -0.05],
    [0.03, 0.05]
  ]
  const avEyes = {}
  for (const [y, up] of [
    [couplerBottom, false],
    [couplerTop, true]
  ]) {
    const sign = up ? 1 : -1
    disc(avionics, y, R * 0.94, plywood)
    avEyes[up ? 'top' : 'bottom'] = eyebolt(avionics, y, up)
    // Charge well with its e-match leads, and the terminal block they screw into
    const well = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.026, 20), aluminium, avionics, [
      0.045,
      y + sign * 0.019,
      0.03
    ])
    mesh(new THREE.CylinderGeometry(0.0125, 0.0125, 0.004, 20), redAnodized, well, [
      0,
      sign * 0.014,
      0
    ])
    const block = mesh(new THREE.BoxGeometry(0.024, 0.012, 0.014), greenTerminal, avionics, [
      -0.045,
      y + sign * 0.012,
      -0.025
    ])
    for (const z of [-0.004, 0.004])
      mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.002, 10), steel, block, [
        0,
        sign * 0.007,
        z
      ])
    for (const [material, dz] of [
      [redWire, 0.003],
      [yellowWire, -0.003]
    ]) {
      const lead = new THREE.CatmullRomCurve3(
        [
          [0.045, y + sign * 0.032, 0.03 + dz],
          [0.02, y + sign * 0.04, 0.012 + dz],
          [-0.02, y + sign * 0.03, -0.015 + dz],
          [-0.045, y + sign * 0.02, -0.025 + dz]
        ].map(p => new THREE.Vector3(...p))
      )
      mesh(new THREE.TubeGeometry(lead, 24, 0.0012, 6), material, avionics)
    }
    // Nuts and washers clamping the bulkhead onto the threaded rods
    for (const [x, z] of rodOffsets) {
      mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.0015, 20), steel, avionics, [
        x,
        y + sign * 0.007,
        z
      ])
      hexNut(avionics, [x, y + sign * 0.011, z], 0.0062, 0.006)
    }
  }
  for (const [x, z] of rodOffsets)
    mesh(
      new THREE.CylinderGeometry(0.0035, 0.0035, couplerTop - couplerBottom + 0.036, 12),
      steel,
      avionics,
      [x, couplerMid, z]
    )
  // The sled rides on the rods and carries everything
  const sled = group(avionics, [0, couplerMid, 0])
  mesh(new THREE.BoxGeometry(0.004, 0.4, 0.13), fiberglass, sled)
  for (const z of [-0.05, 0.05])
    for (const y of [-0.185, 0.185])
      mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.02, 12), nylon, sled, [0.03, y, z], [0, 0, 0])
  for (const z of [-0.05, 0.05])
    for (const y of [-0.185, 0.185])
      mesh(new THREE.BoxGeometry(0.03, 0.008, 0.016), nylon, sled, [0.016, y, z])
  // Flight computer: STM32, barometer, IMU, SD slot, pyro terminals, GPS patch
  const computer = mesh(
    new THREE.BoxGeometry(0.0025, 0.15, 0.1),
    pcbGreen,
    sled,
    [-0.0035, 0.095, 0]
  )
  const onBoard = (geometry, material, y, z, lift = 0, rotation) =>
    mesh(geometry, material, computer, [-0.00125 - lift, y, z], rotation)
  onBoard(new THREE.BoxGeometry(0.003, 0.03, 0.03), chip, 0.025, 0.012, 0.0015)
  onBoard(new THREE.BoxGeometry(0.0025, 0.01, 0.01), chip, -0.02, -0.03, 0.0012)
  onBoard(new THREE.BoxGeometry(0.0025, 0.012, 0.012), chip, -0.035, 0.025, 0.0012)
  onBoard(new THREE.BoxGeometry(0.0025, 0.008, 0.008), chip, 0.05, -0.03, 0.0012)
  onBoard(
    new THREE.BoxGeometry(0.003, 0.026, 0.028),
    standard('#b9bec5', 0.9, 0.35),
    -0.05,
    0.02,
    0.0015
  )
  onBoard(new THREE.BoxGeometry(0.0045, 0.014, 0.022), greenTerminal, 0.0, -0.036, 0.002)
  onBoard(new THREE.BoxGeometry(0.0045, 0.014, 0.022), greenTerminal, 0.02, -0.036, 0.002)
  onBoard(new THREE.BoxGeometry(0.003, 0.006, 0.07), gold, -0.068, 0, 0.0015)
  const gps = onBoard(new THREE.BoxGeometry(0.006, 0.026, 0.026), nylon, 0.058, 0.03, 0.003)
  mesh(new THREE.BoxGeometry(0.001, 0.018, 0.018), aluminium, gps, [-0.0035, 0, 0])
  for (let i = 0; i < 6; i++)
    onBoard(
      new THREE.BoxGeometry(0.0025, 0.004, 0.002),
      i % 2 ? chip : standard('#c7a24a', 0.5, 0.5),
      -0.03 + i * 0.006,
      -0.044,
      0.0012
    )
  // LED and screw switch on the band side
  onBoard(
    new THREE.CylinderGeometry(0.0015, 0.0015, 0.003, 8),
    standard('#ff3b30', 0, 0.4),
    0.068,
    -0.04,
    0.0015,
    [0, 0, Math.PI / 2]
  )
  const screwSwitch = onBoard(
    new THREE.CylinderGeometry(0.004, 0.004, 0.006, 12),
    redAnodized,
    -0.06,
    -0.04,
    0.003,
    [0, 0, Math.PI / 2]
  )
  mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.008, 8), steel, screwSwitch, [0, 0.006, 0])
  // LoRa radio board with its SMA connector and whip antenna
  const radio = mesh(new THREE.BoxGeometry(0.0025, 0.07, 0.06), pcbBlue, sled, [-0.0035, -0.04, 0])
  mesh(
    new THREE.BoxGeometry(0.003, 0.02, 0.02),
    standard('#c7ccd2', 1, 0.3),
    radio,
    [-0.003, 0.008, 0]
  )
  mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.016, 12), gold, radio, [-0.0025, 0.04, 0.02])
  mesh(
    new THREE.CylinderGeometry(0.0045, 0.0045, 0.085, 12),
    blackPlastic,
    radio,
    [-0.0025, 0.088, 0.02]
  )
  mesh(
    new THREE.CylinderGeometry(0.0015, 0.0015, 0.09, 8),
    blackPlastic,
    radio,
    [-0.0025, 0.175, 0.02]
  )
  // 2S LiPo strapped down with a velcro strap, and the wiring between it all
  const pack = mesh(new THREE.BoxGeometry(0.02, 0.09, 0.052), lipo, sled, [0.013, -0.1, 0])
  mesh(new THREE.BoxGeometry(0.0205, 0.02, 0.053), standard('#f2f2f2', 0, 0.6), pack, [0, 0.015, 0])
  mesh(new THREE.BoxGeometry(0.026, 0.016, 0.058), strap, pack, [0.001, -0.02, 0])
  mesh(new THREE.BoxGeometry(0.0035, 0.003, 0.008), redWire, pack, [0.004, 0.045, 0.012])
  for (const [material, points] of [
    [
      redWire,
      [
        [0.004, -0.053, 0.012],
        [0.012, -0.03, 0.02],
        [0.0, 0.0, 0.03],
        [-0.004, 0.06, 0.04]
      ]
    ],
    [
      blackWire,
      [
        [0.004, -0.053, 0.008],
        [0.014, -0.025, 0.012],
        [0.003, 0.01, 0.028],
        [-0.004, 0.065, 0.038]
      ]
    ],
    [
      yellowWire,
      [
        [-0.005, 0.085, -0.036],
        [0.01, 0.13, -0.045],
        [0.0, 0.17, -0.05],
        [-0.03, 0.21, -0.03]
      ]
    ]
  ]) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
    mesh(new THREE.TubeGeometry(curve, 20, 0.0012, 6), material, sled)
  }

  // ── Parachute bay (upper airframe) ──
  const upper = group(spin)
  tube(upper, AV_TOP, UPPER_TOP, textures.upper)
  shearPins(upper, UPPER_TOP - 0.03, 0.6)

  // ── Parachutes: twelve-gore canopies with a spill hole, shroud lines, swivel and quick link ──
  const canopyGeometry = (radius, gores) => {
    const profile = [
      [0.09, 1],
      [0.33, 0.965],
      [0.6, 0.85],
      [0.815, 0.65],
      [0.95, 0.4],
      [1.005, 0.165],
      [1, 0]
    ]
    const geometry = new THREE.LatheGeometry(
      profile.map(([x, y]) => new THREE.Vector2(x * radius, y * radius)),
      gores * 14
    )
    const position = geometry.attributes.position
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)
      const gore = ((((Math.atan2(z, x) / (Math.PI * 2)) * gores) % 1) + 1) % 1
      const bulge = Math.sin(gore * Math.PI)
      const swell = 1 + 0.05 * bulge * Math.min(1, y / (radius * 0.33) + 0.3)
      position.setXYZ(
        i,
        x * swell,
        y + (y < radius * 0.03 ? (1 - bulge) * radius * 0.07 : 0),
        z * swell
      )
    }
    geometry.computeVertexNormals()
    return geometry
  }
  const ripstop = (colors, gores) =>
    new THREE.MeshPhysicalMaterial({
      map: goreTexture(colors, gores),
      roughness: 0.78,
      sheen: 0.7,
      sheenRoughness: 0.5,
      sheenColor: '#ffffff',
      side: THREE.DoubleSide
    })
  const makeChute = (radius, gores, colors) => {
    const chute = new THREE.Group()
    spin.add(chute)
    mesh(canopyGeometry(radius, gores), ripstop(colors, gores), chute)
    mesh(
      new THREE.TorusGeometry(radius * 0.09, radius * 0.008, 6, 24),
      lineMaterial,
      chute,
      [0, radius, 0],
      [Math.PI / 2, 0, 0]
    )
    const skirtY = radius * 0.07
    const confluence = new THREE.Vector3(0, -radius * 1.07, 0)
    for (let i = 0; i < gores; i++) {
      const angle = (i / gores) * Math.PI * 2
      rod(
        chute,
        new THREE.Vector3(Math.cos(angle) * radius, skirtY, Math.sin(angle) * radius),
        confluence,
        radius * 0.006,
        lineMaterial
      )
    }
    // Swivel and quick link at the confluence
    mesh(
      new THREE.CylinderGeometry(radius * 0.02, radius * 0.02, radius * 0.06, 12),
      steel,
      chute,
      [0, confluence.y - radius * 0.03, 0]
    )
    mesh(
      new THREE.TorusGeometry(radius * 0.045, radius * 0.009, 8, 24),
      steel,
      chute,
      [0, confluence.y - radius * 0.1, 0],
      [0, Math.PI / 2, 0]
    )
    const link = anchor(chute, [0, confluence.y - radius * 0.14, 0])
    return { chute, link, radius }
  }
  const main = makeChute(0.3, 12, ['#e0142e', '#f5f3ee'])
  const drogue = makeChute(0.105, 8, ['#f5f3ee', '#1c1c1e'])

  // ── Nose cone: tangent ogive with an aluminium tip, fibreglass shoulder and bulkhead ──
  const nose = group(spin)
  const rho = (R * R + NOSE_LENGTH * NOSE_LENGTH) / (2 * R)
  const ogiveRadius = h => Math.max(0, Math.sqrt(rho * rho - h * h) + R - rho)
  const tipLength = 0.075
  const redProfile = Array.from({ length: 64 }, (_, i) => {
    const h = (i / 63) * (NOSE_LENGTH - tipLength)
    return new THREE.Vector2(ogiveRadius(h), h)
  })
  const tipProfile = Array.from({ length: 24 }, (_, i) => {
    const h = NOSE_LENGTH - tipLength + (i / 23) * tipLength
    return new THREE.Vector2(ogiveRadius(h) * (i === 0 ? 0.985 : 1), h)
  })
  mesh(new THREE.LatheGeometry(redProfile, AROUND), noseRed, nose, [0, UPPER_TOP, 0])
  mesh(new THREE.LatheGeometry(tipProfile, 64), brightAluminium, nose, [0, UPPER_TOP, 0])
  mesh(new THREE.CylinderGeometry(R * 0.95, R * 0.95, 0.12, 64, 1, true), fiberglass, nose, [
    0,
    UPPER_TOP - 0.06,
    0
  ])
  disc(nose, UPPER_TOP - 0.115, R * 0.95, plywood)
  const noseEye = eyebolt(nose, UPPER_TOP - 0.115, false)
  mesh(
    new THREE.RingGeometry(R * 0.95, R, AROUND),
    cutEdge,
    nose,
    [0, UPPER_TOP, 0],
    [Math.PI / 2, 0, 0]
  )
  // Tracker sleeve in the nose: a little GPS beacon on a plywood sled
  mesh(new THREE.BoxGeometry(0.003, 0.12, 0.05), plywood, nose, [0, UPPER_TOP + 0.08, 0])
  mesh(new THREE.BoxGeometry(0.012, 0.045, 0.028), blackPlastic, nose, [0.0075, UPPER_TOP + 0.1, 0])

  // ── Shock cords: kevlar harness between the sections, only drawn when it's pulled apart ──
  const cords = group(spin)
  const cordMeshes = Array.from({ length: 5 }, () => {
    const part = new THREE.Mesh(unitRod, kevlar)
    cords.add(part)
    return part
  })
  const world = new THREE.Vector3()
  const local = a => {
    a.getWorldPosition(world)
    return spin.worldToLocal(world.clone())
  }
  const layCords = () => {
    spin.updateMatrixWorld(true)
    const noseAt = local(noseEye)
    const mainLink = local(main.link)
    const avTop = local(avEyes.top)
    const avBottom = local(avEyes.bottom)
    const drogueLink = local(drogue.link)
    const boosterAt = local(boosterEye)
    // The nose cone's cord runs down past the canopy to the harness at the quick link
    const beside = new THREE.Vector3(main.radius * main.chute.scale.x + 0.03, 0, 0).add(
      new THREE.Vector3(0, (noseAt.y + mainLink.y) / 2, 0)
    )
    const segments = [
      [noseAt, beside],
      [beside, mainLink],
      [mainLink, avTop],
      [avBottom, drogueLink],
      [drogueLink, boosterAt]
    ]
    segments.forEach(([a, b], i) => placeRod(cordMeshes[i], a, b, 0.0035))
  }

  const anchors = {
    'rocket-nose': anchor(nose, [0, UPPER_TOP + 0.3, 0]),
    'rocket-chute': anchor(main.chute, [0, 0.3, 0]),
    'rocket-avionics': anchor(sled, [-0.02, 0.06, 0]),
    'rocket-fins': anchor(fins[0], [R + FIN.span, FIN_TOP - FIN.sweep - 0.03, 0]),
    'rocket-motor': anchor(motor, [0, -0.93, 0])
  }

  // ── Exhaust: flame cones, a glow sprite and a point light for the launch ──
  const flame = group(tilt)
  flame.position.y = BOTTOM - 0.14
  const flameMaterial = color =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  mesh(
    new THREE.ConeGeometry(0.055, 0.62, 32, 1, true),
    flameMaterial('#ff7a2e'),
    flame,
    [0, -0.31, 0],
    [Math.PI, 0, 0]
  )
  mesh(
    new THREE.ConeGeometry(0.032, 0.32, 24, 1, true),
    flameMaterial('#fff1c4'),
    flame,
    [0, -0.16, 0],
    [Math.PI, 0, 0]
  )
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture([
        [0, '#ffe7b0'],
        [0.25, '#ff8a3dcc'],
        [1, '#ff4d0000']
      ]),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  )
  glow.scale.setScalar(0.9)
  glow.position.y = -0.08
  flame.add(glow)
  const light = new THREE.PointLight('#ff9a4a', 0, 4, 1.6)
  light.position.y = -0.15
  flame.add(light)

  let lastPose = ''
  return {
    object,
    tilt,
    spin,
    anchors,
    nozzleY: BOTTOM - 0.14,
    setDecal: textures.setDecal,
    // explode 0 → assembled, 1 → pulled apart along the axis (top to bottom: nose, main chute,
    // parachute bay, av bay, drogue, booster, motor), with the harness strung between them.
    setExplode(explode, sledOut, chuteOpen) {
      // Gaps are just big enough for the chutes and for the motor to clear the booster.
      const shift = 0.46 * explode
      nose.position.y = 1.04 * explode + shift
      upper.position.y = 0.3 * explode + shift
      avionics.position.y = shift
      booster.position.y = -0.5 * explode + shift
      motor.position.y = -2.2 * explode + shift
      sled.position.x = -0.44 * sledOut
      main.chute.position.y = 1.6 * explode + shift
      const open = chuteOpen * 0.9
      main.chute.scale.set(open, open * (0.55 + chuteOpen * 0.45), open)
      drogue.chute.position.y = -0.33 * explode + shift
      drogue.chute.scale.set(open, open * (0.55 + chuteOpen * 0.45), open)
      const shown = chuteOpen > 0.001
      main.chute.visible = shown
      drogue.chute.visible = shown
      cords.visible = shown && explode > 0.05
      const pose = `${explode.toFixed(3)}|${chuteOpen.toFixed(3)}`
      if (cords.visible && pose !== lastPose) {
        lastPose = pose
        layCords()
      }
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
    }
  }
}
