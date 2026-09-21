import { MDXProvider } from '@mdx-js/react'
import type { ComponentType } from 'react'
import { Callout } from './Callout'
import { CodeBlock } from './CodeBlock'
import { Image } from './Image'

const components = { Callout, Image, pre: CodeBlock }

type MDXContentProps = { Component: ComponentType }

export function MDXContent({ Component }: MDXContentProps) {
  return <MDXProvider components={components}><article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:tracking-tight prose-h2:border-l-4 prose-h2:border-gold prose-h2:pl-4 prose-h3:text-gold prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-gold/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-gold prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-gold prose-blockquote:text-muted prose-strong:text-foreground prose-img:rounded-xl"><Component /></article></MDXProvider>
}
