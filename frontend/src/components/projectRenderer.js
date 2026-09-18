import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createProjectModel } from './projectModels'

export function mountProjectRenderer(host, kind, onFailure) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = kind === 'rocket' ? 0.9 : 1.35
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 30)
  camera.position.set(3, 1.75, 6.3)
  camera.lookAt(0, 0, 0)
  const environmentScene = new RoomEnvironment()
  const generator = new THREE.PMREMGenerator(renderer)
  const environment = generator.fromScene(environmentScene, 0.04)
  scene.environment = environment.texture
  environmentScene.dispose()
  generator.dispose()
  const model = createProjectModel(kind)
  scene.add(model)
  scene.add(new THREE.HemisphereLight(0xe5efff, 0x24334e, kind === 'rocket' ? 1 : 2))
  const key = new THREE.DirectionalLight(0xfff2dc, kind === 'rocket' ? 2 : 4)
  key.position.set(-3, 4, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x8ab9ff, kind === 'rocket' ? 1 : 3)
  rim.position.set(3, 2, -4)
  scene.add(rim)
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)
  let visible = false
  let disposed = false
  let frame = 0
  let lastTime = 0
  const draw = now => {
    frame = 0
    if (disposed || !visible || document.hidden) return
    if (!lastTime || now - lastTime >= 1000 / 30) {
      const elapsed = lastTime ? Math.min(now - lastTime, 100) / 1000 : 0
      model.rotation.y += elapsed * 0.3
      lastTime = now
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(draw)
  }
  const resume = () => {
    if (!frame && visible && !document.hidden && !disposed) {
      lastTime = 0
      frame = requestAnimationFrame(draw)
    }
  }
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (!visible) {
      cancelAnimationFrame(frame)
      frame = 0
    } else resume()
  })
  visibility.observe(host)
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height) return
    camera.aspect = width / height
    // Solar wings need extra horizontal room in the narrow card viewport.
    const distance = kind === 'cubesat'
      ? Math.max(7.2, 1.65 / (Math.tan(THREE.MathUtils.degToRad(16.5)) * camera.aspect))
      : kind === 'rocket' ? 6 : 7.2
    camera.position.set(3, 1.75, 6.3).normalize().multiplyScalar(distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    if (visible) renderer.render(scene, camera)
  })
  resize.observe(host)
  const handleVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame)
      frame = 0
    } else resume()
  }
  const lost = event => {
    event.preventDefault()
    disposed = true
    cancelAnimationFrame(frame)
    frame = 0
    visible = false
    onFailure()
  }
  canvas.addEventListener('webglcontextlost', lost)
  document.addEventListener('visibilitychange', handleVisibility)
  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    visibility.disconnect()
    resize.disconnect()
    canvas.removeEventListener('webglcontextlost', lost)
    document.removeEventListener('visibilitychange', handleVisibility)
    const geometries = new Set()
    const materials = new Set()
    const textures = new Set()
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry)
      if (object.material) materials.add(object.material)
    })
    geometries.forEach(geometry => geometry.dispose())
    materials.forEach(material => {
      if (material.map) textures.add(material.map)
      material.dispose()
    })
    textures.forEach(texture => texture.dispose())
    environment.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}
