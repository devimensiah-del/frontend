/**
 * Hook for fetching enrichment data
 * Admin operations (update, approve) are in use-admin-enrichment hook
 */

import { useQuery } from '@tanstack/react-query';
import { enrichmentApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';

export interface UseEnrichmentOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useEnrichment(submissionId: string, options?: UseEnrichmentOptions) {
  // Fetch enrichment data
  const {
    data: enrichment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['enrichment', submissionId],
    queryFn: async () => {
      try {
        return await enrichmentApi.getBySubmissionId(submissionId);
      } catch (err: any) {
        // Gracefully handle 404 - enrichment doesn't exist yet
        if (err?.response?.status === 404 || err?.status === 404 || err?.message === 'Not found') {
          return null;
        }
        throw err;
      }
    },
    enabled: options?.enabled !== false && !!submissionId,
    refetchInterval: options?.refetchInterval,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 - enrichment simply doesn't exist yet
      if (error?.response?.status === 404 || error?.status === 404 || error?.message === 'Not found') {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // 30 seconds
  });

  return {
    enrichment,
    isLoading,
    error: error as ApiError | null,
    refetch,
  };
}
