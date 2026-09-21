import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import i18n from '@/i18n/config'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/types'
import PageTransition from '@/components/layout/PageTransition'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TechStackBackground from '@/components/three/TechStackBackground'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

export default function RootLayout() {
  const { locale: localeParam } = useParams<{ locale: string }>()
  const location = useLocation()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [syncedLocale, setSyncedLocale] = useState<Locale | null>(null)

  const isValidLocale = LOCALES.includes(localeParam as Locale)
  const locale = isValidLocale ? (localeParam as Locale) : DEFAULT_LOCALE

  useEffect(() => {
    let active = true
    if (i18n.resolvedLanguage === locale) {
      setSyncedLocale(locale)
    } else {
      void i18n.changeLanguage(locale).then(() => {
        if (active) setSyncedLocale(locale)
      })
    }
    return () => { active = false }
  }, [locale])

  if (!isValidLocale) {
    const rest = location.pathname.replace(/^\/[^/]+/, '') || '/'
    return <Navigate to={`/${DEFAULT_LOCALE}${rest}${location.search}`} replace />
  }

  if (syncedLocale !== locale) return null

  return (
    <div className="relative flex min-h-screen flex-col font-body text-foreground">
      {/* Fixed full-page 3D tech-stack background — renders behind everything */}
      <TechStackBackground />
      <div className="relative z-10 flex flex-1 flex-col">
        <ScrollToTop />
        <Navbar />
        <main
          className="flex-1 pt-16 md:pt-[72px]"
          aria-label="Portfolio application"
        >
          <AnimatePresence mode="wait" initial={!prefersReducedMotion}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  )
}
