import { createElement, type MouseEventHandler, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardProps = {
  glow?: boolean
  hover?: boolean
  as?: 'div' | 'article' | 'section'
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLElement>
}

export function Card({ glow = false, hover = false, as = 'div', className, children, onClick }: CardProps) {
  return createElement(as, {
    className: cn(
      'rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-md transition-all duration-300 ease-premium',
      glow && 'hover:shadow-gold-md',
      hover && 'hover:-translate-y-0.5 hover:border-gold/40',
      onClick && 'cursor-pointer',
      className,
    ),
    onClick,
  }, children)
}
