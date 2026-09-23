import type { Project, ProjectCategory } from '@/types/project'

export const PROJECT_CATEGORIES: readonly { id: string; labelKey: string }[] = [
  { id: 'all', labelKey: 'all' },
  { id: 'fullstack', labelKey: 'fullstack' },
  { id: 'ai', labelKey: 'ai' },
  { id: 'qa', labelKey: 'qa' },
  { id: 'design', labelKey: 'design' },
]

const project = (
  value: Omit<Project, 'categories'> & { categories?: ProjectCategory[] },
): Project => ({ ...value, categories: value.categories ?? [value.category] })

export const PROJECTS: Project[] = [
  project({
    slug: 'ijschool-portal',
    featured: true,
    title: { en: 'IJSchool Trainer Portal', fr: 'Portail formateurs IJSchool' },
    description: {
      en: 'A production portal for trainer onboarding, resources, and daily operations.',
      fr: 'Un portail de production pour l’intégration et la gestion quotidienne des formateurs.',
    },
    longDescription: {
      en: 'A focused workspace that brings trainer onboarding, resources, and operational workflows into one reliable portal.',
      fr: 'Un espace de travail qui rassemble l’intégration des formateurs, les ressources et les flux opérationnels dans un portail fiable.',
    },
    cover: '/projects/ijschool.webp',
    year: '2026',
    stack: ['React', 'Node.js', 'MongoDB', 'Docker'],
    category: 'fullstack',
    metrics: [
      { value: '198', label: { en: 'tests', fr: 'tests' } },
      { value: '32', label: { en: 'workflows', fr: 'flux' } },
      { value: '99', label: { en: 'Lighthouse', fr: 'Lighthouse' } },
      { value: '~100', label: { en: 'accessibility', fr: 'accessibilité' } },
    ],
    liveUrl: 'https://ijschool.fr/portail-formateur',
    gallery: ['/projects/ijschool-dashboard.webp'],
  }),
  project({
    slug: 'puntaconnect',
    featured: true,
    title: { en: 'PuntaConnect BI', fr: 'PuntaConnect BI' },
    description: {
      en: 'An AI-powered dashboard combining forecasting with natural-language business queries.',
      fr: 'Un dashboard augmenté par IA combinant prévisions et requêtes métier en langage naturel.',
    },
    longDescription: {
      en: 'A decision-support dashboard that turns business signals into readable forecasts and conversational answers.',
      fr: 'Un dashboard d’aide à la décision qui transforme les signaux métier en prévisions lisibles et réponses conversationnelles.',
    },
    cover: '/projects/puntaconnect.webp',
    year: '2026',
    stack: ['Python', 'Prophet', 'Groq', 'React'],
    category: 'ai',
    categories: ['ai', 'fullstack'],
    metrics: [
      { value: '12', label: { en: 'signals', fr: 'signaux' } },
      { value: '4', label: { en: 'data views', fr: 'vues data' } },
    ],
  }),
  project({
    slug: 'daxme-qa',
    featured: true,
    title: { en: 'DAXme QA Automation', fr: 'Automatisation QA DAXme' },
    description: {
      en: 'A maintainable Robot Framework suite for a multi-module SaaS platform.',
      fr: 'Une suite Robot Framework maintenable pour une plateforme SaaS multi-modules.',
    },
    longDescription: {
      en: 'A repeatable QA foundation designed to make regressions visible before they reach users.',
      fr: 'Une base QA reproductible conçue pour rendre les régressions visibles avant qu’elles n’atteignent les utilisateurs.',
    },
    cover: '/projects/daxme.webp',
    year: '2026',
    stack: ['Robot Framework', 'Python', 'Selenium', 'CI/CD'],
    category: 'qa',
    metrics: [
      { value: '47', label: { en: 'test cases', fr: 'cas de test' } },
      { value: '96%', label: { en: 'pass rate', fr: 'réussite' } },
    ],
  }),
  project({
    slug: 'tracify',
    featured: false,
    title: { en: 'TRACiFY', fr: 'TRACiFY' },
    description: {
      en: 'A collaborative full-stack platform for tracking projects and team outcomes.',
      fr: 'Une plateforme full-stack collaborative pour suivre les projets et les résultats d’équipe.',
    },
    cover: '/projects/tracify.webp',
    year: '2025 – 2026',
    stack: ['React', 'Express', 'PostgreSQL'],
    category: 'fullstack',
    metrics: [{ value: '6', label: { en: 'modules', fr: 'modules' } }],
  }),
  project({
    slug: 'curriculum',
    featured: false,
    title: { en: 'Curriculum Builder', fr: 'Curriculum Builder' },
    description: {
      en: 'A structured tool for designing, reviewing, and sharing learning paths.',
      fr: 'Un outil structuré pour concevoir, relire et partager des parcours pédagogiques.',
    },
    cover: '/projects/curriculum.webp',
    year: '2026',
    stack: ['TypeScript', 'React', 'Figma'],
    category: 'fullstack',
    metrics: [{ value: '24', label: { en: 'templates', fr: 'modèles' } }],
  }),
  project({
    slug: 'brand-system',
    featured: false,
    title: { en: 'Product Brand System', fr: 'Product Brand System' },
    description: {
      en: 'A visual system translating product principles into reusable interface patterns.',
      fr: 'Un système visuel qui traduit les principes produit en motifs d’interface réutilisables.',
    },
    cover: '/projects/figma.webp',
    year: '2025',
    stack: ['Figma', 'Design Tokens', 'React'],
    category: 'design',
    metrics: [{ value: '40+', label: { en: 'components', fr: 'composants' } }],
  }),
]
