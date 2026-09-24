import { useEffect, useState } from 'react'

export type PerformanceTier = 'high' | 'medium' | 'low'

type PerformanceTierOptions = {
  /** Minimum tier to return for components that can afford a lightweight floor. */
  minTier?: PerformanceTier
  /** Allows callers to render their own lightweight low-tier fallback. */
  allowLowTierFallback?: boolean
}

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number
}

const TIER_ORDER: Record<PerformanceTier, number> = {
  low: 0,
  medium: 1,
  high: 2,
}

export function usePerformanceTier(options: PerformanceTierOptions = {}): {
  tier: PerformanceTier
} {
  const [tier, setTier] = useState<PerformanceTier>('high')

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const memory = (navigator as NavigatorWithDeviceMemory).deviceMemory ?? 4

    let nextTier: PerformanceTier
    if (isReduced || cores < 4 || memory < 4) {
      nextTier = 'low'
    } else if (cores < 8 || isMobile) {
      nextTier = 'medium'
    } else {
      nextTier = 'high'
    }

    if (
      !isReduced &&
      options.minTier &&
      TIER_ORDER[nextTier] < TIER_ORDER[options.minTier]
    ) {
      nextTier = options.minTier
    }

    setTier(nextTier)
  }, [options.minTier])

  return { tier }
}
