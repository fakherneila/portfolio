import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SITE } from '@/data/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import SceneLoader from '@/components/three/SceneLoader'
import { Button, Icon, Reveal, Typewriter } from '@/components/ui'

const HeroScene = lazy(() => import('@/components/three/HeroScene'))

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  })
}

export function Hero() {
  const { t } = useTranslation()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const roles = useMemo(
    () =>
      [
        t('hero.roles.softwareEngineer'),
        t('hero.roles.fullStackDeveloper'),
        t('hero.roles.pfeCandidate'),
        t('hero.roles.aiMlBuilder'),
      ] as const,
    [t],
  )

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background/80">
      <Suspense fallback={<SceneLoader />}>
        <HeroScene />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-transparent to-background" />
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <div
          aria-hidden
          className="hero-scrim pointer-events-none absolute inset-0 z-0"
        />
        <div className="relative z-10 max-w-4xl rounded-3xl px-6 py-10 backdrop-blur-[2px] [background:radial-gradient(ellipse_at_center,rgba(250,249,246,0.35)_0%,transparent_70%)] dark:[background:radial-gradient(ellipse_at_center,rgba(10,10,10,0.4)_0%,transparent_70%)] md:px-10 md:py-14">
          <Reveal direction="up" delay={0.1}>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-foreground/90 [text-shadow:_0_1px_8px_rgba(250,249,246,0.9)] dark:[text-shadow:_0_2px_12px_rgba(0,0,0,0.5)] md:text-base">
              {t('hero.greeting')}
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              <span className="text-foreground/90 [text-shadow:_0_2px_12px_rgba(0,0,0,0.35)] dark:[text-shadow:_0_2px_12px_rgba(0,0,0,0.5)]">
                {SITE.name.split(' ')[0]}{' '}
              </span>
              <span className="gold-text [filter:_drop-shadow(0_2px_8px_rgba(184,134,11,0.35))] dark:[filter:_drop-shadow(0_4px_16px_rgba(244,196,48,0.45))]">
                {SITE.name.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.35}>
            <div className="mt-6 font-heading text-xl text-foreground [text-shadow:_0_1px_8px_rgba(250,249,246,0.9)] dark:[text-shadow:_0_2px_12px_rgba(0,0,0,0.5)] md:text-2xl lg:text-3xl">
              {' '}
              <Typewriter words={roles} />{' '}
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.5}>
            <p className="mx-auto mt-6 max-w-3xl text-base text-foreground/80 [text-shadow:_0_1px_6px_rgba(250,249,246,0.9)] dark:[text-shadow:_0_2px_10px_rgba(0,0,0,0.45)] md:text-lg">
              {t('hero.tagline')}
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.65}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                variant="gold"
                size="lg"
                onClick={() => scrollToSection('projects')}
              >
                {t('hero.cta.viewProjects')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                as="a"
                href="/Cv.pdf"
                external
                icon="Download"
                className="border border-gold/60 text-gold hover:border-gold hover:text-gold-bright"
              >
                {t('hero.cta.downloadCv')}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-gold/40 text-foreground hover:border-gold hover:text-gold"
                onClick={() => scrollToSection('contact')}
              >
                {t('hero.cta.contactMe')}
              </Button>
            </div>
          </Reveal>
        </div>
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          }
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted"
          aria-hidden="true"
        >
          <span className="text-xs uppercase tracking-widest text-foreground/80 [text-shadow:_0_1px_8px_rgba(0,0,0,0.35)]">
            {t('hero.scrollDown')}
          </span>
          <Icon name="ArrowDown" size={16} className="text-gold" />
        </motion.div>
      </div>
    </section>
  )
}
