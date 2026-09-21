import { useCallback, useEffect, useState } from 'react'
import {
  clearAdminToken,
  getAdminToken,
  validateAdminToken,
} from '@/lib/admin/auth'

export type AdminUser = {
  login: string
  avatarUrl: string
}

export type AdminAuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useAdminAuth() {
  const [status, setStatus] = useState<AdminAuthStatus>('loading')
  const [user, setUser] = useState<AdminUser | null>(null)

  const checkAuth = useCallback(async () => {
    const token = getAdminToken()
    if (!token) {
      setStatus('unauthenticated')
      setUser(null)
      return
    }

    setStatus('loading')
    const result = await validateAdminToken(token)
    if (result.valid) {
      setUser({ login: result.login, avatarUrl: result.avatarUrl })
      setStatus('authenticated')
    } else {
      clearAdminToken()
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  const logout = useCallback(() => {
    clearAdminToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return {
    status,
    user,
    logout,
    revalidate: checkAuth,
  }
}
