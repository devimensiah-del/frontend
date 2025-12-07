'use client'

import { useParams } from 'next/navigation'
import { useAdminAnalysis, useGenerateAll, useUpdateVisibility } from '@/lib/hooks/use-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Zap, Eye, EyeOff, Globe, Lock,
  Loader2, AlertCircle, ArrowLeft
} from 'lucide-react'
import { FrameworkViewer } from '@/components/features/analysis/framework-viewer'
import Link from 'next/link'

export default function AdminAnalysisPage() {
  const { id } = useParams<{ id: string }>()
  const { data: analysis, isLoading, refetch } = useAdminAnalysis(id)
  const generateAll = useGenerateAll()
  const updateVisibility = useUpdateVisibility()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Análise não encontrada</p>
      </div>
    )
  }

  const handleGenerateAll = () => {
    generateAll.mutate(id, {
      onSuccess: () => refetch()
    })
  }

  const handleToggle = (field: 'is_public' | 'is_visible_to_user', value: boolean) => {
    updateVisibility.mutate(
      { analysisId: id, field, value },
      { onSuccess: () => refetch() }
    )
  }

  const isCompleted = analysis.status === 'completed'
  const isProcessing = analysis.status === 'processing' || generateAll.isPending

  const statusVariant = analysis.status === 'completed' ? 'success' :
    analysis.status === 'failed' ? 'error' : 'warning'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/submissions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold">Análise</h1>
            <p className="text-text-secondary font-mono text-sm">ID: {analysis.id}</p>
          </div>
        </div>

        <Badge variant={statusVariant}>
          {analysis.status}
        </Badge>
      </div>

      {/* Admin Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-gold-500" />
            Controles Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generate All Button */}
          {!isCompleted && (
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">
                Gerar todos os 12 frameworks de uma vez (bypass wizard)
              </p>
              <Button
                onClick={handleGenerateAll}
                disabled={isProcessing}
                className="btn-architect"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Gerar Todos
                  </>
                )}
              </Button>

              {generateAll.isPending && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Processando 12 frameworks. Isso pode levar alguns minutos...
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Visibility Controls */}
          {isCompleted && (
            <div className="space-y-4 pt-4 border-t border-line">
              <h4 className="font-medium">Visibilidade</h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {analysis.isVisibleToUser ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <Label htmlFor="visible_user">Visível para Usuário</Label>
                </div>
                <Switch
                  id="visible_user"
                  checked={analysis.isVisibleToUser ?? false}
                  onCheckedChange={(checked) => handleToggle('is_visible_to_user', checked)}
                  disabled={updateVisibility.isPending}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {analysis.isPublic ? (
                    <Globe className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                  <Label htmlFor="public">Relatório Público</Label>
                </div>
                <Switch
                  id="public"
                  checked={analysis.isPublic ?? false}
                  onCheckedChange={(checked) => handleToggle('is_public', checked)}
                  disabled={updateVisibility.isPending}
                />
              </div>

              {analysis.accessCode && (
                <div className="pt-2">
                  <p className="text-xs text-text-secondary">Código de Acesso:</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {analysis.accessCode}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Progress for in-progress */}
          {!isCompleted && (
            <div className="pt-4 border-t border-line">
              <p className="text-sm text-text-secondary">
                Status: {analysis.status}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Framework Results */}
      {isCompleted && analysis.analysis && (
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold">Resultados</h2>
          {Object.entries(analysis.analysis).map(([key, data]) => (
            <FrameworkViewer key={key} frameworkKey={key} data={data as Record<string, unknown>} />
          ))}
        </div>
      )}
    </div>
  )
}
