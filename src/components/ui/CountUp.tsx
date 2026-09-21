import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/lib/utils'

type CountUpProps = {
  to: number
  from?: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export function CountUp({ to, from = 0, duration = 1600, suffix = '', prefix = '', decimals = 0, className }: CountUpProps) {
  const { value, ref } = useCountUp({ to, start: from, duration })
  return <span ref={ref} className={cn(className)}>{prefix}{value.toFixed(decimals)}{suffix}</span>
}
