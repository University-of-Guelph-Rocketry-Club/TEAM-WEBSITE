import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createStoryRocket } from '../projects/storyRocket'

// Our rocket floating on its side with a sponsor decal down the parachute bay, turned so the
// decal faces you. It rolls a little back and forth so you can tell it's a real round airframe.
export function mountSponsorScene(host, onFailure) {
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
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 60)
  const generator = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = generator.fromScene(room, 0.04)
  room.dispose()
  generator.dispose()
  scene.environment = environment.texture
  scene.environmentIntensity = 0.7
  scene.add(new THREE.HemisphereLight('#dfe9ff', '#0b1626', 0.6))
  const key = new THREE.DirectionalLight('#fff1dc', 2.6)
  key.position.set(-3, 5, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight('#86b6ff', 2)
  rim.position.set(4, -2, -5)
  scene.add(rim)

  const rocket = createStoryRocket({ decal: true })
  rocket.setExplode(0, 0, 0)
  rocket.setBurn(0, 0, true)
  const holder = new THREE.Group()
  holder.add(rocket.object)
  scene.add(holder)

  const canvas = renderer.domElement
  host.appendChild(canvas)

  let aspect = 1
  const focus = new THREE.Vector3()
  let disposed = false
  let visible = true
  let frame = 0
  const resize = () => {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height) return
    aspect = width / height
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    camera.aspect = aspect
    // A close-up on the parachute bay where the decal is, with the rest of the rocket running off
    // the bottom left. On wide screens the copy sits on the left, so frame the decal right of centre.
    const wide = width > 900
    rocket.object.rotation.z = -Math.PI / 2 + 0.42
    holder.position.y = 0
    holder.updateMatrixWorld(true)
    rocket.object.localToWorld(focus.set(0, 0.6, 0))
    const across = wide ? 4.2 : 2.6
    const distance = across / 2 / (Math.tan(THREE.MathUtils.degToRad(12)) * aspect)
    camera.position.set(focus.x, focus.y + 0.12, distance)
    camera.lookAt(focus.x, focus.y, 0)
    if (wide) camera.setViewOffset(width, height, -width * 0.16, -height * 0.02, width, height)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()
  }

  const render = now => {
    frame = 0
    if (disposed || !visible) return
    const time = motion.matches ? 0 : now / 1000
    // u = 0.75 on the airframe faces +x, so a quarter turn back brings it round to the camera.
    rocket.spin.rotation.y = -Math.PI / 2 + 0.3 + Math.sin(time * 0.6) * 0.2
    holder.position.y = Math.sin(time * 0.9) * 0.04
    holder.rotation.x = Math.sin(time * 0.45) * 0.05
    renderer.render(scene, camera)
    if (!motion.matches && !document.hidden) frame = requestAnimationFrame(render)
  }
  const start = () => {
    if (!frame && !disposed && visible) frame = requestAnimationFrame(render)
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
  })
  observer.observe(host)
  const resizeObserver = new ResizeObserver(() => {
    resize()
    start()
  })
  resizeObserver.observe(host)
  const onVisibility = () => !document.hidden && start()
  document.addEventListener('visibilitychange', onVisibility)
  const lost = event => {
    event.preventDefault()
    disposed = true
    onFailure()
  }
  canvas.addEventListener('webglcontextlost', lost)
  resize()
  start()

  return {
    setText(text) {
      rocket.setDecal(text)
      start()
    },
    release() {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', lost)
      const textures = new Set()
      scene.traverse(object => {
        object.geometry?.dispose()
        ;[object.material]
          .flat()
          .filter(Boolean)
          .forEach(material => {
            for (const value of Object.values(material)) if (value?.isTexture) textures.add(value)
            material.dispose()
          })
      })
      textures.forEach(texture => texture.dispose())
      environment.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
  }
}
