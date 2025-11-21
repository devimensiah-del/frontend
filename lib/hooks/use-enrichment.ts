/**
 * Hook for fetching and updating enrichment data
 * Includes approval/rejection actions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrichmentApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';
import type { Enrichment } from '@/types';

export interface UseEnrichmentOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useEnrichment(submissionId: string, options?: UseEnrichmentOptions) {
  const queryClient = useQueryClient();

  // Fetch enrichment data
  const {
    data: enrichment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['enrichment', submissionId],
    queryFn: () => enrichmentApi.getBySubmissionId(submissionId),
    enabled: options?.enabled !== false && !!submissionId,
    refetchInterval: options?.refetchInterval,
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Update enrichment
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Enrichment>) =>
      enrichmentApi.update(submissionId, data),
    onSuccess: (updatedEnrichment) => {
      // Update cache
      queryClient.setQueryData(['enrichment', submissionId], updatedEnrichment);
      // Invalidate submission
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  // Approve enrichment
  const approveMutation = useMutation({
    mutationFn: () => enrichmentApi.approve(submissionId),
    onSuccess: (updatedEnrichment) => {
      // Update cache
      queryClient.setQueryData(['enrichment', submissionId], updatedEnrichment);
      // Invalidate submission
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  // Reject enrichment
  const rejectMutation = useMutation({
    mutationFn: (reason: string) => enrichmentApi.reject(submissionId, reason),
    onSuccess: (updatedEnrichment) => {
      // Update cache
      queryClient.setQueryData(['enrichment', submissionId], updatedEnrichment);
      // Invalidate submission
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  return {
    enrichment,
    isLoading,
    error: error as ApiError | null,
    refetch,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiError | null,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    approveError: approveMutation.error as ApiError | null,
    reject: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
    rejectError: rejectMutation.error as ApiError | null,
  };
}
