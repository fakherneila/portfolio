import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePerformanceTier } from '@/hooks/usePerformanceTier'
import SceneFallback from './SceneFallback'
import SceneLoader from './SceneLoader'
import { useWebGLSupport } from './useWebGLSupport'

const HeroSceneInner = lazy(() => import('./HeroSceneInner'))

export default function HeroScene() {
  const { theme } = useTheme()
  const { tier } = usePerformanceTier()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const webGLSupported = useWebGLSupport()
  const mouseRef = useRef({ x: 0, y: 0 })
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>(() => document.hidden ? 'demand' : 'always')

  useEffect(() => {
    const handleVisibility = () => setFrameloop(document.hidden ? 'demand' : 'always')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    mouseRef.current.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
  }

  if (!webGLSupported || tier === 'low') return <div className="absolute inset-0 h-full w-full"><SceneFallback /></div>

  return <div className="absolute inset-0 h-full w-full" onPointerMove={handleMove} onPointerLeave={() => { mouseRef.current.x = 0; mouseRef.current.y = 0 }}>
    <Suspense fallback={<SceneLoader />}>
      <HeroSceneInner theme={theme} reducedMotion={reducedMotion} tier={tier} frameloop={frameloop} mouseRef={mouseRef} />
    </Suspense>
  </div>
}
