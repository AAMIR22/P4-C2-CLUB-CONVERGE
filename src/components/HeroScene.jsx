import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

function createSculptureGeometry() {
  const c = new THREE.Shape()
  c.moveTo(0.56, 0.92)
  c.bezierCurveTo(0.22, 1.24, -0.5, 1.22, -0.89, 0.82)
  c.bezierCurveTo(-1.34, 0.36, -1.32, -0.46, -0.85, -0.84)
  c.bezierCurveTo(-0.42, -1.19, 0.24, -1.11, 0.61, -0.75)
  c.lineTo(0.28, -0.42)
  c.bezierCurveTo(-0.02, -0.69, -0.46, -0.67, -0.68, -0.38)
  c.bezierCurveTo(-0.91, -0.08, -0.9, 0.32, -0.65, 0.58)
  c.bezierCurveTo(-0.4, 0.84, -0.02, 0.84, 0.27, 0.57)
  c.closePath()

  const two = new THREE.Shape()
  two.moveTo(-0.54, 0.78)
  two.bezierCurveTo(-0.22, 1.15, 0.46, 1.18, 0.81, 0.82)
  two.bezierCurveTo(1.1, 0.52, 0.98, 0.1, 0.65, -0.19)
  two.lineTo(-0.34, -0.98)
  two.lineTo(0.91, -0.98)
  two.lineTo(0.91, -0.57)
  two.lineTo(0.18, -0.57)
  two.lineTo(0.88, 0.03)
  two.bezierCurveTo(1.44, 0.52, 1.35, 1.04, 0.91, 1.35)
  two.bezierCurveTo(0.43, 1.68, -0.34, 1.57, -0.72, 1.13)
  two.closePath()

  const geometryOptions = {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.09,
    bevelThickness: 0.11,
    curveSegments: 32,
  }
  const cGeometry = new THREE.ExtrudeGeometry(c, geometryOptions)
  const twoGeometry = new THREE.ExtrudeGeometry(two, { ...geometryOptions, depth: 0.58 })
  cGeometry.computeVertexNormals()
  twoGeometry.computeVertexNormals()
  return [cGeometry, twoGeometry]
}

function createRockGeometry(seed, scale = 1) {
  const geometry = new THREE.IcosahedronGeometry(1, 2)
  const positions = geometry.attributes.position

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const y = positions.getY(index)
    const z = positions.getZ(index)
    const wave = Math.sin(x * 8 + seed) * Math.cos(y * 7 + seed * 1.7)
    const ridge = Math.sin(z * 11 + x * 4 + seed * 2.4) * 0.08
    const factor = scale * (0.78 + wave * 0.095 + ridge)
    positions.setXYZ(index, x * factor, y * factor * 0.75, z * factor)
  }

  positions.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

function createTerrainGeometry() {
  const columns = 64
  const rows = 36
  const width = 9.2
  const depth = 4.8
  const positions = new Float32Array((columns + 1) * (rows + 1) * 3)
  const indices = []

  for (let row = 0; row <= rows; row += 1) {
    const z = (row / rows - 0.5) * depth
    for (let column = 0; column <= columns; column += 1) {
      const x = (column / columns - 0.5) * width
      const broadRidge = Math.sin(x * 1.35 + z * 0.62) * 0.09
      const brokenRock = Math.sin(x * 3.8 - z * 2.1) * Math.cos(z * 3.1 + x * 0.7) * 0.055
      const fineRelief = Math.sin(x * 7.2 + z * 5.4) * 0.018
      const index = (row * (columns + 1) + column) * 3
      positions[index] = x
      positions[index + 1] = -1.62 + broadRidge + brokenRock + fineRelief
      positions[index + 2] = z

      if (row < rows && column < columns) {
        const vertex = row * (columns + 1) + column
        indices.push(vertex, vertex + columns + 1, vertex + 1)
        indices.push(vertex + 1, vertex + columns + 1, vertex + columns + 2)
      }
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function FramedCamera({ pointerRef, reducedMotion }) {
  const { camera, size } = useThree()
  const cameraRef = useRef(camera)
  const target = useRef(new THREE.Vector3())
  const aspectDistance = size.width / size.height

  useFrame((_, delta) => {
    const pointer = reducedMotion ? { x: 0, y: 0 } : pointerRef.current
    target.current.set(pointer.x * 0.12, -0.28 + pointer.y * 0.08, 0)
    cameraRef.current.position.x = THREE.MathUtils.damp(cameraRef.current.position.x, pointer.x * 0.1, 2.2, delta)
    cameraRef.current.position.y = THREE.MathUtils.damp(cameraRef.current.position.y, 0.82 + pointer.y * 0.07, 2.2, delta)
    cameraRef.current.position.z = THREE.MathUtils.damp(
      cameraRef.current.position.z,
      aspectDistance < 0.72 ? 10.2 : aspectDistance < 1.25 ? 8.8 : 8.5,
      2.5,
      delta,
    )
    cameraRef.current.lookAt(target.current)
  })

  return null
}

function HeroSculpture({ pointerRef, reducedMotion }) {
  const { size } = useThree()
  const sculpture = useRef(null)
  const orbitA = useRef(null)
  const orbitB = useRef(null)
  const orbitC = useRef(null)
  const keyLight = useRef(null)
  const blueLight = useRef(null)
  const smoothedPointer = useRef({ x: 0, y: 0 })
  const [cGeometry, twoGeometry] = useMemo(() => createSculptureGeometry(), [])
  const terrainGeometry = useMemo(() => createTerrainGeometry(), [])
  const rocks = useMemo(() => [
    createRockGeometry(1.2, 0.62),
    createRockGeometry(3.7, 0.48),
    createRockGeometry(5.4, 0.38),
    createRockGeometry(7.1, 0.3),
  ], [])
  const sceneOffset = size.width > 900 ? 1.85 : 0

  useFrame((state, delta) => {
    if (!sculpture.current || !orbitA.current || !orbitB.current || !orbitC.current) return

    const pointer = reducedMotion ? { x: 0, y: 0 } : pointerRef.current
    const smoothing = 1 - Math.exp(-delta * 2.8)
    smoothedPointer.current.x = THREE.MathUtils.lerp(smoothedPointer.current.x, pointer.x, smoothing)
    smoothedPointer.current.y = THREE.MathUtils.lerp(smoothedPointer.current.y, pointer.y, smoothing)
    const { x, y } = smoothedPointer.current
    const time = reducedMotion ? 0 : state.clock.getElapsedTime()

    sculpture.current.rotation.set(
      0.1 + y * 0.1,
      0.22 + Math.sin(time * 0.12) * 0.055 + x * 0.16,
      -0.04 + x * 0.035,
    )
    sculpture.current.position.set(0.28 + x * 0.11, 0.12 + Math.sin(time * 0.32) * 0.022 + y * 0.05, 0)
    orbitA.current.rotation.set(1.02 + y * 0.1, time * 0.026 + x * 0.18, 0.28)
    orbitB.current.rotation.set(0.22 + y * 0.08, -0.18 - time * 0.032 + x * 0.12, 1.08)
    orbitC.current.rotation.set(0.78 + y * 0.09, time * 0.02 + x * 0.12, -0.62)

    if (keyLight.current && blueLight.current) {
      keyLight.current.position.x = -2 + x * 0.42
      keyLight.current.position.y = 3 + y * 0.32
      blueLight.current.position.x = 2.5 + x * 0.35
      blueLight.current.position.y = 1.15 + y * 0.28
    }
  })

  return (
    <group position={[sceneOffset, 0, 0]}>
      <group ref={sculpture} scale={1.28}>
        <mesh geometry={cGeometry} position={[-0.2, 0, -0.12]} rotation={[0, 0, -0.05]}>
          <meshPhysicalMaterial
            color="#817993"
            metalness={0.72}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2.4}
          />
        </mesh>
        <mesh geometry={twoGeometry} position={[0.45, 0.05, 0.12]} rotation={[0, 0, 0.02]}>
          <meshPhysicalMaterial
            color="#958baa"
            metalness={0.73}
            roughness={0.17}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2.5}
          />
        </mesh>
      </group>

      <group ref={orbitA} position={[0.26, 0.16, -0.72]}>
        <mesh scale={[1.22, 0.78, 0.72]}>
          <torusGeometry args={[1.8, 0.032, 16, 240]} />
          <meshStandardMaterial color="#b39bea" emissive="#47277f" emissiveIntensity={0.48} metalness={0.88} roughness={0.28} />
        </mesh>
      </group>
      <group ref={orbitB} position={[0.26, 0.16, -0.96]}>
        <mesh scale={[1.12, 0.76, 0.82]}>
          <torusGeometry args={[1.94, 0.028, 16, 240]} />
          <meshStandardMaterial color="#98a7ee" emissive="#243b88" emissiveIntensity={0.44} metalness={0.86} roughness={0.29} />
        </mesh>
      </group>
      <group ref={orbitC} position={[0.26, 0.16, -0.46]}>
        <mesh scale={[1.04, 0.94, 0.7]}>
          <torusGeometry args={[1.68, 0.025, 16, 240]} />
          <meshStandardMaterial color="#b184dd" emissive="#512a82" emissiveIntensity={0.38} metalness={0.84} roughness={0.32} />
        </mesh>
      </group>

      <group position={[0.42, 0, 0.5]}>
        <mesh>
          <primitive object={terrainGeometry} attach="geometry" />
          <meshPhysicalMaterial color="#26293a" metalness={0.43} roughness={0.38} clearcoat={0.66} clearcoatRoughness={0.26} envMapIntensity={1.55} />
        </mesh>
      </group>

      <mesh geometry={rocks[0]} position={[1.92, 1.76, -1.12]} rotation={[0.15, 0.4, 0.62]} scale={[0.82, 1, 0.6]}>
        <meshStandardMaterial color="#211d2d" metalness={0.8} roughness={0.3} emissive="#20132d" emissiveIntensity={0.16} />
      </mesh>
      <mesh geometry={rocks[1]} position={[-2.05, -0.72, -1.5]} rotation={[0.34, 0.2, -0.28]} scale={[0.82, 0.56, 0.5]}>
        <meshStandardMaterial color="#252535" metalness={0.78} roughness={0.33} />
      </mesh>
      <mesh geometry={rocks[2]} position={[2.42, -0.92, -1.25]} rotation={[0.22, 0.75, 0.18]} scale={[0.72, 0.52, 0.48]}>
        <meshStandardMaterial color="#252535" metalness={0.78} roughness={0.32} />
      </mesh>
      <mesh geometry={rocks[3]} position={[-1.7, 1.24, -1.7]} rotation={[0.3, 0.1, 0.4]} scale={[0.65, 0.7, 0.52]}>
        <meshStandardMaterial color="#111523" metalness={0.72} roughness={0.34} emissive="#101326" emissiveIntensity={0.12} />
      </mesh>
      <mesh geometry={rocks[0]} position={[-1.2, -1.22, 2.9]} rotation={[0.22, 0.65, -0.16]} scale={[1.1, 0.45, 0.72]}>
        <meshStandardMaterial color="#222638" metalness={0.38} roughness={0.46} />
      </mesh>
      <mesh geometry={rocks[1]} position={[0.1, -1.32, 3.1]} rotation={[0.12, 0.32, 0.08]} scale={[1.2, 0.42, 0.8]}>
        <meshStandardMaterial color="#292b3d" metalness={0.4} roughness={0.44} />
      </mesh>
      <mesh geometry={rocks[2]} position={[1.58, -1.2, 2.8]} rotation={[0.18, 0.82, 0.18]} scale={[0.95, 0.5, 0.68]}>
        <meshStandardMaterial color="#24283a" metalness={0.4} roughness={0.45} />
      </mesh>

      <Sparkles count={112} scale={[7.4, 4.6, 2.4]} position={[0.4, 0.35, -2.05]} size={1.7} speed={reducedMotion ? 0 : 0.12} color="#c3b0ff" opacity={0.58} noise={1.25} />
      <pointLight ref={keyLight} position={[-2, 3, 2]} intensity={22} distance={10} color="#c8b5ff" />
      <pointLight ref={blueLight} position={[2.5, 1.15, -0.2]} intensity={16} distance={8} color="#557dff" />
    </group>
  )
}

export default function HeroScene({ pointerRef }) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="hero-canvas-wrap" aria-label="Abstract C2-inspired 3D sculpture">
      <Canvas
        camera={{ position: [0, 0.12, 8.8], fov: 36, near: 0.1, far: 70 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <FramedCamera pointerRef={pointerRef} reducedMotion={reducedMotion} />
        <fog attach="fog" args={['#0b0f1d', 7, 18]} />
        <ambientLight intensity={0.22} />
        <directionalLight position={[-3, 4, 5]} intensity={1.5} color="#ddd3ff" />
        <directionalLight position={[4, 1, -2]} intensity={2.1} color="#5575de" />
        <spotLight position={[-2, 3.5, 5]} intensity={25} distance={13} angle={0.55} penumbra={0.86} color="#e5dcff" />
        <pointLight position={[-3.5, 0.2, 1.5]} intensity={16} distance={8} color="#965eff" />
        <pointLight position={[3.2, 1.5, -1]} intensity={10} distance={7} color="#557aff" />
        <pointLight position={[0, -2.5, 3]} intensity={4} distance={6} color="#7250a8" />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3.6} position={[-4, 2, 3]} rotation={[0, Math.PI / 4, 0]} scale={[4, 1.5, 1]} color="#aa91ff" />
          <Lightformer form="rect" intensity={3.1} position={[3, -1, -2]} rotation={[0, -Math.PI / 3, 0]} scale={[3.5, 1.2, 1]} color="#6584ff" />
          <Lightformer form="rect" intensity={2.4} position={[0, 4, -3]} rotation={[Math.PI / 2, 0, 0]} scale={[3.5, 1, 1]} color="#f1eaff" />
          <Lightformer form="rect" intensity={2} position={[1, -3, 2]} rotation={[-Math.PI / 2, 0, 0]} scale={[4, 1, 1]} color="#8b59d2" />
        </Environment>
        <HeroSculpture pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
