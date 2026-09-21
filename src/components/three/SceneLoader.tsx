import { useTranslation } from 'react-i18next'

export default function SceneLoader() {
  const { t } = useTranslation()
  return <div className="flex h-full w-full flex-col items-center justify-center bg-gold-radial" aria-live="polite">
    <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-gold">
      <span className="absolute h-8 w-8 animate-ping rounded-full bg-gold/40" />
      <span className="relative h-2 w-2 rounded-full bg-gold" />
    </div>
    <span className="mt-4 text-xs text-muted">{t('common.loading', { defaultValue: 'Loading' })}</span>
  </div>
}
