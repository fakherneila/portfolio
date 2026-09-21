import { useMemo } from 'react'
import { getAllPosts } from '@/lib/mdx'
import { useLocale } from '@/hooks/useLocale'
import LocaleLink from '@/components/ui/LocaleLink'
import { BlogCard, Button, Reveal, Section, SectionHeading } from '@/components/ui'

export function BlogPreview() {
  const { locale, t } = useLocale()
  const posts = useMemo(() => getAllPosts(locale).slice(0, 3), [locale])
  return <Section id="blog" py="lg"><SectionHeading eyebrow={t('blog.subtitle')} titleKey="blog.title" /><div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">{posts.map((post, index) => <Reveal key={post.slug} delay={index * 0.1}><BlogCard post={post} /></Reveal>)}</div><Reveal delay={0.3}><div className="mt-12 flex justify-center"><LocaleLink to="/blog"><Button variant="secondary" size="lg" iconRight="ArrowRight">{t('blog.readAll')}</Button></LocaleLink></div></Reveal></Section>
}
