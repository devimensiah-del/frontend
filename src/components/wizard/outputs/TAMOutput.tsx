/**
 * TAM-SAM-SOM Output Component
 * Nested market sizing visualization
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import type { TamSamSomAnalysis } from '@/lib/types'

interface TAMOutputProps {
  data: TamSamSomAnalysis
}

export function TAMOutput({ data }: TAMOutputProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Dimensionamento de Mercado (TAM-SAM-SOM)</h3>
        <p className="text-muted-foreground">{data.summary}</p>
      </div>

      {data.caveat_message && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{data.caveat_message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* TAM */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge className="bg-blue-600 text-white">TAM</Badge>
              <span>Total Addressable Market</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">{data.tam}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Mercado total disponível
            </p>
          </CardContent>
        </Card>

        {/* SAM */}
        <Card className="bg-purple-50 border-purple-200 ml-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge className="bg-purple-600 text-white">SAM</Badge>
              <span>Serviceable Addressable Market</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-900">{data.sam}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Mercado endereçável pelo serviço
            </p>
          </CardContent>
        </Card>

        {/* SOM */}
        <Card className="bg-green-50 border-green-200 ml-16">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge className="bg-green-600 text-white">SOM</Badge>
              <span>Serviceable Obtainable Market</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">{data.som}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Mercado obtível (meta realista)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.cagr && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">CAGR (Taxa de Crescimento)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{data.cagr}</p>
            </CardContent>
          </Card>
        )}

        {data.confidence_level && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Nível de Confiança</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{data.confidence_level}%</p>
            </CardContent>
          </Card>
        )}
      </div>

      {data.assumptions && data.assumptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Premissas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.assumptions.map((assumption, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
