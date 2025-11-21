/**
 * Workflow Status Utility - Imensiah Admin Workflow
 *
 * Manages the 3-stage workflow:
 * Stage 1: /admin/dashboard - Submissions inbox
 * Stage 2: /admin/enriquecimento/[id] - Enrichment editor
 * Stage 3: /admin/submissions/[id] - War Room analysis
 */

import type { Submission, Enrichment, Analysis } from "@/types";

export type WorkflowStage = 1 | 2 | 3;

export interface WorkflowAction {
  label: string;
  description: string;
  route: string;
  enabled: boolean;
  disabledReason?: string;
}

/**
 * Get current workflow stage based on submission status
 */
export function getWorkflowStage(submission: Submission): WorkflowStage {
  const status = submission.status?.toLowerCase();

  // Stage 1: Initial submission
  if (status === "pending" || status === "submitted") {
    return 1;
  }

  // Stage 2: Enrichment phase
  if (
    status === "enriching" ||
    status === "enriched" ||
    status === "pending_approval"
  ) {
    return 2;
  }

  // Stage 3: Analysis phase
  if (
    status === "analyzing" ||
    status === "analyzed" ||
    status === "ready" ||
    status === "completed"
  ) {
    return 3;
  }

  // Default to stage 1
  return 1;
}

/**
 * Check if can start enrichment (move to Stage 2)
 */
export function canStartEnrichment(submission: Submission): {
  allowed: boolean;
  reason?: string;
} {
  const status = submission.status?.toLowerCase();

  if (status === "pending" || status === "submitted") {
    return { allowed: true };
  }

  if (status === "enriching" || status === "enriched") {
    return {
      allowed: false,
      reason: "Enriquecimento já iniciado",
    };
  }

  return {
    allowed: false,
    reason: "Status inválido para iniciar enriquecimento",
  };
}

/**
 * Check if can generate analysis (move to Stage 3)
 */
export function canGenerateAnalysis(enrichment: Enrichment | null): {
  allowed: boolean;
  reason?: string;
} {
  if (!enrichment) {
    return {
      allowed: false,
      reason: "Enriquecimento não encontrado",
    };
  }

  const status = enrichment.status?.toLowerCase();

  if (status === "approved") {
    return { allowed: true };
  }

  if (status === "pending") {
    return {
      allowed: false,
      reason: "Enriquecimento precisa ser aprovado primeiro",
    };
  }

  if (status === "rejected") {
    return {
      allowed: false,
      reason: "Enriquecimento foi rejeitado",
    };
  }

  return {
    allowed: false,
    reason: "Status de enriquecimento inválido",
  };
}

/**
 * Check if can send report to user (complete workflow)
 */
export function canSendReport(analysis: Analysis | null): {
  allowed: boolean;
  reason?: string;
} {
  if (!analysis) {
    return {
      allowed: false,
      reason: "Análise não encontrada",
    };
  }

  const status = analysis.status?.toLowerCase();

  if (status === "completed") {
    return { allowed: true };
  }

  if (status === "pending" || status === "failed") {
    return {
      allowed: false,
      reason: "Análise ainda não está completa",
    };
  }

  return {
    allowed: false,
    reason: "Status de análise inválido",
  };
}

/**
 * Get next stage action based on current submission state
 */
export function getNextStageAction(
  submission: Submission,
  enrichment?: Enrichment | null,
  analysis?: Analysis | null
): WorkflowAction | null {
  const currentStage = getWorkflowStage(submission);

  // Stage 1 → Stage 2: Start Enrichment
  if (currentStage === 1) {
    const { allowed, reason } = canStartEnrichment(submission);
    return {
      label: "Iniciar Enriquecimento",
      description: "Mover para edição de dados enriquecidos",
      route: `/admin/enriquecimento/${submission.id}`,
      enabled: allowed,
      disabledReason: reason,
    };
  }

  // Stage 2 → Stage 3: Generate Analysis
  if (currentStage === 2) {
    const { allowed, reason } = canGenerateAnalysis(enrichment || null);
    return {
      label: "Gerar Análise",
      description: "Criar análise estratégica completa",
      route: `/admin/submissions/${submission.id}`,
      enabled: allowed,
      disabledReason: reason,
    };
  }

  // Stage 3: Send Report (final action)
  if (currentStage === 3) {
    const { allowed, reason } = canSendReport(analysis || null);
    return {
      label: "Enviar Relatório",
      description: "Enviar análise completa ao cliente",
      route: "#", // No route, triggers email action
      enabled: allowed,
      disabledReason: reason,
    };
  }

  return null;
}

/**
 * Get stage label for display
 */
export function getStageLabel(stage: WorkflowStage): string {
  const labels: Record<WorkflowStage, string> = {
    1: "Submissão Recebida",
    2: "Enriquecimento",
    3: "Análise Estratégica",
  };

  return labels[stage];
}

/**
 * Get stage description
 */
export function getStageDescription(stage: WorkflowStage): string {
  const descriptions: Record<WorkflowStage, string> = {
    1: "Aguardando início do processo de enriquecimento",
    2: "Dados sendo enriquecidos e aprovados",
    3: "Análise estratégica em andamento",
  };

  return descriptions[stage];
}

/**
 * Get workflow progress percentage
 */
export function getWorkflowProgress(
  submission: Submission,
  enrichment?: Enrichment | null,
  analysis?: Analysis | null
): number {
  const stage = getWorkflowStage(submission);

  if (stage === 1) return 0;
  if (stage === 2) {
    if (enrichment?.status === "approved") return 60;
    return 30;
  }
  if (stage === 3) {
    if (submission.status === "completed") return 100;
    if (analysis?.status === "completed") return 90;
    return 75;
  }

  return 0;
}
