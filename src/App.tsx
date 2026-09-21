import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import router from '@/app/router'
import { initAnalytics } from '@/lib/analytics'

export default function App() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
  )
}
