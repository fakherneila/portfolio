import type { TFunction } from 'i18next'
import type { Experience as ExperienceData } from '@/types/experience'
import { useLocale } from '@/hooks/useLocale'
import { Card, Icon, Tag } from '@/components/ui'

type ExperienceItemProps = { experience: ExperienceData; index: number }

function formatMonth(value: string, locale: string): string {
  if (value === 'present') return value
  const date = new Date(`${value}-01T00:00:00`)
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date)
}

function formatDateRange(start: string, end: string, locale: string, t: TFunction): string {
  const startLabel = formatMonth(start, locale)
  if (end === 'present') return `${startLabel} — ${t('experience.present')}`
  const endLabel = formatMonth(end, locale)
  return start === end ? startLabel : `${startLabel} — ${endLabel}`
}

export default function ExperienceItem({ experience, index }: ExperienceItemProps) {
  const { locale, t } = useLocale()
  return <div className="relative pl-8 md:pl-12" data-experience-index={index}>
    <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-gold shadow-gold-sm ring-4 ring-background" />
    <Card className="p-6 md:p-8" hover>
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gold">{formatDateRange(experience.start, experience.end, locale, t)}</p>
          <h3 className="mt-1 font-heading text-xl font-semibold text-foreground md:text-2xl">{experience.company}</h3>
          <p className="text-sm text-muted">{experience.role[locale]} · {experience.location}</p>
        </div>
        {experience.link ? <a href={experience.link} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-sm text-gold hover:underline">{t('experience.viewSite')}<Icon name="ExternalLink" size={14} /></a> : null}
      </div>
      <p className="mb-4 text-base text-foreground/90">{experience.summary[locale]}</p>
      <ul className="mb-6 space-y-2">{experience.bullets[locale].slice(0, 3).map((bullet) => <li key={bullet} className="flex gap-3 text-sm text-muted"><span className="mt-1.5 shrink-0 text-gold">▸</span><span>{bullet}</span></li>)}</ul>
      <div className="mb-4 flex flex-wrap gap-2">{experience.stack.map((technology) => <Tag key={technology}>{technology}</Tag>)}</div>
      {experience.achievement ? <div className="flex items-start gap-3 rounded-xl border border-gold/20 bg-gold/5 p-3"><Icon name="Award" size={16} className="mt-0.5 shrink-0 text-gold" /><div><p className="mb-1 text-xs font-medium uppercase tracking-widest text-gold">{t('experience.achievement')}</p><p className="text-sm text-foreground/90">{experience.achievement[locale]}</p></div></div> : null}
    </Card>
  </div>
}
