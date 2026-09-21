export type LocaleText = {
  en: string
  fr: string
}

export type Experience = {
  id: string
  type: 'internship' | 'academic'
  company: string
  role: LocaleText
  location: string
  start: string
  end: string
  summary: LocaleText
  bullets: {
    en: string[]
    fr: string[]
  }
  stack: string[]
  achievement?: LocaleText
  link?: string
}