/**
 * Visibility selector component for articles
 */

import * as React from 'react'
import { Check, ChevronDown, EyeOff, Globe, Lock } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { ArticleVisibility } from '../../types/article'

interface VisibilityOption {
  value: ArticleVisibility
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const visibilityOptions: VisibilityOption[] = [
  {
    value: ArticleVisibility.PUBLIC,
    label: 'Public',
    description: 'Anyone can view this article',
    icon: Globe,
  },
  {
    value: ArticleVisibility.PRIVATE,
    label: 'Private',
    description: 'Only project members can view',
    icon: Lock,
  },
  {
    value: ArticleVisibility.UNLISTED,
    label: 'Unlisted',
    description: 'Only you can view this article',
    icon: EyeOff,
  },
]

interface VisibilitySelectorProps {
  value: ArticleVisibility
  onValueChange: (value: ArticleVisibility) => void
  disabled?: boolean
}

export function VisibilitySelector({
  value,
  onValueChange,
  disabled = false,
}: VisibilitySelectorProps) {
  const selectedOption = visibilityOptions.find(option => option.value === value) || visibilityOptions[2]
  const Icon = selectedOption.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'justify-between',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled}
        >
          <div className="flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            {selectedOption.label}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {visibilityOptions.map((option) => {
          const OptionIcon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onValueChange(option.value)}
              className="cursor-pointer"
            >
              <OptionIcon className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
              {value === option.value && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}