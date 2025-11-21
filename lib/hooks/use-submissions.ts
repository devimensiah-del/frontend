/**
 * Hook for fetching submissions list
 * Supports pagination and filtering
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';
import type { Submission, SubmissionFormData } from '@/types';

export interface UseSubmissionsParams {
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface UseSubmissionsOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useSubmissions(
  params?: UseSubmissionsParams,
  options?: UseSubmissionsOptions
) {
  const queryClient = useQueryClient();

  // Fetch submissions list
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['submissions', params],
    queryFn: () => submissionsApi.getAll(params),
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Create submission
  const createMutation = useMutation({
    mutationFn: (data: SubmissionFormData) =>
      submissionsApi.create(data),
    onSuccess: (newSubmission) => {
      // Add to cache
      queryClient.setQueryData(['submission', newSubmission.id], newSubmission);
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  return {
    submissions: data?.submissions || [],
    total: data?.total || 0,
    isLoading,
    error: error as ApiError | null,
    refetch,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error as ApiError | null,
  };
}
