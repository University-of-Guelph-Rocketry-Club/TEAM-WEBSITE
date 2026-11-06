import * as THREE from 'three'

// Modelled on our solid rocket (4 in airframe, about 18.5 calibers long): red ogive nose cone,
// parachute bay with the red bow tie and club logo, av bay with the black tape band,
// booster with "GUELPH ROCKETRY" down the side, and four red-and-white chevron fins.
const D = 0.18
const R = D / 2
const BOTTOM = -1.665
const BOOSTER_TOP = 0.025
const AV_TOP = 0.241
const UPPER_TOP = 1.051
const TIP = 1.665
const NOSE_LENGTH = TIP - UPPER_TOP
const CIRCUMFERENCE = Math.PI * D
const TEXTURE_WIDTH = 640
const PX = TEXTURE_WIDTH / CIRCUMFERENCE // texture pixels per unit, the same along and around the tube
const FIN = { root: 0.432, span: 0.216, tip: 0.063, sweep: 0.288 }
const FIN_TOP = BOTTOM + FIN.root

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
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

function stripeTexture(colors, count) {
  return canvasTexture(512, 8, (ctx, w, h) => {
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(Math.floor(i * w / count), 0, Math.ceil(w / count) + 1, h)
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

function liveries() {
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
  })
  logo.onload = upper.paint
  logo.src = '/Images/rocketrylogo.png'

  const avBay = canvasTexture(TEXTURE_WIDTH, Math.round((AV_TOP - BOOSTER_TOP) * PX), (ctx, w, h) => {
    ctx.fillStyle = white
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#141414'
    ctx.fillRect(0, 0, w, 0.026 * PX)
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, h - 3, w, 3)
    aroundBody(w, cx => {
      ctx.fillStyle = '#141414'
      ctx.fillRect(cx - 0.07 * PX, 0.075 * PX, 0.04 * PX, 0.022 * PX)
      ctx.fillRect(cx + 0.03 * PX, 0.13 * PX, 0.04 * PX, 0.022 * PX)
    })
    // Static ports for the barometers
    ctx.fillStyle = '#1b1b1b'
    for (const u of [0.25, 0.58, 0.91]) {
      ctx.beginPath()
      ctx.arc(u * w, 0.11 * PX, 0.005 * PX, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  const booster = canvasTexture(TEXTURE_WIDTH, Math.round((BOOSTER_TOP - BOTTOM) * PX), (ctx, w, h) => {
    ctx.fillStyle = white
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 0, w, 3)
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
  })
  document.fonts?.load('700 80px Saira').then(booster.paint).catch(() => {})

  // Red and white bands parallel to the leading edge; neighbouring fins make the chevrons.
  const fin = canvasTexture(Math.round(FIN.span * PX), Math.round(FIN.root * PX), (ctx, w) => {
    ctx.fillStyle = white
    ctx.fillRect(0, 0, w, FIN.root * PX)
    ctx.rotate(Math.atan2(FIN.sweep * PX, FIN.span * PX))
    ctx.fillStyle = '#cc1029'
    const band = 0.034 * PX
    for (let k = 0; k < 14; k += 2) ctx.fillRect(-w * 2, k * band, w * 6, band)
  })
  return { upper: upper.texture, avBay: avBay.texture, booster: booster.texture, fin: fin.texture }
}

export function createStoryRocket() {
  const object = new THREE.Group()
  const tilt = new THREE.Group()
  const spin = new THREE.Group()
  object.add(tilt)
  tilt.add(spin)

  const textures = liveries()
  const paint = map => new THREE.MeshPhysicalMaterial({ map, color: map ? '#ffffff' : '#f1f1ed', roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.9 })
  const standard = (color, metalness, roughness, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const noseRed = new THREE.MeshPhysicalMaterial({ color: '#cf0f2a', roughness: 0.36, clearcoat: 1, clearcoatRoughness: 0.06 })
  const lining = standard('#3a3d42', 0.1, 0.85, { side: THREE.BackSide })
  const cutEdge = standard('#e9e7df', 0.05, 0.7, { side: THREE.DoubleSide })
  const fiberglass = standard('#d9d6c0', 0.05, 0.5, { side: THREE.DoubleSide })
  const plywood = standard('#c79a62', 0, 0.75)
  const aluminium = standard('#c9ced4', 1, 0.3)
  const darkAluminium = standard('#4a4f57', 0.9, 0.38, { side: THREE.DoubleSide })
  const redAnodized = standard('#b0172b', 0.85, 0.32)
  const graphite = standard('#2b2c2f', 0.2, 0.65, { side: THREE.DoubleSide })
  const steel = standard('#aeb6bf', 1, 0.25)
  const blackPlastic = standard('#141518', 0.1, 0.55)
  const pcbGreen = standard('#0f5a36', 0.15, 0.45)
  const pcbBlue = standard('#1c4c8f', 0.15, 0.45)
  const chip = standard('#111316', 0.3, 0.4)
  const gold = standard('#d6ad4f', 1, 0.3)
  const lipo = standard('#3d6fc8', 0.3, 0.35)
  const strap = standard('#f2a40e', 0, 0.8)
  const filletPaint = paint(null)

  const mesh = (geometry, material, parent, position = [0, 0, 0], rotation) => {
    const part = new THREE.Mesh(geometry, material)
    part.position.set(...position)
    if (rotation) part.rotation.set(...rotation)
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
  const disc = (parent, y, radius, material) => mesh(new THREE.CylinderGeometry(radius, radius, 0.012, 48), material, parent, [0, y, 0])
  const uBolt = (parent, y, up) => mesh(new THREE.TorusGeometry(0.018, 0.003, 8, 20, Math.PI), steel, parent, [0, y, 0], [0, 0, up ? 0 : Math.PI])
  // Painted airframe tube with a dark inside and cut edges, so separated sections read as hollow.
  const tube = (parent, y0, y1, map) => {
    const height = y1 - y0
    const outer = mesh(new THREE.CylinderGeometry(R, R, height, 72, 1, true), paint(map), parent, [0, (y0 + y1) / 2, 0])
    outer.rotation.y = Math.PI
    mesh(new THREE.CylinderGeometry(R * 0.95, R * 0.95, height, 48, 1, true), lining, parent, [0, (y0 + y1) / 2, 0])
    for (const y of [y0, y1]) mesh(new THREE.RingGeometry(R * 0.95, R, 72), cutEdge, parent, [0, y, 0], [-Math.PI / 2, 0, 0])
  }

  // Booster: the bottom airframe with fins, rail buttons and the motor retainer.
  const booster = group(spin)
  tube(booster, BOTTOM, BOOSTER_TOP, textures.booster)
  const finShape = new THREE.Shape()
  finShape.moveTo(R - 0.004, FIN_TOP)
  finShape.lineTo(R + FIN.span, FIN_TOP - FIN.sweep)
  finShape.lineTo(R + FIN.span, FIN_TOP - FIN.sweep - FIN.tip)
  finShape.lineTo(R - 0.004, BOTTOM)
  finShape.closePath()
  const finGeometry = new THREE.ExtrudeGeometry(finShape, { depth: 0.008, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 3, steps: 1 })
  finGeometry.translate(0, 0, -0.004)
  const finPosition = finGeometry.attributes.position
  const finUv = finGeometry.attributes.uv
  for (let i = 0; i < finPosition.count; i++) {
    finUv.setXY(i, (finPosition.getX(i) - R) / FIN.span, (finPosition.getY(i) - BOTTOM) / FIN.root)
  }
  const finMaterial = paint(textures.fin)
  const filletGeometry = new THREE.CylinderGeometry(0.006, 0.006, FIN.root * 0.96, 8)
  const fins = [0, 1, 2, 3].map(i => {
    const fin = mesh(finGeometry, finMaterial, booster)
    fin.rotation.y = Math.PI / 4 + i * Math.PI / 2
    for (const side of [-1, 1]) mesh(filletGeometry, filletPaint, fin, [R + 0.002, BOTTOM + FIN.root / 2, side * 0.008])
    return fin
  })
  for (const y of [-1.52, -0.42]) {
    const button = group(booster)
    button.position.set(0, y, -R)
    mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.012, 20), blackPlastic, button, [0, 0, -0.006], [Math.PI / 2, 0, 0])
    mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.006, 20), blackPlastic, button, [0, 0, -0.015], [Math.PI / 2, 0, 0])
  }
  mesh(new THREE.CylinderGeometry(R * 0.99, R * 0.96, 0.032, 48, 1, true), darkAluminium, booster, [0, BOTTOM - 0.014, 0])

  // Solid motor: aluminium case, red forward closure, aft closure and graphite nozzle.
  const motor = group(spin)
  const caseRadius = R * 0.9
  mesh(new THREE.CylinderGeometry(caseRadius, caseRadius, 1.5, 48), aluminium, motor, [0, -0.93, 0])
  mesh(new THREE.CylinderGeometry(caseRadius * 1.01, caseRadius * 1.01, 0.05, 48), redAnodized, motor, [0, -0.155, 0])
  mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 6), redAnodized, motor, [0, -0.12, 0])
  mesh(new THREE.CylinderGeometry(caseRadius * 1.01, caseRadius * 1.01, 0.045, 48), darkAluminium, motor, [0, -1.695, 0])
  for (const y of [-0.2, -1.66]) mesh(new THREE.TorusGeometry(caseRadius, 0.0025, 6, 48), steel, motor, [0, y, 0], [Math.PI / 2, 0, 0])
  const nozzleProfile = [[0.03, 0], [0.022, -0.02], [0.03, -0.05], [0.052, -0.085]]
  mesh(new THREE.LatheGeometry(nozzleProfile.map(([x, y]) => new THREE.Vector2(x, y)), 40), graphite, motor, [0, -1.716, 0])
  mesh(new THREE.CylinderGeometry(caseRadius * 1.003, caseRadius * 1.003, 0.22, 48, 1, true, Math.PI - 0.7, 1.4), standard('#f4f1e6', 0, 0.6), motor, [0, -0.7, 0])

  // Av bay: painted switch band, fiberglass coupler, bulkheads, threaded rods and a sliding sled.
  const avionics = group(spin)
  tube(avionics, BOOSTER_TOP, AV_TOP, textures.avBay)
  const couplerBottom = BOOSTER_TOP - 0.17
  const couplerTop = AV_TOP + 0.17
  mesh(new THREE.CylinderGeometry(R * 0.94, R * 0.94, couplerTop - couplerBottom, 48, 1, true), fiberglass, avionics, [0, (couplerTop + couplerBottom) / 2, 0])
  for (const [y, up] of [[couplerBottom, false], [couplerTop, true]]) {
    disc(avionics, y, R * 0.94, plywood)
    uBolt(avionics, y + (up ? 0.006 : -0.006), up)
    const well = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.024, 16), standard('#e8e8e8', 0, 0.5), avionics, [0.04, y + (up ? 0.018 : -0.018), 0.03])
    mesh(new THREE.CylinderGeometry(0.0125, 0.0125, 0.004, 16), redAnodized, well, [0, up ? 0.013 : -0.013, 0])
    mesh(new THREE.BoxGeometry(0.03, 0.012, 0.016), blackPlastic, avionics, [-0.04, y + (up ? 0.012 : -0.012), -0.02])
  }
  for (const z of [-0.05, 0.05]) mesh(new THREE.CylinderGeometry(0.0035, 0.0035, couplerTop - couplerBottom + 0.03, 8), steel, avionics, [0.03, (couplerTop + couplerBottom) / 2, z])
  const sled = group(avionics)
  sled.position.y = (couplerTop + couplerBottom) / 2
  mesh(new THREE.BoxGeometry(0.006, 0.4, 0.13), blackPlastic, sled)
  const computer = mesh(new THREE.BoxGeometry(0.003, 0.14, 0.1), pcbGreen, sled, [-0.005, 0.09, 0])
  mesh(new THREE.BoxGeometry(0.003, 0.028, 0.028), chip, computer, [-0.003, 0.02, 0.012])
  for (const [y, z] of [[-0.03, -0.025], [-0.04, 0.02], [0.05, -0.03]]) mesh(new THREE.BoxGeometry(0.003, 0.012, 0.012), chip, computer, [-0.003, y, z])
  mesh(new THREE.BoxGeometry(0.004, 0.006, 0.07), gold, computer, [-0.003, -0.062, 0])
  const radio = mesh(new THREE.BoxGeometry(0.003, 0.07, 0.06), pcbBlue, sled, [-0.005, -0.04, 0])
  mesh(new THREE.BoxGeometry(0.003, 0.02, 0.02), standard('#c7ccd2', 1, 0.3), radio, [-0.003, 0.008, 0])
  mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.016, 10), gold, radio, [-0.002, 0.04, 0.02])
  mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.08, 10), blackPlastic, radio, [-0.002, 0.085, 0.02])
  const pack = mesh(new THREE.BoxGeometry(0.018, 0.09, 0.05), lipo, sled, [0.013, -0.1, 0])
  mesh(new THREE.BoxGeometry(0.0185, 0.02, 0.051), standard('#f2f2f2', 0, 0.6), pack, [0, 0.015, 0])
  for (const z of [-0.035, 0.035]) mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.01, 12), blackPlastic, sled, [-0.006, -0.15, z], [0, 0, Math.PI / 2])

  // Parachute bay (upper airframe) and the deployed parachute with its shock cord.
  const upper = group(spin)
  tube(upper, AV_TOP, UPPER_TOP, textures.upper)
  const chute = group(spin)
  const canopyProfile = [[0.028, 0.3], [0.1, 0.29], [0.18, 0.255], [0.245, 0.195], [0.285, 0.12], [0.302, 0.05], [0.3, 0]]
  const canopyGeometry = new THREE.LatheGeometry(canopyProfile.map(([x, y]) => new THREE.Vector2(x, y)), 96)
  const canopyPosition = canopyGeometry.attributes.position
  for (let i = 0; i < canopyPosition.count; i++) {
    const x = canopyPosition.getX(i)
    const y = canopyPosition.getY(i)
    const z = canopyPosition.getZ(i)
    const gore = ((Math.atan2(z, x) / (Math.PI * 2) * 12) % 1 + 1) % 1
    const bulge = Math.sin(gore * Math.PI)
    const swell = 1 + 0.045 * bulge * Math.min(1, y / 0.1 + 0.3)
    canopyPosition.setXYZ(i, x * swell, y + (y < 0.01 ? (1 - bulge) * 0.022 : 0), z * swell)
  }
  canopyGeometry.computeVertexNormals()
  mesh(canopyGeometry, new THREE.MeshPhysicalMaterial({ map: stripeTexture(['#e0142e', '#f5f3ee'], 12), roughness: 0.78, sheen: 0.7, sheenRoughness: 0.5, sheenColor: '#ffffff', side: THREE.DoubleSide }), chute)
  const lines = []
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * Math.PI * 2
    lines.push(new THREE.Vector3(Math.cos(angle) * 0.3, 0.022, Math.sin(angle) * 0.3), new THREE.Vector3(0, -0.32, 0))
  }
  chute.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines), new THREE.LineBasicMaterial({ color: '#e7e9ee', transparent: true, opacity: 0.8 })))
  mesh(new THREE.TorusGeometry(0.01, 0.003, 6, 16), steel, chute, [0, -0.33, 0])
  const cord = new THREE.CatmullRomCurve3([[0, -0.34, 0], [0.03, -0.42, 0.02], [-0.02, -0.52, -0.01], [0, -0.62, 0]].map(p => new THREE.Vector3(...p)))
  mesh(new THREE.TubeGeometry(cord, 24, 0.005, 6), strap, chute)

  // Nose cone: tangent ogive with its fiberglass shoulder and bulkhead.
  const nose = group(spin)
  const rho = (R * R + NOSE_LENGTH * NOSE_LENGTH) / (2 * R)
  const ogive = Array.from({ length: 48 }, (_, i) => {
    const h = i / 47 * NOSE_LENGTH
    return new THREE.Vector2(Math.max(0, Math.sqrt(rho * rho - h * h) + R - rho), h)
  })
  mesh(new THREE.LatheGeometry(ogive, 72), noseRed, nose, [0, UPPER_TOP, 0])
  mesh(new THREE.CylinderGeometry(R * 0.95, R * 0.95, 0.11, 48, 1, true), fiberglass, nose, [0, UPPER_TOP - 0.055, 0])
  disc(nose, UPPER_TOP - 0.108, R * 0.95, plywood)
  uBolt(nose, UPPER_TOP - 0.114, false)
  mesh(new THREE.RingGeometry(R * 0.95, R, 72), cutEdge, nose, [0, UPPER_TOP, 0], [Math.PI / 2, 0, 0])

  const anchors = {
    'rocket-nose': anchor(nose, [0, UPPER_TOP + 0.3, 0]),
    'rocket-chute': anchor(chute, [0, 0.3, 0]),
    'rocket-avionics': anchor(sled, [-0.02, 0.06, 0]),
    'rocket-fins': anchor(fins[0], [R + FIN.span, FIN_TOP - FIN.sweep - 0.03, 0]),
    'rocket-motor': anchor(motor, [0, -0.93, 0])
  }

  // Exhaust: flame cones, a glow sprite and a point light for the launch.
  const flame = group(tilt)
  flame.position.y = BOTTOM - 0.09
  const flameMaterial = color => new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  mesh(new THREE.ConeGeometry(0.05, 0.62, 24, 1, true), flameMaterial('#ff7a2e'), flame, [0, -0.31, 0], [Math.PI, 0, 0])
  mesh(new THREE.ConeGeometry(0.03, 0.32, 20, 1, true), flameMaterial('#fff1c4'), flame, [0, -0.16, 0], [Math.PI, 0, 0])
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture([[0, '#ffe7b0'], [0.25, '#ff8a3dcc'], [1, '#ff4d0000']]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  glow.scale.setScalar(0.9)
  glow.position.y = -0.08
  flame.add(glow)
  const light = new THREE.PointLight('#ff9a4a', 0, 4, 1.6)
  light.position.y = -0.15
  flame.add(light)

  return {
    object,
    tilt,
    spin,
    anchors,
    nozzleY: BOTTOM - 0.09,
    // explode 0 → assembled, 1 → pulled apart along the axis (top to bottom: nose, parachute, bay, av bay, booster, motor)
    setExplode(explode, sledOut, chuteOpen) {
      // Gaps are just big enough for the parachute and for the motor to clear the booster.
      const shift = 0.54 * explode
      nose.position.y = 1.0 * explode + shift
      upper.position.y = 0.3 * explode + shift
      avionics.position.y = shift
      booster.position.y = -0.35 * explode + shift
      motor.position.y = -1.95 * explode + shift
      sled.position.x = -0.44 * sledOut
      chute.position.y = 1.639 * explode + shift
      chute.visible = chuteOpen > 0.001
      chute.scale.set(chuteOpen * 0.9, chuteOpen * 0.9 * (0.55 + chuteOpen * 0.45), chuteOpen * 0.9)
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
