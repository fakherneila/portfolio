import { useTranslation } from 'react-i18next'
import { PROJECTS } from '@/data/projects'
import LocaleLink from '@/components/ui/LocaleLink'
import { Button, ProjectCard, Reveal, Section, SectionHeading } from '@/components/ui'

export function ProjectsPreview() {
  const { t } = useTranslation()
  const featured = PROJECTS.filter((project) => project.featured)
  return <Section id="projects" py="lg"><SectionHeading eyebrow={t('projects.subtitle')} titleKey="projects.title" /><div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{featured.map((project, index) => <Reveal key={project.slug} delay={index * 0.1}><ProjectCard project={project} /></Reveal>)}</div><Reveal delay={0.3}><div className="mt-12 flex justify-center"><LocaleLink to="/projects"><Button variant="secondary" size="lg" iconRight="ArrowRight">{t('projects.viewAll')}</Button></LocaleLink></div></Reveal></Section>
}
