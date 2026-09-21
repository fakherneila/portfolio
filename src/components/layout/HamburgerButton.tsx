import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type HamburgerButtonProps = {
  open: boolean
  onClick: () => void
  className?: string
}

export default function HamburgerButton({ open, onClick, className }: HamburgerButtonProps) {
  const { t } = useTranslation()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }

  return <motion.button
    type="button"
    aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
    aria-expanded={open}
    onClick={onClick}
    className={cn('flex h-10 w-10 items-center justify-center rounded-full text-foreground focus-visible:ring-2 focus-visible:ring-ring', className)}
    whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
  >
    <span className="flex w-5 flex-col gap-[4px]">
      <motion.span className="h-[2px] w-5 rounded-full bg-current" animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} transition={transition} />
      <motion.span className="h-[2px] w-5 rounded-full bg-current" animate={{ opacity: open ? 0 : 1 }} transition={transition} />
      <motion.span className="h-[2px] w-5 rounded-full bg-current" animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} transition={transition} />
    </span>
  </motion.button>
}
