import { z } from 'zod'

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  translationOf: z.string().optional(),
})

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>
