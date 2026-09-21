import { useTranslation } from 'react-i18next'
import LocaleLink from '@/components/ui/LocaleLink'
import PageTransition from '@/components/layout/PageTransition'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="gold-text font-heading text-display">{t('common.notFound.title')}</h1>
          <p className="mt-4 text-muted">{t('common.notFound.description')}</p>
          <LocaleLink className="mt-8 inline-flex rounded-full bg-gold px-5 py-2.5 font-semibold text-background transition-transform hover:scale-105" to="/">
            {t('common.notFound.backHome')}
          </LocaleLink>
        </div>
      </div>
    </PageTransition>
  )
}
