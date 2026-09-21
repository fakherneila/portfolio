import { Link, type LinkProps } from 'react-router-dom'
import { buildLocalePath, hasLocalePrefix } from '@/hooks/useLocalePath'
import { useLocale } from '@/hooks/useLocale'
import type { Locale } from '@/i18n/types'

type LocaleLinkProps = LinkProps & {
  locale?: Locale
}

function prefixTarget(target: LinkProps['to'], locale: Locale): LinkProps['to'] {
  if (typeof target === 'string') {
    if (!target.startsWith('/')) return target
    return hasLocalePrefix(target) ? target : buildLocalePath(target, locale)
  }
  if (!target.pathname || !target.pathname.startsWith('/')) return target
  return hasLocalePrefix(target.pathname) ? target : { ...target, pathname: buildLocalePath(target.pathname, locale) }
}

export default function LocaleLink({ locale: targetLocale, to, ...props }: LocaleLinkProps) {
  const { locale } = useLocale()
  return <Link to={prefixTarget(to, targetLocale ?? locale)} {...props} />
}
