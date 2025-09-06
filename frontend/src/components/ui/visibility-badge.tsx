/**
 * Visibility badge component for displaying article visibility status
 */

import { Badge } from './badge'
import { Globe, Lock, EyeOff } from 'lucide-react'
import { ArticleVisibility } from '../../types/article'

interface VisibilityBadgeProps {
  visibility: ArticleVisibility
  className?: string
}

export function VisibilityBadge({ visibility, className }: VisibilityBadgeProps) {
  const getVisibilityConfig = (visibility: ArticleVisibility) => {
    switch (visibility) {
      case ArticleVisibility.PUBLIC:
        return {
          icon: Globe,
          label: 'Public',
          variant: 'default' as const,
        }
      case ArticleVisibility.PRIVATE:
        return {
          icon: Lock,
          label: 'Private',
          variant: 'secondary' as const,
        }
      case ArticleVisibility.UNLISTED:
        return {
          icon: EyeOff,
          label: 'Unlisted',
          variant: 'outline' as const,
        }
      default:
        return {
          icon: EyeOff,
          label: 'Unlisted',
          variant: 'outline' as const,
        }
    }
  }

  const config = getVisibilityConfig(visibility)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  )
}