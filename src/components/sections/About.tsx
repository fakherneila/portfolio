import { useTranslation } from 'react-i18next'
import { SITE } from '@/data/site'
import { Badge, Section, SectionHeading, Stat, Reveal } from '@/components/ui'

export function About() {
  const { t } = useTranslation()

  return (
    <Section id="about" py="lg">
      <SectionHeading eyebrow={t('about.subtitle')} titleKey="about.title" />
      <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-16">
        <Reveal direction="left" className="lg:col-span-2">
          <div className="relative mx-auto aspect-[4/5] max-w-sm">
            <div className="pointer-events-none absolute -inset-2 rounded-3xl border-2 border-gold/30" />
            <img
              src="/profile.webp"
              alt={t('about.photoAlt')}
              className="relative h-full w-full rounded-2xl object-cover shadow-gold-md"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = '/profile-placeholder.svg'
              }}
            />
          </div>
        </Reveal>
        <div className="space-y-6 lg:col-span-3">
          <Reveal direction="right">
            <p className="text-lg leading-relaxed text-foreground/90">
              {t('about.bio1')}
            </p>
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <p className="text-base leading-relaxed text-muted">
              {t('about.bio2')}
            </p>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gold">
                {t('about.languagesLabel')}
              </p>
              <div className="flex flex-wrap gap-2">
                {SITE.languages.map((language) => (
                  <Badge key={language.name} variant="muted">
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                    <span className="text-muted/70">· {language.level}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal delay={0.3}>
        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-16 md:grid-cols-4 md:gap-12">
          <Stat value={4} suffix="+" labelKey="about.stats.yearsStudying" />
          <Stat value={5} suffix="+" labelKey="about.stats.internships" />
          <Stat value={7} suffix="+" labelKey="about.stats.projects" />
          <Stat value={30} suffix="+" labelKey="about.stats.technologies" />
        </div>
      </Reveal>
    </Section>
  )
}
