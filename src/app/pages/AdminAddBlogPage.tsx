import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  Link as LinkIcon,
  Code,
  Quote,
  ImageIcon,
  Eye,
  PenTool,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Send,
  Save,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { getAdminToken } from '@/lib/admin/auth'
import {
  commitFile,
  fileExists,
  getFileSha,
  parseRepo,
} from '@/lib/admin/github'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEO } from '@/components/ui/SEO'

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function escapeYamlString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

const DEFAULT_CONTENT_EN = `## Introduction

Write your post introduction here. What problem were you solving, and what is the key insight?

### Technical Architecture

- **Constraint 1**: High performance and low latency
- **Solution**: Targeted component architecture

\`\`\`ts
// Example code snippet
export function optimizePipeline(input: string): boolean {
  return input.length > 0
}
\`\`\`

<Callout type="tip" title="Pro Tip">
Always test your edge cases across multiple browsers and screen sizes.
</Callout>

### Key Takeaways

Summarize the key outcomes and future considerations.
`

const DEFAULT_CONTENT_FR = `## Introduction

Écrivez ici l'introduction de votre article. Quel problème résolviez-vous et quel est l'enseignement principal ?

### Architecture Technique

- **Contrainte 1** : Haute performance et faible latence
- **Solution** : Architecture de composants ciblée

\`\`\`ts
// Exemple de code
export function optimiserPipeline(entree: string): boolean {
  return entree.length > 0
}
\`\`\`

<Callout type="tip" title="Conseil">
Testez toujours les cas limites sur plusieurs navigateurs et formats d'écran.
</Callout>

### Conclusion

Résumez les résultats obtenus et les prochaines étapes.
`

export default function AdminAddBlogPage() {
  const [locale, setLocale] = useState<'en' | 'fr'>('en')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugCustomized, setSlugCustomized] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState('Engineering, React')
  const [cover, setCover] = useState('/blog/default.webp')
  const [translationOf, setTranslationOf] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const [content, setContent] = useState(DEFAULT_CONTENT_EN)
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    commitUrl: string
    locale: 'en' | 'fr'
    slug: string
    path: string
  } | null>(null)

  const [overwriteConfirm, setOverwriteConfirm] = useState<{
    isOpen: boolean
    sha: string | null
    draftMode: boolean
  }>({ isOpen: false, sha: null, draftMode: false })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { owner, repo, branch } = parseRepo()

  useEffect(() => {
    if (!slugCustomized) {
      setSlug(slugify(title))
    }
  }, [title, slugCustomized])

  const handleLocaleChange = (newLocale: 'en' | 'fr') => {
    setLocale(newLocale)
    if (content === DEFAULT_CONTENT_EN && newLocale === 'fr') {
      setContent(DEFAULT_CONTENT_FR)
    } else if (content === DEFAULT_CONTENT_FR && newLocale === 'en') {
      setContent(DEFAULT_CONTENT_EN)
    }
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (error) setError(null)
  }

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
    setSlugCustomized(true)
    if (error) setError(null)
  }

  const insertSnippet = (before: string, after = '') => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selection = text.substring(start, end)
    const replacement = `${before}${selection || 'text'}${after}`
    const updated = text.substring(0, start) + replacement + text.substring(end)
    setContent(updated)

    requestAnimationFrame(() => {
      textarea.focus()
      const newCursorStart = start + before.length
      const newCursorEnd = start + replacement.length - after.length
      textarea.setSelectionRange(newCursorStart, newCursorEnd)
    })
  }

  const validateForm = () => {
    if (!title.trim()) {
      setError('Please provide a post title.')
      return false
    }
    const cleanSlug = slug.trim()
    if (!cleanSlug) {
      setError('Please provide a valid slug.')
      return false
    }
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      setError('Slug can only contain lowercase letters, numbers, and hyphens.')
      return false
    }
    if (cleanSlug.length < 3 || cleanSlug.length > 80) {
      setError('Slug length must be between 3 and 80 characters.')
      return false
    }
    if (!excerpt.trim()) {
      setError('Please provide a short excerpt.')
      return false
    }
    if (excerpt.length > 500) {
      setError('Excerpt must be at most 500 characters.')
      return false
    }
    if (!content.trim()) {
      setError('Post MDX content cannot be empty.')
      return false
    }
    return true
  }

  const buildMdxFile = (draft: boolean) => {
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const frontmatterLines = [
      '---',
      `title: "${escapeYamlString(title.trim())}"`,
      `excerpt: "${escapeYamlString(excerpt.trim())}"`,
      `date: "${date}"`,
      `tags: [${tagList.map((t) => `"${escapeYamlString(t)}"`).join(', ')}]`,
    ]

    if (cover.trim()) {
      frontmatterLines.push(`cover: "${escapeYamlString(cover.trim())}"`)
    }

    frontmatterLines.push(`draft: ${draft ? 'true' : 'false'}`)

    if (translationOf.trim()) {
      frontmatterLines.push(`translationOf: "${escapeYamlString(translationOf.trim())}"`)
    }

    frontmatterLines.push('---')
    return `${frontmatterLines.join('\n')}\n\n${content.trim()}\n`
  }

  const executeCommit = async (draftMode: boolean, shaToUse?: string) => {
    const token = getAdminToken()
    if (!token) {
      setError('Authentication token missing. Please sign in again.')
      return
    }

    const cleanSlug = slug.trim()
    const filePath = `content/blog/${locale}/${cleanSlug}.mdx`
    const mdxContent = buildMdxFile(draftMode)
    const commitMessage = `feat(blog): add ${locale} post "${title.trim()}"`

    setLoading(true)
    setError(null)
    setOverwriteConfirm({ isOpen: false, sha: null, draftMode: false })

    const res = await commitFile(token, {
      path: filePath,
      content: mdxContent,
      message: commitMessage,
      sha: shaToUse,
    })

    setLoading(false)

    if (res.ok) {
      setSuccess({
        commitUrl: res.url,
        locale,
        slug: cleanSlug,
        path: filePath,
      })
    } else {
      setError(res.error)
    }
  }

  const handleStartSubmit = async (draftMode: boolean) => {
    if (!validateForm()) return

    const token = getAdminToken()
    if (!token) {
      setError('Admin token is missing. Please log in.')
      return
    }

    const cleanSlug = slug.trim()
    const filePath = `content/blog/${locale}/${cleanSlug}.mdx`

    setLoading(true)
    setError(null)

    try {
      const exists = await fileExists(token, filePath)
      if (exists) {
        const existingSha = await getFileSha(token, filePath)
        setLoading(false)
        setOverwriteConfirm({
          isOpen: true,
          sha: existingSha,
          draftMode,
        })
        return
      }
    } catch {
      // If file check encounters an error, proceed to commit directly which will report error if failed
    }

    await executeCommit(draftMode)
  }

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setSlugCustomized(false)
    setExcerpt('')
    setDate(new Date().toISOString().split('T')[0])
    setTags('Engineering, React')
    setCover('/blog/default.webp')
    setTranslationOf('')
    setIsDraft(false)
    setContent(locale === 'fr' ? DEFAULT_CONTENT_FR : DEFAULT_CONTENT_EN)
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="space-y-6">
      <SEO titleOverride="Admin — Write Blog Post" noindex />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create Blog <span className="gold-text">Post</span>
          </h1>
          <p className="text-sm text-muted">
            Compose in MDX, auto-generate frontmatter, and commit straight to{' '}
            <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs text-gold">
              content/blog/{locale}/
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleLocaleChange('en')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              locale === 'en'
                ? 'bg-gold text-background shadow-gold-sm'
                : 'border border-border bg-surface text-muted hover:text-foreground'
            }`}
          >
            English (en)
          </button>
          <button
            type="button"
            onClick={() => handleLocaleChange('fr')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              locale === 'fr'
                ? 'bg-gold text-background shadow-gold-sm'
                : 'border border-border bg-surface text-muted hover:text-foreground'
            }`}
          >
            Français (fr)
          </button>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <h2 className="font-heading text-base font-semibold text-emerald-300">
                Post Published Successfully to GitHub!
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                Commit written to{' '}
                <strong className="text-foreground">{success.path}</strong> on branch{' '}
                <strong className="font-mono text-gold">{branch}</strong>.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <a
                  href={success.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 font-medium text-emerald-200 hover:bg-emerald-500/30"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View GitHub Commit
                </a>
                <a
                  href={`/${success.locale}/blog/${success.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-gold/40 bg-gold/15 px-3 py-1.5 font-medium text-gold hover:bg-gold/25"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview Post URL (/{success.locale}/blog/{success.slug})
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-muted hover:text-foreground hover:bg-surface-elevated"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Write Another Post
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted/90 pt-1">
                <Clock className="h-3.5 w-3.5 text-gold" />
                <span>
                  Vercel Git integration will redeploy within ~1 minute. The post will appear live once the build finishes.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-300">Action Failed</p>
            <p className="mt-1 text-xs text-red-400/90 leading-relaxed font-mono">{error}</p>
          </div>
        </div>
      )}

      {overwriteConfirm.isOpen && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-heading text-sm font-semibold text-amber-300">
                Post Already Exists in Repository
              </p>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                A file already exists at{' '}
                <code className="font-mono text-foreground font-semibold">
                  content/blog/{locale}/{slug}.mdx
                </code>
                . Do you wish to overwrite it with this commit?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <button
              type="button"
              disabled={loading}
              onClick={() => executeCommit(overwriteConfirm.draftMode, overwriteConfirm.sha || undefined)}
              className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-background hover:bg-amber-400 transition-colors shadow-sm"
            >
              {loading ? 'Overwriting...' : 'Yes, Overwrite Post'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setOverwriteConfirm({ isOpen: false, sha: null, draftMode: false })}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Card className="p-0 border-border overflow-hidden bg-surface/90 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface-elevated/80 px-4 py-2.5 gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertSnippet('## ')}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('### ')}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-border mx-1" />
                <button
                  type="button"
                  onClick={() => insertSnippet('**', '**')}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('*', '*')}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('[', '](https://example.com)')}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-border mx-1" />
                <button
                  type="button"
                  onClick={() => insertSnippet('```ts\n', '\n```')}
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Code Block"
                >
                  <Code className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      '<Callout type="tip" title="Note">\n',
                      '\n</Callout>',
                    )
                  }
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Callout Block"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      '<Image src="/blog/cover.webp" alt="Description" caption="Caption" />\n',
                    )
                  }
                  className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  title="Image Component"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center rounded-lg border border-border bg-surface p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorTab('write')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors ${
                    editorTab === 'write'
                      ? 'bg-gold text-background shadow-xs'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors ${
                    editorTab === 'preview'
                      ? 'bg-gold text-background shadow-xs'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
              </div>
            </div>

            <div className="relative min-h-[550px] bg-background/50">
              {editorTab === 'write' ? (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your MDX post content here..."
                  className="h-full min-h-[550px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted/50 focus:outline-none"
                  rows={24}
                />
              ) : (
                <div className="p-6 md:p-8">
                  <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-semibold prose-a:text-gold hover:prose-a:underline prose-pre:bg-surface-elevated prose-pre:border prose-pre:border-border">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/80 bg-surface-elevated/40 px-4 py-2 text-xs text-muted">
              <span>
                Words: <strong>{content.trim().split(/\s+/).filter(Boolean).length}</strong>
              </span>
              <span>
                Est. Reading Time: ~
                <strong>{Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 220))} min</strong>
              </span>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-5 border-border bg-surface/90 p-5 backdrop-blur-md">
            <h2 className="font-heading text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              Frontmatter Settings
            </h2>

            <div className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label htmlFor="post-title" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="post-title"
                  type="text"
                  placeholder="e.g. Scaling Real-Time Systems"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="post-slug" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Slug <span className="text-red-400">*</span>
                  </label>
                  {slugCustomized && (
                    <button
                      type="button"
                      onClick={() => {
                        setSlugCustomized(false)
                        setSlug(slugify(title))
                      }}
                      className="text-[11px] text-gold hover:underline"
                    >
                      Reset to title
                    </button>
                  )}
                </div>
                <div className="flex rounded-xl border border-border bg-surface-elevated focus-within:border-gold focus-within:ring-1 focus-within:ring-gold">
                  <span className="inline-flex items-center px-2.5 text-xs text-muted border-r border-border/70 font-mono">
                    /{locale}/blog/
                  </span>
                  <input
                    id="post-slug"
                    type="text"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="my-post-slug"
                    className="w-full bg-transparent px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="post-excerpt" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Excerpt <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-[11px] ${excerpt.length > 500 ? 'text-red-400 font-bold' : 'text-muted'}`}>
                    {excerpt.length}/500
                  </span>
                </div>
                <textarea
                  id="post-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise summary of the article..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-xs text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="post-date" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Date
                  </label>
                  <input
                    id="post-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-elevated px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="post-tags" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Tags
                  </label>
                  <input
                    id="post-tags"
                    type="text"
                    placeholder="QA, Vitest, CI"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-elevated px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="post-cover" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Cover Image Path
                </label>
                <input
                  id="post-cover"
                  type="text"
                  placeholder="/blog/my-cover.webp"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs font-mono text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="post-translation-of" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Translation Of (Slug)
                  </label>
                  <span title="The slug of the corresponding post in the other language" className="text-muted cursor-help">
                    <HelpCircle className="h-3 w-3" />
                  </span>
                </div>
                <input
                  id="post-translation-of"
                  type="text"
                  placeholder={locale === 'en' ? 'slug-en-francais' : 'english-slug'}
                  value={translationOf}
                  onChange={(e) => setTranslationOf(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs font-mono text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="post-draft"
                  type="checkbox"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                />
                <label htmlFor="post-draft" className="text-xs text-muted select-none">
                  Mark as Draft (only visible in dev mode)
                </label>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/80">
              <Button
                type="button"
                variant="primary"
                size="md"
                loading={loading && !isDraft}
                disabled={loading}
                onClick={() => handleStartSubmit(isDraft)}
                className="w-full"
              >
                <Send className="h-4 w-4" />
                {isDraft ? 'Publish as Draft' : 'Publish to GitHub'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={loading && isDraft}
                disabled={loading}
                onClick={() => handleStartSubmit(true)}
                className="w-full"
              >
                <Save className="h-3.5 w-3.5" />
                Save as Draft Only
              </Button>
            </div>

            <div className="rounded-xl border border-border/60 bg-surface/50 p-3 text-[11px] text-muted space-y-1">
              <p className="font-semibold text-foreground">Target Destination</p>
              <p className="font-mono text-gold truncate">
                {owner}/{repo}
              </p>
              <p className="font-mono truncate text-muted/80">
                content/blog/{locale}/{slug || '...'}.mdx
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
