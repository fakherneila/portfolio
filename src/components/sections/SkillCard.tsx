import { useState } from 'react'
import { Card, Icon, type IconName } from '@/components/ui'
import { cn } from '@/lib/utils'

type SkillCardProps = {
  name: string
  slug?: string
  icon?: string
  className?: string
}

const fallbackIcons: Record<string, IconName> = {
  bot: 'Bot',
  cloud: 'Cloud',
  code: 'Code',
  container: 'Boxes',
  database: 'Database',
  'git-branch': 'GitBranch',
  github: 'Github',
  layers: 'Layers',
  leaf: 'Sparkles',
  palette: 'Palette',
  send: 'Send',
  server: 'Server',
  table: 'Database',
  'test-tube': 'TestTube',
  'trending-up': 'TrendingUp',
  workflow: 'Workflow',
  zap: 'Zap',
}

export function SkillCard({ name, slug, icon, className }: SkillCardProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const showFallback = !slug || imgFailed
  const fallbackIcon = fallbackIcons[icon ?? 'code'] ?? 'Code'

  return (
    <Card
      hover
      className={cn(
        'group flex h-full min-h-[120px] flex-col items-center justify-center gap-3 p-5 text-center',
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center text-muted transition-colors duration-300 group-hover:text-gold">
        {showFallback ? (
          <Icon name={fallbackIcon} size={30} />
        ) : (
          <img
            src={`/tech/${slug}.svg`}
            alt={name}
            width={30}
            height={30}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-[30px] w-[30px] object-contain opacity-70 transition-all duration-300 group-hover:opacity-100 [filter:brightness(0)_saturate(100%)_invert(58%)_sepia(84%)_saturate(514%)_hue-rotate(3deg)_brightness(94%)_contrast(92%)] dark:[filter:brightness(0)_saturate(100%)_invert(85%)_sepia(63%)_saturate(635%)_hue-rotate(339deg)_brightness(108%)_contrast(96%)]"
          />
        )}
      </div>
      <p className="text-xs font-medium leading-tight tracking-tight text-foreground md:text-sm">
        {name}
      </p>
    </Card>
  )
}
