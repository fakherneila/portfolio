import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/utils'

type BadgeProps = {
  variant?: 'default' | 'success' | 'warning' | 'gold' | 'muted'
  pulse?: boolean
  icon?: IconName
  children: ReactNode
  className?: string
}

const variants = {
  default: 'border-border bg-surface text-foreground',
  success: 'border-green-500/20 bg-green-500/10 text-green-500',
  warning: 'border-gold/30 bg-gold/10 text-gold',
  gold: 'border-gold/30 bg-gold/10 text-gold',
  muted: 'border-border bg-muted/10 text-muted',
}

export function Badge({ variant = 'default', pulse = false, icon, children, className }: BadgeProps) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium', variants[variant], className)}>
    {pulse ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" /> : null}
    {icon ? <Icon name={icon} size={14} /> : null}
    {children}
  </span>
}
