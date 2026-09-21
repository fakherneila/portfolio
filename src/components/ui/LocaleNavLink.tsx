import { NavLink, type NavLinkProps } from 'react-router-dom'
import { buildLocalePath, hasLocalePrefix } from '@/hooks/useLocalePath'
import { useLocale } from '@/hooks/useLocale'
import type { Locale } from '@/i18n/types'

type LocaleNavLinkProps = NavLinkProps & {
  locale?: Locale
}

function prefixTarget(target: NavLinkProps['to'], locale: Locale): NavLinkProps['to'] {
  if (typeof target === 'string') {
    if (!target.startsWith('/')) return target
    return hasLocalePrefix(target) ? target : buildLocalePath(target, locale)
  }
  if (!target.pathname || !target.pathname.startsWith('/')) return target
  return hasLocalePrefix(target.pathname) ? target : { ...target, pathname: buildLocalePath(target.pathname, locale) }
}

export default function LocaleNavLink({ locale: targetLocale, to, ...props }: LocaleNavLinkProps) {
  const { locale } = useLocale()
  return <NavLink to={prefixTarget(to, targetLocale ?? locale)} {...props} />
}
