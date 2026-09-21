import type { Experience } from '@/types/experience'

export const EXPERIENCE: Experience[] = [
  {
    id: 'hackhub',
    type: 'internship',
    company: 'HackHub',
    location: 'Remote',
    start: '2026-03',
    end: 'present',
    role: { en: 'QA Engineer (Freelance)', fr: 'Ingénieur QA (Freelance)' },
    summary: {
      en: 'Performed manual quality assurance across core platform features and release checks.',
      fr: 'Réalisation de tests manuels sur les fonctionnalités clés de la plateforme et les releases.',
    },
    bullets: {
      en: [
        'Conducted manual exploratory and regression testing across core platform features.',
        'Wrote and maintained test cases; identified, reproduced, and documented bugs with actionable reports.',
        'Validated releases before deployment and supported the Microsoft Azure hosting setup.',
      ],
      fr: [
        'Tests manuels exploratoires et de régression sur les fonctionnalités clés de la plateforme.',
        'Rédaction et maintenance de cas de test ; identification, reproduction et documentation des bugs avec rapports actionnables.',
        "Validation des releases avant déploiement et support de l'hébergement Microsoft Azure.",
      ],
    },
    stack: ['Manual Testing', 'Test Cases', 'Azure', 'Bug Reporting'],
    achievement: {
      en: 'Improved release confidence before features went live.',
      fr: 'Amélioration de la confiance avant mise en ligne des fonctionnalités.',
    },
  },
  {
    id: 'clevertech',
    type: 'internship',
    company: 'CleverTech France',
    location: 'Les Berges du Lac 2, Tunis, Tunisia',
    start: '2026-07',
    end: '2026-09',
    role: {
      en: 'Software Test Automation Intern',
      fr: 'Stagiaire en Automatisation des Tests',
    },
    summary: {
      en: 'Automated QA for DAXme (dev.daxme.fr), a multi-module SaaS platform, using Robot Framework + Selenium.',
      fr: 'Automatisation QA pour DAXme (dev.daxme.fr), une plateforme SaaS multi-modules, avec Robot Framework + Selenium.',
    },
    bullets: {
      en: [
        'Built maintainable automation scripts for core workflows.',
        'Validated regression risk across critical user journeys.',
        'Improved test traceability for the QA process.',
      ],
      fr: [
        'Création de scripts d’automatisation maintenables pour les parcours clés.',
        'Validation des risques de régression sur les parcours utilisateurs critiques.',
        'Amélioration de la traçabilité des tests pour le processus QA.',
      ],
    },
    stack: ['Robot Framework', 'Selenium', 'Python', 'Chrome'],
    achievement: {
      en: '96% test pass rate — 45 PASS / 47 total, 0 failures.',
      fr: 'Taux de réussite de tests de 96 % — 45 PASS / 47 total, 0 échec.',
    },
  },
  {
    id: 'ijschool',
    type: 'internship',
    company: 'IJSchool France',
    location: 'France · Remote',
    start: '2026-07',
    end: '2026-08',
    role: {
      en: 'Full-Stack Developer Intern',
      fr: 'Stagiaire développeur full-stack',
    },
    summary: {
      en: 'Shipped improvements for a digital learning and trainer management portal.',
      fr: 'Amélioration d’un portail de formation et de gestion des formateurs.',
    },
    bullets: {
      en: [
        'Implemented trainer-facing dashboard workflows.',
        'Connected frontend forms to secure backend services.',
        'Collaborated remotely with product stakeholders.',
      ],
      fr: [
        'Implémentation des parcours du tableau de bord formateur.',
        'Connexion des formulaires aux services backend sécurisés.',
        'Collaboration à distance avec les parties prenantes produit.',
      ],
    },
    stack: [
      'React',
      'Airtable',
      'Vite',
      'Tailwind CSS',
      'React Router',
      'jsPDF',
      'Vitest',
      'Testing Library',
      'Playwright',
      'GitHub',
      'Git',
      'Cloudinary',
      'Render',
      'cPanel',
    ],
    achievement: {
      en: 'Delivered a clearer workflow for trainer onboarding.',
      fr: 'Création d’un parcours plus clair pour l’intégration des formateurs.',
    },
    link: 'https://ijschool.fr/portail-formateur',
  },
  {
    id: 'alfa',
    type: 'internship',
    company: 'Alfa-Computers & Consulting',
    location: 'Mahdia, Tunisia',
    start: '2026-06',
    end: '2026-06',
    role: {
      en: 'Full-Stack / BI Engineering Intern',
      fr: 'Stagiaire Ingénierie Full-Stack / BI',
    },
    summary: {
      en: 'Built PuntaConnect — an AI-powered Business Intelligence dashboard for multi-region sales analysis.',
      fr: 'Développement de PuntaConnect — un tableau de bord Business Intelligence propulsé par IA pour l’analyse de ventes multi-régions.',
    },
    bullets: {
      en: [
        'Built BI dashboards from raw sales data.',
        'Connected business KPIs to readable visual insights.',
        'Improved the data flow for faster reporting.',
      ],
      fr: [
        'Création de dashboards BI à partir de données commerciales brutes.',
        'Connexion des KPI métier à des indicateurs visuels lisibles.',
        'Amélioration du flux de données pour un reporting plus rapide.',
      ],
    },
    stack: ['React', 'Python', 'Power BI', 'SQL'],
    achievement: {
      en: 'Turned scattered data into a usable decision-support tool.',
      fr: 'Transformation de données dispersées en outil d’aide à la décision exploitable.',
    },
  },
  {
    id: 'tachafy',
    type: 'internship',
    company: 'Tachafy',
    location: 'Lyon, France (Remote)',
    start: '2025-06',
    end: '2025-08',
    role: {
      en: 'Full-Stack Developer Intern',
      fr: 'Stagiaire Développeur Full-Stack',
    },
    summary: {
      en: 'Created web experiences and learned the fundamentals of shipping with a product team.',
      fr: 'Création d’expériences web et découverte de la livraison produit en équipe.',
    },
    bullets: {
      en: [
        'Translated designs into responsive pages.',
        'Integrated content management workflows.',
        'Practiced code review and collaborative Git.',
      ],
      fr: [
        'Traduction de maquettes en pages responsives.',
        'Intégration de flux de gestion de contenu.',
        'Mise en pratique des revues de code et de Git collaboratif.',
      ],
    },
    stack: ['React', 'FastAPI', 'PWA', 'Tailwind CSS', 'TypeScript'],
    achievement: {
      en: 'Built a strong foundation in production web development.',
      fr: 'Construction de bases solides en développement web de production.',
    },
  },
  {
    id: 'issat-academic',
    type: 'academic',
    company: 'ISSAT Sousse',
    location: 'Sousse, Tunisia',
    start: '2022-09',
    end: '2026-06',
    role: {
      en: 'Software Engineering Student',
      fr: 'Étudiant en génie logiciel',
    },
    summary: {
      en: 'Focused on software architecture, cloud systems, and applied AI within the engineering curriculum.',
      fr: 'Focus sur l’architecture logicielle, les systèmes cloud et l’IA appliquée dans le cursus d’ingénierie.',
    },
    bullets: {
      en: [
        'Completed academic projects in software engineering and data-driven systems.',
        'Worked with teams on product-oriented technical problems.',
        'Built a strong theoretical foundation for full-stack engineering.',
      ],
      fr: [
        'Réalisation de projets académiques en ingénierie logicielle et systèmes orientés données.',
        'Travail en équipe sur des problèmes techniques orientés produit.',
        'Construction d’une base théorique solide pour l’ingénierie full-stack.',
      ],
    },
    stack: ['Software Engineering', 'Cloud', 'AI', 'Architecture'],
    achievement: {
      en: 'Combined applied learning with technical leadership and product discipline.',
      fr: 'Combinaison d’apprentissage appliqué avec leadership technique et discipline produit.',
    },
  },
]
