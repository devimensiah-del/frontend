'use client'

import { Loader2, CheckCircle2, XCircle, Clock, Play, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { EnrichmentStatus } from '@/lib/types'
import { useEnrichmentStatus, useTriggerStep2, useTriggerStep3, useRetryStep2, useRetryStep3, useReEnrichCompany } from '@/lib/hooks/use-companies'

// =============================================================================
// Shared Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status: EnrichmentStatus }) {
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
// Individual Step Card Components (for use in each tab)
// =============================================================================

interface StepCardBaseProps {
  stepNumber: 1 | 2 | 3
  title: string
  description: string
  status: EnrichmentStatus
  completedAt?: string
  error?: string
  canTrigger: boolean
  onTrigger: () => void
  isPending: boolean
}

function StepCardBase({
  stepNumber,
  title,
  description,
  status,
  completedAt,
  error,
  canTrigger,
  onTrigger,
  isPending,
}: StepCardBaseProps) {
  const isDisabled = !canTrigger || isPending || status === 'processing'

  return (
    <div className="p-4 bg-white border border-line rounded-lg mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
            ${status === 'completed' ? 'bg-success' : status === 'processing' ? 'bg-info' : status === 'failed' ? 'bg-error' : 'bg-muted-foreground/30'}
          `}>
            {status === 'processing' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              stepNumber
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-navy-900">{title}</h4>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            {completedAt && status === 'completed' && (
              <p className="text-xs text-muted-foreground mt-1">
                Concluído em: {new Date(completedAt).toLocaleString('pt-BR')}
              </p>
            )}
            {error && status === 'failed' && (
              <p className="text-xs text-error mt-1">
                Erro: {error}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canTrigger && status !== 'completed' && status !== 'processing' && (
            <Button
              size="sm"
              variant={stepNumber === 1 ? "outline" : "architect"}
              onClick={onTrigger}
              disabled={isDisabled}
              className="gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : stepNumber === 1 ? (
                <RefreshCw className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {stepNumber === 1 ? 'Reiniciar' : 'Iniciar Enriquecimento'}
            </Button>
          )}
          {/* Show re-run button for completed steps */}
          {status === 'completed' && stepNumber === 1 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onTrigger}
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Re-enriquecer
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Step 1 Card - For "Empresa" tab
// =============================================================================

interface Step1CardProps {
  companyId: string
  legacyStatus?: EnrichmentStatus
}

export function Step1Card({ companyId, legacyStatus }: Step1CardProps) {
  const { data: enrichmentStatus, isLoading, error } = useEnrichmentStatus(companyId)
  const reEnrich = useReEnrichCompany()

  if (isLoading) {
    return (
      <div className="p-4 bg-white border border-line rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Carregando status...</span>
        </div>
      </div>
    )
  }

  // Fallback to legacy status
  if (error || !enrichmentStatus) {
    return (
      <div className="p-4 bg-white border border-line rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={legacyStatus || 'pending'} />
            <span className="text-sm text-muted-foreground">Dados Básicos</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => reEnrich.mutate(companyId)}
            disabled={reEnrich.isPending || legacyStatus === 'processing'}
            className="gap-1.5"
          >
            {reEnrich.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Re-enriquecer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <StepCardBase
      stepNumber={1}
      title="Etapa 1: Dados Básicos"
      description="CNPJ, razão social, fundação, sede, funcionários, website, redes sociais, executivos, sócios, CNAE, capital social"
      status={enrichmentStatus.step1_status}
      completedAt={enrichmentStatus.step1_completed_at}
      error={enrichmentStatus.step1_error}
      canTrigger={true}
      onTrigger={() => reEnrich.mutate(companyId)}
      isPending={reEnrich.isPending}
    />
  )
}

// =============================================================================
// Step 2 Card - For "Negócio" tab
// =============================================================================

interface Step2CardProps {
  companyId: string
}

export function Step2Card({ companyId }: Step2CardProps) {
  const { data: enrichmentStatus, isLoading, error } = useEnrichmentStatus(companyId)
  const triggerStep2 = useTriggerStep2()
  const retryStep2 = useRetryStep2()

  if (isLoading) {
    return (
      <div className="p-4 bg-white border border-line rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Carregando status...</span>
        </div>
      </div>
    )
  }

  if (error || !enrichmentStatus) {
    return (
      <div className="p-4 bg-white border border-line rounded-lg mb-6 bg-muted/20">
        <p className="text-sm text-muted-foreground">Status de enriquecimento indisponível</p>
      </div>
    )
  }

  const status = enrichmentStatus.step2_status
  const isCompleted = status === 'completed'
  const isPending = triggerStep2.isPending || retryStep2.isPending

  return (
    <div className="p-4 bg-white border border-line rounded-lg mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
            ${status === 'completed' ? 'bg-success' : status === 'processing' ? 'bg-info' : status === 'failed' ? 'bg-error' : 'bg-muted-foreground/30'}
          `}>
            {status === 'processing' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              2
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-navy-900">Etapa 2: Modelo de Negócio</h4>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-muted-foreground">Modelo de negócio, produtos/serviços, público-alvo, proposta de valor, regiões de atuação</p>
            {enrichmentStatus.step2_completed_at && isCompleted && (
              <p className="text-xs text-muted-foreground mt-1">
                Concluído em: {new Date(enrichmentStatus.step2_completed_at).toLocaleString('pt-BR')}
              </p>
            )}
            {enrichmentStatus.step2_error && status === 'failed' && (
              <p className="text-xs text-error mt-1">
                Erro: {enrichmentStatus.step2_error}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Show trigger button for pending/failed */}
          {enrichmentStatus.can_trigger_step2 && !isCompleted && status !== 'processing' && (
            <Button
              size="sm"
              variant="architect"
              onClick={() => triggerStep2.mutate(companyId)}
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Iniciar Enriquecimento
            </Button>
          )}
          {/* Show re-enrich button for completed */}
          {isCompleted && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => retryStep2.mutate(companyId)}
              disabled={isPending}
              className="gap-1.5"
            >
              {retryStep2.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Re-enriquecer
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Step 3 Card - For "Mercado" tab
// =============================================================================

interface Step3CardProps {
  companyId: string
}

export function Step3Card({ companyId }: Step3CardProps) {
  const { data: enrichmentStatus, isLoading, error } = useEnrichmentStatus(companyId)
  const triggerStep3 = useTriggerStep3()
  const retryStep3 = useRetryStep3()

  if (isLoading) {
    return (
      <div className="p-4 bg-white border border-line rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Carregando status...</span>
        </div>
      </div>
    )
  }

  if (error || !enrichmentStatus) {
    return (
      <div className="p-4 bg-white border border-line rounded-lg mb-6 bg-muted/20">
        <p className="text-sm text-muted-foreground">Status de enriquecimento indisponível</p>
      </div>
    )
  }

  const status = enrichmentStatus.step3_status
  const isCompleted = status === 'completed'
  const isPending = triggerStep3.isPending || retryStep3.isPending

  return (
    <div className="p-4 bg-white border border-line rounded-lg mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
            ${status === 'completed' ? 'bg-success' : status === 'processing' ? 'bg-info' : status === 'failed' ? 'bg-error' : 'bg-muted-foreground/30'}
          `}>
            {status === 'processing' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              3
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-navy-900">Etapa 3: Inteligência Competitiva</h4>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-muted-foreground">Concorrentes, informações do setor, reputação, notícias recentes</p>
            {enrichmentStatus.step3_completed_at && isCompleted && (
              <p className="text-xs text-muted-foreground mt-1">
                Concluído em: {new Date(enrichmentStatus.step3_completed_at).toLocaleString('pt-BR')}
              </p>
            )}
            {enrichmentStatus.step3_error && status === 'failed' && (
              <p className="text-xs text-error mt-1">
                Erro: {enrichmentStatus.step3_error}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Show trigger button for pending/failed */}
          {enrichmentStatus.can_trigger_step3 && !isCompleted && status !== 'processing' && (
            <Button
              size="sm"
              variant="architect"
              onClick={() => triggerStep3.mutate(companyId)}
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Iniciar Enriquecimento
            </Button>
          )}
          {/* Show re-enrich button for completed */}
          {isCompleted && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => retryStep3.mutate(companyId)}
              disabled={isPending}
              className="gap-1.5"
            >
              {retryStep3.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Re-enriquecer
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Legacy EnrichmentSteps Component (backward compatibility)
// =============================================================================

interface EnrichmentStepsProps {
  companyId: string
  legacyStatus?: EnrichmentStatus
}

export function EnrichmentSteps({ companyId, legacyStatus }: EnrichmentStepsProps) {
  const { data: enrichmentStatus, isLoading, error } = useEnrichmentStatus(companyId)
  const triggerStep2 = useTriggerStep2()
  const triggerStep3 = useTriggerStep3()
  const reEnrich = useReEnrichCompany()

  if (isLoading) {
    return (
      <div className="p-4 bg-white border border-line rounded">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Carregando status de enriquecimento...</span>
        </div>
      </div>
    )
  }

  if (error || !enrichmentStatus) {
    return (
      <div className="p-4 bg-white border border-line rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={legacyStatus || 'pending'} />
            <span className="text-sm text-muted-foreground">
              (Status detalhado por etapa indisponível)
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => reEnrich.mutate(companyId)}
            disabled={reEnrich.isPending || legacyStatus === 'processing'}
            className="gap-1.5"
          >
            {reEnrich.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Re-enriquecer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-900">
          Progresso do Enriquecimento
        </h3>
        <span className="text-xs text-muted-foreground">
          (3 etapas)
        </span>
      </div>

      <StepCardBase
        stepNumber={1}
        title="Dados Básicos"
        description="CNPJ, razão social, fundação, sede, funcionários, website, redes sociais, executivos, sócios, CNAE, capital social"
        status={enrichmentStatus.step1_status}
        completedAt={enrichmentStatus.step1_completed_at}
        error={enrichmentStatus.step1_error}
        canTrigger={true}
        onTrigger={() => reEnrich.mutate(companyId)}
        isPending={reEnrich.isPending}
      />

      <StepCardBase
        stepNumber={2}
        title="Modelo de Negócio"
        description="Modelo de negócio, produtos/serviços, público-alvo, proposta de valor, regiões"
        status={enrichmentStatus.step2_status}
        completedAt={enrichmentStatus.step2_completed_at}
        error={enrichmentStatus.step2_error}
        canTrigger={enrichmentStatus.can_trigger_step2}
        onTrigger={() => triggerStep2.mutate(companyId)}
        isPending={triggerStep2.isPending}
      />

      <StepCardBase
        stepNumber={3}
        title="Inteligência Competitiva"
        description="Concorrentes, informações do setor, reputação, notícias recentes"
        status={enrichmentStatus.step3_status}
        completedAt={enrichmentStatus.step3_completed_at}
        error={enrichmentStatus.step3_error}
        canTrigger={enrichmentStatus.can_trigger_step3}
        onTrigger={() => triggerStep3.mutate(companyId)}
        isPending={triggerStep3.isPending}
      />
    </div>
  )
}
