import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, SEO, Section, Tag } from '@/components/ui'
import LocaleLink from '@/components/ui/LocaleLink'
import { useLocale } from '@/hooks/useLocale'
import { formatDate } from '@/lib/format'
import { getAdjacentPosts, getPostBySlug } from '@/lib/mdx'
import NotFoundPage from './NotFoundPage'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const post = slug ? getPostBySlug(locale, slug) : undefined

  if (!post) return <NotFoundPage />

  const { prev, next } = getAdjacentPosts(locale, post.slug)
  const MDXComponent = post.Component

  return (
    <>
      <SEO
        titleOverride={post.frontmatter.title}
        descriptionOverride={post.frontmatter.excerpt}
        image={post.frontmatter.cover}
      />
      <article className="min-h-screen">
        <Section py="md" container>
          <div className="mx-auto max-w-3xl">
            <LocaleLink
              to="/blog"
              className="mb-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
            >
              <Icon name="ArrowLeft" size={16} /> {t('blog.backToList')}
            </LocaleLink>
            {post.frontmatter.tags.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <Tag key={tag} color="gold">
                    {tag}
                  </Tag>
                ))}
              </div>
            ) : null}
            <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              {post.frontmatter.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted">
              <span>
                {t('blog.publishedOn')}{' '}
                {formatDate(post.frontmatter.date, locale)}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {post.readingTime} {t('blog.minRead')}
              </span>
            </div>
            <div className="prose prose-lg mt-6 max-w-none dark:prose-invert prose-headings:font-heading prose-headings:tracking-tight prose-h2:mb-4 prose-h2:mt-12 prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-xl md:prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-foreground prose-code:rounded prose-code:bg-gold/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-gold prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-gold prose-blockquote:text-muted">
              <Suspense fallback={<div className="h-40" />}>
                <MDXComponent />
              </Suspense>
            </div>
            <div className="mt-16 flex items-center justify-between gap-6 border-t border-border pt-8">
              {prev ? (
                <LocaleLink
                  to={`/blog/${prev.slug}`}
                  className="group flex flex-col items-start gap-1 text-sm transition-colors hover:text-gold"
                >
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Icon name="ArrowLeft" size={12} /> {t('blog.previous')}
                  </span>
                  <span className="max-w-[240px] truncate font-medium">
                    {prev.frontmatter.title}
                  </span>
                </LocaleLink>
              ) : (
                <span />
              )}
              {next ? (
                <LocaleLink
                  to={`/blog/${next.slug}`}
                  className="group flex flex-col items-end gap-1 text-right text-sm transition-colors hover:text-gold"
                >
                  <span className="flex items-center gap-1 text-xs text-muted">
                    {t('blog.next')} <Icon name="ArrowRight" size={12} />
                  </span>
                  <span className="max-w-[240px] truncate font-medium">
                    {next.frontmatter.title}
                  </span>
                </LocaleLink>
              ) : (
                <span />
              )}
            </div>
          </div>
        </Section>
      </article>
    </>
  )
}
