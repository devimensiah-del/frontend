'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { companyService, challengeService } from '@/lib/services'
import type { ChallengeCategory, ChallengeType, Challenge } from '@/lib/types'

export function useChallenges(companyId: string) {
  return useQuery({
    queryKey: ['challenges', companyId],
    queryFn: () => companyService.getChallenges(companyId),
    enabled: !!companyId,
    staleTime: 10 * 1000, // 10 seconds
    // Auto-poll every 5 seconds to catch status changes during processing
    refetchInterval: (query) => {
      const hasProcessing = query.state.data?.some(
        (ch) => ch.latest_analysis?.status === 'processing' || ch.latest_analysis?.status === 'pending'
      )
      return hasProcessing ? 5000 : false
    },
  })
}

export function useChallengeTypes() {
  return useQuery({
    queryKey: ['challenge-types'],
    queryFn: challengeService.getTypes,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  })
}

interface CreateChallengeInput {
  companyId: string
  category: ChallengeCategory
  type: ChallengeType
  businessChallenge: string
}

export function useCreateChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateChallengeInput) =>
      challengeService.create({
        company_id: data.companyId,
        challenge_category: data.category,
        challenge_type: data.type,
        business_challenge: data.businessChallenge,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['challenges', variables.companyId] })
      toast.success('Desafio criado com sucesso')
    },
    onError: () => {
      toast.error('Falha ao criar desafio')
    },
  })
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Challenge> }) =>
      challengeService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges', data.company_id] })
      toast.success('Desafio atualizado')
    },
    onError: () => {
      toast.error('Erro ao atualizar desafio')
    },
  })
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: challengeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Desafio excluído')
    },
    onError: () => {
      toast.error('Erro ao excluir desafio')
    },
  })
}
