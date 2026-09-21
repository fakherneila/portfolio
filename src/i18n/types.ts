import type en from './locales/en.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}

export type Locale = 'en' | 'fr'

export const LOCALES: Locale[] = ['en', 'fr']
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'portfolio-locale'
