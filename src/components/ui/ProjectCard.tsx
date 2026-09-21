import { useLocale } from '@/hooks/useLocale'
import LocaleLink from './LocaleLink'
import { Card } from './Card'
import { Icon } from './Icon'
import { Tag } from './Tag'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/project'

type ProjectCardProps = { project: Project; variant?: 'default' | 'featured'; className?: string }

export function ProjectCard({ project, variant = 'default', className }: ProjectCardProps) {
  const { locale, t } = useLocale()
  return <LocaleLink to={`/projects/${project.slug}`} className={cn('group block h-full', className)}><Card hover glow className="flex h-full flex-col overflow-hidden">
    <div className={cn('relative -m-6 mb-4 overflow-hidden', variant === 'featured' ? 'aspect-[4/3]' : 'aspect-video')}><img src={project.cover} alt={project.title[locale]} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = 'none' }} /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" /><span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">{project.year}</span></div>
    <div className="flex flex-1 flex-col pt-2"><h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-gold">{project.title[locale]}</h3><p className="mt-2 line-clamp-3 text-sm text-muted">{project.description[locale]}</p>{project.metrics?.length ? <div className="mt-4 flex flex-wrap gap-3 text-xs">{project.metrics.slice(0, 3).map((metric) => <div key={metric.label.en} className="flex items-baseline gap-1"><span className="font-semibold text-gold">{metric.value}</span><span className="text-muted">{metric.label[locale]}</span></div>)}</div> : null}<div className="mt-4 flex flex-wrap gap-1.5">{project.stack.slice(0, 4).map((technology) => <Tag key={technology}>{technology}</Tag>)}{project.stack.length > 4 ? <Tag>+{project.stack.length - 4}</Tag> : null}</div><div className="mt-6 flex items-center justify-between border-t border-border pt-4"><span className="inline-flex items-center gap-1 text-sm font-medium text-gold transition-all group-hover:gap-2">{t('projects.viewCase')}<Icon name="ArrowRight" size={14} /></span>{project.liveUrl ? <span className="text-muted transition-colors group-hover:text-gold" aria-label={t('projects.liveDemo')}><Icon name="ExternalLink" size={16} /></span> : null}</div></div>
  </Card></LocaleLink>
}
