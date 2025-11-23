/**
 * Hook for fetching analysis data and PDF operations
 * Admin operations (update, approve, send, versioning) are in use-admin-analysis hook
 * Note: Analysis is automatically created after enrichment approval
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';

export interface UseAnalysisOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useAnalysis(submissionId: string, options?: UseAnalysisOptions) {
  const queryClient = useQueryClient();

  // Fetch analysis data
  const {
    data: analysis,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['analysis', submissionId],
    queryFn: async () => {
      try {
        return await analysisApi.getBySubmissionId(submissionId);
      } catch (err: any) {
        // Gracefully handle 404 - analysis doesn't exist yet
        if (err?.response?.status === 404 || err?.status === 404) {
          return null;
        }
        throw err;
      }
    },
    enabled: options?.enabled !== false && !!submissionId,
    refetchInterval: options?.refetchInterval,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 - analysis simply doesn't exist yet
      if (error?.response?.status === 404 || error?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // 30 seconds
  });

  // Publish report and generate PDF
  const publishReportMutation = useMutation({
    mutationFn: () => analysisApi.publishReport(submissionId),
    onSuccess: () => {
      // Invalidate submission to update report_id and pdf_url
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  // Download report PDF
  const downloadReportMutation = useMutation({
    mutationFn: () => analysisApi.downloadReport(submissionId),
  });

  return {
    analysis,
    isLoading,
    error: error as ApiError | null,
    refetch,
    publishReport: publishReportMutation.mutateAsync,
    isPublishing: publishReportMutation.isPending,
    publishError: publishReportMutation.error as ApiError | null,
    downloadReport: downloadReportMutation.mutateAsync,
    isDownloading: downloadReportMutation.isPending,
    downloadError: downloadReportMutation.error as ApiError | null,
  };
}
