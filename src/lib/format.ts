export function formatDate(iso: string, locale: 'en' | 'fr'): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

export function formatDateRange(start: string, end: string | 'present', locale: 'en' | 'fr', presentLabel: string): string {
  const startDate = new Date(`${start}-01T00:00:00`)
  if (Number.isNaN(startDate.getTime())) return `${start} — ${end}`
  const startLabel = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(startDate)
  if (end === 'present') return `${startLabel} — ${presentLabel}`
  const endDate = new Date(`${end}-01T00:00:00`)
  if (Number.isNaN(endDate.getTime())) return `${start} — ${end}`
  const endLabel = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(endDate)
  if (start === end) return startLabel
  return startDate.getFullYear() === endDate.getFullYear() ? `${startLabel.split(' ')[0]} — ${endLabel}` : `${startLabel} — ${endLabel}`
}