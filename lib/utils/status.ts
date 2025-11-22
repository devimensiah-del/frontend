/**
 * Status utility functions for submissions
 * NOW SYNCHRONIZED WITH GO BACKEND CONSTANTS
 */

export type SubmissionStatus = 
  | 'pending' 
  | 'processing' 
  | 'enriching' 
  | 'enriched' 
  | 'analyzing' 
  | 'analyzed' 
  | 'ready_for_review' 
  | 'completed' 
  | 'failed'
  | 'enrichment_failed'
  | 'analysis_failed';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gold';

/**
 * Get badge variant for submission status
 */
export function getStatusVariant(status: string): BadgeVariant {
  // Normalize to ensure matching
  const s = status?.toLowerCase() || 'pending';

  switch (s) {
    case 'completed':
      return 'success'; // Green
      
    // Active Working States -> Blue/Indigo
    case 'enriching':
    case 'enriched':
    case 'analyzing':
    case 'analyzed':
    case 'ready_for_review':
    case 'processing':
      return 'primary'; 
      
    case 'pending':
      return 'warning'; // Yellow
      
    // Error States -> Red
    case 'failed':
    case 'enrichment_failed':
    case 'analysis_failed':
    case 'report_failed':
      return 'error';
      
    default:
      return 'default';
  }
}

/**
 * Get human-readable label for submission status
 */
export function getStatusLabel(status: string): string {
  const s = status?.toLowerCase() || 'pending';

  const map: Record<string, string> = {
    pending: 'Pendente',
    
    // Enrichment Phase
    enriching: 'Enriquecendo Dados',
    enriched: 'Enriquecimento Concluído',
    
    // Analysis Phase
    analyzing: 'IA Analisando',
    analyzed: 'Análise Pronta',
    ready_for_review: 'Aguardando Revisão',
    
    // Final
    completed: 'Relatório Disponível',
    
    // Errors
    failed: 'Falhou',
    enrichment_failed: 'Falha no Enriquecimento',
    analysis_failed: 'Falha na Análise',
    report_failed: 'Falha no Relatório'
  };

  return map[s] || status;
}

/**
 * Get status description for user UI
 */
export function getStatusDescription(status: string): string {
  const s = status?.toLowerCase() || 'pending';

  switch (s) {
    case 'completed':
      return 'Sua análise foi concluída. O relatório PDF está disponível para download.';
    case 'ready_for_review':
      return 'A análise foi gerada e está passando pela revisão final de qualidade.';
    case 'analyzing':
    case 'analyzed':
      return 'Nossos algoritmos estão aplicando os frameworks estratégicos (SWOT, PESTEL, Porter).';
    case 'enriching':
    case 'enriched':
      return 'Estamos coletando e validando dados públicos sobre sua empresa.';
    case 'pending':
      return 'Sua solicitação foi recebida e está na fila de processamento.';
    case 'failed':
    case 'enrichment_failed':
    case 'analysis_failed':
      return 'Identificamos um problema técnico. Nossa equipe foi notificada.';
    default:
      return 'Status desconhecido.';
  }
}

/**
 * Check if enrichment data implies completion
 */
export function hasEnrichmentData(status: string): boolean {
  const s = status?.toLowerCase();
  return ['enriched', 'analyzing', 'analyzed', 'ready_for_review', 'completed'].includes(s || '');
}

/**
 * Check if analysis is fully done
 */
export function hasAnalysisData(status: string): boolean {
  const s = status?.toLowerCase();
  return ['completed', 'ready_for_review'].includes(s || '');
}