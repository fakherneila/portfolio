import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Icon } from '@/components/ui'
import LocaleLink from '@/components/ui/LocaleLink'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LangSwitcher from './LangSwitcher'
import HamburgerButton from './HamburgerButton'
import type { NavLinkConfig } from './NavbarLink'
import { SOCIALS } from '@/data/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  links: NavLinkConfig[]
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const { t } = useTranslation()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  const handleAnchor = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    const target = document.querySelector(href)
    if (target instanceof HTMLElement) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.pushState(null, '', href)
    onClose()
  }

  return <AnimatePresence>
    {open ? <motion.div
      className="fixed inset-0 z-50 bg-background"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.menu')}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex h-full flex-col px-6 py-3">
        <div className="flex h-16 items-center justify-between">
          <LocaleLink to="/" onClick={onClose} className="font-heading text-lg font-semibold">Fakher <span className="gold-text">Neila</span></LocaleLink>
          <HamburgerButton open onClick={onClose} />
        </div>
        <nav className="flex flex-1 flex-col justify-center" aria-label={t('nav.menu')}>
          <ul className="space-y-5">
            {links.map((link, index) => <motion.li key={link.id} initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}>
              {link.href.startsWith('#') ? <a href={link.href} onClick={(event) => handleAnchor(event, link.href)} className="font-heading text-3xl text-foreground transition-colors hover:text-gold md:text-4xl">{link.label}</a> : <LocaleLink to={link.href} onClick={onClose} className="font-heading text-3xl text-foreground transition-colors hover:text-gold md:text-4xl">{link.label}</LocaleLink>}
            </motion.li>)}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitcher />
          <ThemeToggle />
        </div>
        <div className="mt-6 flex items-center gap-3">
          {SOCIALS.map((social) => <a key={social.label} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={social.label} className="rounded-full border border-border p-2 text-muted transition-colors hover:border-gold/40 hover:text-gold"><Icon name={social.icon} size={18} /></a>)}
        </div>
        <div className="mt-6 pb-4"><Badge variant="success" pulse>{t('contact.availability.available')}</Badge></div>
      </div>
    </motion.div> : null}
  </AnimatePresence>
}
