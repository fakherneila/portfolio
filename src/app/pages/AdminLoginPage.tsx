import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { KeyRound, ShieldCheck, AlertCircle, Eye, EyeOff, ExternalLink, Sparkles } from 'lucide-react'
import { setAdminToken, validateAdminToken } from '@/lib/admin/auth'
import { parseRepo } from '@/lib/admin/github'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEO } from '@/components/ui/SEO'

export default function AdminLoginPage() {
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { owner, repo, branch } = parseRepo()
  const usernameHint = import.meta.env.VITE_ADMIN_GITHUB_USERNAME as string | undefined

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = token.trim()
    if (!trimmed) {
      setError('Please provide a GitHub Personal Access Token.')
      return
    }

    setLoading(true)
    setError(null)

    const result = await validateAdminToken(trimmed)
    if (result.valid) {
      setAdminToken(trimmed)
      const targetPath = (location.state as { from?: string } | null)?.from || '/admin/add-blog'
      navigate(targetPath, { replace: true })
    } else {
      setError(result.error || 'Authentication failed. Please verify token scopes and validity.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-6">
      <SEO titleOverride="Admin Login" noindex />

      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/40 bg-gold/10 text-gold shadow-gold-sm">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Blog Admin <span className="gold-text">Access</span>
          </h1>
          <p className="text-sm text-muted">
            Authenticate with your GitHub Personal Access Token to manage and publish posts.
          </p>
        </div>

        <Card glow className="space-y-6 border-border/80 bg-surface/80 p-6 sm:p-8 backdrop-blur-xl">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-300">GitHub Authentication Error</p>
                <p className="mt-1 text-xs text-red-400/90 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pat-input"
                  className="block text-sm font-medium text-foreground"
                >
                  GitHub Personal Access Token (PAT)
                </label>
                {usernameHint && (
                  <span className="text-xs text-muted">
                    User: <strong className="text-gold">@{usernameHint}</strong>
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="pat-input"
                  type={showToken ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="ghp_... or github_pat_..."
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value)
                    if (error) setError(null)
                  }}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 pr-11 font-mono text-sm text-foreground placeholder:text-muted/60 transition-all focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors p-1"
                  aria-label={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/50 p-3.5 text-xs text-muted space-y-1.5">
              <div className="flex items-center justify-between font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  Target Repository
                </span>
                <span className="font-mono text-gold">
                  {owner}/{repo} ({branch})
                </span>
              </div>
              <p className="text-muted/80">
                Posts will be committed directly to <code className="font-mono text-foreground">content/blog/</code> via GitHub Contents API.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={!token.trim() || loading}
              className="w-full"
            >
              {loading ? 'Verifying with GitHub...' : 'Enter Admin Studio'}
            </Button>
          </form>

          <div className="border-t border-border/60 pt-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span>Token Instructions & Security</span>
            </div>

            <div className="text-xs text-muted space-y-2 leading-relaxed">
              <p>
                To generate a Personal Access Token:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>
                  <a
                    href="https://github.com/settings/tokens?type=beta"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Fine-grained token (Recommended)
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  : Scope to repository <strong className="text-foreground">{owner}/{repo}</strong> with <code className="rounded bg-surface-elevated px-1 py-0.5 text-[11px] text-gold">Contents: Read and write</code>.
                </li>
                <li>
                  <a
                    href="https://github.com/settings/tokens/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Classic token
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  : Select the <code className="rounded bg-surface-elevated px-1 py-0.5 text-[11px] text-gold">repo</code> scope.
                </li>
              </ul>
              <div className="rounded-lg border border-border/50 bg-background/50 p-2.5 text-[11px] text-muted">
                🔒 <strong>Privacy notice:</strong> Your token is stored only in your local browser's <code className="font-mono text-foreground">localStorage</code>. It is never sent to any third-party server or backend.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
