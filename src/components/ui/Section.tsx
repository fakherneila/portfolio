import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

type SectionProps = {
  id?: string
  className?: string
  container?: boolean
  py?: 'sm' | 'md' | 'lg' | 'xl'
  reveal?: boolean
  children: ReactNode
}

const padding = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  xl: 'py-32 md:py-40',
}

export function Section({
  id,
  className,
  container = true,
  py = 'md',
  reveal = false,
  children,
}: SectionProps) {
  const content = container ? (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
      {children}
    </div>
  ) : (
    children
  )
  return (
    <section id={id} className={cn('w-full', padding[py], className)}>
      {reveal ? <Reveal>{content}</Reveal> : content}
    </section>
  )
}
