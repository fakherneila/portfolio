import { Canvas } from '@react-three/fiber'
import { Suspense, type MutableRefObject } from 'react'
import type { PerformanceTier } from '@/hooks/usePerformanceTier'
import GoldIcosahedron from './GoldIcosahedron'
import ParticleField from './ParticleField'

type MouseRef = MutableRefObject<{ x: number; y: number }>

type HeroSceneInnerProps = {
  theme: 'light' | 'dark'
  reducedMotion: boolean
  tier: PerformanceTier
  frameloop: 'always' | 'demand'
  mouseRef: MouseRef
}

export default function HeroSceneInner({
  theme,
  reducedMotion,
  tier,
  frameloop,
  mouseRef,
}: HeroSceneInnerProps) {
  const count = tier === 'high' ? 1000 : tier === 'medium' ? 600 : 300
  return (
    <Canvas
      dpr={tier === 'high' ? [1, 1.5] : 1}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        antialias: tier === 'high',
        alpha: true,
        powerPreference: 'high-performance',
      }}
      frameloop={frameloop}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={theme === 'dark' ? 0.4 : 0.7} color="#D4AF37" />
      <directionalLight
        position={[4, 4, 4]}
        intensity={theme === 'dark' ? 1.2 : 0.55}
        color="#F4C430"
      />
      <directionalLight
        position={[-4, -2, -2]}
        intensity={theme === 'dark' ? 0.3 : 0.2}
        color="#B8860B"
      />
      <Suspense fallback={null}>
        <ParticleField
          theme={theme}
          reducedMotion={reducedMotion}
          count={count}
        />
        <GoldIcosahedron
          theme={theme}
          reducedMotion={reducedMotion}
          quality={tier}
          mouseRef={mouseRef}
        />
      </Suspense>
    </Canvas>
  )
}
