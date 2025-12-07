'use client'

import type { BSCAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DollarSign, Users, Cog, GraduationCap } from 'lucide-react'

interface BSCViewProps {
  data: BSCAnalysis
}

const perspectives = [
  {
    key: 'financial',
    title: 'Perspectiva Financeira',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    key: 'customer',
    title: 'Perspectiva do Cliente',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'internal_processes',
    title: 'Processos Internos',
    icon: Cog,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    key: 'learning_growth',
    title: 'Aprendizado e Crescimento',
    icon: GraduationCap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
] as const

export function BSCView({ data }: BSCViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {data.summary && (
        <Card className="border-gold-500">
          <CardHeader>
            <CardTitle>Síntese do Balanced Scorecard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* BSC Perspectives */}
      <div className="grid gap-6 md:grid-cols-2">
        {perspectives.map((perspective) => {
          const items = data[perspective.key as keyof Omit<BSCAnalysis, 'summary'>] as string[]
          if (!items || items.length === 0) return null

          const Icon = perspective.icon

          return (
            <Card key={perspective.key}>
              <CardHeader className={perspective.bgColor}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${perspective.color}`} />
                  <CardTitle className={perspective.color}>
                    {perspective.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-navy-900 text-white text-xs font-medium rounded-full flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-sm text-text-secondary flex-1">{item}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
