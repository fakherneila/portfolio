import { EDUCATION, HACKATHONS, LEADERSHIP } from '@/data/education'
import { useLocale } from '@/hooks/useLocale'
import { Badge, Card, Icon, Reveal, Section, SectionHeading } from '@/components/ui'

export function Education() {
  const { locale, t } = useLocale()
  return <Section id="education" py="lg"><SectionHeading eyebrow={t('education.subtitle')} titleKey="education.title" />
    <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">{EDUCATION.map((education, index) => <Reveal key={education.id} delay={index * 0.1}><Card className="h-full p-6 md:p-8"><p className="text-xs font-medium uppercase tracking-widest text-gold">{education.start} — {education.end}</p><h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{education.degree[locale]}</h3><p className="mt-1 text-sm text-muted">{education.institution}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted/80"><Icon name="MapPin" size={12} />{education.location}</p>{education.description ? <p className="mt-4 text-sm leading-relaxed text-foreground/80">{education.description[locale]}</p> : null}</Card></Reveal>)}</div>
    <Reveal delay={0.2}><div className="mx-auto mt-16 max-w-4xl"><h3 className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-gold">{t('education.leadership.label')}</h3><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{LEADERSHIP.map((item) => <Card key={item.id} className="p-5"><div className="flex items-start gap-3"><div className="rounded-full bg-gold/10 p-2 text-gold"><Icon name="Award" size={16} /></div><div className="flex-1"><p className="text-sm font-medium text-foreground">{item.role[locale]}</p><p className="mt-0.5 text-xs text-muted">{item.org} · {item.period}</p><p className="mt-2 text-xs leading-relaxed text-foreground/70">{item.description[locale]}</p></div></div></Card>)}</div></div></Reveal>
    <Reveal delay={0.3}>
      <div className="mx-auto mt-16 max-w-4xl">
        <h3 className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-gold">
          {t('education.hackathons.label')}
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {HACKATHONS.map((hackathon) => {
            const isOrganizer = hackathon.role === 'organizer'
            const isHighlight = 'highlight' in hackathon && Boolean(hackathon.highlight)
            const variant = isHighlight || isOrganizer ? 'gold' : 'muted'
            const icon = isHighlight ? 'Trophy' : isOrganizer ? 'Users' : 'Award'
            const awardText =
              'award' in hackathon && hackathon.award
                ? typeof hackathon.award === 'object'
                  ? hackathon.award[locale]
                  : t('education.award.firstPlace')
                : null

            return (
              <Badge key={hackathon.id} variant={variant} icon={icon}>
                {hackathon.name} · {hackathon.year}
                {awardText ? (
                  <span className="ml-1 font-semibold text-gold">🏆 {awardText}</span>
                ) : null}
              </Badge>
            )
          })}
        </div>
      </div>
    </Reveal>
  </Section>
}
