import { useLocale } from '@/hooks/useLocale'
import { formatDate } from '@/lib/format'
import type { BlogPost } from '@/lib/mdx'
import LocaleLink from './LocaleLink'
import { Card } from './Card'
import { Tag } from './Tag'

type BlogCardProps = { post: BlogPost; variant?: 'default' | 'compact' }

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const { locale, t } = useLocale()
  return <LocaleLink to={`/blog/${post.slug}`} className="group block h-full"><Card hover className={`flex h-full flex-col overflow-hidden ${variant === 'default' ? 'md:flex-row' : ''}`}><div className={`relative aspect-video overflow-hidden ${variant === 'default' ? 'md:aspect-auto md:w-2/5' : ''}`}>{post.frontmatter.cover ? <img src={post.frontmatter.cover} alt={post.frontmatter.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = 'none' }} /> : null}</div><div className="flex flex-1 flex-col p-5"><div className="mb-3 flex flex-wrap gap-1.5">{post.frontmatter.tags.slice(0, 3).map((tag) => <Tag key={tag} color="gold">{tag}</Tag>)}</div><h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">{post.frontmatter.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{post.frontmatter.excerpt}</p><div className="mt-4 flex items-center gap-3 text-xs text-muted"><span>{formatDate(post.frontmatter.date, locale)}</span><span>·</span><span>{t('blog.readingTime', { minutes: post.readingTime })}</span></div></div></Card></LocaleLink>
}
