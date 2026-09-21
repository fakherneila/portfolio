type SceneFallbackProps = {
  className?: string
}

export default function SceneFallback({ className = '' }: SceneFallbackProps) {
  return <div className={`relative h-full w-full overflow-hidden bg-gold-radial ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,hsl(var(--gold)/0.12),transparent_55%)]" />
    <div className="absolute inset-0 opacity-20 [background-image:repeating-conic-gradient(from_0deg,hsl(var(--gold)/0.08)_0deg_2deg,transparent_2deg_8deg)]" />
    <div className="motion-safe:animate-ping motion-reduce:animate-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/30" />
    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20" />
  </div>
}
