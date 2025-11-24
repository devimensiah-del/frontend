import type { Submission, Enrichment, Analysis } from '@/lib/types';
import type { WorkflowStage, TimelineEvent } from '@/components/workflow';

/**
 * Determine current workflow stage based on enrichment and analysis status
 */
export function getWorkflowStage(
  enrichment: Enrichment | null,
  analysis: Analysis | null
): string {
  if (!enrichment) return 'submission';
  if (enrichment.status === 'pending' || enrichment.status === 'completed') return 'enrichment';
  if (!analysis || analysis.status === 'pending' || analysis.status === 'completed') return 'analysis';
  return 'completed';
}

/**
 * Get workflow stages configuration
 */
export function getWorkflowStages(): WorkflowStage[] {
  return [
    {
      label: 'Envio',
      description: 'Dados recebidos',
    },
    {
      label: 'Pesquisa',
      description: 'Análise de mercado',
    },
    {
      label: 'Análise',
      description: 'Frameworks estratégicos',
    },
    {
      label: 'Concluído',
      description: 'Relatório pronto',
    },
  ];
}

/**
 * Build timeline events from submission, enrichment, and analysis
 */
export function getTimelineEvents(
  submission: Submission,
  enrichment: Enrichment | null,
  analysis: Analysis | null
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      type: 'success',
      title: 'Submissão Recebida',
      timestamp: submission.createdAt,
      description: 'Seus dados foram recebidos e validados',
    },
  ];

  if (enrichment) {
    if (enrichment.status === 'pending') {
      events.push({
        type: 'pending',
        title: 'Pesquisa Iniciada',
        timestamp: enrichment.createdAt,
        description: 'Coletando dados de mercado e contexto competitivo',
      });
    } else if (enrichment.status === 'completed' || enrichment.status === 'approved') {
      events.push({
        type: 'success',
        title: 'Pesquisa Concluída',
        timestamp: enrichment.updatedAt,
        description: 'Dados de mercado coletados e validados',
      });
    }
  }

  if (analysis) {
    if (analysis.status === 'pending') {
      events.push({
        type: 'pending',
        title: 'Análise Iniciada',
        timestamp: analysis.createdAt,
        description: 'Aplicando frameworks estratégicos',
      });
    } else if (analysis.status === 'completed' || analysis.status === 'approved') {
      events.push({
        type: 'success',
        title: 'Análise Concluída',
        timestamp: analysis.updatedAt,
        description: 'Frameworks aplicados, gerando relatório',
      });
    } else if (analysis.status === 'sent') {
      events.push({
        type: 'info',
        title: 'Relatório Enviado',
        timestamp: analysis.updatedAt,
        description: 'Seu relatório estratégico está disponível',
      });
    }
  }

  return events.reverse(); // Most recent first
}

/**
 * Get next action based on workflow state
 */
export function getNextAction(
  enrichment: Enrichment | null,
  analysis: Analysis | null
): {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  estimatedTime?: string;
  status: 'pending' | 'in_progress' | 'completed';
} {
  // No enrichment yet
  if (!enrichment) {
    return {
      title: 'Aguardando Pesquisa de Mercado',
      description:
        'Nossa equipe iniciará a pesquisa de mercado em breve. Você será notificado quando os dados estiverem disponíveis.',
      estimatedTime: '1-2 dias',
      status: 'pending',
    };
  }

  // Enrichment in progress
  if (enrichment.status === 'pending' || enrichment.status === 'completed') {
    return {
      title: 'Pesquisa em Andamento',
      description:
        'Estamos coletando dados de mercado, contexto competitivo e tendências da sua indústria.',
      estimatedTime: '1 dia',
      status: 'in_progress',
    };
  }

  // No analysis yet
  if (!analysis) {
    return {
      title: 'Aguardando Análise Estratégica',
      description:
        'A pesquisa foi concluída. Nossa equipe começará a aplicar os frameworks estratégicos em breve.',
      estimatedTime: '2-3 dias',
      status: 'pending',
    };
  }

  // Analysis in progress
  if (analysis.status === 'pending' || analysis.status === 'completed') {
    return {
      title: 'Análise em Andamento',
      description:
        'Aplicando 11 frameworks estratégicos (PESTEL, Porter, SWOT, TAM/SAM/SOM, OKRs e mais) aos seus dados.',
      estimatedTime: '1-2 dias',
      status: 'in_progress',
    };
  }

  // Analysis sent
  if (analysis.status === 'sent') {
    return {
      title: 'Relatório Disponível',
      description:
        'Seu relatório estratégico completo está pronto! Baixe o PDF para ver todas as análises e recomendações.',
      actionLabel: 'Ver Relatório',
      actionHref: '#analysis',
      status: 'completed',
    };
  }

  // Default fallback
  return {
    title: 'Processamento em Andamento',
    description: 'Seu pedido está sendo processado por nossa equipe.',
    status: 'in_progress',
  };
}

/**
 * Calculate enrichment completion percentage
 */
export function getEnrichmentCompletion(enrichment: Enrichment | null): number {
  if (!enrichment) return 0;
  if (enrichment.status === 'approved') return 100;
  if (enrichment.status === 'completed') return 90;
  return enrichment.progress || 0;
}

/**
 * Get data quality score from enrichment
 */
export function getDataQualityScore(enrichment: Enrichment | null): number | null {
  if (!enrichment?.data) return null;

  let score = 0;
  let maxScore = 0;

  // Check for key data sections
  const sections = [
    'profile_overview',
    'financials',
    'market_position',
    'strategic_assessment',
    'competitive_landscape',
    'macro_context',
  ];

  sections.forEach((section) => {
    maxScore += 20;
    if (enrichment.data[section]) {
      const sectionData = enrichment.data[section];
      const fields = Object.keys(sectionData).length;
      score += Math.min(fields * 4, 20); // Max 20 points per section
    }
  });

  return Math.round((score / maxScore) * 100);
}

/**
 * Get framework completion count
 */
export function getFrameworkCompletion(analysis: Analysis | null): {
  completed: number;
  total: number;
} {
  if (!analysis?.analysis) return { completed: 0, total: 11 };

  const frameworks = [
    'pestel',
    'porter',
    'swot',
    'tamSamSom',
    'benchmarking',
    'blueOcean',
    'growthHacking',
    'scenarios',
    'okrs',
    'bsc',
    'decisionMatrix',
  ];

  const completed = frameworks.filter(
    (fw) => analysis.analysis[fw as keyof typeof analysis.analysis]
  ).length;

  return { completed, total: 11 };
}
