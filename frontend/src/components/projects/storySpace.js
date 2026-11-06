import * as THREE from 'three'
import { isLand } from './landMask'

export const GUELPH = { lat: 43.55, lon: -80.25 }

// Same convention for every surface point: longitude 0 faces +Z, north is +Y.
export function latLonToVector(lat, lon, radius = 1, target = new THREE.Vector3()) {
  const phi = THREE.MathUtils.degToRad(lat)
  const lambda = THREE.MathUtils.degToRad(lon)
  return target.set(Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda)).multiplyScalar(radius)
}

export function createStars(count = 2600) {
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const tints = [new THREE.Color('#ffffff'), new THREE.Color('#cfe1ff'), new THREE.Color('#9fc4ff'), new THREE.Color('#ffe9c4')]
  const point = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    point.randomDirection().multiplyScalar(70 + Math.random() * 50)
    point.toArray(positions, i * 3)
    const bright = Math.random() ** 6
    sizes[i] = 1.1 + bright * 3.4
    phases[i] = Math.random()
    tints[Math.floor(Math.random() * tints.length)].toArray(colors, i * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uOpacity: { value: 1 } },
    vertexShader: `
      attribute float aSize; attribute float aPhase; attribute vec3 aColor;
      uniform float uTime; uniform float uPixelRatio;
      varying vec3 vColor; varying float vTwinkle;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPixelRatio;
        vTwinkle = 0.62 + 0.38 * sin(uTime * (0.4 + aPhase * 1.3) + aPhase * 40.0);
        vColor = aColor;
      }`,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vColor; varying float vTwinkle;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, a * a * vTwinkle * uOpacity);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const object = new THREE.Points(geometry, material)
  object.frustumCulled = false
  object.renderOrder = -10
  return { object, material }
}

export function createEarth(radius = 2.4) {
  const object = new THREE.Group()
  const tilt = new THREE.Group()
  const spin = new THREE.Group()
  object.add(tilt)
  tilt.add(spin)
  const sun = { value: new THREE.Vector3(-0.55, 0.45, 0.7).normalize() }

  const base = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.992, 72, 48),
    new THREE.ShaderMaterial({
      uniforms: { uSun: sun },
      vertexShader: `
        varying vec3 vWorldNormal;
        void main() {
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 uSun;
        varying vec3 vWorldNormal;
        void main() {
          float light = clamp(dot(normalize(vWorldNormal), uSun), 0.0, 1.0);
          gl_FragColor = vec4(mix(vec3(0.006, 0.014, 0.03), vec3(0.03, 0.075, 0.14), light), 1.0);
        }`
    })
  )
  spin.add(base)

  // Fibonacci lattice: an even spread of dots, brighter where there is land.
  const count = 22000
  const positions = new Float32Array(count * 3)
  const landFlags = new Float32Array(count)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - 2 * (i + 0.5) / count
    const r = Math.sqrt(1 - y * y)
    const theta = i * golden
    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    const lat = THREE.MathUtils.radToDeg(Math.asin(y))
    const lon = THREE.MathUtils.radToDeg(Math.atan2(x, z))
    positions[i * 3] = x * radius
    positions[i * 3 + 1] = y * radius
    positions[i * 3 + 2] = z * radius
    landFlags[i] = isLand(lon, lat) ? 1 : 0
  }
  const dotGeometry = new THREE.BufferGeometry()
  dotGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  dotGeometry.setAttribute('aLand', new THREE.BufferAttribute(landFlags, 1))
  const dotMaterial = new THREE.ShaderMaterial({
    uniforms: { uSun: sun, uPixelRatio: { value: 1 }, uScale: { value: 1 } },
    vertexShader: `
      attribute float aLand;
      uniform vec3 uSun; uniform float uPixelRatio; uniform float uScale;
      varying float vLand; varying float vLight; varying float vFacing;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 viewNormal = normalize(normalMatrix * position);
        vFacing = dot(viewNormal, normalize(-mv.xyz));
        vLight = clamp(dot(normalize(mat3(modelMatrix) * position), uSun) * 0.9 + 0.3, 0.0, 1.0);
        vLand = aLand;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = mix(1.25, 2.5, aLand) * uPixelRatio * uScale / -mv.z;
      }`,
    fragmentShader: `
      varying float vLand; varying float vLight; varying float vFacing;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        vec3 land = mix(vec3(0.26, 0.45, 0.74), vec3(0.88, 0.95, 1.0), vLight);
        vec3 color = mix(vec3(0.16, 0.29, 0.47), land, vLand);
        float alpha = mix(0.2, 0.95, vLand) * smoothstep(0.5, 0.1, d) * smoothstep(0.0, 0.32, vFacing) * mix(0.3, 1.0, vLight);
        gl_FragColor = vec4(color, alpha);
      }`,
    transparent: true,
    depthWrite: false
  })
  const dots = new THREE.Points(dotGeometry, dotMaterial)
  dots.renderOrder = 1
  spin.add(dots)

  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: { uSun: sun, uStrength: { value: 1 } },
    vertexShader: `
      varying vec3 vNormal; varying vec3 vView; varying vec3 vWorldNormal;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uSun; uniform float uStrength;
      varying vec3 vNormal; varying vec3 vView; varying vec3 vWorldNormal;
      void main() {
        float facing = clamp(dot(vNormal, vView), 0.0, 1.0);
        float glow = smoothstep(0.0, 0.3, facing) * pow(1.0 - facing, 4.0) * 3.2;
        float day = 0.55 + 0.45 * clamp(dot(vWorldNormal, uSun) + 0.35, 0.0, 1.0);
        gl_FragColor = vec4(vec3(0.33, 0.6, 1.0) * glow * day * uStrength, 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const glow = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.12, 72, 48), glowMaterial)
  glow.renderOrder = 2
  object.add(glow)

  // Ground station marker
  const guelph = new THREE.Group()
  latLonToVector(GUELPH.lat, GUELPH.lon, radius * 1.004, guelph.position)
  guelph.lookAt(guelph.position.clone().multiplyScalar(2))
  spin.add(guelph)
  const markerMaterial = new THREE.MeshBasicMaterial({ color: '#ffcf28' })
  guelph.add(new THREE.Mesh(new THREE.CircleGeometry(0.028, 24), markerMaterial))
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: '#ffcf28', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.062, 40), pulseMaterial)
  guelph.add(pulse)
  const guelphAnchor = new THREE.Object3D()
  guelph.add(guelphAnchor)

  // Orbit ring: a near-polar circle that passes over Guelph when the globe faces the camera.
  const displaySpin = -THREE.MathUtils.degToRad(GUELPH.lon) + 0.55
  const station = latLonToVector(GUELPH.lat, GUELPH.lon).applyAxisAngle(new THREE.Vector3(0, 1, 0), displaySpin)
  const pole = new THREE.Vector3(0, 1, 0)
  const normal = new THREE.Vector3().crossVectors(station, pole).normalize().applyAxisAngle(station, THREE.MathUtils.degToRad(8))
  const north = new THREE.Vector3().crossVectors(normal, station).normalize()
  const orbitRadius = radius * 1.26
  const orbitStart = -1.6
  const orbitPoint = (angle, target = new THREE.Vector3()) => target.copy(station).multiplyScalar(Math.cos(angle)).addScaledVector(north, Math.sin(angle)).multiplyScalar(orbitRadius)
  const path = new THREE.CatmullRomCurve3(Array.from({ length: 160 }, (_, i) => orbitPoint(orbitStart + i / 160 * Math.PI * 2)), true)
  const ringGeometry = new THREE.TubeGeometry(path, 320, 0.006, 6, true)
  const ringMaterial = new THREE.MeshBasicMaterial({ color: '#9cc8ff', transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  const ringIndexCount = ringGeometry.index.count
  ring.renderOrder = 3
  tilt.add(ring)

  const beamGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
  const beamMaterial = new THREE.LineBasicMaterial({ color: '#ffcf28', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const beam = new THREE.Line(beamGeometry, beamMaterial)
  beam.frustumCulled = false
  beam.renderOrder = 4
  object.add(beam)

  const scratch = new THREE.Vector3()
  return {
    object,
    tilt,
    spin,
    radius,
    displaySpin,
    orbitStart,
    guelph,
    guelphAnchor,
    setPixelRatio(ratio) {
      dotMaterial.uniforms.uPixelRatio.value = ratio
    },
    setDotScale(scale) {
      dotMaterial.uniforms.uScale.value = scale
    },
    // Orbit position in world space for an angle measured from the Guelph overpass.
    orbitWorld(angle, target) {
      orbitPoint(angle, target)
      return tilt.localToWorld(target)
    },
    setRing(drawn, opacity) {
      ring.visible = drawn > 0.001 && opacity > 0.001
      ring.geometry.setDrawRange(0, Math.floor(ringIndexCount * drawn / 3) * 3)
      ringMaterial.opacity = 0.75 * opacity
    },
    setBeam(from, strength) {
      beam.visible = strength > 0.01
      if (!beam.visible) return
      const attribute = beamGeometry.attributes.position
      object.worldToLocal(scratch.copy(from))
      attribute.setXYZ(0, scratch.x, scratch.y, scratch.z)
      guelph.getWorldPosition(scratch)
      object.worldToLocal(scratch)
      attribute.setXYZ(1, scratch.x, scratch.y, scratch.z)
      attribute.needsUpdate = true
      beamMaterial.opacity = strength
    },
    pulse(time, strength) {
      const cycle = (time * 0.6) % 1
      pulse.scale.setScalar(1 + cycle * 2.4)
      pulseMaterial.opacity = (1 - cycle) * strength
      markerMaterial.color.set(strength > 0.05 ? '#ffcf28' : '#6d8bb0')
    }
  }
}
