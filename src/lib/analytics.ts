export function initAnalytics(): void {
  if (import.meta.env.VITE_ANALYTICS_ENABLED !== 'true') return

  // Vercel: install @vercel/analytics and call inject() here.
  // Plausible alternative: inject a script tag using VITE_PLAUSIBLE_DOMAIN.
  // TODO: wire either provider in the deployment environment.
}

export function trackEvent(
  name: string,
  props?: Record<string, unknown>,
): void {
  if (import.meta.env.VITE_ANALYTICS_ENABLED !== 'true') return

  // TODO: call window.plausible(name, { props }) or the Vercel equivalent.
  void name
  void props
}
