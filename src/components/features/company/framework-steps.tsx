'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, XCircle, Clock, Play, RefreshCw, Edit, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { FrameworkResultStatus, FrameworkResultWithDetails, FrameworkV2 } from '@/lib/types'
import { useFrameworkResults, useRunFramework, useExecutionPlan } from '@/lib/hooks/use-frameworks'

// =============================================================================
// Status Badge Component
// =============================================================================

function FrameworkStatusBadge({ status }: { status: FrameworkResultStatus }) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Concluído
        </Badge>
      )
    case 'processing':
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processando
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="text-error border-error/30 bg-error/10">
          <XCircle className="w-3 h-3 mr-1" />
          Falhou
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 bg-muted/30">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      )
  }
}

// =============================================================================
// Framework Card Component
// =============================================================================

interface FrameworkCardProps {
  framework: FrameworkV2
  result?: FrameworkResultWithDetails
  companyId: string
  challengeId?: string
  onEdit?: (result: FrameworkResultWithDetails) => void
  disabled?: boolean
}

function FrameworkCard({
  framework,
  result,
  companyId,
  challengeId,
  onEdit,
  disabled = false,
}: FrameworkCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const runFramework = useRunFramework()

  const status = result?.result.status
  const isCompleted = status === 'completed'
  const isProcessing = status === 'processing'
  const isPending = status === 'pending'
  const isFailed = status === 'failed'
  const hasResult = result && isCompleted

  const handleRun = () => {
    runFramework.mutate({
      companyId,
      frameworkCode: framework.code,
      challengeId,
    })
  }

  return (
    <div className="p-4 bg-white border border-line rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0
            ${isCompleted ? 'bg-success' : isProcessing ? 'bg-info' : isFailed ? 'bg-error' : 'bg-muted-foreground/30'}
          `}>
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isFailed ? (
              <XCircle className="w-5 h-5" />
            ) : (
              framework.layer
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-navy-900">{framework.name}</h4>
              {status && <FrameworkStatusBadge status={status} />}
              {!status && (
                <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 bg-muted/30">
                  <Clock className="w-3 h-3 mr-1" />
                  Não executado
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{framework.description}</p>
            {result?.result.generated_at && isCompleted && (
              <p className="text-xs text-muted-foreground mt-1">
                Gerado em: {new Date(result.result.generated_at).toLocaleString('pt-BR')}
              </p>
            )}
            {result?.result.error_message && isFailed && (
              <p className="text-xs text-error mt-1">
                Erro: {result.result.error_message}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {/* Run button for not executed or failed */}
          {(!status || isFailed) && (
            <Button
              size="sm"
              variant="architect"
              onClick={handleRun}
              disabled={disabled || runFramework.isPending}
              className="gap-1.5"
            >
              {runFramework.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Executar
            </Button>
          )}
          {/* Re-run button for completed */}
          {isCompleted && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRun}
                disabled={disabled || runFramework.isPending}
                className="gap-1.5"
              >
                {runFramework.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Re-executar
              </Button>
              {onEdit && result && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(result)}
                  className="gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Editar
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Expandable result preview */}
      {hasResult && result.result.result && (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Ocultar resultado
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver resultado
              </>
            )}
          </Button>
          {isOpen && (
            <div className="mt-3 p-3 bg-muted/30 rounded-md">
              <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(result.result.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Layer Section Component
// =============================================================================

interface LayerSectionProps {
  layerNumber: number
  title: string
  description: string
  frameworks: FrameworkV2[]
  results: Map<string, FrameworkResultWithDetails>
  companyId: string
  challengeId?: string
  onEdit?: (result: FrameworkResultWithDetails) => void
  previousLayerCompleted: boolean
}

function LayerSection({
  layerNumber,
  title,
  description,
  frameworks,
  results,
  companyId,
  challengeId,
  onEdit,
  previousLayerCompleted,
}: LayerSectionProps) {
  const allCompleted = frameworks.every(fw => {
    const r = results.get(fw.code)
    return r?.result.status === 'completed'
  })

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm
          ${allCompleted ? 'bg-success' : 'bg-navy-900'}
        `}>
          {allCompleted ? <CheckCircle2 className="w-4 h-4" /> : layerNumber}
        </div>
        <div>
          <h3 className="font-semibold text-navy-900">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-3 ml-11">
        {frameworks.map(framework => (
          <FrameworkCard
            key={framework.id}
            framework={framework}
            result={results.get(framework.code)}
            companyId={companyId}
            challengeId={challengeId}
            onEdit={onEdit}
            disabled={!previousLayerCompleted}
          />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Main Framework Steps Component
// =============================================================================

interface FrameworkStepsProps {
  companyId: string
  challengeId?: string
  onEditResult?: (result: FrameworkResultWithDetails) => void
}

export function FrameworkSteps({ companyId, challengeId, onEditResult }: FrameworkStepsProps) {
  const { data: resultsData, isLoading: resultsLoading } = useFrameworkResults(companyId, challengeId)
  const { data: executionPlan, isLoading: planLoading } = useExecutionPlan()

  if (resultsLoading || planLoading) {
    return (
      <div className="p-6 bg-white border border-line rounded-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Carregando frameworks...</span>
        </div>
      </div>
    )
  }

  if (!executionPlan) {
    return (
      <div className="p-6 bg-white border border-line rounded-lg">
        <p className="text-muted-foreground">Nenhum framework disponível.</p>
      </div>
    )
  }

  // Create a map of results by framework code
  const resultsMap = new Map<string, FrameworkResultWithDetails>()
  resultsData?.results?.forEach(r => {
    resultsMap.set(r.framework.code, r)
  })

  // Layer descriptions
  const layerInfo: Record<number, { title: string; description: string }> = {
    1: { title: 'Diagnóstico Externo', description: 'Análise do ambiente externo e competitivo' },
    2: { title: 'Diagnóstico Interno', description: 'Análise interna e posicionamento' },
    3: { title: 'Estratégias de Crescimento', description: 'Frameworks estratégicos opcionais' },
    4: { title: 'Planejamento', description: 'Cenários e OKRs' },
    5: { title: 'Execução', description: 'Planos de execução e priorização' },
    6: { title: 'Síntese', description: 'Resumo executivo e recomendações finais' },
  }

  // Check if previous layer is completed
  const isLayerCompleted = (layer: number): boolean => {
    const layerData = executionPlan.layers.find(l => l.layer_number === layer)
    if (!layerData) return true
    return layerData.frameworks.every(fw => {
      const r = resultsMap.get(fw.code)
      return r?.result.status === 'completed'
    })
  }

  return (
    <div className="space-y-6">
      {executionPlan.layers.map((layer, index) => {
        const info = layerInfo[layer.layer_number] || {
          title: `Camada ${layer.layer_number}`,
          description: ''
        }
        const prevCompleted = index === 0 || isLayerCompleted(executionPlan.layers[index - 1].layer_number)

        return (
          <LayerSection
            key={layer.layer_number}
            layerNumber={layer.layer_number}
            title={info.title}
            description={info.description}
            frameworks={layer.frameworks}
            results={resultsMap}
            companyId={companyId}
            challengeId={challengeId}
            onEdit={onEditResult}
            previousLayerCompleted={prevCompleted}
          />
        )
      })}
    </div>
  )
}
