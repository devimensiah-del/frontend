'use client'

import type { ScenariosAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Minus, TrendingDown, Shield, AlertTriangle } from 'lucide-react'

interface ScenariosViewProps {
  data: ScenariosAnalysis
}

const scenarioConfig = {
  optimistic: {
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Otimista'
  },
  realist: {
    icon: Minus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Realista'
  },
  pessimistic: {
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Pessimista'
  },
} as const

export function ScenariosView({ data }: ScenariosViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {data.summary && (
        <Card className="border-gold-500">
          <CardHeader>
            <CardTitle>Síntese da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Scenarios */}
      <div className="grid gap-6 lg:grid-cols-3">
        {(['optimistic', 'realist', 'pessimistic'] as const).map((key) => {
          const scenario = data[key]
          if (!scenario) return null

          const config = scenarioConfig[key]
          const Icon = config.icon

          return (
            <Card key={key}>
              <CardHeader className={config.bgColor}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <CardTitle className={config.color}>{config.label}</CardTitle>
                  </div>
                  <Badge variant="outline">
                    {Math.round(scenario.probability * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-navy-900 mb-2">
                    {scenario.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {scenario.description}
                  </p>
                </div>

                {scenario.required_actions && scenario.required_actions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-2">
                      Ações Necessárias:
                    </p>
                    <ul className="space-y-1">
                      {scenario.required_actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="inline-block w-1 h-1 bg-navy-900 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-xs text-text-secondary flex-1">
                            {action}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Mitigation Tactics */}
      {data.mitigation_tactics && data.mitigation_tactics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-navy-900" />
              <CardTitle>Táticas de Mitigação</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.mitigation_tactics.map((tactic, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-navy-900 text-white text-xs font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-text-secondary flex-1">{tactic}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Early Warning Signals */}
      {data.early_warning_signals && data.early_warning_signals.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-gold-500" />
              <CardTitle>Sinais de Alerta Precoce</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.early_warning_signals.map((signal, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-text-secondary flex-1">
                    {signal}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
