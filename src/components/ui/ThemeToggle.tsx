import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

// This component must be rendered inside <ThemeProvider>.
type ThemeToggleProps = { className?: string }

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  return (
    <motion.button
      type="button"
      aria-label={t('a11y.toggleTheme')}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={cn('glass-card z-50 flex h-10 w-10 items-center justify-center rounded-full text-gold transition-shadow duration-200 hover:shadow-gold-sm', className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Moon size={18} strokeWidth={1.5} aria-hidden="true" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sun size={18} strokeWidth={1.5} aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
