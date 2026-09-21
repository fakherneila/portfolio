import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { LogOut, ExternalLink, PenLine, FolderGit2, FileText } from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { parseRepo } from '@/lib/admin/github'
import { SEO } from '@/components/ui/SEO'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function AdminLayout() {
  const { status, user, logout } = useAdminAuth()
  const location = useLocation()
  const isLoginPage = location.pathname.endsWith('/login')
  const { owner, repo, branch } = parseRepo()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <SEO titleOverride="Admin Loading" noindex />
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-sm text-muted">Checking admin authorization...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' && !isLoginPage) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (status === 'authenticated' && isLoginPage) {
    return <Navigate to="/admin/add-blog" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <SEO titleOverride="Admin" noindex />

      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/admin/add-blog" className="flex items-center gap-2 group">
              <span className="font-heading text-lg font-bold tracking-tight">
                Portfolio <span className="gold-text">Admin</span>
              </span>
            </Link>

            {status === 'authenticated' && (
              <nav className="hidden items-center gap-1 sm:flex">
                <Link
                  to="/admin/add-blog"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    location.pathname.includes('/add-blog')
                      ? 'bg-surface-elevated text-gold font-semibold shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <PenLine className="h-4 w-4" />
                  Write Post
                </Link>
                <Link
                  to="/admin/posts"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    location.pathname.includes('/posts')
                      ? 'bg-surface-elevated text-gold font-semibold shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Manage Posts
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {status === 'authenticated' && (
              <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted md:flex">
                <FolderGit2 className="h-3.5 w-3.5 text-gold" />
                <span className="font-mono font-medium text-foreground">
                  {owner}/{repo}
                </span>
                <span className="text-muted">({branch})</span>
              </div>
            )}

            {status === 'authenticated' && user && (
              <div className="flex items-center gap-2">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.login}
                    className="h-7 w-7 rounded-full border border-border object-cover"
                  />
                ) : null}
                <span className="hidden text-xs font-semibold sm:inline">
                  @{user.login}
                </span>
              </div>
            )}

            <ThemeToggle />

            <Link
              to="/"
              className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-gold"
              title="View Public Site"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View site</span>
            </Link>

            {status === 'authenticated' && (
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
