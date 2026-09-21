import { useTranslation } from 'react-i18next'
import { CountUp } from './CountUp'
import { cn } from '@/lib/utils'

type StatProps = {
  value: number
  suffix?: string
  labelKey: string
  className?: string
}

export function Stat({ value, suffix, labelKey, className }: StatProps) {
  const { t } = useTranslation()
  return <div className={cn('flex flex-col items-center text-center', className)}>
    <div className="font-heading text-3xl font-semibold text-gold md:text-4xl"><CountUp to={value} suffix={suffix} /></div>
    <p className="mt-2 text-xs text-muted md:text-sm">{t(labelKey, { defaultValue: labelKey })}</p>
  </div>
}