'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { submissionService } from '@/lib/services'
import type { CreateSubmissionRequest } from '@/lib/types'

export function useSubmissions(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['submissions', page, pageSize],
    queryFn: () => submissionService.list(page, pageSize),
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: ['submission', id],
    queryFn: () => submissionService.getById(id),
    enabled: !!id,
    // Poll every 5 seconds while status is 'enriching' or 'analyzing'
    refetchInterval: (query) => {
      const submission = query.state.data
      if (!submission) return false

      // Derive workflow status
      const hasAnalysis = !!submission.analysisId
      const isAnalyzing = hasAnalysis && submission.analysisStatus === 'processing'
      const isEnriching = !hasAnalysis && submission.companyId

      if (isEnriching || isAnalyzing) {
        return 5000 // 5 seconds
      }
      return false // Stop polling when completed or failed
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useSubmissionAnalysis(id: string) {
  return useQuery({
    queryKey: ['submission', id, 'analysis'],
    queryFn: () => submissionService.getAnalysis(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry on 404 (analysis not yet created)
      if ((error as any)?.response?.status === 404) return false
      return failureCount < 3
    },
  })
}

export function useCreateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubmissionRequest) => submissionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      toast.success('Solicitação enviada com sucesso')
    },
    onError: () => {
      toast.error('Falha ao enviar solicitação')
    },
  })
}
