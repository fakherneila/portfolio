export type LocalizedText = { en: string; fr: string }
export type EducationEntry = {
  id: string
  start: string
  end: string
  degree: LocalizedText
  institution: string
  location: string
  description?: LocalizedText
}
export type LeadershipEntry = {
  id: string
  role: LocalizedText
  org: string
  start: string
  end: string
  period: string
  description: LocalizedText
}
export type HackathonEntry = {
  id: string
  name: string
  year: number | string
  role: 'participant' | 'organizer'
  highlight?: boolean
  award?: LocalizedText | string
}
