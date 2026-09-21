import { lazy, Suspense } from 'react'
import { SEO } from '@/components/ui'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'

const BlogPreview = lazy(() => import('@/components/sections/BlogPreview').then((module) => ({ default: module.BlogPreview })))
import { Skills } from '@/components/sections/Skills'
import { ProjectsPreview } from '@/components/sections/ProjectsPreview'
import { Education } from '@/components/sections/Education'

const Contact = lazy(() => import('@/components/sections/Contact').then((module) => ({ default: module.Contact })))

export default function HomePage() {
  return <>
    <SEO titleKey="hero.greeting" descriptionKey="hero.tagline" />
    <Hero />
    <About />
    <Experience />
    <Skills />
    <ProjectsPreview />
    <Education />
    <Suspense fallback={null}><BlogPreview /></Suspense>
    <Suspense fallback={null}><Contact /></Suspense>
  </>
}
