'use client'

import type { TamSamSomAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Crosshair } from 'lucide-react'

interface TAMViewProps {
  data: TamSamSomAnalysis
}

export function TAMView({ data }: TAMViewProps) {
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

      {/* Market Sizing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <CardTitle>TAM</CardTitle>
            </div>
            <p className="text-xs text-text-secondary">Total Addressable Market</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy-900 mb-2">
              {data.tam}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              <CardTitle>SAM</CardTitle>
            </div>
            <p className="text-xs text-text-secondary">Serviceable Available Market</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy-900 mb-2">
              {data.sam}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-gold-500" />
              <CardTitle>SOM</CardTitle>
            </div>
            <p className="text-xs text-text-secondary">Serviceable Obtainable Market</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy-900 mb-2">
              {data.som}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {data.cagr && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taxa de Crescimento (CAGR)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-navy-900">
                {data.cagr}
              </p>
            </CardContent>
          </Card>
        )}

        {data.confidence_level && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nível de Confiança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gold-500 h-full"
                    style={{ width: `${data.confidence_level}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-navy-900">
                  {data.confidence_level}%
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assumptions */}
      {data.assumptions && data.assumptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Premissas da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-navy-900 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-text-secondary flex-1">
                    {assumption}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Method and Caveats */}
      {(data.estimation_method || data.calculation_notes || data.caveat_message) && (
        <Card className="bg-surface-paper">
          <CardHeader>
            <CardTitle className="text-base">Metodologia e Considerações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.estimation_method && (
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">Método:</p>
                <p className="text-sm text-navy-900">{data.estimation_method}</p>
              </div>
            )}
            {data.calculation_notes && (
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">Notas de Cálculo:</p>
                <p className="text-sm text-navy-900">{data.calculation_notes}</p>
              </div>
            )}
            {data.caveat_message && (
              <div className="pt-2 border-t border-line">
                <Badge variant="outline" className="mb-2">Aviso</Badge>
                <p className="text-xs text-text-secondary">{data.caveat_message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
