import { useEffect, useState } from 'react'

export type PerformanceTier = 'high' | 'medium' | 'low'

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number
}

export function usePerformanceTier(): { tier: PerformanceTier } {
  const [tier, setTier] = useState<PerformanceTier>('high')

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const memory = (navigator as NavigatorWithDeviceMemory).deviceMemory ?? 4

    if (isReduced || cores < 4 || memory < 4 || isMobile) {
      setTier('low')
    } else if (cores < 8) {
      setTier('medium')
    }
  }, [])

  return { tier }
}
