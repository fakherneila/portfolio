export type Skill = { name: string; slug?: string; icon?: string }
export type SkillCategory = { id: string; labelKey: string; skills: Skill[] }
