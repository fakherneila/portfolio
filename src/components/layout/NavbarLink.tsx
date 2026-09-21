import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'
import LocaleNavLink from '@/components/ui/LocaleNavLink'

type NavbarLinkProps = {
  label: string
  href: string
  isExternal?: boolean
  isActive?: boolean
  onClick?: () => void
}

export type NavLinkConfig = NavbarLinkProps & { id: string }

export default function NavbarLink({
  label,
  href,
  isExternal = false,
  isActive = false,
  onClick,
}: NavbarLinkProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { locale } = useLocale()

  const isHomePage =
    location.pathname === `/${locale}` || location.pathname === `/${locale}/`

  const handleClick = (e: React.MouseEvent) => {
    // Only intercept for anchor links (starting with '#')
    if (!href.startsWith('#')) {
      onClick?.()
      return
    }

    e.preventDefault()
    const id = href.slice(1) // 'skills'

    if (isHomePage) {
      // Already on home — scroll to the element
      const el = document.getElementById(id)
      if (el) {
        const reduced = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        el.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        })
        // Update the URL hash without a full navigation
        window.history.replaceState(null, '', `#${id}`)
      }
    } else {
      // On a different route — navigate to the homepage with the hash
      navigate(`/${locale}#${id}`)
    }

    onClick?.()
  }

  const className = `relative px-1 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
  }`

  return (
    <li className="relative">
      {href.startsWith('#') || isExternal ? (
        <a
          href={isHomePage ? href : `/${locale}${href}`}
          className={className}
          onClick={handleClick}
        >
          {label}
        </a>
      ) : (
        <LocaleNavLink to={href} className={className} onClick={onClick}>
          {label}
        </LocaleNavLink>
      )}
      {isActive ? (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gold-gradient"
        />
      ) : null}
    </li>
  )
}
