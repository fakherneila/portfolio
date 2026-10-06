import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BlogCard, Reveal, SEO, Section, SectionHeading } from '@/components/ui'
import { useLocale } from '@/hooks/useLocale'
import { getAllPosts } from '@/lib/mdx'

export default function BlogListPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const posts = useMemo(() => getAllPosts(locale), [locale])

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
