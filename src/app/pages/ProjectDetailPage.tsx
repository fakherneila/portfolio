import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PROJECTS } from '@/data/projects'
import { useLocale } from '@/hooks/useLocale'
import LocaleLink from '@/components/ui/LocaleLink'
import { Button, Icon, Reveal, SEO, Section, Tag } from '@/components/ui'
import NotFoundPage from './NotFoundPage'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, t } = useLocale()
  const index = useMemo(() => PROJECTS.findIndex((project) => project.slug === slug), [slug])

  if (index === -1) return <NotFoundPage />
  const project = PROJECTS[index]
  const previous = index > 0 ? PROJECTS[index - 1] : null
  const next = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null

  return <><SEO titleKey="projects.title" descriptionKey="projects.subtitle" titleOverride={project.title[locale]} descriptionOverride={project.description[locale]} /><article className="min-h-screen"><Section py="md" container>
    <Reveal><LocaleLink to="/projects" className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"><Icon name="ArrowLeft" size={16} />{t('projects.backToList')}</LocaleLink></Reveal>
    <Reveal delay={0.1}><div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-gold-radial"><img src={project.cover} alt={project.title[locale]} className="relative z-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div></Reveal>
    <div className="mt-10 max-w-3xl"><Reveal delay={0.15}><div className="mb-4 flex items-center gap-3"><span className="text-xs font-medium uppercase tracking-widest text-gold">{project.year}</span><span className="text-muted/50">·</span><span className="text-xs font-medium uppercase tracking-widest text-muted">{project.categories.map((category) => t(`projects.categories.${category}`, { defaultValue: category })).join(' · ')}</span></div></Reveal><Reveal delay={0.2}><h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">{project.title[locale]}</h1></Reveal><Reveal delay={0.25}><p className="mt-6 text-lg leading-relaxed text-muted">{project.description[locale]}</p></Reveal><Reveal delay={0.3}><div className="mt-8 flex flex-wrap gap-3">{project.liveUrl ? <Button variant="gold" size="md" as="a" href={project.liveUrl} external iconRight="ExternalLink">{t('projects.liveDemo')}</Button> : null}{project.repoUrl ? <Button variant="secondary" size="md" as="a" href={project.repoUrl} external icon="Github">{t('projects.sourceCode')}</Button> : null}</div></Reveal></div>
    {project.metrics?.length ? <Reveal delay={0.35}><div className="mt-16 max-w-4xl"><h2 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-gold">{t('projects.metrics')}</h2><div className="grid grid-cols-2 gap-6 md:grid-cols-4">{project.metrics.map((metric) => <div key={metric.label.en} className="flex flex-col items-start"><span className="font-heading text-3xl font-semibold text-gold md:text-4xl">{metric.value}</span><span className="mt-1 text-sm text-muted">{metric.label[locale]}</span></div>)}</div></div></Reveal> : null}
    <Reveal delay={0.4}><div className="mt-16 max-w-3xl"><h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">{t('projects.overview')}</h2><p className="text-base leading-relaxed text-foreground/90">{project.longDescription?.[locale] ?? project.description[locale]}</p></div></Reveal>
    <Reveal delay={0.45}><div className="mt-16 max-w-3xl"><h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">{t('projects.stack')}</h2><div className="flex flex-wrap gap-2">{project.stack.map((technology) => <Tag key={technology}>{technology}</Tag>)}</div></div></Reveal>
    {project.gallery?.length ? <Reveal delay={0.5}><div className="mt-16 max-w-5xl"><h2 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-gold">{t('projects.gallery')}</h2><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{project.gallery.map((source) => <div key={source} className="aspect-video overflow-hidden rounded-2xl border border-border bg-surface"><img src={source} alt={`${project.title[locale]} — ${t('projects.gallery')}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div>)}</div></div></Reveal> : null}
    <Reveal delay={0.55}><div className="mt-24 flex max-w-3xl items-center justify-between gap-4 border-t border-border pt-8">{previous ? <LocaleLink to={`/projects/${previous.slug}`} className="group flex flex-col items-start gap-1 text-sm transition-colors hover:text-gold"><span className="flex items-center gap-1 text-xs text-muted"><Icon name="ArrowLeft" size={12} />{t('projects.previous')}</span><span className="font-medium">{previous.title[locale]}</span></LocaleLink> : <span />}{next ? <LocaleLink to={`/projects/${next.slug}`} className="group flex flex-col items-end gap-1 text-right text-sm transition-colors hover:text-gold"><span className="flex items-center gap-1 text-xs text-muted">{t('projects.next')}<Icon name="ArrowRight" size={12} /></span><span className="font-medium">{next.title[locale]}</span></LocaleLink> : <span />}</div></Reveal>
  </Section></article></>
}
