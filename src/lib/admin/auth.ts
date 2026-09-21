const TOKEN_KEY = 'portfolio-admin-token'

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token.trim())
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export function hasAdminToken(): boolean {
  return Boolean(getAdminToken())
}

export async function validateAdminToken(token: string): Promise<
  | { valid: true; login: string; avatarUrl: string }
  | { valid: false; error: string }
> {
  const trimmed = token.trim()
  if (!trimmed) {
    return { valid: false, error: 'Token cannot be empty' }
  }

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${trimmed}`,
        Accept: 'application/vnd.github+json',
      },
    })

    if (res.ok) {
      const data = (await res.json()) as { login: string; avatar_url: string }
      return {
        valid: true,
        login: data.login,
        avatarUrl: data.avatar_url,
      }
    }

    const errData = (await res.json().catch(() => null)) as { message?: string } | null
    const errorMsg =
      errData?.message || `GitHub API returned HTTP ${res.status}: ${res.statusText}`
    return { valid: false, error: errorMsg }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error validating token'
    return { valid: false, error: message }
  }
}
