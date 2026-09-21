import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

type CalloutProps = { type?: 'info' | 'tip' | 'warn' | 'danger'; title?: string; children: ReactNode }

const icons: Record<NonNullable<CalloutProps['type']>, IconName> = { info: 'Info', tip: 'Sparkles', warn: 'AlertTriangle', danger: 'AlertCircle' }

export function Callout({ type = 'info', title, children }: CalloutProps) {
  return <div className={cn('my-6 flex gap-3 rounded-xl border p-4 md:p-5', type === 'info' || type === 'tip' ? 'border-gold/30 bg-gold/5' : type === 'warn' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5')}><Icon name={icons[type]} size={20} className={cn(type === 'danger' ? 'text-red-500' : type === 'warn' ? 'text-yellow-500' : 'text-gold')} /><div className="flex-1">{title ? <p className="mb-1 font-medium">{title}</p> : null}<div className="prose prose-sm max-w-none dark:prose-invert">{children}</div></div></div>
}
