/**
 * Hook to fetch workflow stage counts
 * NEW ARCHITECTURE: All submissions have status 'received'
 * Workflow tracking should be based on Enrichment/Analysis entities
 *
 * Note: This is a simplified version that counts total submissions.
 * For accurate stage counts, the backend should provide an endpoint
 * that aggregates enrichment and analysis statuses.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Submission } from '@/lib/types';

interface WorkflowCounts {
  stage1: number; // Total submissions (all are 'received')
  stage2: number; // Would need enrichment data to calculate
  stage3: number; // Would need analysis data to calculate
}

async function fetchWorkflowCounts(): Promise<WorkflowCounts> {
  try {
    const response = await apiClient.admin.getAllSubmissions();
    const submissions = response.data || [];

    // NEW ARCHITECTURE: All submissions are 'received'
    // Stage counts would need to be calculated based on Enrichment/Analysis
    // For now, just return total count in stage1
    const counts: WorkflowCounts = {
      stage1: submissions.length, // All submissions
      stage2: 0, // TODO: Query enrichment statuses
      stage3: 0, // TODO: Query analysis statuses
    };

    return counts;
  } catch (error) {
    console.error('Failed to fetch workflow counts:', error);
    return { stage1: 0, stage2: 0, stage3: 0 };
  }
}

export function useWorkflowCounts() {
  return useQuery({
    queryKey: ['workflow-counts'],
    queryFn: fetchWorkflowCounts,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
