import { useNavigate, type NavigateOptions, type To } from 'react-router-dom'
import { buildLocalePath, hasLocalePrefix } from '@/hooks/useLocalePath'
import { useLocale } from '@/hooks/useLocale'

export function useLocaleNavigate() {
  const navigate = useNavigate()
  const { locale } = useLocale()

  return (to: To, options?: NavigateOptions): void => {
    if (typeof to !== 'string' || !to.startsWith('/')) {
      if (typeof to === 'string' || !to.pathname || !to.pathname.startsWith('/')) {
        navigate(to, options)
        return
      }
      navigate(
        hasLocalePrefix(to.pathname) ? to : { ...to, pathname: buildLocalePath(to.pathname, locale) },
        options,
      )
      return
    }
    navigate(hasLocalePrefix(to) ? to : buildLocalePath(to, locale), options)
  }
}
