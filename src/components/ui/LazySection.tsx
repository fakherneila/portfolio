import { useEffect, useRef, useState, type ReactNode } from 'react'

type LazySectionProps = {
  children: ReactNode
  placeholder?: ReactNode
  rootMargin?: string
}

export function LazySection({
  children,
  placeholder = null,
  rootMargin = '200px',
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : '50vh' }}>
      {visible ? children : placeholder}
    </div>
  )
}
