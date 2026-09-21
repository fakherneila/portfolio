import type {
  EducationEntry,
  HackathonEntry,
  LeadershipEntry,
} from '@/types/education'

export const EDUCATION: EducationEntry[] = [
  {
    id: 'issat',
    start: '2022',
    end: '2026',
    degree: {
      en: 'Software Engineering Degree',
      fr: 'Diplôme d’ingénieur en génie logiciel',
    },
    institution: 'ISSAT Sousse',
    location: 'Sousse, Tunisia',
    description: {
      en: 'Engineering studies focused on software architecture, cloud systems, and applied AI.',
      fr: 'Formation d’ingénieur orientée architecture logicielle, cloud et IA appliquée.',
    },
  },
  {
    id: 'prepa',
    start: '2020',
    end: '2022',
    degree: {
      en: 'Preparatory Engineering Studies',
      fr: 'Cycle préparatoire aux études d’ingénieur',
    },
    institution: 'ISSAT Sousse',
    location: 'Sousse, Tunisia',
    description: {
      en: 'Foundations in mathematics, algorithms, and engineering sciences.',
      fr: 'Bases en mathématiques, algorithmique et sciences de l’ingénieur.',
    },
  },
]

export const LEADERSHIP: LeadershipEntry[] = [
  {
    id: 'cybertrace-vp',
    role: { en: 'Vice President', fr: 'Vice-Président' },
    org: 'CyberTrace Club — ISSAT Sousse',
    start: '2025-09',
    end: '2026-06',
    period: 'Sep 2025 – Jun 2026',
    description: {
      en: 'Coordinated cross-functional activities across HR, Management, Marketing, and Technical teams.',
      fr: 'Coordination d’activités transverses entre les équipes RH, Management, Marketing et Technique.',
    },
  },
  {
    id: 'microsoft-club-instructor',
    role: {
      en: 'Web Development Instructor',
      fr: 'Formateur en Développement Web',
    },
    org: 'Microsoft Club ISSATSO',
    start: '2024-09',
    end: '2025-06',
    period: 'Sep 2024 – Jun 2025',
    description: {
      en: 'Delivered training on HTML, CSS, JavaScript; mentored students through hands-on web development projects.',
      fr: 'Formation en HTML, CSS, JavaScript ; mentorat d’étudiants sur des projets pratiques.',
    },
  },
] as const

export const HACKATHONS: HackathonEntry[] = [
  {
    id: 'imgoster',
    name: 'Imgoster',
    year: '2025',
    role: 'participant',
    highlight: true,
    award: 'firstPlace',
  },
  {
    id: 'hack-for-good',
    name: 'Hack for Good',
    year: '2024',
    role: 'organizer',
  },
]
