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
  // Participations
  {
    id: 'imgoster-2025',
    name: 'Imgoster',
    year: 2025,
    role: 'participant',
    award: { en: '1st Place', fr: '1ère Place' },
    highlight: true,
  },
  {
    id: 'ideathon-3-2025',
    name: 'Ideathon 3.0',
    year: 2025,
    role: 'participant',
  },
  {
    id: 'ideathon-4-2026',
    name: 'Ideathon 4.0',
    year: 2026,
    role: 'participant',
  },
  {
    id: 'maze-1-2024',
    name: 'The Maze 1.0',
    year: 2024,
    role: 'participant',
  },
  {
    id: 'cybersummit-3-2025',
    name: 'CyberSummit 3.0',
    year: 2025,
    role: 'participant',
  },
  {
    id: 'shieldsup-2026',
    name: 'ShieldsUp',
    year: 2026,
    role: 'participant',
  },
  // Organizer
  {
    id: 'maze-2-2025',
    name: 'The Maze 2.0',
    year: 2025,
    role: 'organizer',
  },
  {
    id: 'cybersummit-4-2026',
    name: 'CyberSummit 4.0',
    year: 2026,
    role: 'organizer',
  },
  {
    id: 'mission-impossible-2026',
    name: 'Mission Impossible',
    year: 2026,
    role: 'organizer',
  },
  {
    id: 'coding-moon-2025',
    name: 'Coding Moon Challenge',
    year: 2025,
    role: 'organizer',
  },
] as const
