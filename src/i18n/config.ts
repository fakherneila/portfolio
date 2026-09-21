import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from './types'

// Detection prefers an explicit local choice, then the browser language, then <html lang>.
// The fallback keeps the interface usable when a browser reports an unsupported locale.
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: ['en', 'fr'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    returnNull: false,
  })

if (typeof document !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng
  })
  document.documentElement.lang = i18n.resolvedLanguage ?? DEFAULT_LOCALE
}

export default i18n
