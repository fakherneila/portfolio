import { useTranslation } from 'react-i18next'
import { Badge, Icon } from '@/components/ui'
import LocaleLink from '@/components/ui/LocaleLink'
import { SOCIALS, SITE } from '@/data/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function Footer() {
  const { t } = useTranslation()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const links = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.experience'), href: '#experience' },
    { label: t('nav.skills'), href: '#skills' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.blog'), href: '/blog' },
    { label: t('nav.contact'), href: '#contact' },
  ]
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })

  return <footer className="relative z-10 mt-24 border-t border-border">
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-xl font-semibold">Fakher <span className="gold-text">Neila</span></p>
          <p className="mt-3 max-w-xs text-sm text-muted">{t('footer.tagline', { defaultValue: 'Building premium web experiences from Tunis.' })}</p>
          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map((social) => <a key={social.label} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={social.label} className="rounded-full border border-border p-2 text-muted transition-all duration-300 hover:border-gold/40 hover:text-gold focus-visible:ring-2 focus-visible:ring-ring"><Icon name={social.icon} size={18} /></a>)}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">{t('footer.quickLinks')}</h3>
          <ul className="space-y-3 text-sm">
            {links.map((link) => <li key={link.href}>{link.href.startsWith('/') ? <LocaleLink className="text-muted transition-colors hover:text-gold" to={link.href}>{link.label}</LocaleLink> : <a className="text-muted transition-colors hover:text-gold" href={link.href}>{link.label}</a>}</li>)}
          </ul>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <Badge variant="success" pulse>{t('contact.availability.available')}</Badge>
          <p className="text-xs text-muted">{t('contact.availability.range')}</p>
          <a href={`tel:${SITE.phones[0].raw}`} className="text-xs text-muted transition-colors hover:text-gold">
            {SITE.phones[0].number}
          </a>
          <button type="button" onClick={handleBackToTop} className="mt-2 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold focus-visible:ring-2 focus-visible:ring-ring" aria-label={t('a11y.scrollToTop')}>
            <Icon name="ArrowUp" size={16} />{t('footer.backToTop')}
          </button>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted md:flex-row">
        <p>© {new Date().getFullYear()} Fakher Neila. {t('footer.rights')}</p>
      </div>
    </div>
  </footer>
}
