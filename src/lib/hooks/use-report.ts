'use client'

import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/lib/services'

/**
 * Hook for fetching public reports via access code
 * @param code - Access code for the report
 * @param preview - Optional preview mode ('admin' for admin preview)
 */
export function usePublicReport(code: string, preview?: string) {
  return useQuery({
    queryKey: ['report', 'public', code, preview],
    queryFn: () => reportService.getPublicReport(code, preview),
    enabled: !!code,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (invalid code) or 401 (unauthorized)
      const status = (error as any)?.response?.status
      if (status === 404 || status === 401) return false
      return failureCount < 3
    },
  })
}

/**
 * Hook for fetching authenticated user's analysis report
 */
export function useAuthenticatedReport(submissionId: string) {
  return useQuery({
    queryKey: ['report', 'authenticated', submissionId],
    queryFn: () => reportService.getAuthenticatedReport(submissionId),
    enabled: !!submissionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on permission errors
      const status = (error as any)?.response?.status
      if (status === 403 || status === 404) return false
      return failureCount < 3
    },
  })
}
