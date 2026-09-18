import * as THREE from 'three'

// Paint wraps around the model, so the lettering and badge rotate with the airframe.
export function createRocketLivery() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 2048
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#f3f1e9'
  ctx.fillRect(0, 0, 1024, 2048)
  ctx.fillStyle = '#cf142b'
  for (const x of [0, 512]) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + 390, 0)
    ctx.lineTo(x + 240, 275)
    ctx.lineTo(x + 165, 275)
    ctx.lineTo(x + 295, 55)
    ctx.lineTo(x, 130)
    ctx.closePath()
    ctx.fill()
  }
  for (const x of [256, 768]) {
    ctx.save()
    ctx.translate(x, 1300)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = '#202126'
    ctx.font = '500 92px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GUELPH ROCKETRY', 0, 0, 1160)
    ctx.restore()
  }
  const body = new THREE.CanvasTexture(canvas)
  body.colorSpace = THREE.SRGBColorSpace
  body.anisotropy = 4
  const logo = new Image()
  logo.onload = () => {
    for (const x of [256, 768]) {
      ctx.drawImage(logo, x - 86, 380, 172, 202)
    }
    body.needsUpdate = true
  }
  logo.src = '/Images/rocketrylogo.png'
  body.addEventListener('dispose', () => { logo.onload = null })

  const finCanvas = document.createElement('canvas')
  finCanvas.width = 512
  finCanvas.height = 768
  const paint = finCanvas.getContext('2d')
  paint.fillStyle = '#f3f1e9'
  paint.fillRect(0, 0, 512, 768)
  paint.strokeStyle = '#cf142b'
  paint.lineWidth = 52
  paint.lineJoin = 'miter'
  for (const offset of [0, 140, 280, 420]) {
    paint.beginPath()
    paint.moveTo(-35, 770 - offset)
    paint.lineTo(28, 35 - offset)
    paint.lineTo(570, 610 - offset)
    paint.stroke()
  }
  const fins = new THREE.CanvasTexture(finCanvas)
  fins.colorSpace = THREE.SRGBColorSpace
  fins.anisotropy = 4
  return { body, fins }
}
