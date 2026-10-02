import { lazy, Suspense } from 'react'
import { SEO } from '@/components/ui'
import { Hero } from '@/components/sections/Hero'
import { LazySection } from '@/components/ui/LazySection'

const About = lazy(() =>
  import('@/components/sections/About').then((module) => ({
    default: module.About,
  })),
)
const Experience = lazy(() =>
  import('@/components/sections/Experience').then((module) => ({
    default: module.Experience,
  })),
)
const Skills = lazy(() =>
  import('@/components/sections/Skills').then((module) => ({
    default: module.Skills,
  })),
)
const ProjectsPreview = lazy(() =>
  import('@/components/sections/ProjectsPreview').then((module) => ({
    default: module.ProjectsPreview,
  })),
)
const Education = lazy(() =>
  import('@/components/sections/Education').then((module) => ({
    default: module.Education,
  })),
)
const Contact = lazy(() =>
  import('@/components/sections/Contact').then((module) => ({
    default: module.Contact,
  })),
)

export default function HomePage() {
  return (
    <>
      <SEO titleKey="hero.greeting" descriptionKey="hero.tagline" />
      <Hero />
      <LazySection>
        <Suspense fallback={null}>
          <About />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <Skills />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <ProjectsPreview />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <Education />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </LazySection>
    </>
  )
}
