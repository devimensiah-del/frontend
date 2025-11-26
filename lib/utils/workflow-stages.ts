/**
 * Workflow Stage Utilities
 *
 * This module handles the mapping between entity statuses and workflow stages.
 * Admin sees 6 stages, user sees 3 stages.
 *
 * Stage Mapping (Admin 6 Stages):
 * | Stage | Label                    | enrichment.status | analysis.status | is_visible_to_user |
 * |-------|--------------------------|-------------------|-----------------|-------------------|
 * | 1     | Enriquecimento em Andamento | pending         | —               | —                 |
 * | 2     | Enriquecimento Concluído    | completed       | —               | —                 |
 * | 3     | Análise em Andamento        | approved        | pending         | false             |
 * | 4     | Análise Concluída           | approved        | completed       | false             |
 * | 5     | Análise Aprovada            | approved        | approved        | false             |
 * | 6     | Relatório Disponível        | approved        | approved        | true              |
 *
 * User 3 Stages (Derived):
 * | Stage | Label               | Condition                                        |
 * |-------|---------------------|--------------------------------------------------|
 * | 1     | Coletando Dados     | Admin stages 1-2                                 |
 * | 2     | Análise em Preparo  | Admin stages 3-4                                 |
 * | 3     | Relatório Pronto    | Admin stages 5-6 AND is_visible_to_user=true     |
 */

import type { EnrichmentStatus, AnalysisStatus } from '@/types';
import {
  Sparkles,
  Eye,
  BarChart3,
  FileCheck,
  Shield,
  Send,
  Database,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

// Admin workflow stages (6 stages)
export type AdminStage = 1 | 2 | 3 | 4 | 5 | 6;

// User workflow stages (3 stages)
export type UserStage = 1 | 2 | 3;

export interface AdminStageConfig {
  stage: AdminStage;
  label: string;
  description: string;
  icon: typeof Sparkles;
  color: string;
}

export interface UserStageConfig {
  stage: UserStage;
  label: string;
  description: string;
  icon: typeof Database;
  color: string;
}

// Admin stage configurations
export const ADMIN_STAGES: AdminStageConfig[] = [
  {
    stage: 1,
    label: 'Enriquecendo',
    description: 'Dados estão sendo coletados',
    icon: Sparkles,
    color: 'text-amber-500',
  },
  {
    stage: 2,
    label: 'Enriquecimento Pronto',
    description: 'Aguardando aprovação para análise',
    icon: Eye,
    color: 'text-blue-500',
  },
  {
    stage: 3,
    label: 'Analisando',
    description: '11 frameworks sendo aplicados',
    icon: BarChart3,
    color: 'text-purple-500',
  },
  {
    stage: 4,
    label: 'Análise Pronta',
    description: 'Aguardando aprovação final',
    icon: FileCheck,
    color: 'text-indigo-500',
  },
  {
    stage: 5,
    label: 'Aprovado',
    description: 'Admin pode ver relatório. Cliente aguardando.',
    icon: Shield,
    color: 'text-emerald-500',
  },
  {
    stage: 6,
    label: 'Liberado',
    description: 'Cliente pode visualizar (com blur premium)',
    icon: Send,
    color: 'text-green-500',
  },
];

// User stage configurations
export const USER_STAGES: UserStageConfig[] = [
  {
    stage: 1,
    label: 'Coletando Dados',
    description: 'Estamos reunindo informações sobre sua empresa',
    icon: Database,
    color: 'text-blue-500',
  },
  {
    stage: 2,
    label: 'Preparando Análise',
    description: 'Nossa equipe está trabalhando no seu relatório',
    icon: Loader2,
    color: 'text-purple-500',
  },
  {
    stage: 3,
    label: 'Pronto!',
    description: 'Seu relatório estratégico está disponível',
    icon: CheckCircle2,
    color: 'text-green-500',
  },
];

/**
 * Compute admin workflow stage from entity statuses
 *
 * @param enrichmentStatus - Status of the enrichment entity
 * @param analysisStatus - Status of the analysis entity (may be null if not created)
 * @param isVisibleToUser - Whether analysis is visible to user
 * @returns Admin stage number (1-6)
 */
export function computeAdminStage(
  enrichmentStatus: EnrichmentStatus | null | undefined,
  analysisStatus: AnalysisStatus | null | undefined,
  isVisibleToUser: boolean | null | undefined
): AdminStage {
  // Default to stage 1 if no enrichment
  if (!enrichmentStatus) {
    return 1;
  }

  // Stage 1: Enrichment pending
  if (enrichmentStatus === 'pending') {
    return 1;
  }

  // Stage 2: Enrichment completed, not yet approved
  if (enrichmentStatus === 'completed') {
    return 2;
  }

  // From here, enrichment is approved
  if (enrichmentStatus === 'approved') {
    // No analysis yet or analysis pending
    if (!analysisStatus || analysisStatus === 'pending') {
      return 3;
    }

    // Analysis completed
    if (analysisStatus === 'completed') {
      return 4;
    }

    // Analysis approved (or sent)
    if (analysisStatus === 'approved' || analysisStatus === 'sent') {
      // Check visibility
      if (isVisibleToUser) {
        return 6;
      }
      return 5;
    }
  }

  // Default fallback
  return 1;
}

/**
 * Compute user workflow stage from entity statuses
 *
 * @param enrichmentStatus - Status of the enrichment entity
 * @param analysisStatus - Status of the analysis entity
 * @param isVisibleToUser - Whether analysis is visible to user
 * @returns User stage number (1-3)
 */
export function computeUserStage(
  enrichmentStatus: EnrichmentStatus | null | undefined,
  analysisStatus: AnalysisStatus | null | undefined,
  isVisibleToUser: boolean | null | undefined
): UserStage {
  const adminStage = computeAdminStage(enrichmentStatus, analysisStatus, isVisibleToUser);

  // Stages 1-2 → User Stage 1 (Collecting Data)
  if (adminStage <= 2) {
    return 1;
  }

  // Stages 3-4 → User Stage 2 (Preparing Analysis)
  if (adminStage <= 4) {
    return 2;
  }

  // Stages 5-6 → User Stage 3 (Report Ready) - only if visible
  // If not visible yet, stay at stage 2
  if (adminStage >= 5 && isVisibleToUser) {
    return 3;
  }

  return 2;
}

/**
 * Get stage configuration for admin view
 */
export function getAdminStageConfig(stage: AdminStage): AdminStageConfig {
  return ADMIN_STAGES[stage - 1];
}

/**
 * Get stage configuration for user view
 */
export function getUserStageConfig(stage: UserStage): UserStageConfig {
  return USER_STAGES[stage - 1];
}

/**
 * Check if admin can move to a target stage from current stage
 * Returns an error message if the move is not allowed, or null if allowed
 */
export function canMoveToStage(
  currentStage: AdminStage,
  targetStage: AdminStage,
  enrichmentStatus: EnrichmentStatus | null | undefined,
  analysisStatus: AnalysisStatus | null | undefined
): string | null {
  // Can't move to same stage
  if (currentStage === targetStage) {
    return 'Já está neste estágio';
  }

  // Forward transitions have specific requirements
  if (targetStage > currentStage) {
    // 1 → 2: Requires enrichment to be completed (automatic, worker does this)
    if (targetStage === 2 && enrichmentStatus !== 'completed') {
      return 'O enriquecimento ainda está em processamento';
    }

    // 2 → 3: Requires enrichment approval (triggers analysis)
    // This is fine - admin approves enrichment

    // 3 → 4: Requires analysis to be completed (automatic, worker does this)
    if (targetStage === 4 && analysisStatus !== 'completed') {
      return 'A análise ainda está em processamento';
    }

    // 4 → 5: Requires analysis approval
    // This is fine - admin approves analysis

    // 5 → 6: Requires analysis to be approved
    if (targetStage === 6 && analysisStatus !== 'approved' && analysisStatus !== 'sent') {
      return 'A análise precisa ser aprovada antes de liberar';
    }
  }

  // All backward transitions are allowed (soft reset, preserves data)
  return null;
}

/**
 * Get the API action needed to transition between stages
 */
export interface StageTransition {
  action: 'approveEnrichment' | 'reopenEnrichment' | 'approveAnalysis' | 'reopenAnalysis' | 'toggleVisibility';
  params?: Record<string, any>;
  description: string;
}

export function getStageTransition(
  currentStage: AdminStage,
  targetStage: AdminStage
): StageTransition | null {
  // Forward transitions
  if (targetStage > currentStage) {
    switch (targetStage) {
      case 3: // 2 → 3: Approve enrichment
        return {
          action: 'approveEnrichment',
          description: 'Aprovar enriquecimento e iniciar análise',
        };
      case 5: // 4 → 5: Approve analysis
        return {
          action: 'approveAnalysis',
          description: 'Aprovar análise',
        };
      case 6: // 5 → 6: Make visible
        return {
          action: 'toggleVisibility',
          params: { visible: true },
          description: 'Liberar relatório para o cliente',
        };
      default:
        return null; // Stages 2, 4 are automatic (worker completes)
    }
  }

  // Backward transitions
  if (targetStage < currentStage) {
    switch (targetStage) {
      case 5: // 6 → 5: Hide from user
        return {
          action: 'toggleVisibility',
          params: { visible: false },
          description: 'Ocultar relatório do cliente',
        };
      case 4: // 5 → 4: Reopen analysis for editing
        return {
          action: 'reopenAnalysis',
          description: 'Reabrir análise para edição',
        };
      case 2: // 3,4,5,6 → 2: Reopen enrichment for editing
        return {
          action: 'reopenEnrichment',
          description: 'Reabrir enriquecimento para edição',
        };
      default:
        return null;
    }
  }

  return null;
}

/**
 * Get what content should be visible at each stage
 */
export interface StageContent {
  showEnrichment: boolean;
  enrichmentEditable: boolean;
  showAnalysis: boolean;
  analysisEditable: boolean;
  showReportButton: boolean;
}

export function getAdminStageContent(stage: AdminStage): StageContent {
  switch (stage) {
    case 1:
      return {
        showEnrichment: false,
        enrichmentEditable: false,
        showAnalysis: false,
        analysisEditable: false,
        showReportButton: false,
      };
    case 2:
      return {
        showEnrichment: true,
        enrichmentEditable: true,
        showAnalysis: false,
        analysisEditable: false,
        showReportButton: false,
      };
    case 3:
      return {
        showEnrichment: true,
        enrichmentEditable: false,
        showAnalysis: true, // Show loading state
        analysisEditable: false,
        showReportButton: false,
      };
    case 4:
      return {
        showEnrichment: true,
        enrichmentEditable: false,
        showAnalysis: true,
        analysisEditable: true,
        showReportButton: false,
      };
    case 5:
    case 6:
      return {
        showEnrichment: true,
        enrichmentEditable: false,
        showAnalysis: true,
        analysisEditable: false,
        showReportButton: stage === 6,
      };
    default:
      return {
        showEnrichment: false,
        enrichmentEditable: false,
        showAnalysis: false,
        analysisEditable: false,
        showReportButton: false,
      };
  }
}

export function getUserStageContent(stage: UserStage, isVisibleToUser: boolean): StageContent {
  switch (stage) {
    case 1:
      return {
        showEnrichment: false,
        enrichmentEditable: false,
        showAnalysis: false,
        analysisEditable: false,
        showReportButton: false,
      };
    case 2:
      return {
        showEnrichment: true,
        enrichmentEditable: false, // Read-only for users
        showAnalysis: false,
        analysisEditable: false,
        showReportButton: false,
      };
    case 3:
      return {
        showEnrichment: true,
        enrichmentEditable: false,
        showAnalysis: isVisibleToUser,
        analysisEditable: false,
        showReportButton: isVisibleToUser,
      };
    default:
      return {
        showEnrichment: false,
        enrichmentEditable: false,
        showAnalysis: false,
        analysisEditable: false,
        showReportButton: false,
      };
  }
}
