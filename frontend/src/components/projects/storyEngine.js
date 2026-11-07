import * as THREE from 'three'

// Example liquid engine on a vertical, down-firing test stand. Modelled in millimetres and scaled
// to the rocket model's units (1 unit = 564 mm), so it sits at true size next to the rocket.
// Thrust pushes the engine up into a load cell; the plume hits a deflector plate on the pad.
export const MM = 1 / 564
const POST = 40
const FRAME_W = 520
const FRAME_H = 1350

function canvasTexture(width, height, draw, repeat) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  if (repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(...repeat)
  }
  return texture
}

// Stainless braid on the feed hoses
function braidTexture() {
  return canvasTexture(
    64,
    64,
    (ctx, w, h) => {
      ctx.fillStyle = '#7d848c'
      ctx.fillRect(0, 0, w, h)
      for (let i = -h; i < w + h; i += 8) {
        for (const [dir, tone] of [
          [1, '#c9cfd6'],
          [-1, '#a3aab3']
        ]) {
          ctx.strokeStyle = tone
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i + dir * h, h)
          ctx.stroke()
        }
      }
    },
    [1, 30]
  )
}

// Plume brightness along its length: hot at the exit, fading out
function plumeTexture() {
  return canvasTexture(8, 256, (ctx, w, h) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, h)
    gradient.addColorStop(0, 'rgba(255,240,215,1)')
    gradient.addColorStop(0.18, 'rgba(255,170,90,.75)')
    gradient.addColorStop(0.6, 'rgba(150,120,255,.3)')
    gradient.addColorStop(1, 'rgba(90,110,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)
  })
}

function glowTexture() {
  return canvasTexture(128, 128, (ctx, w) => {
    const gradient = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    gradient.addColorStop(0, 'rgba(255,236,200,1)')
    gradient.addColorStop(0.3, 'rgba(255,150,70,.6)')
    gradient.addColorStop(1, 'rgba(255,90,30,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, w)
  })
}

// 40 x 40 T-slot aluminium extrusion profile, extruded along +Z with unit length.
export function tSlotGeometry() {
  const shape = new THREE.Shape()
  const half = POST / 2
  const side = [
    [-half, -half],
    [-4, -half],
    [-4, -half + 3],
    [-8, -half + 3],
    [-8, -half + 9],
    [8, -half + 9],
    [8, -half + 3],
    [4, -half + 3],
    [4, -half]
  ]
  const points = []
  for (let k = 0; k < 4; k++) {
    const angle = (k * Math.PI) / 2
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    for (const [x, y] of side) points.push(new THREE.Vector2(x * c - y * s, x * s + y * c))
  }
  shape.setFromPoints(points)
  const hole = new THREE.Path()
  hole.absarc(0, 0, 3.5, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  return new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: 10 })
}

export function createStoryEngine() {
  const object = new THREE.Group()
  const stand = new THREE.Group()
  stand.scale.setScalar(MM)
  object.add(stand)

  const standard = (color, metalness, roughness, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const extrusion = standard('#c4cad1', 0.9, 0.36)
  const aluminium = standard('#d3d8de', 1, 0.28)
  const stainless = standard('#b5bcc4', 1, 0.22)
  const steel = standard('#5c626a', 0.8, 0.45)
  const darkSteel = standard('#2f3338', 0.7, 0.5)
  const copper = new THREE.MeshPhysicalMaterial({
    color: '#e08a55',
    metalness: 1,
    roughness: 0.3,
    clearcoat: 0.3,
    envMapIntensity: 2.2
  })
  const soot = standard('#1a1716', 0.3, 0.85, { side: THREE.BackSide })
  const braid = standard('#ffffff', 0.9, 0.35, { map: braidTexture() })
  const red = standard('#b51d30', 0.5, 0.35)
  const black = standard('#141518', 0.2, 0.6)
  const blueCell = standard('#2a5fae', 0.6, 0.35)
  const grey = standard('#8a9097', 0.3, 0.6)
  const brass = standard('#c9a14a', 1, 0.3)
  const wireRed = standard('#c4202f', 0.1, 0.6)
  const wireYellow = standard('#e8c021', 0.1, 0.6)

  const mesh = (geometry, material, parent, position = [0, 0, 0], rotation) => {
    const part = new THREE.Mesh(geometry, material)
    part.position.set(...position)
    if (rotation) part.rotation.set(...rotation)
    parent.add(part)
    return part
  }
  const tube = (points, radius, material, parent, segments = 48) => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
    return mesh(new THREE.TubeGeometry(curve, segments, radius, 10, false), material, parent)
  }
  const bolts = (parent, y, radius, count, size = 5, offset = 0) => {
    const geometry = new THREE.CylinderGeometry(size, size, size * 1.1, 6)
    for (let i = 0; i < count; i++) {
      const angle = offset + (i / count) * Math.PI * 2
      mesh(geometry, steel, parent, [Math.cos(angle) * radius, y, Math.sin(angle) * radius])
    }
  }

  // Frame: four posts, rings of cross members, and corner gussets.
  const slot = tSlotGeometry()
  const beam = (from, to) => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const part = mesh(slot, extrusion, stand, from)
    part.scale.z = a.distanceTo(b)
    part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), b.clone().sub(a).normalize())
    return part
  }
  const half = FRAME_W / 2 - POST / 2
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ]
  for (const [x, z] of corners) beam([x * half, 20, z * half], [x * half, FRAME_H, z * half])
  for (const y of [70, 760, FRAME_H - 20]) {
    for (let k = 0; k < 4; k++) {
      const [x0, z0] = corners[k]
      const [x1, z1] = corners[(k + 1) % 4]
      const inset = POST / 2
      beam(
        [x0 * half + ((x1 - x0) * inset) / 2, y, z0 * half + ((z1 - z0) * inset) / 2],
        [x1 * half - ((x1 - x0) * inset) / 2, y, z1 * half - ((z1 - z0) * inset) / 2]
      )
    }
  }
  // Diagonal braces on the two sides
  for (const x of [-1, 1]) beam([x * half, 110, -half + 30], [x * half, 720, half - 30])
  const gusset = new THREE.BoxGeometry(36, 36, 4)
  for (const [x, z] of corners) {
    for (const y of [70, 760, FRAME_H - 20]) {
      for (const [gx, gz, ry] of [
        [0, -z, 0],
        [-x, 0, Math.PI / 2]
      ]) {
        mesh(
          gusset,
          aluminium,
          stand,
          [x * half + gx * 22, y + (y > 100 ? -24 : 24), z * half + gz * 22],
          [0, ry, Math.PI / 4]
        )
      }
    }
  }
  // Base plate, levelling feet and anchor bolts
  mesh(new THREE.BoxGeometry(FRAME_W + 120, 12, FRAME_W + 120), darkSteel, stand, [0, 6, 0])
  for (const [x, z] of corners) {
    mesh(new THREE.CylinderGeometry(14, 14, 8, 6), steel, stand, [
      x * (FRAME_W / 2 + 35),
      16,
      z * (FRAME_W / 2 + 35)
    ])
  }

  // Top reaction plate across the frame, with the load cell and the guided thrust plate under it.
  const topY = FRAME_H - 20 - POST / 2
  mesh(new THREE.BoxGeometry(FRAME_W - 30, 16, 160), aluminium, stand, [0, topY - 8, 0])
  bolts(stand, topY - 18, 70, 6, 5)
  const loadCell = new THREE.Group()
  loadCell.position.y = topY - 16
  stand.add(loadCell)
  mesh(new THREE.CylinderGeometry(34, 34, 46, 40), blueCell, loadCell, [0, -23, 0])
  mesh(new THREE.CylinderGeometry(36, 36, 6, 40), stainless, loadCell, [0, -3, 0])
  mesh(new THREE.CylinderGeometry(36, 36, 6, 40), stainless, loadCell, [0, -43, 0])
  mesh(new THREE.CylinderGeometry(6, 6, 22, 12), black, loadCell, [38, -23, 0], [0, 0, Math.PI / 2])
  tube(
    [
      [48, topY - 39, 0],
      [80, topY - 40, 10],
      [half - 10, topY - 60, 60],
      [half + 10, topY - 200, 90]
    ],
    3,
    black,
    stand,
    24
  )

  const thrustY = topY - 62 - 8
  mesh(new THREE.BoxGeometry(300, 16, 300), aluminium, stand, [0, thrustY, 0])
  // Guide rods with linear bearings keep the thrust plate square
  for (const [x, z] of corners) {
    mesh(new THREE.CylinderGeometry(8, 8, 160, 16), stainless, stand, [
      x * 120,
      thrustY + 30,
      z * 120
    ])
    mesh(new THREE.CylinderGeometry(16, 16, 40, 20), darkSteel, stand, [
      x * 120,
      thrustY + 28,
      z * 120
    ])
  }
  // Hangers from the thrust plate down to the injector flange
  for (let i = 0; i < 4; i++) {
    const angle = Math.PI / 4 + (i * Math.PI) / 2
    mesh(new THREE.CylinderGeometry(6, 6, 70, 12), stainless, stand, [
      Math.cos(angle) * 62,
      thrustY - 43,
      Math.sin(angle) * 62
    ])
  }

  // Engine: injector head, heat-sink copper chamber, and the converging-diverging nozzle.
  const engine = new THREE.Group()
  engine.position.y = thrustY - 94
  stand.add(engine)
  const E = engine.position.y
  mesh(new THREE.CylinderGeometry(70, 70, 16, 48), stainless, engine, [0, 8, 0])
  bolts(engine, 18, 58, 8, 5, Math.PI / 8)
  mesh(new THREE.CylinderGeometry(55, 60, 42, 48), stainless, engine, [0, -21, 0])
  // Oxidiser and fuel inlets into the injector manifolds on opposite sides
  for (const side of [-1, 1]) {
    mesh(
      new THREE.CylinderGeometry(11, 11, 34, 6),
      stainless,
      engine,
      [side * 60, -20, 0],
      [0, 0, Math.PI / 2]
    )
    mesh(
      new THREE.CylinderGeometry(8, 8, 20, 16),
      brass,
      engine,
      [side * 86, -20, 0],
      [0, 0, Math.PI / 2]
    )
  }
  // Chamber pressure transducer and its cable
  mesh(
    new THREE.CylinderGeometry(7, 7, 24, 6),
    stainless,
    engine,
    [-40, -20, 40],
    [Math.PI / 2.6, 0, Math.PI / 5]
  )
  mesh(
    new THREE.CylinderGeometry(10, 10, 48, 20),
    stainless,
    engine,
    [-56, -6, 58],
    [Math.PI / 2.6, 0, Math.PI / 5]
  )
  mesh(
    new THREE.CylinderGeometry(7, 7, 12, 16),
    black,
    engine,
    [-68, 6, 72],
    [Math.PI / 2.6, 0, Math.PI / 5]
  )

  // Chamber flange pair bolted to the injector
  mesh(new THREE.CylinderGeometry(72, 72, 14, 48), stainless, engine, [0, -49, 0])
  mesh(new THREE.CylinderGeometry(72, 72, 14, 48), copper, engine, [0, -64, 0])
  bolts(engine, -56, 62, 10, 4.5)
  // Chamber + nozzle: one lathe for the outer copper wall, one for the sooty inside.
  const chamberTop = -71
  const outer = [
    [52, 0],
    [52, -170],
    [46, -195],
    [30, -222],
    [27, -230],
    [30, -240],
    [36, -262],
    [41, -290],
    [44, -318],
    [45, -330]
  ]
  const inner = [
    [44, 0],
    [44, -170],
    [38, -195],
    [20, -222],
    [15, -230],
    [18, -240],
    [26, -262],
    [32, -290],
    [36, -318],
    [38, -330]
  ]
  const lathe = profile =>
    new THREE.LatheGeometry(
      profile.map(([r, y]) => new THREE.Vector2(r, y)),
      64
    )
  mesh(lathe(outer), copper, engine, [0, chamberTop, 0])
  mesh(lathe(inner), soot, engine, [0, chamberTop, 0])
  mesh(
    new THREE.RingGeometry(38, 45, 64),
    copper,
    engine,
    [0, chamberTop - 330, 0],
    [Math.PI / 2, 0, 0]
  )
  // Thermocouples clamped to the chamber wall
  for (const [angle, y] of [
    [0.4, -110],
    [2.3, -200],
    [4.1, -150]
  ]) {
    const x = Math.cos(angle) * 53
    const z = Math.sin(angle) * 53
    mesh(
      new THREE.CylinderGeometry(54, 54, 6, 48, 1, true, angle - 0.18, 0.36),
      stainless,
      engine,
      [0, chamberTop + y, 0]
    )
    tube(
      [
        [x, E + chamberTop + y, z],
        [x * 1.3, E + chamberTop + y + 30, z * 1.3],
        [x * 2.2, E + chamberTop + y + 120, z * 2.2],
        [Math.sign(x) * (half - 24), E + 40, Math.sign(z) * (half - 24)],
        [Math.sign(x) * (half - 24), topY - 60, Math.sign(z) * (half - 24)]
      ],
      1.6,
      wireYellow,
      stand,
      24
    )
  }
  // Pyro igniter leads hanging out of the nozzle (they get spat out at ignition)
  const igniter = new THREE.Group()
  engine.add(igniter)
  tube(
    [
      [2, chamberTop - 140, 0],
      [3, chamberTop - 260, 2],
      [4, chamberTop - 340, 3],
      [16, chamberTop - 420, 12],
      [60, chamberTop - 520, 40],
      [120, chamberTop - 600, 70]
    ],
    1.4,
    wireRed,
    igniter,
    30
  )
  tube(
    [
      [-2, chamberTop - 140, 0],
      [-3, chamberTop - 260, -2],
      [-4, chamberTop - 340, -3],
      [10, chamberTop - 420, 18],
      [52, chamberTop - 520, 52],
      [110, chamberTop - 600, 82]
    ],
    1.4,
    black,
    igniter,
    30
  )

  // Run valves on the side of the frame: ball valves with pneumatic actuators.
  const valve = (x, y, z, rotation) => {
    const group = new THREE.Group()
    group.position.set(x, y, z)
    group.rotation.y = rotation
    stand.add(group)
    mesh(new THREE.BoxGeometry(56, 46, 46), stainless, group)
    mesh(
      new THREE.CylinderGeometry(13, 13, 90, 6),
      stainless,
      group,
      [0, 0, 0],
      [0, 0, Math.PI / 2]
    )
    mesh(new THREE.BoxGeometry(70, 40, 62), aluminium, group, [0, 48, 0])
    mesh(new THREE.CylinderGeometry(22, 22, 110, 24), red, group, [0, 48, 0], [0, 0, Math.PI / 2])
    for (const side of [-1, 1])
      mesh(
        new THREE.CylinderGeometry(24, 24, 8, 24),
        darkSteel,
        group,
        [side * 56, 48, 0],
        [0, 0, Math.PI / 2]
      )
    mesh(new THREE.BoxGeometry(24, 18, 18), black, group, [0, 76, 0])
    return group
  }
  const oxValve = valve(-half - 70, 960, -60, 0)
  const fuelValve = valve(half + 70, 900, 60, 0)
  // Brackets tying the valves to the posts
  mesh(new THREE.BoxGeometry(80, 10, 30), aluminium, stand, [-half - 30, 935, -60])
  mesh(new THREE.BoxGeometry(80, 10, 30), aluminium, stand, [half + 30, 875, 60])

  // Braided feed lines: valve → injector, and back off the pad toward the run tanks.
  const ox = oxValve.position
  const fuel = fuelValve.position
  tube(
    [
      [ox.x + 45, ox.y, ox.z],
      [ox.x + 110, ox.y + 20, ox.z * 0.6],
      [-190, E - 10, -30],
      [-125, E - 20, 0],
      [-97, E - 20, 0]
    ],
    9,
    braid,
    stand
  )
  tube(
    [
      [fuel.x - 45, fuel.y, fuel.z],
      [fuel.x - 110, fuel.y + 30, fuel.z * 0.6],
      [190, E - 10, 30],
      [125, E - 20, 0],
      [97, E - 20, 0]
    ],
    8,
    braid,
    stand
  )
  tube(
    [
      [ox.x - 45, ox.y, ox.z],
      [ox.x - 160, ox.y - 120, ox.z - 80],
      [ox.x - 260, 40, -700],
      [ox.x - 320, 22, -2400]
    ],
    11,
    braid,
    stand
  )
  tube(
    [
      [fuel.x + 45, fuel.y, fuel.z],
      [fuel.x + 160, fuel.y - 120, fuel.z - 80],
      [fuel.x + 260, 40, -700],
      [fuel.x + 340, 22, -2400]
    ],
    10,
    braid,
    stand
  )
  // Line pressure transducers on each run line
  for (const [x, y, z] of [
    [ox.x + 70, ox.y + 18, ox.z * 0.8],
    [fuel.x - 70, fuel.y + 30, fuel.z * 0.85]
  ]) {
    mesh(new THREE.CylinderGeometry(9, 9, 40, 20), stainless, stand, [x, y + 26, z])
    mesh(new THREE.CylinderGeometry(6, 6, 14, 16), black, stand, [x, y + 52, z])
  }

  // DAQ box at the foot of the stand with its harness up a post
  mesh(new THREE.BoxGeometry(220, 140, 120), grey, stand, [half + 150, 82, -half + 40])
  mesh(new THREE.BoxGeometry(222, 10, 122), darkSteel, stand, [half + 150, 150, -half + 40])
  for (let i = 0; i < 4; i++)
    mesh(new THREE.CylinderGeometry(7, 7, 16, 12), black, stand, [
      half + 70 + i * 22,
      150,
      -half - 22
    ])
  tube(
    [
      [half + 110, 150, -half - 22],
      [half + 40, 300, -half - 20],
      [half + 22, 700, -half - 22],
      [half + 22, 1100, -half - 22],
      [half - 10, topY - 200, -half + 60]
    ],
    6,
    black,
    stand,
    30
  )

  // Deflector plate where the plume hits the pad
  const deflector = mesh(
    new THREE.BoxGeometry(300, 12, 360),
    darkSteel,
    stand,
    [0, 120, 30],
    [-0.75, 0, 0]
  )
  mesh(new THREE.BoxGeometry(12, 160, 300), darkSteel, stand, [-150, 80, 30])
  mesh(new THREE.BoxGeometry(12, 160, 300), darkSteel, stand, [150, 80, 30])
  deflector.userData.receives = true

  // Plume with shock diamonds. Exit is at chamberTop - 330 in engine space.
  const exitY = engine.position.y + chamberTop - 330
  const plume = new THREE.Group()
  plume.position.y = exitY
  stand.add(plume)
  const additive = (color, map, opacity = 1) =>
    new THREE.MeshBasicMaterial({
      color,
      map,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  const plumeMap = plumeTexture()
  const envelope = mesh(
    new THREE.CylinderGeometry(38, 70, 640, 40, 1, true),
    additive('#ffffff', plumeMap, 0.7),
    plume,
    [0, -320, 0]
  )
  const core = mesh(
    new THREE.CylinderGeometry(30, 46, 420, 32, 1, true),
    additive('#ffd9a8', plumeMap, 0.9),
    plume,
    [0, -210, 0]
  )
  const diamonds = []
  const diamond = new THREE.OctahedronGeometry(1, 0)
  for (let i = 0; i < 5; i++) {
    const node = mesh(diamond, additive('#fff1d0', null, 1), plume, [0, -64 - i * 82, 0])
    node.scale.set(20 - i * 2, 30, 20 - i * 2)
    const halo = mesh(diamond, additive('#ff9a5a', null, 0.5), node)
    halo.scale.set(1.6, 1.35, 1.6)
    diamonds.push(node)
  }
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  )
  glow.scale.set(260, 260, 1)
  glow.position.y = -30
  plume.add(glow)
  const light = new THREE.PointLight('#ffa060', 0, 6, 1.4)
  plume.add(light)
  light.position.y = -0.18 / MM

  const anchors = {}
  const anchor = (name, parent, position) => {
    const point = new THREE.Object3D()
    point.position.set(...position)
    parent.add(point)
    anchors[name] = point
  }
  anchor('engine-chamber', engine, [52, chamberTop - 120, 0])
  anchor('engine-loadcell', loadCell, [34, -23, 0])
  anchor('engine-valve', oxValve, [0, 70, 0])

  return {
    object,
    anchors,
    height: FRAME_H * MM,
    width: (FRAME_W + 400) * MM,
    // 0 → cold, 1 → full thrust
    setFire(amount, time) {
      plume.visible = amount > 0.01
      igniter.visible = amount < 0.02
      if (!plume.visible) {
        light.intensity = 0
        return
      }
      const flicker = 1 + Math.sin(time * 53) * 0.04 + Math.sin(time * 37.7) * 0.03
      plume.scale.set(1, amount * flicker, 1)
      envelope.material.opacity = 0.7 * amount
      core.material.opacity = 0.9 * amount
      diamonds.forEach((node, i) => {
        const level = Math.max(0, (1 - i * 0.17) * amount * (0.9 + Math.sin(time * 41 + i) * 0.1))
        node.material.opacity = level
        node.children[0].material.opacity = level * 0.45
      })
      glow.material.opacity = amount
      light.intensity = 3.2 * amount * flicker
    }
  }
}
