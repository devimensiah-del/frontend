/**
 * Admin hook for fetching enrichment by submission ID
 * Uses admin endpoint that doesn't require ownership check
 */

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';

export interface UseAdminEnrichmentQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useAdminEnrichmentQuery(submissionId: string, options?: UseAdminEnrichmentQueryOptions) {
  // Fetch enrichment data using admin endpoint
  const {
    data: enrichment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-enrichment', submissionId],
    queryFn: async () => {
      try {
        // Use admin endpoint that bypasses ownership check
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/admin/submissions/${submissionId}/enrichment`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error('Failed to fetch enrichment');
        }

        const data = await response.json();
        return data.enrichment;
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
