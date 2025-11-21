/**
 * Mock analysis data for development
 */

import type { AnalysisData } from '@/types';

export const mockAnalysis: AnalysisData[] = [
  {
    id: 'analysis-1',
    submissionId: 'submission-1',
    status: 'completed',
    summary: 'Cliente apresenta perfil financeiro saudável com bom histórico de crédito.',
    findings: [
      'Score de crédito acima da média (750 pontos)',
      'Renda mensal estável de R$ 8.500',
      'Sem pendências financeiras identificadas',
      'Histórico de pagamentos consistente',
      'Dados cadastrais verificados e atualizados',
    ],
    recommendations: [
      'Aprovado para linha de crédito até R$ 50.000',
      'Taxa de juros preferencial disponível',
      'Sugestão de produtos premium',
      'Cliente elegível para programa de fidelidade',
    ],
    riskLevel: 'low',
    confidenceScore: 0.92,
    generatedAt: '2024-01-19T14:30:00.000Z',
    sentToUserAt: '2024-01-20T09:15:00.000Z',
    createdAt: '2024-01-19T14:30:00.000Z',
    updatedAt: '2024-01-20T09:15:00.000Z',
  },
  {
    id: 'analysis-2',
    submissionId: 'submission-2',
    status: 'pending',
    summary: 'Análise em andamento. Aguardando validação de dados adicionais.',
    findings: [
      'Dados básicos verificados',
      'Análise de crédito em processamento',
    ],
    recommendations: [],
    riskLevel: 'medium',
    confidenceScore: 0.75,
    generatedAt: '2024-02-10T10:00:00.000Z',
    createdAt: '2024-02-10T10:00:00.000Z',
    updatedAt: '2024-02-10T10:00:00.000Z',
  },
];
