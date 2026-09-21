import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PROJECTS, PROJECT_CATEGORIES } from '@/data/projects'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ProjectCard, ProjectFilter, Reveal, SEO, Section, SectionHeading } from '@/components/ui'

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const filtered = useMemo(() => activeCategory === 'all' ? PROJECTS : PROJECTS.filter((project) => project.categories.includes(activeCategory as typeof project.categories[number])), [activeCategory])

  return <><SEO titleKey="projects.title" descriptionKey="projects.subtitle" /><div className="min-h-screen"><Section py="lg" container><SectionHeading eyebrow={t('projects.subtitle')} titleKey="projects.title" /><Reveal delay={0.15}><div className="mt-12"><ProjectFilter value={activeCategory} onChange={setActiveCategory} categories={PROJECT_CATEGORIES} /></div></Reveal><div className="mt-12">{filtered.length === 0 ? <Reveal><p className="py-20 text-center text-muted">{t('projects.noProjects')}</p></Reveal> : <motion.div layout={!prefersReducedMotion} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"><AnimatePresence mode="popLayout">{filtered.map((project, index) => <motion.div key={project.slug} layout={!prefersReducedMotion} initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96 }} transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : Math.min(index * 0.04, 0.25), ease: [0.22, 1, 0.36, 1] }}><ProjectCard project={project} /></motion.div>)}</AnimatePresence></motion.div>}</div></Section></div></>
}
