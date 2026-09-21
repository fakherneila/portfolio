import type { IconName } from '@/components/ui/Icon'

export const SITE = {
  name: 'Fakher Neila',
  url: 'https://fakher-neila.example',
  emails: {
    primary: 'neilafakher8@gmail.com',
    professional: 'f.neila@clevertech-france.fr',
  },
  email: 'neilafakher8@gmail.com',
  roles: [
    'Software Engineer',
    'Full-Stack Developer',
    'PFE Candidate',
    'AI/ML Builder',
  ],
  languages: [
    { name: 'Arabe', flag: 'AR', level: 'Natif' },
    { name: 'Français', flag: 'FR', level: 'Courant' },
    { name: 'Anglais', flag: 'EN', level: 'Professionnel' },
    { name: 'Espagnol', flag: 'ES', level: 'Notions' },
  ],
  availability: { available: true, range: 'Feb 2026 — Aug 2026' },
} as const

export const SOCIALS: ReadonlyArray<{
  label: string
  href: string
  icon: IconName
}> = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'Github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'Linkedin' },
  { label: 'Email', href: 'mailto:neilafakher8@gmail.com', icon: 'Mail' },
]
