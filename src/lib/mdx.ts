import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import { Buffer } from 'buffer'
import matter from 'gray-matter'
import { z } from 'zod'

const browserGlobal = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer
}
browserGlobal.Buffer ??= Buffer

const frontmatterSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  translationOf: z.string().optional(),
})

export type BlogFrontmatter = z.infer<typeof frontmatterSchema>

export type BlogPost = {
  slug: string
  locale: 'en' | 'fr'
  frontmatter: BlogFrontmatter
  readingTime: number
  Component: LazyExoticComponent<ComponentType>
}

type RawModule = string | { default: string }

const rawModules = import.meta.glob('../../content/blog/**/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, RawModule>

const compiledModules = import.meta.glob('../../content/blog/**/*.mdx', {
  eager: false,
}) as Record<string, () => Promise<{ default: ComponentType }>>

function normalizeKey(key: string): string {
  return key.replace(/\\/g, '/').replace(/^.*\/content\/blog\//, '')
}

function parsePosts(): BlogPost[] {
  const posts: BlogPost[] = []
  const rawByKey: Record<string, string> = {}
  const compiledByKey: Record<
    string,
    () => Promise<{ default: ComponentType }>
  > = {}

  for (const [key, value] of Object.entries(rawModules))
    rawByKey[normalizeKey(key)] =
      typeof value === 'string' ? value : value.default
  for (const [key, value] of Object.entries(compiledModules))
    compiledByKey[normalizeKey(key)] = value

  for (const [key, raw] of Object.entries(rawByKey)) {
    const match = key.match(/^(en|fr)\/([^/]+)\.mdx$/)
    if (!match) continue
    const [, locale, slug] = match

    let parsed: matter.GrayMatterFile<string>
    try {
      parsed = matter(raw)
    } catch (error) {
      console.warn(`[mdx] Failed to parse frontmatter in ${key}:`, error)
      continue
    }

    let frontmatter: BlogFrontmatter
    try {
      frontmatter = frontmatterSchema.parse(parsed.data)
    } catch (error) {
      console.warn(`[mdx] Invalid frontmatter in ${key}:`, error)
      continue
    }

    if (frontmatter.draft && import.meta.env.PROD) continue

    const words = parsed.content.trim().split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(words / 220))
    const loader = compiledByKey[key]
    if (!loader) {
      console.warn(`[mdx] No compiled module found for ${key}`)
      continue
    }

    posts.push({
      slug,
      locale: locale as 'en' | 'fr',
      frontmatter,
      readingTime,
      Component: lazy(loader),
    })
  }

  return posts
}

let POSTS: BlogPost[] = []
try {
  POSTS = parsePosts()
} catch (error) {
  console.error('[mdx] Failed to parse posts at load time:', error)
}

export function getAllPosts(locale: 'en' | 'fr'): BlogPost[] {
  return POSTS.filter((post) => post.locale === locale).sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  )
}

export function getPostBySlug(
  locale: 'en' | 'fr',
  slug: string,
): BlogPost | undefined {
  return POSTS.find((post) => post.locale === locale && post.slug === slug)
}

export function getAdjacentPosts(locale: 'en' | 'fr', slug: string) {
  const all = getAllPosts(locale)
  const index = all.findIndex((post) => post.slug === slug)
  return {
    prev: index > 0 ? (all[index - 1] ?? null) : null,
    next:
      index >= 0 && index < all.length - 1 ? (all[index + 1] ?? null) : null,
  }
}

export function getTranslation(
  currentLocale: 'en' | 'fr',
  slug: string,
): { locale: 'en' | 'fr'; slug: string } | null {
  const otherLocale = currentLocale === 'en' ? 'fr' : 'en'
  const current = getPostBySlug(currentLocale, slug)
  if (!current) return null

  if (current.frontmatter.translationOf) {
    const target = getPostBySlug(otherLocale, current.frontmatter.translationOf)
    if (target) return { locale: otherLocale, slug: target.slug }
  }

  const reverse = POSTS.find(
    (post) =>
      post.locale === otherLocale && post.frontmatter.translationOf === slug,
  )
  return reverse ? { locale: otherLocale, slug: reverse.slug } : null
}
