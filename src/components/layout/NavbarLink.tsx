import { motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import LocaleNavLink from '@/components/ui/LocaleNavLink'

type NavbarLinkProps = {
  label: string
  href: string
  isExternal?: boolean
  isActive?: boolean
  onClick?: () => void
}

export type NavLinkConfig = NavbarLinkProps & { id: string }

export default function NavbarLink({ label, href, isExternal = false, isActive = false, onClick }: NavbarLinkProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.querySelector(href)
    if (target instanceof HTMLElement) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.pushState(null, '', href)
    onClick?.()
  }
  const className = `relative px-1 py-2 text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted hover:text-foreground'}`

  return <li className="relative">
    {href.startsWith('#') || isExternal ? (
      <a href={href} className={className} onClick={href.startsWith('#') ? handleAnchorClick : onClick}>{label}</a>
    ) : (
      <LocaleNavLink to={href} className={className} onClick={onClick}>{label}</LocaleNavLink>
    )}
    {isActive ? <motion.span layoutId="nav-underline" className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gold-gradient" /> : null}
  </li>
}
