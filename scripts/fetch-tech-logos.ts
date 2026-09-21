import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const OUT_DIR = resolve('public/tech')
mkdirSync(OUT_DIR, { recursive: true })

const ICONS: Record<string, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  python: 'python',
  java: 'openjdk',
  c: 'c',
  cpp: 'cplusplus',
  react: 'react',
  vite: 'vite',
  tailwind: 'tailwindcss',
  angular: 'angular',
  tanstack: 'reactquery',
  recharts: 'recharts',
  node: 'nodedotjs',
  express: 'express',
  spring: 'springboot',
  django: 'django',
  symfony: 'symfony',
  airtable: 'airtable',
  appwrite: 'appwrite',
  postgres: 'postgresql',
  mongodb: 'mongodb',
  sqlite: 'sqlite',
  sql: 'databricks',
  plsql: 'oracle',
  docker: 'docker',
  git: 'git',
  github: 'github',
  gitlab: 'gitlab',
  azure: 'microsoftazure',
  render: 'render',
  cpanel: 'cpanel',
  groq: 'openai',
  n8n: 'n8n',
  prophet: 'meta',
  vitest: 'vitest',
  testinglibrary: 'testinglibrary',
  playwright: 'playwright',
  junit: 'junit5',
  selenium: 'selenium',
  robotframework: 'robotframework',
  figma: 'figma',
  postman: 'postman',
  lucide: 'lucide',
}

async function download(slug: string, outPath: string) {
  if (existsSync(outPath)) {
    console.log(`  exists: ${slug}`)
    return
  }
  const response = await fetch(`https://cdn.simpleicons.org/${slug}`)
  if (!response.ok) {
    console.warn(`  failed: ${slug} (${response.status})`)
    return
  }
  writeFileSync(outPath, await response.text(), 'utf8')
  console.log(`  downloaded: ${slug}`)
}

async function main() {
  console.log('Fetching tech logos from Simple Icons...')
  for (const [name, slug] of Object.entries(ICONS))
    await download(slug, resolve(OUT_DIR, `${name}.svg`))
  console.log('Done.')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
