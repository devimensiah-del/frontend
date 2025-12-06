/**
 * Status utility functions - NEW ARCHITECTURE
 * Submission status is always 'received'
 * Workflow tracked via Enrichment and Analysis statuses
 */

import type { EnrichmentStatus, AnalysisStatus } from '@/types';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gold';

// ============================================================================
// SUBMISSION STATUS (Always 'received')
// ============================================================================

/**
 * Get badge variant for submission status (always received)
 */
export function getSubmissionStatusVariant(): BadgeVariant {
  return 'success'; // Received is a positive state
}

/**
 * Get human-readable label for submission status
 */
export function getSubmissionStatusLabel(): string {
  return 'Recebido';
}

/**
 * Get status description for submission
 */
export function getSubmissionStatusDescription(): string {
  return 'Sua solicitação foi recebida e está sendo processada.';
}

// ============================================================================
// ENRICHMENT STATUS
// ============================================================================

/**
 * Get badge variant for enrichment status
 */
export function getEnrichmentStatusVariant(status: EnrichmentStatus): BadgeVariant {
  switch (status) {
    case 'pending':
      return 'warning'; // Yellow - waiting
    case 'processing':
      return 'primary'; // Blue - in progress
    case 'completed':
      return 'success'; // Green - done
    case 'failed':
      return 'error'; // Red - error
    default:
      return 'default';
  }
}

/**
 * Get human-readable label for enrichment status
 */
export function getEnrichmentStatusLabel(status: EnrichmentStatus): string {
  const labels: Record<EnrichmentStatus, string> = {
    pending: 'Pendente',
    processing: 'Processando',
    completed: 'Concluído',
    failed: 'Falhou',
  };

  return labels[status] || status;
}

/**
 * Get enrichment status description
 */
export function getEnrichmentStatusDescription(status: EnrichmentStatus): string {
  switch (status) {
    case 'pending':
      return 'Aguardando início do enriquecimento de dados.';
    case 'processing':
      return 'Coletando e processando informações da empresa.';
    case 'completed':
      return 'Enriquecimento concluído com sucesso.';
    case 'failed':
      return 'Erro durante o enriquecimento.';
    default:
      return 'Status desconhecido.';
  }
}

// ============================================================================
// ANALYSIS STATUS
// ============================================================================

/**
 * Get badge variant for analysis status
 */
export function getAnalysisStatusVariant(status: AnalysisStatus): BadgeVariant {
  switch (status) {
    case 'pending':
      return 'warning'; // Yellow - waiting
    case 'completed':
      return 'gold'; // Gold - ready for approval
    case 'approved':
      return 'success'; // Green - approved, can send
    case 'sent':
      return 'success'; // Green - sent to user
    default:
      return 'default';
  }
}

/**
 * Get human-readable label for analysis status
 */
export function getAnalysisStatusLabel(status: AnalysisStatus): string {
  const labels: Partial<Record<AnalysisStatus, string>> = {
    pending: 'Pendente',
    completed: 'Aguardando Aprovação',
    approved: 'Aprovado',
    sent: 'Enviado ao Cliente',
  };

  return labels[status] || status;
}

/**
 * Get analysis status description
 */
export function getAnalysisStatusDescription(status: AnalysisStatus): string {
  switch (status) {
    case 'pending':
      return 'Aguardando início da análise estratégica.';
    case 'completed':
      return 'Análise concluída. Aguardando aprovação administrativa para envio.';
    case 'approved':
      return 'Análise aprovada. Pronta para ser enviada ao cliente.';
    case 'sent':
      return 'Relatório enviado ao cliente com sucesso.';
    default:
      return 'Status desconhecido.';
  }
}

// ============================================================================
// WORKFLOW HELPERS
// ============================================================================

/**
 * Check if enrichment can be approved
 */
export function canApproveEnrichment(status: EnrichmentStatus): boolean {
  return status === 'completed';
}

/**
 * Check if analysis can be generated (enrichment must be completed)
 */
export function canGenerateAnalysis(enrichmentStatus: EnrichmentStatus): boolean {
  return enrichmentStatus === 'completed';
}

/**
 * Check if analysis can be approved
 */
export function canApproveAnalysis(status: AnalysisStatus): boolean {
  return status === 'completed';
}

/**
 * Check if analysis can be sent (must be approved first)
 */
export function canSendAnalysis(status: AnalysisStatus): boolean {
  return status === 'approved';
}

/**
 * Check if report PDF can be generated
 */
export function canGeneratePDF(status: AnalysisStatus): boolean {
  // Can generate PDF when analysis is completed or approved
  return status === 'completed' || status === 'approved';
}
