'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { companyService } from '@/lib/services'
import type { CreateCompanyRequest, Company } from '@/lib/types'

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
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['company', id] })
      toast.success('Enriquecimento iniciado')
    },
    onError: () => {
      toast.error('Erro ao iniciar enriquecimento')
    },
  })
}
