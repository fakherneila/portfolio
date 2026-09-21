import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Icon } from '@/components/ui/Icon'
import { useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CodeBlockProps = HTMLAttributes<HTMLPreElement> & { children?: ReactNode; 'data-language'?: string }

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const language = props['data-language'] ?? 'code'
  const copy = async () => {
    const text = ref.current?.textContent ?? ''
    await navigator.clipboard?.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), prefersReducedMotion ? 0 : 2000)
  }

  return <div className="my-6 overflow-hidden rounded-xl border border-border bg-surface">
    <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-muted"><span className="font-mono uppercase">{language}</span><button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:ring-2 focus-visible:ring-ring" aria-label={copied ? 'Copied' : 'Copy code'}><Icon name={copied ? 'Check' : 'Copy'} size={14} />{copied ? 'Copied' : 'Copy'}</button></div>
    <pre ref={ref} {...props} className={cn('m-0 max-h-[32rem] overflow-x-auto p-4 font-mono text-sm', className)}>{children}</pre>
  </div>
}
