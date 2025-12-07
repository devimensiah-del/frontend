'use client'

import { cn } from '@/lib/utils'

interface FrameworkNavProps {
  frameworks: Array<{
    key: string
    name: string
  }>
  activeFramework: string
  onSelect: (key: string) => void
}

export function FrameworkNav({
  frameworks,
  activeFramework,
  onSelect,
}: FrameworkNavProps) {
  return (
    <nav className="bg-white border border-line rounded-lg p-2 overflow-x-auto">
      <ul className="flex flex-wrap gap-1">
        {frameworks.map((framework) => (
          <li key={framework.key}>
            <button
              onClick={() => onSelect(framework.key)}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                activeFramework === framework.key
                  ? 'bg-gold-500 text-white'
                  : 'text-navy-900 hover:bg-navy-900/5'
              )}
            >
              {framework.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
