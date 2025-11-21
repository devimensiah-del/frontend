/**
 * Hook to fetch workflow stage counts
 * Tracks number of submissions in each workflow stage
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { SubmissionStatus } from '@/types';

interface WorkflowCounts {
  stage1: number; // Envios (pending, submitted)
  stage2: number; // Enriquecimento (enriching, enriched)
  stage3: number; // Análise (analyzing, analyzed, generating_report)
}

// Map statuses to workflow stages
const STAGE_STATUS_MAP: Record<1 | 2 | 3, SubmissionStatus[]> = {
  1: ['pendente', 'aguardando_pagamento'],
  2: ['em_enriquecimento', 'enriquecimento_completo'],
  3: ['em_analise', 'analise_completa', 'em_geracao_relatorio'],
};

async function fetchWorkflowCounts(): Promise<WorkflowCounts> {
  try {
    const response = await apiClient.admin.getAllSubmissions();

    const submissions = response.data || [];

    // Count submissions by stage
    const counts: WorkflowCounts = {
      stage1: 0,
      stage2: 0,
      stage3: 0,
    };

    submissions.forEach((submission) => {
      if (STAGE_STATUS_MAP[1].includes(submission.status)) {
        counts.stage1++;
      } else if (STAGE_STATUS_MAP[2].includes(submission.status)) {
        counts.stage2++;
      } else if (STAGE_STATUS_MAP[3].includes(submission.status)) {
        counts.stage3++;
      }
    });

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
