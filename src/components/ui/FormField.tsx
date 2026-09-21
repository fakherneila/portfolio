import type { UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

type FormFieldProps = { label: string; name: string; error?: string; type?: 'text' | 'email' | 'textarea'; placeholder?: string; register: UseFormRegisterReturn; rows?: number; className?: string }

export function FormField({ label, name, error, type = 'text', placeholder, register, rows = 5, className }: FormFieldProps) {
  return <div className={cn('flex flex-col gap-2', className)}>
    <label htmlFor={name} className="text-sm font-medium text-foreground">{label}</label>
    {type === 'textarea' ? <textarea id={name} rows={rows} placeholder={placeholder} {...register} className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30" /> : <input id={name} type={type} placeholder={placeholder} {...register} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30" />}
    {error ? <p className="mt-1 text-xs text-red-500" role="alert">{error}</p> : null}
  </div>
}