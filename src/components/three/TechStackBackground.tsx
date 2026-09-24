/**
 * TechStackBackground
 *
 * A fixed, full-viewport 3D canvas layer that sits behind ALL site content
 * (zIndex: 0). It renders ~25 tech-stack SVG logos as softly drifting,
 * slowly rotating planes in 3D space.
 *
 * Performance tiers & viewport breakpoints:
 *   Desktop (>=1024px) → 25 logos (clamped to 15 on medium tier)
 *   Tablet (640-1023px) → 18 logos (clamped to 15 on medium tier)
 *   Mobile (<640px)    → 10 logos, scaled to 0.75x
 *   Low tier / no WebGL→ no canvas at all
 *   Reduced motion     → renders logos frozen in place without motion
 *
 * Route behavior:
 *   /admin/*           → hidden completely
 *   /projects/:slug    → dimmed by 30% (opacityMultiplier = 0.7)
 *   Other routes       → full opacity (1.0)
 */

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePerformanceTier } from '@/hooks/usePerformanceTier'
import { useWebGLSupport } from './useWebGLSupport'

const TechStackBackgroundInner = lazy(
  () => import('./TechStackBackgroundInner'),
)

export default function TechStackBackground() {
  const { theme } = useTheme()
  const { tier } = usePerformanceTier({
    minTier: 'medium',
    allowLowTierFallback: true,
  })
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const webGLSupported = useWebGLSupport()
  const { pathname } = useLocation()

  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef({ y: 0 })

  const [frameloop, setFrameloop] = useState<'always' | 'demand'>(() =>
    typeof document !== 'undefined' && document.hidden ? 'demand' : 'always',
  )

  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )

  // Track viewport resize to dynamically adjust logo count & mobile scale
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Pause render loop when tab is hidden
  useEffect(() => {
    const handleVisibility = () =>
      setFrameloop(document.hidden ? 'demand' : 'always')
    document.addEventListener('visibilitychange', handleVisibility)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Track normalized scroll position [0, ...] for subtle group parallax
  useEffect(() => {
    const handleScroll = () => {
      const h = window.innerHeight || 1
      scrollRef.current.y = window.scrollY / h
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track pointer for mouse parallax (global listener so pointer-events: none on wrapper doesn't block it)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      mouseRef.current.x = (e.clientX / w) * 2 - 1
      mouseRef.current.y = -((e.clientY / h) * 2 - 1)
    }
    const handlePointerLeave = () => {
      mouseRef.current.x = 0
      mouseRef.current.y = 0
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  // Route-aware adjustments
  const hidden = pathname.startsWith('/admin') || pathname.includes('/admin')
  const dimmed = /\/projects\/[^/]+/.test(pathname)
  if (hidden) return null
  const opacityMultiplier = dimmed ? 0.7 : 1

  // Responsive logo count
  const isMobile = viewportWidth < 640
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024

  let count = 25
  if (isMobile) count = 12
  else if (isTablet) count = 18

  if (tier === 'medium') count = Math.min(count, 12)
  if (tier === 'low') count = 8

  // Gate: no canvas when WebGL is unavailable or motion should be reduced
  if (!webGLSupported || reducedMotion) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh' /* dvh handles mobile browser chrome */,
        zIndex: 0 /* behind content, above page background */,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* The 3D canvas — fills this container 100% */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={null}>
          <TechStackBackgroundInner
            theme={theme}
            tier={tier}
            frameloop={reducedMotion ? 'demand' : frameloop}
            mouseRef={mouseRef}
            scrollRef={scrollRef}
            reducedMotion={reducedMotion}
            opacityMultiplier={opacityMultiplier}
            count={count}
            isMobile={isMobile}
          />
        </Suspense>
      </div>

      {/* Theme-aware scrim on top of canvas, still below content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(10,10,10,0.55) 100%)'
              : 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(250,249,246,0.65) 100%)',
          transition: 'background 0.3s ease',
        }}
      />
    </div>
  )
}
