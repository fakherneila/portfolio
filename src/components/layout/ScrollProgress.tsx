import { motion, useScroll, useSpring } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function ScrollProgress() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  if (prefersReducedMotion) return null
  return <div className="fixed left-0 right-0 top-0 z-[60] h-[2px]" aria-hidden="true"><motion.div className="h-full origin-left bg-gold-gradient" style={{ scaleX: smoothProgress }} /></div>
}
