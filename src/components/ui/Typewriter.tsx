import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTypewriter } from '@/hooks/useTypewriter'
import { cn } from '@/lib/utils'

type TypewriterProps = {
  words: readonly string[]
  className?: string
  cursorClassName?: string
  showCursor?: boolean
}

export function Typewriter({ words, className, cursorClassName, showCursor = true }: TypewriterProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const text = useTypewriter({ words, enabled: !prefersReducedMotion })
  return <span className={cn('inline-flex items-baseline', className)}>
    <span>{text}</span>
    {showCursor ? <span className={cn('ml-0.5 inline-block w-[2px] bg-gold motion-reduce:animate-none', !prefersReducedMotion && 'animate-pulse', cursorClassName)} style={{ height: '1em' }} aria-hidden="true" /> : null}
  </span>
}