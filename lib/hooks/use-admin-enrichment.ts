/**
 * Admin hook for enrichment management
 * Uses enrichment ID directly for admin operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';
import type { Enrichment } from '@/types';

export function useAdminEnrichment() {
  const queryClient = useQueryClient();

  // Update enrichment fields (status remains unchanged)
  const updateMutation = useMutation({
    mutationFn: ({ enrichmentId, data }: { enrichmentId: string; data: Record<string, any> }) =>
      adminApi.updateEnrichment(enrichmentId, data),
    onSuccess: (updatedEnrichment, variables) => {
      // Update cache - we need to find which submission this enrichment belongs to
      // For now, invalidate all enrichment queries
      queryClient.invalidateQueries({ queryKey: ['enrichment'] });
    },
  });

  // Approve enrichment (changes status to 'approved' and triggers analysis)
  const approveMutation = useMutation({
    mutationFn: (enrichmentId: string) =>
      adminApi.approveEnrichment(enrichmentId),
    onSuccess: (response) => {
      // Invalidate all enrichment and analysis queries since new analysis was created
      queryClient.invalidateQueries({ queryKey: ['enrichment'] });
      queryClient.invalidateQueries({ queryKey: ['analysis'] });
      queryClient.invalidateQueries({ queryKey: ['submission'] });
    },
  });

  return {
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiError | null,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    approveError: approveMutation.error as ApiError | null,
  };
}
