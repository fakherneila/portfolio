import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type ProjectFilterProps = { value: string; onChange: (id: string) => void; categories: readonly { id: string; labelKey: string }[]; className?: string }

export function ProjectFilter({ value, onChange, categories, className }: ProjectFilterProps) {
  const { t } = useTranslation()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  return <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>{categories.map((category) => { const active = category.id === value; return <button key={category.id} type="button" onClick={() => onChange(category.id)} className={cn('relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300', active ? 'text-background' : 'border border-border text-muted hover:border-gold/40 hover:text-foreground')}><span className="relative z-10">{t(`projects.categories.${category.labelKey}`, { defaultValue: category.labelKey })}</span>{active ? <motion.span layoutId="project-filter-pill" className="absolute inset-0 rounded-full bg-gold" layout={!prefersReducedMotion} transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }} /> : null}</button> })}</div>
}
