import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Points } from 'three'

type ParticleFieldProps = {
  theme: 'light' | 'dark'
  reducedMotion: boolean
  count: number
}

export default function ParticleField({ theme, reducedMotion, count }: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let index = 0; index < count; index += 1) {
      const radius = 6 * Math.cbrt((index + 0.5) / count)
      const y = 1 - (index / (count - 1)) * 2
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * index
      values[index * 3] = Math.cos(theta) * ringRadius * radius
      values[index * 3 + 1] = y * radius
      values[index * 3 + 2] = Math.sin(theta) * ringRadius * radius
    }
    return values
  }, [count])

  useFrame((_, delta) => {
    const points = pointsRef.current
    if (!points || reducedMotion) return
    points.rotation.y += delta * 0.02
    points.rotation.x += delta * 0.01
  })

  return <points ref={pointsRef}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
    </bufferGeometry>
    <pointsMaterial
      color={theme === 'dark' ? '#F4C430' : '#B8860B'}
      size={0.02}
      sizeAttenuation
      transparent
      opacity={theme === 'dark' ? 0.7 : 0.5}
      depthWrite={false}
      blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
    />
  </points>
}
