/**
 * Workflow Utility - NEW ARCHITECTURE
 *
 * Workflow based on Enrichment and Analysis statuses:
 * - Submission: Always 'received'
 * * - Enrichment: pending -> finished -> approved
 * - Analysis: pending -> completed -> approved -> sent
 */

import type { Enrichment, Analysis } from "@/types";

export type WorkflowStage = 'submission' | 'enrichment' | 'analysis' | 'complete';

/**
 * Convert workflow stage name to numeric index (1-based)
 */
export function getStageNumber(stage: WorkflowStage): number {
  const stageMap: Record<WorkflowStage, number> = {
    submission: 1,
    enrichment: 2,
    analysis: 3,
    complete: 4,
  };
  return stageMap[stage];
}

export interface WorkflowAction {
  label: string;
  description: string;
  route?: string;
  action?: string; // API action identifier
  enabled: boolean;
  disabledReason?: string;
}

/**
 * Get current workflow stage based on enrichment and analysis statuses
 */
export function getWorkflowStage(
  enrichment?: Enrichment | null,
  analysis?: Analysis | null
): WorkflowStage {
  // Stage 4: Complete (analysis sent)
  if (analysis?.status === 'sent') {
    return 'complete';
  }

  // Stage 3: Analysis (enrichment approved, analysis in progress)
  if (
    enrichment?.status === 'approved' &&
    (analysis?.status === 'pending' ||
     analysis?.status === 'completed' ||
     analysis?.status === 'approved')
  ) {
    return 'analysis';
  }

  // Stage 2: Enrichment (has enrichment data)
  if (enrichment) {
    return 'enrichment';
  }

  // Stage 1: Submission received
  return 'submission';
}

/**
 * Get enrichment workflow actions based on current status
 */
export function getEnrichmentActions(enrichment: Enrichment | null): {
  canEdit: boolean;
  canApprove: boolean;
  canGenerateAnalysis: boolean;
  message?: string;
} {
  if (!enrichment) {
    return {
      canEdit: false,
      canApprove: false,
      canGenerateAnalysis: false,
      message: 'Enriquecimento não encontrado',
    };
  }

  const status = enrichment.status;

  switch (status) {
    case 'pending':
      return {
        canEdit: true,
        canApprove: false,
        canGenerateAnalysis: false,
        message: 'Aguardando worker processar',
      };

    case 'finished':
      return {
        canEdit: true,
        canApprove: true,
        canGenerateAnalysis: false,
        message: 'Pronto para revisão e aprovação',
      };

    case 'approved':
      return {
        canEdit: false,
        canApprove: false,
        canGenerateAnalysis: true,
        message: 'Aprovado - Análise será gerada automaticamente',
      };

    default:
      return {
        canEdit: false,
        canApprove: false,
        canGenerateAnalysis: false,
      };
  }
}

/**
 * Get analysis workflow actions based on current status
 */
export function getAnalysisActions(analysis: Analysis | null): {
  canEdit: boolean;
  canApprove: boolean;
  canGeneratePDF: boolean;
  canSend: boolean;
  message?: string;
} {
  if (!analysis) {
    return {
      canEdit: false,
      canApprove: false,
      canGeneratePDF: false,
      canSend: false,
      message: 'Análise não encontrada',
    };
  }

  const status = analysis.status;

  switch (status) {
    case 'pending':
      return {
        canEdit: false,
        canApprove: false,
        canGeneratePDF: false,
        canSend: false,
        message: 'Aguardando worker processar',
      };

    case 'completed':
      return {
        canEdit: true,
        canApprove: true,
        canGeneratePDF: true,
        canSend: false,
        message: 'Pronto para aprovação e envio',
      };

    case 'approved':
      return {
        canEdit: true, // Can still edit and create new version
        canApprove: false,
        canGeneratePDF: true,
        canSend: true,
        message: 'Aprovado - Pronto para enviar',
      };

    case 'sent':
      return {
        canEdit: false,
        canApprove: false,
        canGeneratePDF: true, // Can regenerate PDF
        canSend: false,
        message: 'Enviado ao cliente',
      };

    default:
      return {
        canEdit: false,
        canApprove: false,
        canGeneratePDF: false,
        canSend: false,
      };
  }
}

/**
 * Get next workflow action based on current state
 */
export function getNextAction(
  enrichment?: Enrichment | null,
  analysis?: Analysis | null
): WorkflowAction | null {
  const stage = getWorkflowStage(enrichment, analysis);

  // Complete - no next action
  if (stage === 'complete') {
    return {
      label: 'Concluído',
      description: 'Relatório enviado ao cliente',
      enabled: false,
    };
  }

  // Analysis stage
  if (stage === 'analysis') {
    const analysisActions = getAnalysisActions(analysis ?? null);

    if (analysisActions.canSend) {
      return {
        label: 'Enviar ao Cliente',
        description: 'Enviar relatório aprovado ao cliente',
        action: 'send_analysis',
        enabled: true,
      };
    }

    if (analysisActions.canApprove) {
      return {
        label: 'Aprovar Análise',
        description: 'Aprovar análise para envio',
        action: 'approve_analysis',
        enabled: true,
      };
    }

    return {
      label: 'Aguardando',
      description: analysisActions.message || 'Processando análise',
      enabled: false,
    };
  }

  // Enrichment stage
  if (stage === 'enrichment') {
    const enrichmentActions = getEnrichmentActions(enrichment ?? null);

    if (enrichmentActions.canGenerateAnalysis) {
      return {
        label: 'Gerar Análise',
        description: 'Iniciar análise estratégica',
        action: 'generate_analysis',
        enabled: true,
      };
    }

    if (enrichmentActions.canApprove) {
      return {
        label: 'Aprovar Enriquecimento',
        description: 'Aprovar dados enriquecidos',
        action: 'approve_enrichment',
        enabled: true,
      };
    }

    return {
      label: 'Aguardando',
      description: enrichmentActions.message || 'Processando enriquecimento',
      enabled: false,
    };
  }

  // Submission stage
  return {
    label: 'Iniciar Enriquecimento',
    description: 'Começar processo de enriquecimento de dados',
    action: 'start_enrichment',
    enabled: true,
  };
}

/**
 * Get workflow progress percentage (0-100)
 */
export function getWorkflowProgress(
  enrichment?: Enrichment | null,
  analysis?: Analysis | null
): number {
  const stage = getWorkflowStage(enrichment, analysis);

  // Complete
  if (stage === 'complete') {
    return 100;
  }

  // Analysis stage (60-95%)
  if (stage === 'analysis') {
    switch (analysis?.status) {
      case 'sent':
        return 100;
      case 'approved':
        return 95;
      case 'completed':
        return 85;
      case 'pending':
        return 65;
      default:
        return 70;
    }
  }

  // Enrichment stage (20-55%)
  if (stage === 'enrichment') {
    switch (enrichment?.status) {
      case 'approved':
        return 55;
      case 'finished':
        return 45;
      case 'pending':
        return 20;
      default:
        return 25;
    }
  }

  // Submission stage (0-15%)
  return 10;
}

/**
 * Get stage label for display
 */
export function getStageLabel(stage: WorkflowStage): string {
  const labels: Record<WorkflowStage, string> = {
    submission: 'Submissão Recebida',
    enrichment: 'Enriquecimento de Dados',
    analysis: 'Análise Estratégica',
    complete: 'Concluído',
  };

  return labels[stage];
}

/**
 * Get stage description
 */
export function getStageDescription(stage: WorkflowStage): string {
  const descriptions: Record<WorkflowStage, string> = {
    submission: 'Aguardando início do processo de enriquecimento',
    enrichment: 'Coletando e validando dados empresariais',
    analysis: 'Aplicando frameworks estratégicos',
    complete: 'Relatório enviado ao cliente',
  };

  return descriptions[stage];
}



