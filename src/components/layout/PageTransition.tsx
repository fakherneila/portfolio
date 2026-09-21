import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type PageTransitionProps = {
  children: ReactNode
  className?: string
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const staticState = { opacity: 1, y: 0 }

  return (
    <motion.div
      className={cn('min-h-screen', className)}
      initial={prefersReducedMotion ? staticState : { opacity: 0, y: 12 }}
      animate={staticState}
      exit={prefersReducedMotion ? staticState : { opacity: 0, y: -12 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
