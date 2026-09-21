import { MeshDistortMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Vector3, type Mesh } from 'three'

type MouseRef = MutableRefObject<{ x: number; y: number }>

type GoldIcosahedronProps = {
  theme: 'light' | 'dark'
  reducedMotion: boolean
  quality: 'high' | 'medium' | 'low'
  mouseRef: MouseRef
}

export default function GoldIcosahedron({
  theme,
  reducedMotion,
  quality,
  mouseRef,
}: GoldIcosahedronProps) {
  const meshRef = useRef<Mesh>(null)
  const targetScale = useMemo(() => new Vector3(1, 1, 1), [])
  const detail = quality === 'high' ? 64 : 32
  const isDark = theme === 'dark'
  const color = isDark ? '#F4C430' : '#E8C547'

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    mesh.scale.lerp(targetScale, Math.min(delta * 4, 1))
    if (reducedMotion) return

    mesh.rotation.x += delta * 0.1
    mesh.rotation.y += delta * 0.15
    mesh.rotation.x += (mouseRef.current.y * 0.15 - mesh.rotation.x) * 0.05
    mesh.rotation.y += (mouseRef.current.x * 0.15 - mesh.rotation.y) * 0.05
  })

  return (
    <mesh ref={meshRef} scale={0.8} rotation={[0.12, -0.18, 0]}>
      <icosahedronGeometry args={[1.4, detail]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isDark ? 0.35 : 0}
        metalness={isDark ? 1 : 0.6}
        roughness={isDark ? 0.15 : 0.4}
        distort={isDark ? 0.4 : 0.25}
        speed={reducedMotion ? 0 : 1.5}
        transparent={!isDark}
        opacity={isDark ? 1 : 0.85}
      />
    </mesh>
  )
}
