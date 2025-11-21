/**
 * Hook for fetching single submission
 * Includes loading, error states, and caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';
import type { Submission } from '@/types';

export interface UseSubmissionOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useSubmission(id: string, options?: UseSubmissionOptions) {
  const queryClient = useQueryClient();

  // Fetch submission
  const {
    data: submission,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => submissionsApi.getById(id),
    enabled: options?.enabled !== false && !!id,
    refetchInterval: options?.refetchInterval,
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Update submission
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Submission>) => submissionsApi.update(id, data),
    onSuccess: (updatedSubmission) => {
      // Update cache
      queryClient.setQueryData(['submission', id], updatedSubmission);
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  // Delete submission
  const deleteMutation = useMutation({
    mutationFn: () => submissionsApi.delete(id),
    onSuccess: () => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['submission', id] });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  return {
    submission,
    isLoading,
    error: error as ApiError | null,
    refetch,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiError | null,
    delete: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error as ApiError | null,
  };
}
