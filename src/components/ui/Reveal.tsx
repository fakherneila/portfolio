import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type RevealProps = {
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  once?: boolean
  className?: string
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
}

export function Reveal({
  delay = 0, duration = 0.6, direction = 'up', distance = 24, once = true, className, children, as = 'div',
}: RevealProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const offset = direction === 'left' ? { x: -distance, y: 0 } : direction === 'right' ? { x: distance, y: 0 } : direction === 'down' ? { x: 0, y: -distance } : direction === 'none' ? { x: 0, y: 0 } : { x: 0, y: distance }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return <motion.div
    className={cn(className)}
    data-as={as}
    initial={{ opacity: 0, ...offset }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once, amount: 0.15 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>
}
