'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { frameworkService, frameworkV2Service } from '@/lib/services'
import type {
  FrameworkResultStatus,
  AcknowledgeStaleRequest,
  ExecuteFrameworkRequest,
} from '@/lib/types'

// ============================================================================
// Legacy Framework Hooks (analysisbysteps)
// ============================================================================

export function useFrameworks() {
  return useQuery({
    queryKey: ['frameworks'],
    queryFn: frameworkService.list,
    staleTime: 30 * 60 * 1000, // 30 minutes (frameworks rarely change)
  })
}

export function useFramework(code: string) {
  return useQuery({
    queryKey: ['framework', code],
    queryFn: () => frameworkService.getByCode(code),
    enabled: !!code,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useFrameworkOrder() {
  return useQuery({
    queryKey: ['frameworks', 'order'],
    queryFn: frameworkService.getOrder,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// ============================================================================
// Framework V2 Hooks (database-driven)
// ============================================================================

// Admin: List all frameworks
export function useFrameworksV2() {
  return useQuery({
    queryKey: ['frameworks-v2'],
    queryFn: frameworkV2Service.list,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Admin: Get framework by code
export function useFrameworkV2(code: string) {
  return useQuery({
    queryKey: ['framework-v2', code],
    queryFn: () => frameworkV2Service.getByCode(code),
    enabled: !!code,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Admin: Get execution plan
export function useExecutionPlan() {
  return useQuery({
    queryKey: ['execution-plan'],
    queryFn: frameworkV2Service.getExecutionPlan,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Company: Get framework results
export function useFrameworkResults(companyId: string, challengeId?: string) {
  return useQuery({
    queryKey: ['framework-results', companyId, challengeId],
    queryFn: () => frameworkV2Service.getCompanyResults(companyId, challengeId),
    enabled: !!companyId,
    // Poll every 5 seconds while any result is processing or pending
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.results?.some(r =>
        r.result.status === 'processing' || r.result.status === 'pending'
      )) {
        return 5000 // 5 seconds
      }
      return false
    },
    staleTime: 10 * 1000, // 10 seconds
  })
}

// Company: Get single result status (for polling)
export function useFrameworkResultStatus(companyId: string, resultId: string, enabled = true) {
  return useQuery({
    queryKey: ['framework-result', companyId, resultId],
    queryFn: () => frameworkV2Service.getResultStatus(companyId, resultId),
    enabled: !!companyId && !!resultId && enabled,
    // Poll every 3 seconds while processing
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.result?.status === 'processing' || data?.result?.status === 'pending') {
        return 3000 // 3 seconds
      }
      return false
    },
    staleTime: 5 * 1000, // 5 seconds
  })
}

// Company: Run framework
export function useRunFramework() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ companyId, frameworkCode, challengeId }: {
      companyId: string
      frameworkCode: string
      challengeId?: string
    }) => frameworkV2Service.runFramework(companyId, frameworkCode, challengeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['framework-results', variables.companyId] })
      toast.success(`Framework ${data.framework} iniciado`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao executar framework'
      toast.error(message)
    },
  })
}

// Company: Update framework result (user editing)
export function useUpdateFrameworkResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ companyId, resultId, result }: {
      companyId: string
      resultId: string
      result: Record<string, unknown>
    }) => frameworkV2Service.updateResult(companyId, resultId, result),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['framework-results', variables.companyId] })
      queryClient.invalidateQueries({ queryKey: ['framework-result', variables.companyId, variables.resultId] })
      toast.success('Resultado atualizado')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar resultado'
      toast.error(message)
    },
  })
}

// Admin: Update framework configuration
export function useUpdateFramework() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      frameworkV2Service.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['frameworks-v2'] })
      queryClient.invalidateQueries({ queryKey: ['framework-v2', data.code] })
      queryClient.invalidateQueries({ queryKey: ['execution-plan'] })
      toast.success('Framework atualizado')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar framework'
      toast.error(message)
    },
  })
}

// ============================================================================
// 5-Step Analysis Hooks (Dependency Chain with Stale Tracking)
// ============================================================================

/**
 * Get analysis state for a company (5-step progress with stale indicators)
 */
export function useAnalysisState(companyId: string, challengeId?: string) {
  return useQuery({
    queryKey: ['analysis-state', companyId, challengeId],
    queryFn: () => frameworkV2Service.getAnalysisState(companyId, challengeId),
    enabled: !!companyId,
    // Poll every 5 seconds while any framework is processing
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.steps?.some(step =>
        step.frameworks?.some(fw =>
          fw.status === 'processing' || fw.status === 'pending'
        )
      )) {
        return 5000 // 5 seconds
      }
      return false
    },
    staleTime: 10 * 1000, // 10 seconds
  })
}

/**
 * Get stale frameworks for a company
 */
export function useStaleFrameworks(companyId: string, challengeId?: string) {
  return useQuery({
    queryKey: ['stale-frameworks', companyId, challengeId],
    queryFn: () => frameworkV2Service.getStaleFrameworks(companyId, challengeId),
    enabled: !!companyId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Acknowledge stale frameworks (dismiss or rerun)
 */
export function useAcknowledgeStale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ companyId, request }: {
      companyId: string
      request: AcknowledgeStaleRequest
    }) => frameworkV2Service.acknowledgeStale(companyId, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['analysis-state', variables.companyId] })
      queryClient.invalidateQueries({ queryKey: ['stale-frameworks', variables.companyId] })
      queryClient.invalidateQueries({ queryKey: ['framework-results', variables.companyId] })
      if (data.rerun_started > 0) {
        toast.success(`${data.rerun_started} framework(s) em re-execução`)
      } else if (data.acknowledged > 0) {
        toast.success(`${data.acknowledged} alerta(s) reconhecido(s)`)
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao processar ação'
      toast.error(message)
    },
  })
}

/**
 * Check framework readiness (dependencies met, execution mode)
 */
export function useFrameworkReadiness(companyId: string, frameworkCode: string, challengeId?: string, enabled = true) {
  return useQuery({
    queryKey: ['framework-readiness', companyId, frameworkCode, challengeId],
    queryFn: () => frameworkV2Service.getFrameworkReadiness(companyId, frameworkCode, challengeId),
    enabled: !!companyId && !!frameworkCode && enabled,
    staleTime: 10 * 1000, // 10 seconds
  })
}

/**
 * Execute framework with dependency awareness
 */
export function useExecuteFramework() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ companyId, frameworkCode, request, challengeId }: {
      companyId: string
      frameworkCode: string
      request?: ExecuteFrameworkRequest
      challengeId?: string
    }) => frameworkV2Service.executeFramework(companyId, frameworkCode, request, challengeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['analysis-state', variables.companyId] })
      queryClient.invalidateQueries({ queryKey: ['framework-results', variables.companyId] })
      queryClient.invalidateQueries({ queryKey: ['stale-frameworks', variables.companyId] })
      const modeLabel = data.mode === 'initial' ? 'Gerando' : 'Atualizando'
      toast.success(`${modeLabel} ${data.framework}...`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao executar framework'
      toast.error(message)
    },
  })
}

/**
 * Get framework dependency chain (for visualization)
 */
export function useDependencyChain(frameworkCode: string, enabled = true) {
  return useQuery({
    queryKey: ['dependency-chain', frameworkCode],
    queryFn: () => frameworkV2Service.getDependencyChain(frameworkCode),
    enabled: !!frameworkCode && enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes (dependencies rarely change)
  })
}
