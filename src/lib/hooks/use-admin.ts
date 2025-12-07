'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/lib/services'
import type { ChallengeData, FrameworkResults } from '@/lib/types'

// ===== Analysis Hooks =====
export function useAdminAnalyses(params?: {
  page?: number
  pageSize?: number
  email?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['admin', 'analyses', params],
    queryFn: () => adminService.listAnalyses(params),
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useAdminAnalysis(id: string) {
  return useQuery({
    queryKey: ['admin', 'analysis', id],
    queryFn: () => adminService.getAnalysis(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useUpdateAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FrameworkResults> }) =>
      adminService.updateAnalysis(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analysis', variables.id] })
      toast.success('Análise atualizada')
    },
    onError: () => {
      toast.error('Falha ao atualizar análise')
    },
  })
}

export function useToggleVisibility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.toggleVisibility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analyses'] })
      toast.success('Visibilidade alterada')
    },
    onError: () => {
      toast.error('Falha ao alterar visibilidade')
    },
  })
}

export function useToggleBlur() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.toggleBlur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analyses'] })
      toast.success('Desfoque alterado')
    },
    onError: () => {
      toast.error('Falha ao alterar desfoque')
    },
  })
}

export function useTogglePublic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.togglePublic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analyses'] })
      toast.success('Acesso público alterado')
    },
    onError: () => {
      toast.error('Falha ao alterar acesso público')
    },
  })
}

export function useGenerateAccessCode() {
  return useMutation({
    mutationFn: (id: string) => adminService.generateAccessCode(id),
    onSuccess: (data) => {
      toast.success(`Código gerado: ${data.access_code}`)
    },
    onError: () => {
      toast.error('Falha ao gerar código de acesso')
    },
  })
}

export function useRetryAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (submissionId: string) => adminService.retryAnalysis(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analyses'] })
      toast.success('Análise reiniciada')
    },
    onError: () => {
      toast.error('Falha ao reiniciar análise')
    },
  })
}

export function useGenerateAll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (analysisId: string) => adminService.generateAllSteps(analysisId),
    onSuccess: (_, analysisId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analysis', analysisId] })
      toast.success('Geração iniciada. Acompanhe o progresso.')
    },
    onError: () => {
      toast.error('Erro ao iniciar geração')
    },
  })
}

export function useUpdateVisibility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, field, value }: { analysisId: string; field: 'is_public' | 'is_visible_to_user'; value: boolean }) =>
      adminService.updateVisibility(analysisId, { [field]: value }),
    onSuccess: (_, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analysis', analysisId] })
      toast.success('Visibilidade atualizada')
    },
    onError: () => {
      toast.error('Erro ao atualizar visibilidade')
    },
  })
}

export function useRetryEnrichment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => adminService.retryEnrichment(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'company', companyId] })
      toast.success('Enriquecimento reiniciado')
    },
    onError: () => {
      toast.error('Erro ao reiniciar enriquecimento')
    },
  })
}

// ===== Company Hooks =====
export function useAdminCompanies(limit?: number, offset?: number) {
  return useQuery({
    queryKey: ['admin', 'companies', limit, offset],
    queryFn: () => adminService.listCompanies(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminCompany(id: string) {
  return useQuery({
    queryKey: ['admin', 'company', id],
    queryFn: () => adminService.getCompany(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useReAnalyze() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ companyId, challenge }: { companyId: string; challenge: ChallengeData }) =>
      adminService.reAnalyze(companyId, challenge),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'analyses'] })
      toast.success('Re-análise iniciada')
    },
    onError: () => {
      toast.error('Falha ao iniciar re-análise')
    },
  })
}
