import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import i18n from '@/i18n/config'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/types'

type LocaleState = {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: TFunction
  availableLocales: Locale[]
}

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && LOCALES.includes(value as Locale)
}

export function useLocale(): LocaleState {
  const { t } = useTranslation()
  const locale = isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE
  const setLocale = (nextLocale: Locale) => {
    void i18n.changeLanguage(nextLocale)
  }
  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'fr' : 'en')
  }

  return { locale, setLocale, toggleLocale, t, availableLocales: LOCALES }
}
