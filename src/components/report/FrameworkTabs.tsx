'use client'

import { Lock } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export interface FrameworkTab {
  key: string
  title: string
  isPremium: boolean
  content: React.ReactNode
}

interface FrameworkTabsProps {
  tabs: FrameworkTab[]
  isBlurred: boolean
  defaultTab?: string
}

export function FrameworkTabs({ tabs, isBlurred, defaultTab }: FrameworkTabsProps) {
  const visibleTabs = tabs.filter(tab => tab.content !== null)

  if (visibleTabs.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        Nenhum framework disponível
      </div>
    )
  }

  return (
    <Tabs defaultValue={defaultTab || visibleTabs[0]?.key} className="w-full">
      <TabsList className="w-full overflow-x-auto flex justify-start">
        {visibleTabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className={cn(
              'relative flex items-center gap-2',
              tab.isPremium && isBlurred && 'text-text-secondary'
            )}
          >
            {tab.title}
            {tab.isPremium && isBlurred && (
              <Lock className="w-3 h-3" aria-label="Conteúdo premium" />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {visibleTabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
