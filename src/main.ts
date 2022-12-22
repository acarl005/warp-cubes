import "./style.css"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
scene.background = null
document.body.appendChild(renderer.domElement)

function shrinkFactor(a: number): number {
  return -1 * Math.abs(a - 4) + 4
}

for (let z = 0; z < 9; z++) {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const show = (
        (x === 0 && (y < 2 || y > 6 || z < 2 || z > 6)) ||
        x === 8 ||
        (y === 0 && (x < 2 || x > 6 || z < 2 || z > 6)) ||
        y === 8 ||
        (z === 0 && (x < 2 || x > 6 || y < 2 || y > 6)) ||
        z === 8
      )
      if (!show) {
        continue
      }

      const xEdge = x === 0 || x === 8
      const yEdge = y === 0 || y === 8
      const zEdge = z === 0 || z === 8
      const corner = xEdge + yEdge + zEdge === 3

      const totalShrinkFactor = shrinkFactor(x) + shrinkFactor(y) + shrinkFactor(z)
      const outerSize = 1 - totalShrinkFactor * 0.085
      const innerSize = outerSize - 0.2

      if (x === 8 || y === 8 || z === 8) {
        const coreMaterial = new THREE.MeshStandardMaterial({
          color: "white",
          emissive: "white"
        })
        const coreSizeFactor = (x + y + z - 8) / 16
        const coreSize = innerSize * coreSizeFactor
        const coreCube = new THREE.Mesh(new THREE.BoxGeometry(coreSize, coreSize, coreSize), coreMaterial)
        coreCube.position.x = 1.1 * x
        coreCube.position.y = -1.1 * y
        coreCube.position.z = -1.1 * z
        scene.add(coreCube)
      }

      let innerColor = "rgb(21, 0, 59)"
      if (corner) {
        innerColor = "black"
      }
      const innerMaterial = new THREE.MeshPhongMaterial({
        color: innerColor,
        transparent: true,
        opacity: corner ? 1 : (1 - (x + y + z) / 48)
      })

      const innerCube = new THREE.Mesh(new THREE.BoxGeometry(innerSize, innerSize, innerSize), innerMaterial)
      innerCube.position.x = 1.1 * x
      innerCube.position.y = -1.1 * y
      innerCube.position.z = -1.1 * z
      scene.add(innerCube)

      const outerMaterial = new THREE.MeshPhongMaterial({
        color: `rgb(${28 * (9 - x)}, ${110 + (x * 10)}, 255)`,
        transparent: true,
        opacity: corner ? 0.15 : 0.3,
      })

      const outerCube = new THREE.Mesh(new THREE.BoxGeometry(outerSize, outerSize, outerSize), outerMaterial)
      outerCube.position.x = 1.1 * x
      outerCube.position.y = -1.1 * y
      outerCube.position.z = -1.1 * z
      scene.add(outerCube)

    }
  }
}

const light = new THREE.HemisphereLight(0xffffff, 0x080820)
light.position.set(-5, 5, 0)
scene.add(light)

camera.position.x = -5
camera.position.y = 5
camera.position.z = 5

new OrbitControls(camera, renderer.domElement)

function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  renderer.render(scene, camera)
}

animate()
