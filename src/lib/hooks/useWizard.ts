/**
 * Wizard React Query Hooks
 * Handles wizard state management and polling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as wizardApi from '@/lib/api/wizard'
import type { WizardState, WizardSummary } from '@/lib/types'

/**
 * Hook to start wizard
 */
export function useStartWizard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { company_id: string; challenge_id: string }) => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Not authenticated')
      return wizardApi.startWizard(params, token)
    },
    onSuccess: (data) => {
      // Cache the initial wizard state
      queryClient.setQueryData(['wizard', data.analysis_id], data)
    },
  })
}

/**
 * Hook to get wizard state (with polling support)
 */
export function useWizardState(analysisId: string | null | undefined, enablePolling = false) {
  return useQuery<WizardState>({
    queryKey: ['wizard', analysisId],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      if (!token || !analysisId) throw new Error('Missing token or analysisId')
      return wizardApi.getWizardState(analysisId, token)
    },
    enabled: !!analysisId,
    // Poll every 2 seconds when generating
    refetchInterval: (query) => {
      if (!enablePolling) return false
      const data = query.state.data
      return data?.step_status === 'generating' ? 2000 : false
    },
    refetchIntervalInBackground: false,
  })
}

/**
 * Hook to generate step
 */
export function useGenerateStep(analysisId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      human_context?: string
      human_answers?: Record<string, string>
    }) => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Not authenticated')
      return wizardApi.generateStep(analysisId, params, token)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['wizard', analysisId], data)
    },
  })
}

/**
 * Hook to approve step
 */
export function useApproveStep(analysisId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Not authenticated')
      return wizardApi.approveStep(analysisId, token)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['wizard', analysisId], data)
    },
  })
}

/**
 * Hook to refine step
 */
export function useRefineStep(analysisId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      human_context?: string
      human_answers?: Record<string, string>
    }) => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Not authenticated')
      return wizardApi.refineStep(analysisId, params, token)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['wizard', analysisId], data)
    },
  })
}

/**
 * Hook to get wizard summary
 */
export function useWizardSummary(analysisId: string | null | undefined) {
  return useQuery<WizardSummary>({
    queryKey: ['wizard-summary', analysisId],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      if (!token || !analysisId) throw new Error('Missing token or analysisId')
      return wizardApi.getWizardSummary(analysisId, token)
    },
    enabled: !!analysisId,
  })
}
