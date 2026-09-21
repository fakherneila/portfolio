import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import PageTransition from '@/components/layout/PageTransition'

type PlaceholderTitleKey = 'blog.title' | 'projects.title'

type PlaceholderPageProps = {
  titleKey: PlaceholderTitleKey
  step: string
}

export default function PlaceholderPage({ titleKey, step }: PlaceholderPageProps) {
  const { t } = useTranslation()
  const params = useParams<{ locale: string; slug?: string }>()

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="gold-text font-heading text-display">{t(titleKey)}</h1>
          <p className="mt-4 text-muted">Coming soon — {step}</p>
          <p className="mt-3 text-sm text-muted/70">
            {params.locale}{params.slug ? ` / ${params.slug}` : ''}
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
