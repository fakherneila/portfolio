import { Navigate, useLocation } from 'react-router-dom'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/types'

function detectLocale(): Locale {
  const stored = localStorage.getItem('portfolio-locale')
  if (stored && LOCALES.includes(stored as Locale)) return stored as Locale

  const browserLocale = navigator.language.slice(0, 2)
  return LOCALES.includes(browserLocale as Locale) ? (browserLocale as Locale) : DEFAULT_LOCALE
}

export default function LocaleRedirect() {
  const location = useLocation()
  const locale = detectLocale()
  const restOfPath = location.pathname === '/' ? '' : location.pathname

  return <Navigate to={`/${locale}${restOfPath}${location.search}`} replace />
}
