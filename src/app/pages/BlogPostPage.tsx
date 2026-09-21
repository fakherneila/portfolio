import { lazy, Suspense, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getAdjacentPosts, getPostBySlug } from '@/lib/mdx'
import { formatDate } from '@/lib/format'
import { useLocale } from '@/hooks/useLocale'
import LocaleLink from '@/components/ui/LocaleLink'
import { Icon, Reveal, SEO, Section, Tag } from '@/components/ui'
import { MDXContent } from '@/components/mdx/MDXContent'
import NotFoundPage from './NotFoundPage'

function BlogLoader() {
  return <div className="space-y-4" aria-busy="true"><div className="h-4 w-1/3 animate-pulse rounded bg-surface-elevated" /><div className="h-4 w-full animate-pulse rounded bg-surface-elevated" /><div className="h-4 w-5/6 animate-pulse rounded bg-surface-elevated" /></div>
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, t } = useLocale()
  const post = slug ? getPostBySlug(locale, slug) : undefined
  const adjacent = useMemo(() => slug ? getAdjacentPosts(locale, slug) : { prev: null, next: null }, [locale, slug])
  const MDXComponent = useMemo(() => post ? lazy(post.component) : null, [post])

  if (!post || !MDXComponent) return <NotFoundPage />
  return <><SEO titleKey="blog.title" descriptionKey="blog.subtitle" titleOverride={post.frontmatter.title} descriptionOverride={post.frontmatter.excerpt} image={post.frontmatter.cover} /><article className="min-h-screen"><Section py="md" container><Reveal><LocaleLink to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"><Icon name="ArrowLeft" size={16} />{t('blog.backToList')}</LocaleLink></Reveal>{post.frontmatter.tags.length > 0 ? <Reveal delay={0.05}><div className="mb-6 flex flex-wrap gap-2">{post.frontmatter.tags.map((tag) => <Tag key={tag} color="gold">{tag}</Tag>)}</div></Reveal> : null}<Reveal delay={0.1}><h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight md:text-5xl">{post.frontmatter.title}</h1></Reveal><Reveal delay={0.15}><div className="mt-6 flex items-center gap-3 text-sm text-muted"><span>{t('blog.publishedOn')} {formatDate(post.frontmatter.date, locale)}</span><span>·</span><span>{t('blog.readingTime', { minutes: post.readingTime })}</span></div></Reveal>{post.frontmatter.cover ? <Reveal delay={0.2}><div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-gold-radial"><img src={post.frontmatter.cover} alt={post.frontmatter.title} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div></Reveal> : null}<Reveal delay={0.25}><div className="mt-12 max-w-3xl"><Suspense fallback={<BlogLoader />}><MDXContent Component={MDXComponent} /></Suspense></div></Reveal><Reveal delay={0.3}><div className="mt-24 flex max-w-3xl items-center justify-between gap-4 border-t border-border pt-8">{adjacent.prev ? <LocaleLink to={`/blog/${adjacent.prev.slug}`} className="group flex flex-col items-start gap-1 text-sm transition-colors hover:text-gold"><span className="flex items-center gap-1 text-xs text-muted"><Icon name="ArrowLeft" size={12} />{t('blog.previous')}</span><span className="max-w-[240px] truncate font-medium">{adjacent.prev.frontmatter.title}</span></LocaleLink> : <span />}{adjacent.next ? <LocaleLink to={`/blog/${adjacent.next.slug}`} className="group flex flex-col items-end gap-1 text-right text-sm transition-colors hover:text-gold"><span className="flex items-center gap-1 text-xs text-muted">{t('blog.next')}<Icon name="ArrowRight" size={12} /></span><span className="max-w-[240px] truncate font-medium">{adjacent.next.frontmatter.title}</span></LocaleLink> : <span />}</div></Reveal></Section></article></>
}
