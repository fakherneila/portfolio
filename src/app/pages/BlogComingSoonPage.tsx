import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { SEO } from '@/components/ui/SEO'
import { Icon } from '@/components/ui/Icon'
import LocaleLink from '@/components/ui/LocaleLink'
import { Button } from '@/components/ui/Button'

export default function BlogComingSoonPage() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        titleOverride="Blog"
        descriptionOverride="Blog posts coming soon."
      />
      <Section py="xl" container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center"
        >
          {/* Icon */}
          <div className="mb-8 rounded-full border border-gold/30 bg-gold/5 p-6">
            <Icon name="Sparkles" size={32} className="text-gold" />
          </div>

          {/* Eyebrow */}
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
            {t('blog.eyebrow', 'Writing')}
          </p>

          {/* Title */}
          <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            {t('blog.comingSoon.title', 'Coming soon')}
          </h1>

          {/* Gold underline */}
          <div className="mt-4 h-[2px] w-16 rounded-full bg-gold-gradient" />

          {/* Description */}
          <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
            {t(
              'blog.comingSoon.description',
              "I'm working on a series of technical write-ups on full-stack engineering, testing, and AI. Check back soon — or reach out if you'd like to talk in the meantime.",
            )}
          </p>

          {/* CTA */}
          <div className="mt-10">
            <LocaleLink to="/#contact">
              <Button variant="gold" size="lg" icon="Mail">
                {t('blog.comingSoon.cta', 'Get in touch')}
              </Button>
            </LocaleLink>
          </div>
        </motion.div>
      </Section>
    </>
  )
}
