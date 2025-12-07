'use client'

import type { GrowthHackingAnalysis, GrowthLoop } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingUp, BarChart3, AlertCircle } from 'lucide-react'

interface GrowthHackingViewProps {
  data: GrowthHackingAnalysis
}

function GrowthLoopCard({ loop, title }: { loop: GrowthLoop; title: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold-500" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant="outline">{loop.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name/Description */}
        <div>
          <p className="text-sm font-medium text-navy-900 mb-1">{loop.name}</p>
        </div>

        {/* Steps */}
        {loop.steps && loop.steps.length > 0 && (
          <div>
            <p className="text-xs font-medium text-text-secondary mb-2">Etapas:</p>
            <ol className="space-y-2">
              {loop.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-navy-900 text-white text-xs font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-secondary flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Metrics */}
        {loop.metrics && loop.metrics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-navy-900" />
              <p className="text-xs font-medium text-text-secondary">Métricas-chave:</p>
            </div>
            <ul className="space-y-1">
              {loop.metrics.map((metric, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="inline-block w-1 h-1 bg-gold-500 rounded-full" />
                  <span className="text-sm text-text-secondary">{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottleneck */}
        {loop.bottleneck && (
          <div className="pt-3 border-t border-line">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">Gargalo:</p>
                <p className="text-sm text-navy-900">{loop.bottleneck}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function GrowthHackingView({ data }: GrowthHackingViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {data.summary && (
        <Card className="border-gold-500">
          <CardHeader>
            <CardTitle>Síntese da Estratégia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Growth Loops */}
      <div className="grid gap-6 lg:grid-cols-2">
        {data.leap_loop && (
          <GrowthLoopCard loop={data.leap_loop} title="LEAP Loop (Aquisição)" />
        )}
        {data.scale_loop && (
          <GrowthLoopCard loop={data.scale_loop} title="SCALE Loop (Retenção)" />
        )}
      </div>
    </div>
  )
}
