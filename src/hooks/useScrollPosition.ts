import { useEffect, useState } from 'react'

export function useScrollPosition(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame: number | null = null

    const update = () => {
      frame = null
      const next = window.scrollY > threshold
      setScrolled((previous) => previous === next ? previous : next)
    }

    const handleScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}