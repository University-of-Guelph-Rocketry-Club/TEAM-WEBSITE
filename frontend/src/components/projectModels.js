import * as THREE from 'three'
import { createRocketLivery } from './rocketLivery'

// Illustrative hardware, not CAD of the club's final designs.
export function createProjectModel(kind) {
  const model = new THREE.Group()
  const material = (color, metalness = 0.7, roughness = 0.3) => new THREE.MeshStandardMaterial({ color, metalness, roughness })
  const steel = material('#b9c4cf', 0.9, 0.25)
  const dark = material('#242b35', 0.7, 0.36)
  const red = material('#b51d30', 0.35, 0.3)
  const gold = material('#dbad4c', 0.82, 0.3)
  const white = material('#f0f1ef', 0.25, 0.33)
  const copper = material('#b86c3b', 0.83, 0.26)
  const mesh = (geometry, surface, position = [0, 0, 0], parent = model) => {
    const part = new THREE.Mesh(geometry, surface)
    part.position.set(...position)
    part.castShadow = true
    part.receiveShadow = true
    parent.add(part)
    return part
  }
  const box = (size, surface, position, parent) => mesh(new THREE.BoxGeometry(...size), surface, position, parent)
  const cylinder = (top, bottom, height, surface, position, parent) => mesh(new THREE.CylinderGeometry(top, bottom, height, 32), surface, position, parent)
  const ring = (radius, thickness, surface, position, parent) => {
    const part = mesh(new THREE.TorusGeometry(radius, thickness, 8, 40), surface, position, parent)
    part.rotation.x = Math.PI / 2
    return part
  }
  const beam = (from, to, width, surface = steel) => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const part = box([width, start.distanceTo(end), width], surface, start.clone().add(end).multiplyScalar(0.5).toArray())
    part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize())
    return part
  }
  const pipe = (points, radius, surface = copper) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))), 28, radius, 8, false), surface)

  if (kind === 'rocket') {
    const livery = createRocketLivery()
    const paintedBody = new THREE.MeshStandardMaterial({ map: livery.body, metalness: 0, roughness: 0.72, envMapIntensity: 0.25 })
    const paintedFins = new THREE.MeshStandardMaterial({ map: livery.fins, metalness: 0, roughness: 0.72, envMapIntensity: 0.25 })
    const nosePaint = material('#cf142b', 0.15, 0.35)
    const airframe = cylinder(0.125, 0.125, 2.5, paintedBody, [0, 0, 0])
    airframe.rotation.y = -Math.PI / 2
    const nose = [[0.125, 0], [0.12, 0.12], [0.101, 0.29], [0.07, 0.46], [0.034, 0.62], [0, 0.76]]
    mesh(new THREE.LatheGeometry(nose.map(([x, y]) => new THREE.Vector2(x, y)), 40), nosePaint, [0, 1.25, 0])
    for (const y of [-0.16, 0.65, 1.248]) ring(0.1255, 0.0015, dark, [0, y, 0])
    cylinder(0.08, 0.095, 0.08, dark, [0, -1.28, 0])
    ring(0.094, 0.009, steel, [0, -1.32, 0])
    const fin = new THREE.Shape()
    fin.moveTo(0.12, -0.61)
    fin.lineTo(0.51, -0.94)
    fin.lineTo(0.51, -1.37)
    fin.lineTo(0.12, -1.24)
    fin.closePath()
    const finGeometry = new THREE.ExtrudeGeometry(fin, { depth: 0.012, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 1, steps: 1 })
    const positions = finGeometry.attributes.position
    const uv = finGeometry.attributes.uv
    for (let i = 0; i < positions.count; i++) {
      uv.setXY(i, (positions.getX(i) - 0.12) / 0.39, (positions.getY(i) + 1.37) / 0.76)
    }
    for (let i = 0; i < 4; i++) {
      const part = mesh(finGeometry, paintedFins)
      part.rotation.y = i * Math.PI / 2
    }
    // Small rail buttons on the back of the airframe.
    for (const y of [-0.45, 0.48]) {
      const button = cylinder(0.014, 0.014, 0.023, steel, [0, y, -0.132])
      button.rotation.x = Math.PI / 2
    }
    model.rotation.z = -0.22
  } else if (kind === 'cubesat') {
    const cells = material('#132c60', 0.52, 0.21)
    box([0.82, 1.2, 0.82], gold, [0, 0, 0])
    for (const x of [-0.46, 0.46]) {
      for (const z of [-0.46, 0.46]) box([0.065, 1.4, 0.065], steel, [x, 0, z])
    }
    for (const y of [-0.64, 0.64]) {
      for (const z of [-0.46, 0.46]) box([0.92, 0.06, 0.065], steel, [0, y, z])
      for (const x of [-0.46, 0.46]) box([0.065, 0.06, 0.92], steel, [x, y, 0])
    }
    const panel = (width, height, columns, rows, parent) => {
      box([width, height, 0.04], dark, [0, 0, 0], parent)
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          const px = (x + 0.5) * width / columns - width / 2
          const py = (y + 0.5) * height / rows - height / 2
          box([width / columns - 0.03, height / rows - 0.025, 0.005], cells, [px, py, 0.024], parent)
          box([width / columns - 0.04, 0.003, 0.006], steel, [px, py, 0.029], parent)
        }
      }
    }
    for (const side of [-1, 1]) {
      const wing = new THREE.Group()
      wing.position.set(side * 1.14, 0, 0)
      wing.rotation.y = side * -0.14
      model.add(wing)
      panel(1.15, 1.16, 3, 6, wing)
      box([0.18, 0.04, 0.06], steel, [side * 0.53, 0.35, 0])
      box([0.18, 0.04, 0.06], steel, [side * 0.53, -0.35, 0])
    }
    for (let side = 0; side < 4; side++) {
      const face = new THREE.Group()
      face.rotation.y = side * Math.PI / 2
      face.position.set(Math.sin(face.rotation.y) * 0.43, 0, Math.cos(face.rotation.y) * 0.43)
      model.add(face)
      panel(0.72, 1.12, 2, 5, face)
    }
    box([0.62, 0.025, 0.62], dark, [0, 0.64, 0])
    cylinder(0.14, 0.14, 0.09, steel, [0, 0.7, 0])
    cylinder(0.11, 0.11, 0.015, dark, [0, 0.751, 0])
    for (const side of [-1, 1]) {
      beam([side * 0.25, 0.66, 0.2], [side * 0.65, 1.16, 0.35], 0.012)
    }
    model.rotation.z = -0.13
  } else {
    // Open steel test frame with raised engine mount and visible exhaust bell.
    for (const x of [-0.7, 0.7]) {
      for (const z of [-0.48, 0.48]) {
        beam([x, -1.15, z], [x, 0.72, z], 0.065)
        box([0.26, 0.05, 0.23], dark, [x, -1.17, z])
        for (const dx of [-0.075, 0.075]) cylinder(0.025, 0.025, 0.023, steel, [x + dx, -1.13, z])
      }
      for (const y of [-1.08, 0.46, 0.72]) beam([x, y, -0.48], [x, y, 0.48], 0.065)
      beam([x, -1.08, -0.48], [x, 0.46, 0.48], 0.035)
    }
    for (const y of [-1.08, 0.46, 0.72]) {
      for (const z of [-0.48, 0.48]) beam([-0.7, y, z], [0.7, y, z], 0.065)
    }
    box([0.63, 0.08, 0.6], steel, [0, 0.46, 0])
    cylinder(0.2, 0.2, 0.4, copper, [0, 0.24, 0])
    for (let y = 0.08; y < 0.42; y += 0.045) ring(0.2, 0.013, copper, [0, y, 0])
    cylinder(0.25, 0.25, 0.065, steel, [0, 0.48, 0])
    const bell = [[0.2, 0], [0.17, -0.09], [0.115, -0.19], [0.13, -0.29], [0.2, -0.43], [0.31, -0.61], [0.35, -0.66]]
    const nozzleSurface = material('#6d6864', 0.87, 0.26)
    nozzleSurface.side = THREE.DoubleSide
    mesh(new THREE.LatheGeometry(bell.map(([x, y]) => new THREE.Vector2(x, y)), 48), nozzleSurface, [0, 0.04, 0])
    ring(0.35, 0.018, copper, [0, -0.62, 0])
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4
      cylinder(0.023, 0.023, 0.035, dark, [Math.cos(angle) * 0.225, 0.53, Math.sin(angle) * 0.225])
    }
    // Feed tanks, retaining straps, pressure gauges, valves, and copper tubing.
    for (const side of [-1, 1]) {
      const x = side * 0.44
      cylinder(0.16, 0.16, 0.81, side === -1 ? white : steel, [x, 1.12, 0.14])
      for (const y of [0.715, 1.525]) {
        const cap = mesh(new THREE.SphereGeometry(0.16, 24, 12), steel, [x, y, 0.14])
        cap.scale.y = 0.42
      }
      for (const y of [0.88, 1.36]) ring(0.166, 0.025, dark, [x, y, 0.14])
      cylinder(0.044, 0.044, 0.14, gold, [x, 1.64, 0.14])
      ring(0.085, 0.017, side === -1 ? red : gold, [x, 1.71, 0.14])
      pipe([[x, 1.63, 0.14], [x * 1.3, 1.62, 0.22], [x * 1.3, 0.8, 0.34], [x * 0.65, 0.62, 0.3], [0.17 * side, 0.35, 0.04]], 0.028)
      const gauge = cylinder(0.086, 0.086, 0.06, steel, [x, 0.82, 0.4])
      gauge.rotation.x = Math.PI / 2
      const dial = cylinder(0.071, 0.071, 0.008, white, [x, 0.82, 0.436])
      dial.rotation.x = Math.PI / 2
      const needle = box([0.009, 0.06, 0.009], dark, [x + 0.013, 0.83, 0.445])
      needle.rotation.z = -0.6
    }
    box([0.33, 0.29, 0.12], dark, [0.75, 0.1, 0.43])
    for (const x of [0.68, 0.8]) mesh(new THREE.SphereGeometry(0.026, 10, 8), x < 0.7 ? red : gold, [x, 0.1, 0.51])
  }

  // Normalize all three assemblies into the same presentation space.
  const bounds = new THREE.Box3().setFromObject(model)
  const center = bounds.getCenter(new THREE.Vector3())
  const size = bounds.getSize(new THREE.Vector3())
  const scale = 2.8 / Math.max(size.x, size.y, size.z)
  const root = new THREE.Group()
  model.position.sub(center)
  root.add(model)
  root.scale.setScalar(scale)
  return root
}
