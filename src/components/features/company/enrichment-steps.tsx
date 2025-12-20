'use client'

import { Loader2, CheckCircle2, XCircle, Clock, Play, RefreshCw, Building2, Briefcase, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { EnrichmentStatus, CompanyEnrichmentStatus } from '@/lib/types'
import { useEnrichmentStatus, useTriggerStep2, useTriggerStep3, useReEnrichCompany } from '@/lib/hooks/use-companies'

interface StepCardProps {
  stepNumber: 1 | 2 | 3
  title: string
  description: string
  status: EnrichmentStatus
  completedAt?: string
  error?: string
  canTrigger: boolean
  onTrigger: () => void
  isPending: boolean
  icon: React.ReactNode
}

function StepCard({
  stepNumber,
  title,
  description,
  status,
  completedAt,
  error,
  canTrigger,
  onTrigger,
  isPending,
  icon,
}: StepCardProps) {
  const getStatusBadge = () => {
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

  const isDisabled = !canTrigger || isPending || status === 'processing'

  return (
    <div className="p-4 bg-white border border-line rounded-lg">
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
              {getStatusBadge()}
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
          {/* Show action button based on state */}
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
              {stepNumber === 1 ? 'Reiniciar' : 'Iniciar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface EnrichmentStepsProps {
  companyId: string
  legacyStatus?: EnrichmentStatus // Fallback if API not ready
}

export function EnrichmentSteps({ companyId, legacyStatus }: EnrichmentStepsProps) {
  const { data: enrichmentStatus, isLoading, error } = useEnrichmentStatus(companyId)
  const triggerStep2 = useTriggerStep2()
  const triggerStep3 = useTriggerStep3()
  const reEnrich = useReEnrichCompany()

  // If API fails or loading, use legacy single-status approach
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

  // Fallback to legacy if enrichment status endpoint not available
  if (error || !enrichmentStatus) {
    return (
      <div className="p-4 bg-white border border-line rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={
              legacyStatus === 'completed' ? "text-success border-success/30 bg-success/10" :
              legacyStatus === 'processing' ? "text-info border-info/30 bg-info/10" :
              legacyStatus === 'failed' ? "text-error border-error/30 bg-error/10" :
              "text-warning border-warning/30 bg-warning/10"
            }>
              {legacyStatus === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {legacyStatus === 'processing' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              {legacyStatus === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
              {legacyStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
              {legacyStatus === 'completed' ? 'Enriquecida' :
               legacyStatus === 'processing' ? 'Processando' :
               legacyStatus === 'failed' ? 'Falhou' : 'Pendente'}
            </Badge>
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

      <StepCard
        stepNumber={1}
        title="Dados Básicos"
        description="CNPJ, razão social, fundação, sede, funcionários, website, redes sociais, executivos"
        status={enrichmentStatus.step1_status}
        completedAt={enrichmentStatus.step1_completed_at}
        error={enrichmentStatus.step1_error}
        canTrigger={true}
        onTrigger={() => reEnrich.mutate(companyId)}
        isPending={reEnrich.isPending}
        icon={<Building2 className="w-4 h-4" />}
      />

      <StepCard
        stepNumber={2}
        title="Modelo de Negócio"
        description="Modelo de negócio, produtos/serviços, público-alvo, proposta de valor, regiões"
        status={enrichmentStatus.step2_status}
        completedAt={enrichmentStatus.step2_completed_at}
        error={enrichmentStatus.step2_error}
        canTrigger={enrichmentStatus.can_trigger_step2}
        onTrigger={() => triggerStep2.mutate(companyId)}
        isPending={triggerStep2.isPending}
        icon={<Briefcase className="w-4 h-4" />}
      />

      <StepCard
        stepNumber={3}
        title="Inteligência Competitiva"
        description="Concorrentes, informações do setor, reputação, notícias recentes"
        status={enrichmentStatus.step3_status}
        completedAt={enrichmentStatus.step3_completed_at}
        error={enrichmentStatus.step3_error}
        canTrigger={enrichmentStatus.can_trigger_step3}
        onTrigger={() => triggerStep3.mutate(companyId)}
        isPending={triggerStep3.isPending}
        icon={<Target className="w-4 h-4" />}
      />
    </div>
  )
}
