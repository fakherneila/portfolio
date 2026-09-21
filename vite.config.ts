import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const baseMdx = mdx({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: {
          dark: 'github-dark-dimmed',
          light: 'github-light',
        },
        keepBackground: false,
        defaultLang: 'plaintext',
      },
    ],
  ],
  providerImportSource: '@mdx-js/react',
})

const mdxWithRawFilter = {
  name: 'mdx-with-raw-filter',
  enforce: 'pre' as const,
  transform(code: string, id: string, options?: unknown) {
    if (id.includes('?raw')) return null
    return (baseMdx as any).transform.call(this, code, id, options)
  },
}

export default defineConfig({
  plugins: [mdxWithRawFilter, react()],
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
