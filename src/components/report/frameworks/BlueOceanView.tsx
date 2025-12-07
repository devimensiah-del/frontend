'use client'

import type { BlueOceanAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MinusCircle, ArrowDown, ArrowUp, PlusCircle } from 'lucide-react'

interface BlueOceanViewProps {
  data: BlueOceanAnalysis
}

const actions = [
  { key: 'eliminate', title: 'Eliminar', icon: MinusCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  { key: 'reduce', title: 'Reduzir', icon: ArrowDown, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { key: 'raise', title: 'Elevar', icon: ArrowUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { key: 'create', title: 'Criar', icon: PlusCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
] as const

export function BlueOceanView({ data }: BlueOceanViewProps) {
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

      {/* ERRC Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {actions.map((action) => {
          const items = data[action.key as keyof Omit<BlueOceanAnalysis, 'newValueCurve' | 'summary'>] as string[]
          if (!items || items.length === 0) return null

          const Icon = action.icon

          return (
            <Card key={action.key}>
              <CardHeader className={action.bgColor}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${action.color}`} />
                  <CardTitle className={action.color}>{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-navy-900 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-text-secondary flex-1">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* New Value Curve */}
      {data.newValueCurve && (
        <Card className="border-gold-500">
          <CardHeader>
            <CardTitle>Nova Curva de Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {data.newValueCurve}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
