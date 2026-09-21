import { useMemo } from 'react'
import { getAllPosts } from '@/lib/mdx'
import { useLocale } from '@/hooks/useLocale'
import { BlogCard, Reveal, SEO, Section, SectionHeading } from '@/components/ui'

export default function BlogListPage() {
  const { locale, t } = useLocale()
  const posts = useMemo(() => {
    try {
      return getAllPosts(locale)
    } catch (err) {
      console.error('[blog] Failed to load posts:', err)
      return []
    }
  }, [locale])
  return (
    <>
      <SEO titleKey="blog.title" descriptionKey="blog.subtitle" />
      <Section py="lg" container>
        <SectionHeading eyebrow={t('blog.subtitle')} titleKey="blog.title" />
        <div className="mx-auto mt-16 max-w-4xl space-y-6">
          {posts.length === 0 ? (
            <p className="py-20 text-center text-muted">{t('blog.empty')}</p>
          ) : (
            posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.08}>
                <BlogCard post={post} />
              </Reveal>
            ))
          )}
        </div>
      </Section>
    </>
  )
}
