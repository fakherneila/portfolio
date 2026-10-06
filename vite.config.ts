import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mdxRawPlugin = {
  name: 'portfolio-mdx-raw',
  enforce: 'pre' as const,
  resolveId(id: string, importer?: string) {
    if (id.includes('?raw') && id.split('?')[0].endsWith('.mdx')) {
      const filename = id.split('?')[0]
      const absolute = filename.startsWith('/')
        ? path.resolve(__dirname, `.${filename}`)
        : path.resolve(importer ? path.dirname(importer) : __dirname, filename)
      return `${absolute}?raw`
    }
    return null
  },
  load(id: string) {
    if (!id.includes('?raw') || !id.split('?')[0].endsWith('.mdx')) return null
    const source = readFileSync(id.split('?')[0], 'utf8')
    return `export default ${JSON.stringify(source)}`
  },
}

const baseMdx = mdx({
  remarkPlugins: [remarkGfm, remarkFrontmatter],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: { dark: 'github-dark-dimmed', light: 'github-light' },
        keepBackground: false,
        defaultLang: 'plaintext',
      },
    ],
  ],
  providerImportSource: '@mdx-js/react',
})

const mdxWithRawFilter = {
  name: 'portfolio-mdx-with-raw-filter',
  enforce: 'pre' as const,
  transform(this: unknown, code: string, id: string) {
    if (id.includes('?raw')) return null
    return baseMdx.transform?.call(this as never, code, id)
  },
}

export default defineConfig({
  plugins: [mdxRawPlugin, mdxWithRawFilter, react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['framer-motion'],
  },
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !dep.includes('HeroSceneInner')),
    },
    rollupOptions: {
      output: {
        manualChunks: {
          framer: ['framer-motion'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          i18n: ['i18next', 'react-i18next'],
          forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
})
