'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  StepProgress,
  StepVisibilityToggle,
  StepActions,
  PreviousSteps,
  StepEditor,
  EditWarningBanner,
  ChallengeContextCard,
  ReflectionQuestionsCard,
} from '@/components/features/analysis-by-steps'
import {
  useStepState,
  useAllSteps,
  useGenerateStep,
  useSaveStepEdit,
  useApproveStep,
  useToggleStepVisibility,
} from '@/lib/hooks/use-analysis-by-steps'
import { useFrameworkOrder } from '@/lib/hooks/use-frameworks'

export default function AnalysisByStepsPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.id as string

  // Local state for tracking changes and navigation
  const [editedContent, setEditedContent] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedStepNumber, setSelectedStepNumber] = useState<number | null>(null)

  // Queries and mutations
  const { data: state, isLoading, error } = useStepState(analysisId)
  const { data: allSteps } = useAllSteps(analysisId)
  const { data: frameworkOrder } = useFrameworkOrder()
  const generateStep = useGenerateStep()
  const saveEdit = useSaveStepEdit()
  const approveStep = useApproveStep()
  const toggleVisibility = useToggleStepVisibility()

  const currentStepNumber = state?.current_step ?? 0
  const currentStep = state?.current_step_data
  const previousSteps = state?.previous_steps || []

  // Build lookup map for framework metadata by code
  const frameworkMetaMap = useMemo(() => {
    if (!frameworkOrder?.frameworks) return new Map()
    return new Map(frameworkOrder.frameworks.map(f => [f.code, f]))
  }, [frameworkOrder])

  // Initialize selectedStepNumber to current frontier
  useEffect(() => {
    if (selectedStepNumber === null && currentStepNumber !== undefined) {
      setSelectedStepNumber(currentStepNumber)
    }
  }, [currentStepNumber, selectedStepNumber])

  // Auto-generate step 0 when starting new analysis OR when landing on a pending step
  useEffect(() => {
    if (currentStep && currentStep.status === 'pending' && !generateStep.isPending) {
      generateStep.mutate({ analysisId, stepNumber: currentStep.step_number })
    }
  }, [currentStep?.id, currentStep?.status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine which step to display
  const displayedStep = selectedStepNumber !== null && allSteps
    ? allSteps.find(s => s.step_number === selectedStepNumber)
    : currentStep

  const isViewingPreviousStep = selectedStepNumber !== null && selectedStepNumber < currentStepNumber

  // Handle content changes from editor
  const handleContentChange = useCallback((content: string) => {
    setEditedContent(content)
    setHasChanges(true)
  }, [])

  // Handle pill selection
  const handleStepSelect = useCallback((stepNumber: number) => {
    if (hasChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja continuar?')) {
        setSelectedStepNumber(stepNumber)
        setEditedContent(null)
        setHasChanges(false)
      }
    } else {
      setSelectedStepNumber(stepNumber)
      setEditedContent(null)
      setHasChanges(false)
    }
  }, [hasChanges])

  // Handle generate
  const handleGenerate = useCallback(() => {
    if (!displayedStep) return
    generateStep.mutate({
      analysisId,
      stepNumber: displayedStep.step_number,
    })
  }, [analysisId, displayedStep, generateStep])

  // Handle save
  const handleSave = useCallback(() => {
    if (!displayedStep || !editedContent) return
    saveEdit.mutate(
      {
        analysisId,
        stepNumber: displayedStep.step_number,
        content: editedContent,
        isViewingPreviousStep,
      },
      {
        onSuccess: () => {
          setHasChanges(false)
        },
      }
    )
  }, [analysisId, displayedStep, editedContent, isViewingPreviousStep, saveEdit])

  // Handle approve
  const handleApprove = useCallback(() => {
    if (!displayedStep) return
    // Save first if there are changes
    if (hasChanges && editedContent) {
      saveEdit.mutate(
        {
          analysisId,
          stepNumber: displayedStep.step_number,
          content: editedContent,
          isViewingPreviousStep,
        },
        {
          onSuccess: () => {
            approveStep.mutate(
              { analysisId, stepNumber: displayedStep.step_number },
              {
                onSuccess: (data) => {
                  setHasChanges(false)
                  setEditedContent(null)
                  if (data.is_complete && data.access_code) {
                    // Redirect to report when complete
                    router.push(`/report/${data.access_code}`)
                  } else {
                    // Move to next step
                    if (data.next_step) {
                      setSelectedStepNumber(data.next_step.step_number)
                    }
                  }
                },
              }
            )
          },
        }
      )
    } else {
      approveStep.mutate(
        { analysisId, stepNumber: displayedStep.step_number },
        {
          onSuccess: (data) => {
            setHasChanges(false)
            setEditedContent(null)
            if (data.is_complete && data.access_code) {
              router.push(`/report/${data.access_code}`)
            } else {
              // Move to next step
              if (data.next_step) {
                setSelectedStepNumber(data.next_step.step_number)
              }
            }
          },
        }
      )
    }
  }, [analysisId, displayedStep, hasChanges, editedContent, isViewingPreviousStep, saveEdit, approveStep, router])

  // Handle visibility toggle
  const handleVisibilityChange = useCallback((visible: boolean) => {
    if (!displayedStep) return
    toggleVisibility.mutate({
      analysisId,
      stepNumber: displayedStep.step_number,
      visible,
    })
  }, [analysisId, displayedStep, toggleVisibility])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Erro ao carregar análise</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  // No current step (shouldn't happen but handle gracefully)
  if (!displayedStep) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">Nenhuma etapa disponível</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  const hasContent = !!(displayedStep.ai_output || displayedStep.human_edited)
  const isGenerating = displayedStep.status === 'generating' || generateStep.isPending
  const isFailed = displayedStep.status === 'failed'

  const progressPercentage = currentStepNumber > 0 ? Math.round((currentStepNumber / 14) * 100) : 0

  return (
    <div className="container max-w-7xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-medium text-navy-900">Análise por Etapas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Etapa {currentStepNumber} de 14 ({progressPercentage}%)
            </p>
          </div>
        </div>
        <Link href={`/report/${analysisId}`} target="_blank">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Ver Relatório
          </Button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-line p-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gold-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Progress with Pills Navigation */}
      <StepProgress
        steps={allSteps || []}
        selectedStep={selectedStepNumber ?? currentStepNumber}
        currentStep={currentStepNumber}
        onSelect={handleStepSelect}
        disabled={isGenerating || saveEdit.isPending || approveStep.isPending}
      />

      {/* Warning Banner for Previous Steps */}
      {isViewingPreviousStep && displayedStep && (
        <EditWarningBanner
          stepNumber={displayedStep.step_number}
          frameworkName={frameworkMetaMap.get(displayedStep.framework_code)?.name || displayedStep.framework_code}
        />
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Context Cards */}
        <div className="space-y-6">
          {/* Challenge Context */}
          {state?.challenge_description && (
            <ChallengeContextCard
              description={state.challenge_description}
              category={state.challenge_category}
              type={state.challenge_type}
            />
          )}

          {/* Reflection Questions - based on displayed step */}
          {displayedStep && (() => {
            const meta = frameworkMetaMap.get(displayedStep.framework_code)
            if (!meta || !meta.reflection_questions?.length) return null
            return (
              <ReflectionQuestionsCard
                guidanceText={meta.guidance_text}
                questions={meta.reflection_questions}
              />
            )
          })()}

          {/* Previous Steps Accordion */}
          {previousSteps.length > 0 && (
            <div className="bg-white border border-line p-4">
              <h3 className="text-sm font-medium uppercase tracking-wide text-navy-900 mb-3">
                Etapas Anteriores
              </h3>
              <PreviousSteps steps={previousSteps} />
            </div>
          )}
        </div>

        {/* Right Column - Editor and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Editor with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={displayedStep.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StepEditor
                step={displayedStep}
                onContentChange={handleContentChange}
                disabled={isGenerating}
              />
            </motion.div>
          </AnimatePresence>

          {/* Visibility Toggle */}
          <div className="bg-white border border-line p-4">
            <StepVisibilityToggle
              visible={displayedStep.visible}
              onChange={handleVisibilityChange}
              disabled={toggleVisibility.isPending}
            />
          </div>

          {/* Actions */}
          <StepActions
            hasContent={hasContent}
            hasChanges={hasChanges}
            isViewingPreviousStep={isViewingPreviousStep}
            onRetry={handleGenerate}
            onSave={handleSave}
            onApprove={handleApprove}
            isSaving={saveEdit.isPending}
            isApproving={approveStep.isPending}
            isFailed={isFailed}
          />
        </div>
      </div>
    </div>
  )
}
