import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import type { PerformanceTier } from '@/hooks/usePerformanceTier'

// ─── Logo list ────────────────────────────────────────────────────────────────
// Names map 1-to-1 with /public/tech/<name>.svg.
// Ordered by visual priority.
const LOGOS = [
  'react',
  'typescript',
  'javascript',
  'python',
  'node',
  'docker',
  'github',
  'git',
  'vite',
  'tailwind',
  'angular',
  'express',
  'mongodb',
  'postgres',
  'django',
  'spring',
  'figma',
  'vitest',
  'airtable',
  'appwrite',
  'selenium',
  'n8n',
  'tanstack',
  'postman',
  'robotframework',
] as const

// ─── Deterministic seeded pseudo-random (Park-Miller LCG) ─────────────────────
function makeRand(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Shared Texture Cache ───────────────────────────────────────────────────
// TextureLoader / Image-based loading avoids repeated GPU uploads and network calls
const textureCache = new Map<string, THREE.Texture>()

function getSvgTexture(url: string): THREE.Texture {
  let tex = textureCache.get(url)
  if (!tex) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    const newTex = new THREE.Texture(img)
    newTex.colorSpace = THREE.SRGBColorSpace
    img.onload = () => {
      newTex.needsUpdate = true
    }
    textureCache.set(url, newTex)
    return newTex
  }
  return tex
}

// ─── Deterministic logo descriptor ──────────────────────────────────────────
interface LogoSpec {
  name: string
  url: string
  // Base 3D coordinates & rotations
  baseX: number
  baseY: number
  baseZ: number
  baseRotX: number
  baseRotY: number
  baseRotZ: number
  scale: number
  depthFactor: number
  // Lissajous curve parameters
  speedX: number
  speedY: number
  speedZ: number
  phaseX: number
  phaseY: number
  phaseZ: number
  radiusX: number
  radiusY: number
  radiusZ: number
  // Self-rotation parameters
  rotSpeedY: number
  phaseRotX: number
  phaseRotZ: number
  // Base opacities
  lightOpacity: number
  darkOpacity: number
}

// ─── Per-logo runtime state (kept in ONE array ref) ──────────────────────────
interface LogoRuntimeState {
  currentOpacity: number
  targetOpacity: number
  baseOpacity: number
  shimmerResetAt: number
}

// ─── Tech Logo Cloud ────────────────────────────────────────────────────────
interface TechLogoCloudProps {
  theme: 'light' | 'dark'
  tier: PerformanceTier
  mouseRef: MutableRefObject<{ x: number; y: number }>
  scrollRef: MutableRefObject<{ y: number }>
  reducedMotion: boolean
  opacityMultiplier: number
  count: number
  isMobile: boolean
}

function TechLogoCloud({
  theme,
  mouseRef,
  scrollRef,
  reducedMotion,
  opacityMultiplier,
  count,
  isMobile,
}: TechLogoCloudProps) {
  const isDark = theme === 'dark'
  const logoColor = isDark ? '#F4C430' : '#B8860B'
  const threeColor = useMemo(() => new THREE.Color(logoColor), [logoColor])

  // Hierarchy: root group (scroll parallax, mouse parallax, mobile scale)
  //            -> orbit group (scene center rotation & subtle tilt wobble)
  //            -> individual logo groups (Lissajous drift, self-rotation)
  const rootGroupRef = useRef<THREE.Group>(null)
  const orbitGroupRef = useRef<THREE.Group>(null)

  // Single ref arrays for all logos (centralized frame updates)
  const logoGroupsRef = useRef<(THREE.Group | null)[]>([])
  const mainMaterialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const haloMaterialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const logoStatesRef = useRef<LogoRuntimeState[]>([])

  // Ambient shimmer timer
  const lastShimmerTime = useRef(0)
  const nextShimmerInterval = useRef(8)

  // Precompute all 25 logo descriptors deterministically once
  const specs: LogoSpec[] = useMemo(() => {
    const rand = makeRand(42)
    return LOGOS.map((name) => {
      const baseX = (rand() * 2 - 1) * 12
      const baseY = (rand() * 2 - 1) * 6.5
      // baseZ distributed across [-8, 2]
      const baseZ = -8 + rand() * 10

      // Depth factor: z = -8 (far) -> 0.4, z = +2 (near) -> 1.4
      const depthFactor = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(baseZ, -8, 2, 0.4, 1.4),
        0.4,
        1.4,
      )

      // Scale variation: base [0.6, 1.3] multiplied by depth factor
      const rawScale = 0.6 + rand() * 0.7
      const scale = rawScale * (0.7 + 0.3 * depthFactor)

      // Theme-specific base opacities
      // Dark: [0.22, 0.38]
      const darkOpacity = 0.22 + rand() * 0.16
      // Light: [0.10, 0.18]
      const lightOpacity = 0.10 + rand() * 0.08

      // Initial rotations
      const baseRotX = (rand() * 2 - 1) * 0.3
      const baseRotY = rand() * Math.PI * 2
      const baseRotZ = (rand() * 2 - 1) * 0.2
      const phaseRotX = rand() * Math.PI * 2
      const phaseRotZ = rand() * Math.PI * 2

      // rotSpeedY in [0.08, 0.25] rad/s with randomized direction
      const rotDir = rand() > 0.5 ? 1 : -1
      const rotSpeedY = (0.08 + rand() * 0.17) * rotDir

      // Lissajous parameters: speed [0.08, 0.22], phase [0, 2π], radius
      const speedX = 0.08 + rand() * 0.14
      const speedY = 0.08 + rand() * 0.14
      const speedZ = 0.08 + rand() * 0.14

      const phaseX = rand() * Math.PI * 2
      const phaseY = rand() * Math.PI * 2
      const phaseZ = rand() * Math.PI * 2

      const radiusX = 0.3 + rand() * 0.9
      const radiusY = 0.4 + rand() * 1.1
      const radiusZ = 0.2 + rand() * 0.6

      return {
        name,
        url: `/tech/${name}.svg`,
        baseX,
        baseY,
        baseZ,
        baseRotX,
        baseRotY,
        baseRotZ,
        scale,
        depthFactor,
        speedX,
        speedY,
        speedZ,
        phaseX,
        phaseY,
        phaseZ,
        radiusX,
        radiusY,
        radiusZ,
        rotSpeedY,
        phaseRotX,
        phaseRotZ,
        lightOpacity,
        darkOpacity,
      }
    })
  }, [])

  // Initialize and synchronize runtime states when specs, count, or theme changes
  useEffect(() => {
    logoStatesRef.current = specs.slice(0, count).map((spec) => {
      const baseOpacity = isDark ? spec.darkOpacity : spec.lightOpacity
      return {
        currentOpacity: baseOpacity,
        targetOpacity: baseOpacity,
        baseOpacity,
        shimmerResetAt: 0,
      }
    })

    mainMaterialRefs.current.forEach((mat, i) => {
      if (mat) {
        mat.color.copy(threeColor)
        mat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending
        const spec = specs[i]
        if (spec) {
          mat.opacity = (isDark ? spec.darkOpacity : spec.lightOpacity) * opacityMultiplier
        }
        mat.needsUpdate = true
      }
    })

    haloMaterialRefs.current.forEach((mat) => {
      if (mat) {
        mat.color.copy(threeColor)
        mat.visible = isDark
        mat.opacity = 0.15 * opacityMultiplier
        mat.needsUpdate = true
      }
    })
  }, [isDark, opacityMultiplier, count, specs, threeColor])

  // Central useFrame loop: handles all 7 animation channels across all logos
  useFrame(({ clock }, delta) => {
    if (reducedMotion) return

    const rootGroup = rootGroupRef.current
    const orbitGroup = orbitGroupRef.current
    if (!rootGroup || !orbitGroup) return

    const t = clock.getElapsedTime()

    // Part 3: Scale root group on mobile
    rootGroup.scale.setScalar(isMobile ? 0.75 : 1)

    // Layer 7: Scroll parallax (secondary subtle vertical translation & slight drift)
    const scrollYNorm = scrollRef.current.y || 0
    rootGroup.position.y = -scrollYNorm * 1.5
    rootGroup.position.x = scrollYNorm * 0.4

    // Layer 5: Mouse parallax (smooth spring lagging behind cursor)
    const mouse = mouseRef.current
    rootGroup.rotation.y += (mouse.x * 0.25 - rootGroup.rotation.y) * 0.04
    rootGroup.rotation.x += (mouse.y * 0.18 - rootGroup.rotation.x) * 0.04

    // Layer 3: Slow orbital drift around scene center + subtle tilt wobble
    orbitGroup.rotation.y += delta * 0.02
    orbitGroup.rotation.x = Math.sin(t * 0.05) * 0.05

    // Layer 6: Ambient shimmer trigger (every 6-12s, brief 40% pulse for 1.5s)
    if (t - lastShimmerTime.current >= nextShimmerInterval.current) {
      lastShimmerTime.current = t
      nextShimmerInterval.current = 6 + Math.random() * 6
      if (count > 0) {
        const randIdx = Math.floor(Math.random() * Math.min(count, specs.length))
        const st = logoStatesRef.current[randIdx]
        if (st) {
          st.targetOpacity = st.baseOpacity * 1.4
          st.shimmerResetAt = t + 1.5
        }
      }
    }

    // Central loop over all active logos (Layers 1, 2, 4, 6)
    const activeCount = Math.min(count, specs.length)
    for (let i = 0; i < activeCount; i++) {
      const group = logoGroupsRef.current[i]
      const spec = specs[i]
      if (!group || !spec) continue

      // Layer 1 & 4: Lissajous curve drift with depth factor
      group.position.x =
        spec.baseX +
        Math.sin(t * spec.speedX + spec.phaseX) * spec.radiusX * spec.depthFactor
      group.position.y =
        spec.baseY +
        Math.cos(t * spec.speedY + spec.phaseY) * spec.radiusY * spec.depthFactor
      group.position.z =
        spec.baseZ +
        Math.sin(t * spec.speedZ + spec.phaseZ) * (spec.radiusZ * 0.4) * spec.depthFactor

      // Layer 2 & 4: Self-rotation & wobble with depth factor
      group.rotation.y = t * (spec.rotSpeedY * spec.depthFactor) + spec.baseRotY
      group.rotation.x = spec.baseRotX + Math.sin(t * 0.3 + spec.phaseRotX) * 0.15
      group.rotation.z = spec.baseRotZ + Math.sin(t * 0.2 + spec.phaseRotZ) * 0.08

      // Layer 6: Ambient shimmer opacity damping
      const state = logoStatesRef.current[i]
      if (state) {
        // Reset shimmer pulse if duration elapsed
        if (t >= state.shimmerResetAt && state.targetOpacity !== state.baseOpacity) {
          state.targetOpacity = state.baseOpacity
        }

        state.currentOpacity = THREE.MathUtils.damp(
          state.currentOpacity,
          state.targetOpacity,
          2.5,
          delta,
        )

        const finalOpacity = state.currentOpacity * opacityMultiplier
        const mainMat = mainMaterialRefs.current[i]
        if (mainMat) {
          mainMat.opacity = finalOpacity
        }

        const haloMat = haloMaterialRefs.current[i]
        if (haloMat && isDark) {
          // Glow halo: scaled proportionally to the shimmer pulse
          haloMat.opacity = (finalOpacity / state.baseOpacity) * 0.15
        }
      }
    }
  })

  return (
    <group ref={rootGroupRef}>
      <group ref={orbitGroupRef}>
        {specs.slice(0, count).map((spec, i) => (
          <group
            key={spec.name}
            ref={(el) => {
              logoGroupsRef.current[i] = el
            }}
            position={[spec.baseX, spec.baseY, spec.baseZ]}
            rotation={[spec.baseRotX, spec.baseRotY, spec.baseRotZ]}
            scale={spec.scale}
          >
            {/* Front logo mesh */}
            <mesh>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                ref={(el) => {
                  mainMaterialRefs.current[i] = el
                }}
                map={getSvgTexture(spec.url)}
                color={logoColor}
                transparent
                opacity={(isDark ? spec.darkOpacity : spec.lightOpacity) * opacityMultiplier}
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
              />
            </mesh>

            {/* Dark mode soft glow halo behind the logo (scaled 1.35x, opacity ~0.15) */}
            <mesh position={[0, 0, -0.04]} scale={1.35} visible={isDark}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                ref={(el) => {
                  haloMaterialRefs.current[i] = el
                }}
                map={getSvgTexture(spec.url)}
                color="#F4C430"
                transparent
                opacity={0.15 * opacityMultiplier}
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// ─── Canvas & Export ────────────────────────────────────────────────────────
interface TechStackBackgroundInnerProps {
  theme: 'light' | 'dark'
  tier: PerformanceTier
  frameloop: 'always' | 'demand'
  mouseRef: MutableRefObject<{ x: number; y: number }>
  scrollRef: MutableRefObject<{ y: number }>
  reducedMotion: boolean
  opacityMultiplier: number
  count: number
  isMobile: boolean
}

export default function TechStackBackgroundInner({
  theme,
  tier,
  frameloop,
  mouseRef,
  scrollRef,
  reducedMotion,
  opacityMultiplier,
  count,
  isMobile,
}: TechStackBackgroundInnerProps) {
  // DPR: [1, 1.5] on high, [1, 1.25] on medium, 1 on low
  const dpr = tier === 'high' ? ([1, 1.5] as [number, number]) : tier === 'medium' ? ([1, 1.25] as [number, number]) : 1

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 14], fov: 55 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      frameloop={frameloop}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <TechLogoCloud
          theme={theme}
          tier={tier}
          mouseRef={mouseRef}
          scrollRef={scrollRef}
          reducedMotion={reducedMotion}
          opacityMultiplier={opacityMultiplier}
          count={count}
          isMobile={isMobile}
        />
      </Suspense>
    </Canvas>
  )
}
