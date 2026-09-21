import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { MouseEvent, ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type TiltCardProps = {
  max?: number
  scale?: number
  className?: string
  children: ReactNode
}

export function TiltCard({ max = 8, scale = 1.02, className, children }: TiltCardProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 })
  const scaleValue = useSpring(useMotionValue(1), { stiffness: 150, damping: 20 })

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    rotateX.set(((mouseY - rect.height / 2) / (rect.height / 2)) * -max)
    rotateY.set(((mouseX - rect.width / 2) / (rect.width / 2)) * max)
    scaleValue.set(scale)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
    scaleValue.set(1)
  }

  return <motion.div
    className={cn(className)}
    style={{ rotateX, rotateY, scale: prefersReducedMotion ? 1 : scaleValue, transformStyle: 'preserve-3d', perspective: 1000 }}
    onMouseMove={handleMove}
    onMouseLeave={reset}
  >{children}</motion.div>
}
