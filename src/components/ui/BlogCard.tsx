import { useTranslation } from 'react-i18next'
import LocaleLink from './LocaleLink'
import { Card } from './Card'
import { Tag } from './Tag'
import { Icon } from './Icon'
import { useLocale } from '@/hooks/useLocale'
import { formatDate } from '@/lib/format'
import type { BlogPost } from '@/lib/mdx'

export function BlogCard({ post }: { post: BlogPost }) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  return (
    <LocaleLink to={`/blog/${post.slug}`} className="group block">
      <Card hover className="flex flex-col gap-4 p-6 md:p-8">
        {post.frontmatter.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {post.frontmatter.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} color="gold">
                {tag}
              </Tag>
            ))}
          </div>
        ) : null}
        <h2 className="font-heading text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-gold md:text-2xl">
          {post.frontmatter.title}
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted md:text-base">
          {post.frontmatter.excerpt}
        </p>
        <div className="mt-2 flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{formatDate(post.frontmatter.date, locale)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {post.readingTime} {t('blog.minRead')}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-all group-hover:gap-2.5">
            {t('blog.readMore')} <Icon name="ArrowRight" size={14} />
          </span>
        </div>
      </Card>
    </LocaleLink>
  )
}
