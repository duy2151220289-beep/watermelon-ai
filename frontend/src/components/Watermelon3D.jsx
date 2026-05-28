import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Watermelon({ isLoading }) {
  const melonRef = useRef()
  const laserRef = useRef()
  const wireframeRef = useRef()

  // Generate a procedural striped green watermelon texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Base light green
    ctx.fillStyle = '#10b981'
    ctx.fillRect(0, 0, 512, 512)

    // Dark green wavy stripes
    ctx.strokeStyle = '#064e3b'
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    for (let x = -20; x < 532; x += 48) {
      ctx.beginPath()
      for (let y = 0; y <= 512; y += 10) {
        const wave = Math.sin(y * 0.04) * 15 + Math.cos(y * 0.015) * 8
        if (y === 0) ctx.moveTo(x + wave, y)
        else ctx.lineTo(x + wave, y)
      }
      ctx.stroke()
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (melonRef.current) {
      const speed = isLoading ? 1.5 : 0.2
      const bounceSpeed = isLoading ? 4.5 : 1.2
      const bounceAmp = isLoading ? 0.14 : 0.08
      melonRef.current.rotation.y = t * speed
      melonRef.current.position.y = Math.sin(t * bounceSpeed) * bounceAmp
    }
    if (laserRef.current) {
      const laserSpeed = isLoading ? 5.5 : 1.8
      laserRef.current.position.y = Math.sin(t * laserSpeed) * 1.7
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 1.2
      wireframeRef.current.rotation.x = t * 0.4
    }
  })

  return (
    <group ref={melonRef}>
      {/* Watermelon stem */}
      <mesh position={[0, 1.55, 0]} rotation={[0.25, 0, 0.4]}>
        <cylinderGeometry args={[0.05, 0.03, 0.35, 8]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Main Watermelon Ellipsoid Body */}
      <mesh scale={[1.2, 1.55, 1.2]} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.08} />
      </mesh>

      {/* Holographic scanning wireframe shell */}
      {isLoading && (
        <mesh ref={wireframeRef} scale={[1.23, 1.58, 1.23]}>
          <sphereGeometry args={[1.01, 16, 16]} />
          <meshBasicMaterial
            color="#3bf7ff"
            wireframe
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Volumetric Glowing Laser Scanning Plane HUD */}
      <group ref={laserRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.38, 0.03, 8, 48]} />
          <meshBasicMaterial color={isLoading ? "#3bf7ff" : "#22f0a5"} transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function ScanningGrid() {
  return (
    <gridHelper
      args={[14, 14, '#1cf0b3', '#031710']}
      position={[0, -2.09, 0]}
    />
  )
}

function FloatingParticles() {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(150)
    for (let i = 0; i < 150; i += 3) {
      arr[i] = (Math.random() - 0.5) * 8
      arr[i + 1] = (Math.random() - 0.5) * 6
      arr[i + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#1cf0b3"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.5}
      />
    </points>
  )
}

export default function Watermelon3D({ isLoading }) {
  return (
    <div className="h-full w-full relative min-h-[350px]">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#22f0a5] border-t-transparent" />
          <p className="text-xs text-slate-400">Loading 3D Hologram...</p>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0.4, 4.2], fov: 60 }}
          shadows
          gl={{ antialias: true }}
          className="h-full w-full"
        >
          {/* Neon lights and directional lights */}
          <ambientLight intensity={0.4} />
          
          <directionalLight
            position={[5, 8, 3]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          
          <spotLight
            position={[-5, 5, 2]}
            intensity={0.8}
            angle={0.6}
            penumbra={1}
            color="#22f0a5"
          />

          <pointLight
            position={[0, -2, 1]}
            intensity={0.5}
            color="#1cf0b3"
          />

          {/* Interactive Group */}
          <Watermelon isLoading={isLoading} />
          <ScanningGrid />
          <FloatingParticles />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
