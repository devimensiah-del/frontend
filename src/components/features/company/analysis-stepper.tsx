'use client'

import { useState } from 'react'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type {
  AnalysisState,
  StepState,
  FrameworkState,
  AnalysisStepDefinition,
} from '@/lib/types'
import { ANALYSIS_STEPS } from '@/lib/types'
import { useAnalysisState, useExecuteFramework, useStaleFrameworks } from '@/lib/hooks/use-frameworks'

// =============================================================================
// Step Tab Component
// =============================================================================

interface StepTabProps {
  step: AnalysisStepDefinition
  state?: StepState
  isActive: boolean
  onClick: () => void
  hasStaleFrameworks: boolean
}

function StepTab({ step, state, isActive, onClick, hasStaleFrameworks }: StepTabProps) {
  const isCompleted = state?.is_completed ?? false
  const isUnlocked = state?.is_unlocked ?? step.number === 1
  const isProcessing = state?.frameworks?.some(fw => fw.status === 'processing')

  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={cn(
        'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all',
        'border-b-2 -mb-[2px]',
        isActive
          ? 'border-accent text-accent'
          : isCompleted
          ? 'border-success/50 text-success hover:border-success'
          : isUnlocked
          ? 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
          : 'border-transparent text-muted-foreground/50 cursor-not-allowed',
      )}
    >
      {/* Step indicator */}
      <span
        className={cn(
          'flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold',
          isCompleted
            ? 'bg-success text-white'
            : isProcessing
            ? 'bg-info text-white'
            : isActive
            ? 'bg-accent text-white'
            : isUnlocked
            ? 'bg-muted text-muted-foreground'
            : 'bg-muted/50 text-muted-foreground/50',
        )}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : isProcessing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : !isUnlocked ? (
          <Lock className="w-3 h-3" />
        ) : (
          step.number
        )}
      </span>

      {/* Step name */}
      <span>{step.name}</span>

      {/* Stale indicator */}
      {hasStaleFrameworks && isCompleted && (
        <AlertTriangle className="w-4 h-4 text-warning" />
      )}
    </button>
  )
}

// =============================================================================
// Subtab Navigation Component
// =============================================================================

interface SubtabNavProps {
  step: AnalysisStepDefinition
  activeSubtab: string
  onSubtabChange: (code: string) => void
  frameworkStates: Map<string, FrameworkState>
}

function SubtabNav({ step, activeSubtab, onSubtabChange, frameworkStates }: SubtabNavProps) {
  if (!step.subtabs || step.subtabs.length === 0) return null

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg mb-4">
      {step.subtabs.map((subtab) => {
        const isActive = activeSubtab === subtab.code
        const fwState = frameworkStates.get(subtab.frameworks[0])
        const isCompleted = fwState?.status === 'completed'
        const isStale = fwState?.is_stale
        const isProcessing = fwState?.status === 'processing'

        return (
          <button
            key={subtab.code}
            onClick={() => onSubtabChange(subtab.code)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all',
              isActive
                ? 'bg-white shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/50',
            )}
          >
            {/* Status indicator */}
            {isProcessing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-info" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            )}

            <span>{subtab.name}</span>

            {isStale && <AlertTriangle className="w-3.5 h-3.5 text-warning" />}
          </button>
        )
      })}
    </div>
  )
}

// =============================================================================
// Framework Panel Component
// =============================================================================

interface FrameworkPanelProps {
  framework: FrameworkState
  companyId: string
  challengeId?: string
  onRerun?: () => void
}

function FrameworkPanel({ framework, companyId, challengeId, onRerun }: FrameworkPanelProps) {
  const executeFramework = useExecuteFramework()

  const isCompleted = framework.status === 'completed'
  const isProcessing = framework.status === 'processing'
  const isFailed = framework.status === 'failed'
  const canExecute = framework.can_execute

  const handleExecute = () => {
    executeFramework.mutate({
      companyId,
      frameworkCode: framework.code,
      challengeId,
    })
  }

  return (
    <div className="p-6 bg-white border border-line rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">{framework.name}</h3>
          {framework.generated_at && isCompleted && (
            <p className="text-xs text-muted-foreground mt-1">
              v{framework.version} • Gerado em {new Date(framework.generated_at).toLocaleString('pt-BR')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          {isCompleted && !framework.is_stale && (
            <Badge variant="outline" className="text-success border-success/30 bg-success/10">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Concluído
            </Badge>
          )}
          {isCompleted && framework.is_stale && (
            <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Desatualizado
            </Badge>
          )}
          {isProcessing && (
            <Badge variant="outline" className="text-info border-info/30 bg-info/10">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Processando
            </Badge>
          )}
          {isFailed && (
            <Badge variant="outline" className="text-error border-error/30 bg-error/10">
              <XCircle className="w-3 h-3 mr-1" />
              Erro
            </Badge>
          )}

          {/* Action button */}
          {!isProcessing && canExecute && (
            <Button
              size="sm"
              variant={isCompleted ? 'outline' : 'architect'}
              onClick={handleExecute}
              disabled={executeFramework.isPending}
              className="gap-1.5"
            >
              {executeFramework.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isCompleted ? (
                <RefreshCw className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {isCompleted ? 'Atualizar' : 'Executar'}
            </Button>
          )}
        </div>
      </div>

      {/* Missing dependencies warning */}
      {!canExecute && framework.missing_dependencies.length > 0 && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-md text-sm">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">Dependências pendentes</p>
              <p className="text-muted-foreground mt-1">
                Complete primeiro: {framework.missing_dependencies.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stale warning */}
      {framework.is_stale && framework.stale_reason && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-md text-sm mt-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">Análise desatualizada</p>
              <p className="text-muted-foreground mt-1">{framework.stale_reason}</p>
              {framework.stale_acknowledged_at && (
                <p className="text-xs text-muted-foreground mt-2">
                  Reconhecido em {new Date(framework.stale_acknowledged_at).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for result content */}
      {isCompleted && !framework.is_stale && (
        <div className="mt-4 p-4 bg-muted/20 rounded-md">
          <p className="text-sm text-muted-foreground">
            Resultado disponível. Clique em "Atualizar" para regenerar com novos dados.
          </p>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Analysis Stepper Component
// =============================================================================

interface AnalysisStepperProps {
  companyId: string
  challengeId?: string
  steps?: AnalysisStepDefinition[]
}

export function AnalysisStepper({ companyId, challengeId, steps = ANALYSIS_STEPS }: AnalysisStepperProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [activeSubtab, setActiveSubtab] = useState<string | null>(null)

  const { data: analysisState, isLoading: stateLoading } = useAnalysisState(companyId, challengeId)
  const { data: staleData } = useStaleFrameworks(companyId, challengeId)

  // Get current step definition
  const currentStepDef = steps.find(s => s.number === activeStep) || steps[0]

  // Build framework states map from analysis state
  const frameworkStates = new Map<string, FrameworkState>()
  analysisState?.steps?.forEach(step => {
    step.frameworks?.forEach(fw => {
      frameworkStates.set(fw.code, fw)
    })
  })

  // Get step state
  const getStepState = (stepNumber: number): StepState | undefined => {
    return analysisState?.steps?.find(s => s.step_number === stepNumber)
  }

  // Check if step has stale frameworks
  const hasStaleFrameworks = (stepNumber: number): boolean => {
    const state = getStepState(stepNumber)
    return state?.frameworks?.some(fw => fw.is_stale) ?? false
  }

  // Set initial subtab when step changes
  const handleStepChange = (stepNumber: number) => {
    setActiveStep(stepNumber)
    const step = steps.find(s => s.number === stepNumber)
    if (step?.subtabs && step.subtabs.length > 0) {
      setActiveSubtab(step.subtabs[0].code)
    } else {
      setActiveSubtab(null)
    }
  }

  // Get frameworks to display in current view
  const getDisplayFrameworks = (): string[] => {
    if (currentStepDef.subtabs && activeSubtab) {
      const subtab = currentStepDef.subtabs.find(s => s.code === activeSubtab)
      return subtab?.frameworks || []
    }
    return currentStepDef.frameworks
  }

  if (stateLoading) {
    return (
      <div className="p-6 bg-white border border-line rounded-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Carregando análise...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      {analysisState && (
        <div className="flex items-center gap-4 p-4 bg-white border border-line rounded-lg">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-900">Progresso da Análise</span>
              <span className="text-sm text-muted-foreground">{analysisState.overall_progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${analysisState.overall_progress}%` }}
              />
            </div>
          </div>
          {analysisState.has_stale_frameworks && (
            <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {staleData?.total || 0} desatualizado(s)
            </Badge>
          )}
        </div>
      )}

      {/* Step tabs */}
      <div className="border-b border-line bg-white rounded-t-lg">
        <div className="flex items-center overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.code} className="flex items-center">
              <StepTab
                step={step}
                state={getStepState(step.number)}
                isActive={activeStep === step.number}
                onClick={() => handleStepChange(step.number)}
                hasStaleFrameworks={hasStaleFrameworks(step.number)}
              />
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white border border-line rounded-lg p-6">
        {/* Step header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-navy-900">{currentStepDef.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{currentStepDef.description}</p>
        </div>

        {/* Subtab navigation */}
        <SubtabNav
          step={currentStepDef}
          activeSubtab={activeSubtab || currentStepDef.subtabs?.[0]?.code || ''}
          onSubtabChange={setActiveSubtab}
          frameworkStates={frameworkStates}
        />

        {/* Framework panels */}
        <div className="space-y-4">
          {getDisplayFrameworks().map(fwCode => {
            const fwState = frameworkStates.get(fwCode)
            if (!fwState) {
              return (
                <div key={fwCode} className="p-6 bg-muted/20 border border-line rounded-lg">
                  <p className="text-muted-foreground">Framework {fwCode} não encontrado</p>
                </div>
              )
            }
            return (
              <FrameworkPanel
                key={fwCode}
                framework={fwState}
                companyId={companyId}
                challengeId={challengeId}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
