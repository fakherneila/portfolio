import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mdxRawPlugin = {
  name: 'portfolio-mdx-raw',
  enforce: 'pre' as const,
  resolveId(id: string, importer?: string) {
    if (id.includes('?raw') && id.split('?')[0].endsWith('.mdx')) {
      const filename = id.split('?')[0]
      const absolute = filename.startsWith('/') ? path.resolve(__dirname, `.${filename}`) : path.resolve(importer ? path.dirname(importer) : __dirname, filename)
      return `${absolute}?raw`
    }
    return null
  },
  load(id: string) {
    if (!id.includes('?raw') || !id.split('?')[0].endsWith('.mdx')) return null
    return readFileSync(id.split('?')[0], 'utf8')
  },
}

export default defineConfig({
  plugins: [
    mdxRawPlugin,
    {
      enforce: 'pre',
      ...mdx({
        exclude: /\?raw/,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: { dark: 'github-dark-dimmed', light: 'github-light' }, keepBackground: false, defaultLang: 'plaintext' }],
        ],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
})
