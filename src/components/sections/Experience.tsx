import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EXPERIENCE } from '@/data/experience'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Section, SectionHeading } from '@/components/ui'
import ExperienceItem from './ExperienceItem'

gsap.registerPlugin(ScrollTrigger)

export function Experience() {
  const { t } = useTranslation()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const timelineRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const filteredExperience = EXPERIENCE.filter((experience) => experience.type !== 'academic')

  useEffect(() => {
    if (prefersReducedMotion || !lineRef.current || !timelineRef.current) return
    const context = gsap.context(() => {
      gsap.from(lineRef.current, {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 0.5,
        },
      })
    }, timelineRef)
    return () => context.revert()
  }, [prefersReducedMotion])

  return <Section id="experience" py="lg" className="relative">
    <SectionHeading eyebrow={t('experience.subtitle')} titleKey="experience.title" />
    <div ref={timelineRef} className="relative mx-auto mt-16 max-w-4xl">
      <div ref={lineRef} className="absolute bottom-0 left-[7px] top-0 w-[2px] origin-top bg-gradient-to-b from-gold/60 via-gold/40 to-transparent" />
      <div className="space-y-8 md:space-y-12">{filteredExperience.map((experience, index) => <ExperienceItem key={experience.id} experience={experience} index={index} />)}</div>
    </div>
  </Section>
}
