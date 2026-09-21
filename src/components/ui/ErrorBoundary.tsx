import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[error-boundary]', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="font-heading text-3xl font-semibold md:text-5xl">
            Something broke.
          </h1>
          <p className="mt-4 max-w-md text-muted">
            The page hit an unexpected error. Try refreshing, or head back home.
          </p>
          <a href="/" className="mt-8 inline-block">
            <button
              type="button"
              className="rounded-full bg-gold px-6 py-3 font-medium text-background"
            >
              Back to home
            </button>
          </a>
        </div>
      )
    }

    return this.props.children
  }
}
