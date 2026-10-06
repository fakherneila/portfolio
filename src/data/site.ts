import type { IconName } from '@/components/ui/Icon'

export const SITE = {
  name: 'Fakher Neila',
  url: 'https://fakher-neila.example',
  emails: {
    personal: 'neilafakher8@gmail.com',
    professional: 'f.neila@clevertech-france.fr',
  },
  phones: [
    { label: 'Mobile', number: '+216 26 511 871', raw: '+21626511871' },
    { label: 'Mobile', number: '+216 25 126 528', raw: '+21625126528' },
  ],
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
  availability: { available: true, range: 'Feb 2027 — Aug 2027' },
} as const

export const SOCIALS: ReadonlyArray<{
  label: string
  href: string
  icon: IconName
}> = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'Github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ne%C3%AFla-fakher-a00901247',
    icon: 'Linkedin',
  },
  { label: 'Email', href: 'mailto:neilafakher8@gmail.com', icon: 'Mail' },
]

/**
 * Returns the correct CV file path for the given locale.
 * English -> /cv.pdf
 * French  -> /cv-fr.pdf
 */
export function getCvPath(locale: 'en' | 'fr'): string {
  return locale === 'fr' ? '/cv-fr.pdf' : '/cv.pdf'
}
