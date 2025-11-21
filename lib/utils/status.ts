/**
 * Status utility functions for submissions
 */

export type SubmissionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gold';

/**
 * Get badge variant for submission status
 */
export function getStatusVariant(status: SubmissionStatus): BadgeVariant {
  switch (status) {
    case 'completed':
      return 'success';
    case 'processing':
      return 'primary';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Get human-readable label for submission status
 */
export function getStatusLabel(status: SubmissionStatus): string {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'processing':
      return 'Processando';
    case 'pending':
      return 'Pendente';
    case 'failed':
      return 'Falhou';
    default:
      return status;
  }
}

/**
 * Get status description for user
 */
export function getStatusDescription(status: SubmissionStatus): string {
  switch (status) {
    case 'completed':
      return 'Sua análise foi concluída e está disponível para download.';
    case 'processing':
      return 'Sua análise está sendo processada por nossa equipe.';
    case 'pending':
      return 'Sua análise está na fila e será processada em breve.';
    case 'failed':
      return 'Ocorreu um erro ao processar sua análise. Entre em contato com o suporte.';
    default:
      return 'Status desconhecido.';
  }
}

/**
 * Check if enrichment data is available for status
 */
export function hasEnrichmentData(status: SubmissionStatus): boolean {
  return status !== 'pending' && status !== 'failed';
}

/**
 * Check if analysis data is available for status
 */
export function hasAnalysisData(status: SubmissionStatus): boolean {
  return status === 'completed';
}

/**
 * Get progress percentage for status
 */
export function getStatusProgress(status: SubmissionStatus): number {
  switch (status) {
    case 'completed':
      return 100;
    case 'processing':
      return 60;
    case 'pending':
      return 20;
    case 'failed':
      return 0;
    default:
      return 0;
  }
}
