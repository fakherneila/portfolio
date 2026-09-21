import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TagProps = {
  color?: 'default' | 'gold'
  children: ReactNode
  className?: string
}

export function Tag({ color = 'default', children, className }: TagProps) {
  return <span className={cn(
    'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs',
    color === 'gold' ? 'border-gold/20 bg-gold/5 text-gold' : 'border-border bg-surface-elevated text-muted',
    className,
  )}>{children}</span>
}
