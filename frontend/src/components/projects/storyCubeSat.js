import * as THREE from 'three'

// Illustrative 3U CubeSat (about 10 x 10 x 34 cm) with hinged solar wings and tape antennas.
const W = 0.3
const H = 1.0

export function createStoryCubeSat() {
  const object = new THREE.Group()
  const body = new THREE.Group()
  object.add(body)

  const standard = (color, metalness, roughness, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const frame = standard('#c7cfd8', 0.9, 0.28)
  const cells = standard('#16337a', 0.55, 0.2, { envMapIntensity: 1.4 })
  const busbar = standard('#d5dbe2', 0.95, 0.2)
  const substrate = standard('#262b33', 0.5, 0.5)
  const gold = standard('#d9a944', 0.9, 0.32)
  const radiator = standard('#eef1f4', 0.05, 0.5)
  const tape = standard('#e8e2cf', 0.7, 0.35)
  const dark = standard('#171b21', 0.4, 0.5)

  const box = (size, material, parent, position = [0, 0, 0]) => {
    const part = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
    part.position.set(...position)
    parent.add(part)
    return part
  }
  const anchor = (parent, position) => {
    const point = new THREE.Object3D()
    point.position.set(...position)
    parent.add(point)
    return point
  }
  // A panel of solar cells on a dark substrate, facing local +Z.
  const panel = (width, height, columns, rows, parent) => {
    box([width, height, 0.01], substrate, parent)
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const px = (x + 0.5) * width / columns - width / 2
        const py = (y + 0.5) * height / rows - height / 2
        box([width / columns - 0.018, height / rows - 0.016, 0.004], cells, parent, [px, py, 0.006])
        box([width / columns - 0.03, 0.003, 0.005], busbar, parent, [px, py + height / rows * 0.32, 0.007])
      }
    }
  }

  // Structure: four corner rails and end plates.
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) box([0.03, H + 0.04, 0.03], frame, body, [x * (W / 2 - 0.012), 0, z * (W / 2 - 0.012)])
  }
  for (const y of [-1, 1]) {
    box([W - 0.02, 0.018, W - 0.02], gold, body, [0, y * H / 2, 0])
    for (const x of [-1, 1]) box([0.03, 0.02, W], frame, body, [x * (W / 2 - 0.012), y * (H / 2 + 0.005), 0])
  }
  box([W - 0.024, H - 0.02, W - 0.024], dark, body)

  // Body-mounted cells on the front, a white radiator on the back.
  const front = new THREE.Group()
  front.position.z = W / 2 - 0.002
  body.add(front)
  panel(W - 0.05, H - 0.06, 2, 6, front)
  const back = box([W - 0.05, H - 0.06, 0.008], radiator, body, [0, 0, -W / 2 + 0.002])
  for (let i = 0; i < 9; i++) box([W - 0.07, 0.004, 0.004], frame, back, [0, (i - 4) * 0.1, -0.005])
  box([0.12, 0.12, 0.012], gold, body, [0, H / 2 + 0.012, 0]).rotation.x = Math.PI / 2

  // Deployable wings, hinged on the front edges. Folded, they lie flat on the side faces.
  const wings = [-1, 1].map(side => {
    const pivot = new THREE.Group()
    pivot.position.set(side * (W / 2 + 0.008), 0, W / 2 + 0.008)
    body.add(pivot)
    const leaf = new THREE.Group()
    leaf.position.x = side * (W / 2 + 0.004)
    pivot.add(leaf)
    panel(W - 0.012, H - 0.04, 2, 6, leaf)
    for (const y of [-0.3, 0.3]) box([0.03, 0.05, 0.016], frame, pivot, [0, y, -0.004])
    return { pivot, side, tip: anchor(leaf, [side * (W / 2 - 0.03), -0.12, 0.01]) }
  })

  // Four tape antennas on the top plate, unrolling outward.
  const antennas = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([x, z]) => {
    const pivot = new THREE.Group()
    pivot.position.set(x * (W / 2 - 0.03), H / 2 + 0.02, z * (W / 2 - 0.03))
    pivot.rotation.y = Math.atan2(-z, x)
    body.add(pivot)
    const strip = box([1, 0.004, 0.012], tape, pivot)
    strip.geometry.translate(0.5, 0, 0)
    box([0.04, 0.02, 0.03], dark, pivot)
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
      for (const wing of wings) wing.pivot.rotation.y = wing.side * (1 - wingAmount) * Math.PI / 2
      const length = 0.03 + antennaAmount * 0.5
      for (const antenna of antennas) {
        antenna.strip.scale.x = length
        antenna.strip.visible = antennaAmount > 0.001
      }
      antennaTip.position.x = length
    }
  }
}
