import { useTranslation } from 'react-i18next'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  titleKey: string
  subtitleKey?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, titleKey, subtitleKey, align = 'center', className }: SectionHeadingProps) {
  const { t } = useTranslation()
  const centered = align === 'center'
  return <Reveal className={cn(centered ? 'mx-auto text-center' : 'text-left', className)}>
    {eyebrow ? <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold">{eyebrow}</p> : null}
    <h2 className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{t(titleKey, { defaultValue: titleKey })}</h2>
    <div className={cn('mt-4 h-0.5 w-[60px] rounded-full bg-gold-gradient', centered && 'mx-auto')} />
    {subtitleKey ? <p className={cn('mt-4 max-w-2xl text-base text-muted md:text-lg', centered && 'mx-auto')}>{t(subtitleKey, { defaultValue: subtitleKey })}</p> : null}
  </Reveal>
}
