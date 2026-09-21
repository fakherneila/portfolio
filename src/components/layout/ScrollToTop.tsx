import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash, scroll to that element (after the page renders)
    if (hash) {
      const id = hash.replace('#', '')
      let attempts = 0
      let timer: number

      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
          ).matches
          el.scrollIntoView({
            behavior: reduced ? 'auto' : 'smooth',
            block: 'start',
          })
        } else if (attempts < 3) {
          attempts++
          timer = window.setTimeout(tryScroll, 60)
        } else {
          // Element not found after attempts — fall back to top
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      }

      timer = window.setTimeout(tryScroll, 60)
      return () => window.clearTimeout(timer)
    }

    // No hash — scroll to top instantly on every route change
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default ScrollToTop
