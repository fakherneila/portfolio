import { useEffect, useMemo, useState } from 'react'

export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const idsKey = useMemo(() => sectionIds.join('|'), [sectionIds])

  useEffect(() => {
    const ids = idsKey ? idsKey.split('|') : []
    const elements = ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) {
      setActiveId(null)
      return
    }

    // This central band avoids activating headings as they briefly pass the viewport edge.
    const observer = new IntersectionObserver((entries) => {
      const entered = entries.filter((entry) => entry.isIntersecting)
      const mostRecent = entered.at(-1)
      if (mostRecent?.target instanceof HTMLElement) setActiveId(mostRecent.target.id)
    }, { rootMargin: '-40% 0px -55% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [idsKey])

  return activeId
}