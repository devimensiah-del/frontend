'use client'

import { useParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>()

  // TODO: Add useAnalysis hook when analysis API is ready
  const isLoading = false
  const analysis = null

  if (isLoading) return <LoadingSpinner />

  if (!analysis) {
    return (
      <div className="max-w-5xl mx-auto py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
            <p className="text-text-secondary text-center">
              Análise não encontrada ou você não tem permissão para visualizá-la.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Análise Completa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-900">
              A visualização completa de análise será implementada no prompt 015.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              ID da análise: {id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
