'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { wizardService } from '@/lib/services'

export function useWizardState(analysisId: string) {
  return useQuery({
    queryKey: ['wizard', analysisId],
    queryFn: () => wizardService.getState(analysisId),
    enabled: !!analysisId,
    staleTime: 10 * 1000, // 10 seconds
    // Refetch while generating
    refetchInterval: (query) => {
      const state = query.state.data
      if (state?.step_status === 'generating') {
        return 3000 // 3 seconds while generating
      }
      return false
    },
  })
}

interface StartWizardInput {
  companyId: string
  challengeId: string
}

export function useStartWizard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ companyId, challengeId }: StartWizardInput) =>
      wizardService.start(companyId, challengeId),
    onSuccess: (data) => {
      // Invalidate challenges to refetch with new analysis
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Assistente iniciado')
    },
    onError: () => {
      toast.error('Falha ao iniciar assistente')
    },
  })
}

export function useGenerateStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      analysisId,
      humanContext,
      answers,
    }: {
      analysisId: string
      humanContext?: string
      answers?: Record<string, string>
    }) => wizardService.generate(analysisId, humanContext, answers),
    onSuccess: (data) => {
      queryClient.setQueryData(['wizard', data.analysis_id], data)
    },
    onError: () => {
      toast.error('Falha ao gerar analise')
    },
  })
}

export function useApproveStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (analysisId: string) => wizardService.approve(analysisId),
    onSuccess: (data) => {
      queryClient.setQueryData(['wizard', data.analysis_id], data)
      toast.success('Etapa aprovada')
    },
    onError: () => {
      toast.error('Falha ao aprovar etapa')
    },
  })
}

export function useRefineStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      analysisId,
      additionalContext,
      notes,
    }: {
      analysisId: string
      additionalContext: string
      notes?: string
    }) => wizardService.refine(analysisId, additionalContext, notes),
    onSuccess: (data) => {
      queryClient.setQueryData(['wizard', data.analysis_id], data)
    },
    onError: () => {
      toast.error('Falha ao refinar analise')
    },
  })
}

export function useWizardSummary(analysisId: string) {
  return useQuery({
    queryKey: ['wizard', analysisId, 'summary'],
    queryFn: () => wizardService.getSummary(analysisId),
    enabled: !!analysisId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
