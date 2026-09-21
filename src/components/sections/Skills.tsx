import { useTranslation } from 'react-i18next'
import { SKILLS } from '@/data/skills'
import { Reveal, Section, SectionHeading } from '@/components/ui'
import { SkillCard } from './SkillCard'

export function Skills() {
  const { t } = useTranslation()
  return (
    <Section id="skills" py="lg">
      <SectionHeading eyebrow={t('skills.subtitle')} titleKey="skills.title" />
      <div className="mt-16 space-y-12">
        {SKILLS.map((category) => (
          <div key={category.id}>
            <Reveal>
              <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-gold">
                {t(`skills.categories.${category.labelKey}`, {
                  defaultValue: category.labelKey,
                })}
              </h3>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {category.skills.map((skill, index) => (
                <Reveal key={skill.name} delay={Math.min(index * 0.04, 0.3)}>
                  <SkillCard
                    name={skill.name}
                    slug={skill.slug}
                    icon={skill.icon}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
