import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import LocaleLink from '@/components/ui/LocaleLink'
import LangSwitcher from './LangSwitcher'
import ThemeToggle from '@/components/ui/ThemeToggle'
import NavbarLink, { type NavLinkConfig } from './NavbarLink'
import HamburgerButton from './HamburgerButton'
import MobileMenu from './MobileMenu'
import ScrollProgress from './ScrollProgress'

const SECTION_IDS = ['about', 'experience', 'skills', 'projects', 'education', 'contact']

export default function Navbar() {
  const { t } = useTranslation()
  const scrolled = useScrollPosition(20)
  const activeId = useActiveSection(SECTION_IDS)
  const [menuOpen, setMenuOpen] = useState(false)
  const links = useMemo<NavLinkConfig[]>(() => [
    { id: 'about', label: t('nav.about'), href: '#about' },
    { id: 'experience', label: t('nav.experience'), href: '#experience' },
    { id: 'skills', label: t('nav.skills'), href: '#skills' },
    { id: 'projects', label: t('nav.projects'), href: '#projects' },
    { id: 'education', label: t('nav.education'), href: '#education' },
    { id: 'blog', label: t('nav.blog'), href: '/blog' },
    { id: 'contact', label: t('nav.contact'), href: '#contact' },
  ], [t])

  return <header className="fixed left-0 right-0 top-0 z-40 transition-all duration-500">
    <ScrollProgress />
    <nav className={cn('mx-auto flex h-16 max-w-7xl items-center justify-between px-6 transition-colors duration-500 md:h-[72px] md:px-8', scrolled && 'border-b border-border bg-background/70 backdrop-blur-md')}>
      <LocaleLink to="/" className="flex items-center gap-2" aria-label={t('nav.home')}>
        <span className="font-heading text-lg font-semibold tracking-tight">Fakher <span className="gold-text">Neila</span></span>
        <span className="hidden text-xs text-muted lg:inline">{t('nav.brandRole')}</span>
      </LocaleLink>
      <ul className="hidden items-center gap-8 md:flex">
        {links.map((link) => <NavbarLink key={link.href} {...link} isActive={activeId === link.id} />)}
      </ul>
      <div className="hidden items-center gap-3 md:flex"><LangSwitcher /><ThemeToggle /></div>
      <div className="flex items-center gap-3 md:hidden"><LangSwitcher /><HamburgerButton open={menuOpen} onClick={() => setMenuOpen((value) => !value)} /></div>
    </nav>
    <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} />
  </header>
}
