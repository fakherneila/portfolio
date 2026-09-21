import { useEffect, useRef, useState, type RefObject } from 'react'

type UseInViewOptions = {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView<T extends Element>(options: UseInViewOptions = {}): { ref: RefObject<T>; inView: boolean } {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && triggerOnce) observer.disconnect()
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, threshold, triggerOnce])

  return { ref, inView }
}
