import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  ExternalLink,
  Trash2,
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle,
  Eye,
} from 'lucide-react'
import { getAdminToken } from '@/lib/admin/auth'
import {
  listPosts,
  deleteFile,
  parseRepo,
  type GitHubPostItem,
} from '@/lib/admin/github'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEO } from '@/components/ui/SEO'

export default function AdminPostsPage() {
  const [locale, setLocale] = useState<'en' | 'fr'>('en')
  const [posts, setPosts] = useState<GitHubPostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<GitHubPostItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { owner, repo, branch } = parseRepo()

  const loadPosts = useCallback(async () => {
    const token = getAdminToken()
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const items = await listPosts(token, locale)
      setPosts(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts from GitHub')
    } finally {
      setLoading(false)
    }
  }, [locale])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const token = getAdminToken()
    if (!token) return

    setDeleting(true)
    setError(null)
    setActionSuccess(null)

    const commitMessage = `feat(blog): remove ${locale} post "${deleteTarget.name}"`
    const res = await deleteFile(token, deleteTarget.path, deleteTarget.sha, commitMessage)

    setDeleting(false)

    if (res.ok) {
      setActionSuccess(`Post "${deleteTarget.name}" deleted successfully.`)
      setDeleteTarget(null)
      void loadPosts()
    } else {
      setError(res.error)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  const getSlugFromFilename = (filename: string) => {
    return filename.replace(/\.mdx$/, '')
  }

  return (
    <div className="space-y-6">
      <SEO titleOverride="Admin — Manage Blog Posts" noindex />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Manage <span className="gold-text">Posts</span>
          </h1>
          <p className="text-sm text-muted">
            Posts stored in <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-gold">{owner}/{repo}</code> (branch: <span className="font-mono text-foreground">{branch}</span>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/add-blog">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              Write New Post
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => void loadPosts()}
            disabled={loading}
            className="rounded-xl border border-border bg-surface p-2.5 text-muted hover:bg-surface-elevated hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => {
            setLocale('en')
            setActionSuccess(null)
          }}
          className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
            locale === 'en'
              ? 'bg-gold text-background shadow-gold-sm'
              : 'border border-border bg-surface text-muted hover:text-foreground'
          }`}
        >
          English Posts ({locale === 'en' ? posts.length : '...'})
        </button>
        <button
          type="button"
          onClick={() => {
            setLocale('fr')
            setActionSuccess(null)
          }}
          className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
            locale === 'fr'
              ? 'bg-gold text-background shadow-gold-sm'
              : 'border border-border bg-surface text-muted hover:text-foreground'
          }`}
        >
          Articles Français ({locale === 'fr' ? posts.length : '...'})
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {deleteTarget && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-heading text-sm font-semibold text-red-300">
                Confirm Deletion from Repository
              </p>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Are you sure you want to delete <code className="font-mono text-foreground font-semibold">{deleteTarget.path}</code> from GitHub? This will trigger an automatic Vercel redeployment removing the post.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <button
              type="button"
              disabled={deleting}
              onClick={() => void handleDeleteConfirm()}
              className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {deleting ? 'Deleting on GitHub...' : 'Yes, Delete Permanently'}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Card className="p-0 border-border overflow-hidden bg-surface/90 backdrop-blur-md">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-8 text-muted">
            <RefreshCw className="h-6 w-6 animate-spin text-gold" />
            <p className="text-xs">Fetching posts from GitHub...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-8 text-center">
            <FileText className="h-10 w-10 text-muted/50" />
            <h2 className="font-heading text-base font-semibold text-foreground">
              No posts found in content/blog/{locale}/
            </h2>
            <p className="max-w-md text-xs text-muted">
              You haven&apos;t published any posts in this locale yet, or the folder has not been indexed.
            </p>
            <Link to="/admin/add-blog" className="pt-2">
              <Button variant="primary" size="sm">
                Create First Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-elevated/60 text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Post Slug / File</th>
                  <th className="px-5 py-3 font-semibold">Size</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {posts.map((post) => {
                  const slug = getSlugFromFilename(post.name)
                  return (
                    <tr
                      key={post.sha}
                      className="hover:bg-surface-elevated/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-gold flex-shrink-0" />
                          <div>
                            <p className="font-mono font-medium text-foreground text-sm">
                              {post.name}
                            </p>
                            <p className="text-[11px] text-muted">
                              content/blog/{locale}/{post.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-muted">
                        {formatFileSize(post.size)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`/${locale}/blog/${slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-border bg-surface p-1.5 text-muted hover:text-gold hover:border-gold/50 transition-colors"
                            title="Preview post route"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </a>

                          <a
                            href={post.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-border bg-surface p-1.5 text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                            title="View on GitHub"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(post)}
                            className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
