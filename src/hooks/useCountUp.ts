import { useEffect, useRef, useState, type RefObject } from 'react'
import { useInView } from '@/hooks/useInView'

type UseCountUpOptions = {
  to: number
  duration?: number
  start?: number
  easing?: (progress: number) => number
  enabled?: boolean
}

type CountUpResult = {
  value: number
  ref: RefObject<HTMLElement>
}

const easeOutExpo = (progress: number): number => (progress === 1 ? 1 : 1 - 2 ** (-10 * progress))

export function useCountUp({
  to,
  duration = 1600,
  start = 0,
  easing = easeOutExpo,
  enabled = true,
}: UseCountUpOptions): CountUpResult {
  const { ref, inView } = useInView<HTMLElement>()
  const [value, setValue] = useState(enabled ? start : to)
  const frameRef = useRef<number | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setValue(to)
      return
    }
    if (!inView || hasStartedRef.current) return

    hasStartedRef.current = true
    const startedAt = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      setValue(start + (to - start) * easing(progress))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [duration, easing, enabled, inView, start, to])

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
  }, [])

  return { value, ref }
}
