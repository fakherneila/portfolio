import { useEffect, useState } from 'react'

type TypewriterOptions = {
  words: readonly string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseMs?: number
  enabled?: boolean
}

export function useTypewriter({ words, typeSpeed = 65, deleteSpeed = 35, pauseMs = 1800, enabled = true }: TypewriterOptions): string {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    if (!enabled || words.length === 0) return
    const word = words[wordIndex % words.length] ?? ''
    const delay = phase === 'typing' ? typeSpeed : phase === 'pausing' ? pauseMs : deleteSpeed
    const timeout = window.setTimeout(() => {
      if (phase === 'typing') {
        if (charIndex < word.length) setCharIndex((value) => value + 1)
        else setPhase('pausing')
      } else if (phase === 'pausing') {
        setPhase('deleting')
      } else if (charIndex > 0) {
        setCharIndex((value) => value - 1)
      } else {
        setWordIndex((value) => (value + 1) % words.length)
        setPhase('typing')
      }
    }, delay)
    return () => window.clearTimeout(timeout)
  }, [charIndex, deleteSpeed, enabled, pauseMs, phase, typeSpeed, wordIndex, words])

  if (words.length === 0) return ''
  if (!enabled) return words[0] ?? ''
  return (words[wordIndex % words.length] ?? '').slice(0, charIndex)
}