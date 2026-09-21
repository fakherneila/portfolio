import type { MouseEventHandler, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/utils'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: IconName
  iconRight?: IconName
  as?: 'button' | 'a'
  href?: string
  external?: boolean
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  type?: 'button' | 'submit' | 'reset'
}

const variants = {
  primary: 'bg-gold text-background shadow-gold-sm hover:bg-gold-bright hover:shadow-gold-md',
  secondary: 'border border-gold bg-transparent text-gold hover:bg-gold/10',
  ghost: 'bg-transparent text-foreground hover:bg-surface',
  gold: 'bg-gold-gradient text-background',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-[52px] px-8 text-base',
}

export function Button({
  variant = 'primary', size = 'md', loading = false, icon, iconRight, as = 'button', href,
  external = false, children, className, disabled = false, onClick, type = 'button',
}: ButtonProps) {
  const isDisabled = disabled || loading
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium transition-all duration-300 ease-premium',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
    variants[variant], sizes[size], className,
  )
  const content = <>
    {loading ? <Icon name="Loader2" className="animate-spin" /> : icon ? <Icon name={icon} /> : null}
    {children}
    {!loading && iconRight ? <Icon name={iconRight} /> : null}
  </>

  if (as === 'a' || href) {
    return <a className={classes} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} aria-disabled={isDisabled || undefined} onClick={onClick}>
      {content}
    </a>
  }

  return <button className={classes} type={type} disabled={isDisabled} onClick={onClick}>
    {content}
  </button>
}
