/**
 * Admin hook for analysis management
 * Uses analysis ID directly for admin operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';
import type { Analysis } from '@/types';

export function useAdminAnalysis() {
  const queryClient = useQueryClient();

  // Update analysis fields (status remains unchanged)
  const updateMutation = useMutation({
    mutationFn: ({ analysisId, data }: { analysisId: string; data: Record<string, any> }) =>
      adminApi.updateAnalysis(analysisId, data),
    onSuccess: (updatedAnalysis) => {
      // Invalidate all analysis queries
      queryClient.invalidateQueries({ queryKey: ['analysis'] });
    },
  });

  // Create new version with optional edits
  const createVersionMutation = useMutation({
    mutationFn: ({ analysisId, edits }: { analysisId: string; edits?: Record<string, any> }) =>
      adminApi.createAnalysisVersion(analysisId, edits),
    onSuccess: (newVersion) => {
      // Invalidate all analysis queries to show new version
      queryClient.invalidateQueries({ queryKey: ['analysis'] });
      queryClient.invalidateQueries({ queryKey: ['submission'] });
    },
  });

  // Approve analysis (changes status to 'approved' and triggers PDF generation)
  const approveMutation = useMutation({
    mutationFn: (analysisId: string) =>
      adminApi.approveAnalysis(analysisId),
    onSuccess: (response) => {
      // Invalidate queries to refresh status
      queryClient.invalidateQueries({ queryKey: ['analysis'] });
      queryClient.invalidateQueries({ queryKey: ['submission'] });
    },
  });

  // Send analysis to user (changes status to 'sent')
  const sendMutation = useMutation({
    mutationFn: ({ analysisId, userEmail }: { analysisId: string; userEmail: string }) =>
      adminApi.sendAnalysis(analysisId, userEmail),
    onSuccess: (response) => {
      // Invalidate queries to refresh status
      queryClient.invalidateQueries({ queryKey: ['analysis'] });
      queryClient.invalidateQueries({ queryKey: ['submission'] });
    },
  });

  return {
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiError | null,
    createVersion: createVersionMutation.mutateAsync,
    isCreatingVersion: createVersionMutation.isPending,
    createVersionError: createVersionMutation.error as ApiError | null,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    approveError: approveMutation.error as ApiError | null,
    send: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    sendError: sendMutation.error as ApiError | null,
  };
}
