export type LocalizedProjectText = { en: string; fr: string }
export type ProjectMetric = { value: string; label: LocalizedProjectText }
export type ProjectCategory = 'fullstack' | 'ai' | 'qa' | 'design'
export type Project = {
  slug: string
  featured: boolean
  title: LocalizedProjectText
  description: LocalizedProjectText
  cover: string
  year: string
  stack: string[]
  category: ProjectCategory
  categories: ProjectCategory[]
  metrics?: ProjectMetric[]
  liveUrl?: string
  repoUrl?: string
  longDescription?: LocalizedProjectText
  gallery?: string[]
}
