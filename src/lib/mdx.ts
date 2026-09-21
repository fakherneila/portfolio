import type React from 'react'
import { blogFrontmatterSchema, type BlogFrontmatter } from './mdx-schemas'

export type BlogPost = {
  slug: string
  locale: 'en' | 'fr'
  frontmatter: BlogFrontmatter
  readingTime: number
  component: () => Promise<{ default: React.ComponentType }>
}

type RawValue = string | { default: string }
type RawModule = Record<string, RawValue>
type CompiledModule = Record<
  string,
  () => Promise<{ default: React.ComponentType }>
>

function normalizeKey(key: string): string {
  return key.replace(/\\/g, '/')
}

const rawModules = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../content/blog/**/*.mdx', {
      eager: true,
      query: '?raw',
      import: 'default',
    }) as RawModule,
  ).map(([key, value]) => [normalizeKey(key), value]),
) as RawModule

const compiledModules = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../content/blog/**/*.mdx', {
      eager: false,
    }) as CompiledModule,
  ).map(([key, value]) => [normalizeKey(key), value]),
) as CompiledModule

if (import.meta.env.DEV) {
  const rawKeys = Object.keys(rawModules)
  const compiledKeys = Object.keys(compiledModules)
  const missingCompiled = rawKeys.filter((key) => !compiledKeys.includes(key))
  if (missingCompiled.length > 0) {
    console.error(
      '[mdx] Raw/compiled key mismatch. Missing compiled:',
      missingCompiled,
    )
  }
}

function parseFrontmatter(source: string): {
  data: Record<string, unknown>
  content: string
} {
  const trimmed = source.trimStart()
  if (!trimmed.startsWith('---')) {
    return { data: {}, content: source }
  }

  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: source }
  }

  const [, rawFrontmatter, content] = match
  const data: Record<string, unknown> = {}

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue

    const separator = line.indexOf(':')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()

    if (!value) {
      data[key] = ''
      continue
    }

    const parseScalar = (raw: string): unknown => {
      const trimmedRaw = raw.trim()
      if (trimmedRaw === 'true') return true
      if (trimmedRaw === 'false') return false
      if (trimmedRaw === 'null') return null
      if (/^\d+$/.test(trimmedRaw)) return Number(trimmedRaw)
      if (
        (trimmedRaw.startsWith('"') && trimmedRaw.endsWith('"')) ||
        (trimmedRaw.startsWith("'") && trimmedRaw.endsWith("'"))
      ) {
        return trimmedRaw.slice(1, -1)
      }
      try {
        return JSON.parse(trimmedRaw.replace(/'/g, '"'))
      } catch {
        return trimmedRaw
      }
    }

    data[key] = parseScalar(value)
  }

  return { data, content }
}

function parsePosts(): Record<string, BlogPost> {
  const posts: Record<string, BlogPost> = {}

  for (const [filePath, raw] of Object.entries(rawModules)) {
    const source = typeof raw === 'string' ? raw : raw.default

    if (typeof source !== 'string') {
      throw new Error(
        `[mdx] Expected raw string for ${filePath}, got ${typeof raw}. This means the ?raw query is being intercepted by another plugin. Check vite.config.ts — the MDX plugin must skip ids containing '?raw'.`,
      )
    }

    if (
      !source.trimStart().startsWith('---') &&
      !source.trimStart().startsWith('#')
    ) {
      throw new Error(
        `[mdx] File ${filePath} doesn't look like a valid MDX source. First 80 chars: ${source.slice(0, 80)}`,
      )
    }

    const { data, content } = parseFrontmatter(source)
    const frontmatter = blogFrontmatterSchema.parse(data)
    const words = content.trim().split(/\s+/).filter(Boolean).length
    const component = compiledModules[filePath]
    if (!component) {
      console.warn(`[mdx] No compiled module for ${filePath}`)
      continue
    }

    const match =
      filePath.match(/\/content\/blog\/(en|fr)\/([^/]+)\.mdx$/) ??
      filePath.match(/(?:^|\/)\b(en|fr)\b\/(?:.+?)\/([^/]+)\.mdx$/)
    if (!match) {
      console.warn(`[mdx] Skipping file with unexpected path: ${filePath}`)
      continue
    }

    const [, localePart, slug] = match
    const locale = localePart as 'en' | 'fr'
    const key = `${locale}/${slug}`

    posts[key] = {
      slug,
      locale,
      frontmatter,
      readingTime: Math.max(1, Math.ceil(words / 220)),
      component,
    }
  }

  return posts
}

let POSTS: Record<string, BlogPost> = {}
try {
  POSTS = parsePosts()
} catch (err) {
  console.error('[mdx] Failed to parse posts at load time:', err)
  POSTS = {}
}

export function getAllPosts(locale: 'en' | 'fr'): BlogPost[] {
  return Object.values(POSTS)
    .filter(
      (post) =>
        post.locale === locale &&
        (!post.frontmatter.draft || import.meta.env.DEV),
    )
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
}

export function getPostBySlug(
  locale: 'en' | 'fr',
  slug: string,
): BlogPost | undefined {
  return getAllPosts(locale).find((post) => post.slug === slug)
}

export function getAdjacentPosts(
  locale: 'en' | 'fr',
  slug: string,
): { prev: BlogPost | null; next: BlogPost | null } {
  const localizedPosts = getAllPosts(locale)
  const index = localizedPosts.findIndex((post) => post.slug === slug)
  return index === -1
    ? { prev: null, next: null }
    : {
        prev: localizedPosts[index - 1] ?? null,
        next: localizedPosts[index + 1] ?? null,
      }
}
