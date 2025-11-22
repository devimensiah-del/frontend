/**
 * Hook for fetching and managing analysis data
 * Includes PDF generation and report sending
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';
import type { Analysis } from '@/types';

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

  // Generate analysis
  const generateMutation = useMutation({
    mutationFn: () => analysisApi.generate(submissionId),
    onSuccess: (newAnalysis) => {
      // Update cache
      queryClient.setQueryData(['analysis', submissionId], newAnalysis);
      // Invalidate submission
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  // Update analysis
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Analysis>) =>
      analysisApi.update(submissionId, data),
    onSuccess: (updatedAnalysis) => {
      // Update cache
      queryClient.setQueryData(['analysis', submissionId], updatedAnalysis);
      // Invalidate submission
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  // Publish report and generate PDF
  const generatePDFMutation = useMutation({
    mutationFn: () => analysisApi.publishReport(submissionId),
    onSuccess: () => {
      // Invalidate submission to update report_id and pdf_url
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  // Send to user
  const sendToUserMutation = useMutation({
    mutationFn: () => analysisApi.send(submissionId),
    onSuccess: () => {
      // Invalidate submission to update status
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });

  return {
    analysis,
    isLoading,
    error: error as ApiError | null,
    refetch,
    generate: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    generateError: generateMutation.error as ApiError | null,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiError | null,
    generatePDF: generatePDFMutation.mutateAsync,
    isGeneratingPDF: generatePDFMutation.isPending,
    generatePDFError: generatePDFMutation.error as ApiError | null,
    sendToUser: sendToUserMutation.mutateAsync,
    isSending: sendToUserMutation.isPending,
    sendError: sendToUserMutation.error as ApiError | null,
  };
}
