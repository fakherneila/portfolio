import { useLocation } from 'react-router-dom'
import { LOCALES, type Locale } from '@/i18n/types'

const localePattern = new RegExp(`^/(${LOCALES.join('|')})(?=/|$)`)

export function hasLocalePrefix(pathname: string): boolean {
  return localePattern.test(pathname)
}

/** Removes a supported locale prefix from a pathname. */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(localePattern, '')
  return stripped === '' ? '/' : stripped
}

/** Replaces an existing locale prefix or adds one to a pathname. */
export function buildLocalePath(pathname: string, locale: Locale): string {
  const pathWithoutLocale = stripLocalePrefix(pathname)
  return pathWithoutLocale === '/' ? `/${locale}` : `/${locale}${pathWithoutLocale}`
}

/** Returns the current route without its locale prefix. */
export function useCurrentLocalePath(): string {
  return stripLocalePrefix(useLocation().pathname)
}
