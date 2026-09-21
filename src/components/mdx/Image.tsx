type ImageProps = { src: string; alt: string; caption?: string; width?: number; height?: number }

export function Image({ src, alt, caption, width, height }: ImageProps) {
  return <figure className="my-8"><img src={src} alt={alt} loading="lazy" width={width} height={height} className="h-auto w-full rounded-xl border border-border" onError={(event) => { event.currentTarget.style.display = 'none' }} />{caption ? <figcaption className="mt-2 text-center text-sm italic text-muted">{caption}</figcaption> : null}</figure>
}
