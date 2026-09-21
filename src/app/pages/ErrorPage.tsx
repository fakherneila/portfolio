import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError() as { message?: string } | undefined

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-3xl font-semibold md:text-5xl">
        Something broke.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page hit an unexpected error. Try refreshing, or head back home.
      </p>
      {error ? (
        <p className="mt-3 text-sm text-muted">
          {error.message ?? 'Unknown error'}
        </p>
      ) : null}
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
