'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { analysisByStepsService } from '@/lib/services/analysis-by-steps-service'

// Query key factory
const stepKeys = {
  all: ['analysis-steps'] as const,
  state: (analysisId: string) => [...stepKeys.all, 'state', analysisId] as const,
  steps: (analysisId: string) => [...stepKeys.all, 'list', analysisId] as const,
}

// Start a new step-by-step analysis
export function useStartAnalysisBySteps() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (challengeId: string) => analysisByStepsService.start(challengeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Análise por etapas iniciada')
    },
    onError: () => {
      toast.error('Erro ao iniciar análise por etapas')
    },
  })
}

// Generate AI output for current step
export function useGenerateStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber }: { analysisId: string; stepNumber: number }) =>
      analysisByStepsService.generateStep(analysisId, stepNumber),
    onSuccess: (_, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      toast.success('Conteúdo gerado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao gerar conteúdo')
    },
  })
}

// Save human edit
export function useSaveStepEdit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber, content, isViewingPreviousStep }: {
      analysisId: string
      stepNumber: number
      content: string
      isViewingPreviousStep?: boolean
    }) =>
      analysisByStepsService.saveEdit(analysisId, stepNumber, content),
    onSuccess: (_, { analysisId, isViewingPreviousStep }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      queryClient.invalidateQueries({ queryKey: stepKeys.steps(analysisId) })

      if (isViewingPreviousStep) {
        toast.success('Alterações salvas. Etapas posteriores não foram afetadas.')
      } else {
        toast.success('Alterações salvas')
      }
    },
    onError: () => {
      toast.error('Erro ao salvar alterações')
    },
  })
}

// Approve step and advance
export function useApproveStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber }: { analysisId: string; stepNumber: number }) =>
      analysisByStepsService.approveStep(analysisId, stepNumber),
    onSuccess: (data, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      queryClient.invalidateQueries({ queryKey: stepKeys.steps(analysisId) })
      if (data.is_complete) {
        toast.success('Análise concluída!')
        queryClient.invalidateQueries({ queryKey: ['challenges'] })
      } else {
        toast.success('Etapa aprovada')
      }
    },
    onError: () => {
      toast.error('Erro ao aprovar etapa')
    },
  })
}

// Get current step state (polls while generating)
export function useStepState(analysisId: string) {
  return useQuery({
    queryKey: stepKeys.state(analysisId),
    queryFn: () => analysisByStepsService.getState(analysisId),
    enabled: !!analysisId,
    refetchInterval: (query) => {
      // Poll every 3s while generating
      const status = query.state.data?.current_step_data?.status
      return status === 'generating' ? 3000 : false
    },
    staleTime: 10 * 1000, // 10 seconds
  })
}

// Get all steps
export function useAllSteps(analysisId: string) {
  return useQuery({
    queryKey: stepKeys.steps(analysisId),
    queryFn: () => analysisByStepsService.getSteps(analysisId),
    enabled: !!analysisId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Toggle step visibility
export function useToggleStepVisibility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber, visible }: { analysisId: string; stepNumber: number; visible: boolean }) =>
      analysisByStepsService.toggleVisibility(analysisId, stepNumber, visible),
    onSuccess: (_, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      toast.success('Visibilidade atualizada')
    },
    onError: () => {
      toast.error('Erro ao alterar visibilidade')
    },
  })
}
