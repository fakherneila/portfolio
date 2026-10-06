import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useCurrentLocalePath } from '@/hooks/useLocalePath'
import { useLocaleNavigate } from '@/hooks/useLocaleNavigate'
import { cn } from '@/lib/utils'
import { getTranslation } from '@/lib/mdx'

// Step 4 will also update the URL prefix when the locale changes.
type LangSwitcherProps = { className?: string }

export default function LangSwitcher({ className }: LangSwitcherProps) {
  const { locale, setLocale, t } = useLocale()
  const navigate = useLocaleNavigate()
  const { pathname } = useLocation()
  const currentPath = useCurrentLocalePath()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 500, damping: 35 }
  const handleToggle = () => {
    const nextLocale = locale === 'en' ? 'fr' : 'en'
    const blogMatch = pathname.match(/^\/(en|fr)\/blog\/([^/]+)$/)
    if (blogMatch) {
      const [, currentLocale, currentSlug] = blogMatch
      const translation = getTranslation(
        currentLocale as 'en' | 'fr',
        currentSlug ?? '',
      )
      navigate(
        translation
          ? `/${translation.locale}/blog/${translation.slug}`
          : `/${nextLocale}/blog`,
      )
      setLocale(nextLocale)
      return
    }
    navigate(`/${nextLocale}${currentPath === '/' ? '' : currentPath}`)
    setLocale(nextLocale)
  }

  return (
    <motion.button
      type="button"
      aria-label={t('a11y.switchLanguage')}
      onClick={handleToggle}
      className={cn(
        'glass-card relative flex h-8 w-16 items-center rounded-full p-1 text-xs font-semibold tracking-wide text-foreground transition-shadow duration-200 hover:shadow-gold-sm',
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10 flex w-1/2 items-center justify-center">
        EN
      </span>
      <span className="relative z-10 flex w-1/2 items-center justify-center">
        FR
      </span>
      <motion.span
        layoutId="lang-pill"
        className={`absolute inset-y-1 w-7 rounded-full bg-gold ${locale === 'en' ? 'left-1' : 'right-1'}`}
        transition={transition}
        layout={!prefersReducedMotion}
      />
    </motion.button>
  )
}
