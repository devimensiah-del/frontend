'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { companyService } from '@/lib/services'
import type { CreateCompanyRequest, Company, CompanyEnrichmentStatus } from '@/lib/types'

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companyService.list,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getById(id),
    enabled: !!id,
    // Poll every 5 seconds while enrichment is processing
    refetchInterval: (query) => {
      const company = query.state.data
      if (company?.enrichment_status === 'processing') {
        return 5000 // 5 seconds
      }
      return false // Stop polling when completed or failed
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCompanyRequest) => companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] })
      toast.success('Empresa criada com sucesso')
    },
    onError: () => {
      toast.error('Falha ao criar empresa')
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companyService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['company', data.id] })
      toast.success('Empresa atualizada')
    },
    onError: () => {
      toast.error('Erro ao atualizar empresa')
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: companyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Empresa excluída')
    },
    onError: () => {
      toast.error('Erro ao excluir empresa')
    },
  })
}

export function useReEnrichCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: companyService.reEnrich,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['company', id] })
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['enrichment-status', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'company', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] })
      toast.success('Re-enriquecimento da Etapa 1 iniciado')
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        const message = error?.response?.data?.message || 'Limite de re-enriquecimento atingido. Tente novamente mais tarde.'
        toast.error(message)
      } else {
        toast.error('Erro ao iniciar enriquecimento')
      }
    },
  })
}

/**
 * Hook to retry Step 1 enrichment (re-run even if completed)
 */
export function useRetryStep1() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: companyService.retryStep1,
    onSuccess: (data, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['enrichment-status', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'company', companyId] })
      toast.success('Re-enriquecimento da Etapa 1 iniciado')
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        const message = error?.response?.data?.message || 'Limite de re-enriquecimento atingido. Tente novamente mais tarde.'
        toast.error(message)
      } else {
        const message = error?.response?.data?.message || 'Erro ao re-enriquecer Etapa 1'
        toast.error(message)
      }
    },
  })
}

// ============================================================================
// 3-Step Enrichment Hooks
// ============================================================================

/**
 * Hook to fetch enrichment status for all 3 steps
 * Polls every 5 seconds while any step is processing
 */
export function useEnrichmentStatus(companyId: string) {
  return useQuery({
    queryKey: ['enrichment-status', companyId],
    queryFn: () => companyService.getEnrichmentStatus(companyId),
    enabled: !!companyId,
    // Poll every 5 seconds while any step is processing
    refetchInterval: (query) => {
      const status = query.state.data as CompanyEnrichmentStatus | undefined
      if (
        status?.step1_status === 'processing' ||
        status?.step2_status === 'processing' ||
        status?.step3_status === 'processing'
      ) {
        return 5000 // 5 seconds
      }
      return false // Stop polling when all steps are done
    },
    staleTime: 10 * 1000, // 10 seconds
  })
}

/**
 * Hook to trigger Step 2 enrichment (business model)
 */
export function useTriggerStep2() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: companyService.triggerStep2,
    onSuccess: (data, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['enrichment-status', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'company', companyId] })
      toast.success('Etapa 2 (Modelo de Negócio) iniciada')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao iniciar Etapa 2'
      toast.error(message)
    },
  })
}

/**
 * Hook to trigger Step 3 enrichment (competitive intelligence)
 */
export function useTriggerStep3() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: companyService.triggerStep3,
    onSuccess: (data, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['enrichment-status', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'company', companyId] })
      toast.success('Etapa 3 (Inteligência Competitiva) iniciada')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao iniciar Etapa 3'
      toast.error(message)
    },
  })
}

/**
 * Hook to retry Step 2 enrichment (re-run even if completed)
 */
export function useRetryStep2() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: companyService.retryStep2,
    onSuccess: (data, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['enrichment-status', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'company', companyId] })
      toast.success('Re-enriquecimento da Etapa 2 iniciado')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao re-enriquecer Etapa 2'
      toast.error(message)
    },
  })
}

/**
 * Hook to retry Step 3 enrichment (re-run even if completed)
 */
export function useRetryStep3() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: companyService.retryStep3,
    onSuccess: (data, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['enrichment-status', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'company', companyId] })
      toast.success('Re-enriquecimento da Etapa 3 iniciado')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao re-enriquecer Etapa 3'
      toast.error(message)
    },
  })
}
