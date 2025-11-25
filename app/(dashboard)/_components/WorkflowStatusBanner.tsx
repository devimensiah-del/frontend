"use client";

import React from 'react';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Send,
  Eye,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { EnrichmentStatus, AnalysisStatus } from '@/lib/types';

interface WorkflowStatusBannerProps {
  enrichmentStatus?: EnrichmentStatus;
  analysisStatus?: AnalysisStatus;
  pdfReady?: boolean;
  isAdmin: boolean;
}

type WorkflowStage =
  | 'enrichment_pending'
  | 'enrichment_completed'
  | 'analysis_pending'
  | 'analysis_completed'
  | 'pdf_generating'
  | 'pdf_ready'
  | 'sent';

interface StageConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'blue' | 'amber' | 'green' | 'purple';
  animate?: boolean;
}

function getWorkflowStage(
  enrichmentStatus?: EnrichmentStatus,
  analysisStatus?: AnalysisStatus,
  pdfReady?: boolean
): WorkflowStage {
  // Analysis sent = final state
  if (analysisStatus === 'sent') return 'sent';

  // Analysis approved + PDF ready = ready to send
  if (analysisStatus === 'approved' && pdfReady) return 'pdf_ready';

  // Analysis approved but no PDF = generating
  if (analysisStatus === 'approved') return 'pdf_generating';

  // Analysis completed = needs admin approval
  if (analysisStatus === 'completed') return 'analysis_completed';

  // Analysis pending = being generated
  if (analysisStatus === 'pending') return 'analysis_pending';

  // Enrichment approved but no analysis = analysis about to start
  if (enrichmentStatus === 'approved') return 'analysis_pending';

  // Enrichment completed = needs admin approval
  if (enrichmentStatus === 'completed') return 'enrichment_completed';

  // Default = enrichment pending
  return 'enrichment_pending';
}

function getAdminConfig(stage: WorkflowStage): StageConfig {
  const configs: Record<WorkflowStage, StageConfig> = {
    enrichment_pending: {
      icon: Sparkles,
      title: 'Enriquecimento em andamento',
      description: 'A IA está coletando e analisando informações sobre a empresa. Aguarde a conclusão.',
      color: 'blue',
      animate: true
    },
    enrichment_completed: {
      icon: Eye,
      title: 'Aguardando aprovação do enriquecimento',
      description: 'Revise os dados enriquecidos e aprove para iniciar a análise estratégica.',
      color: 'amber'
    },
    analysis_pending: {
      icon: BarChart3,
      title: 'Análise estratégica em andamento',
      description: 'Aplicando frameworks estratégicos (SWOT, PESTEL, Porter, etc.). Aguarde a conclusão.',
      color: 'blue',
      animate: true
    },
    analysis_completed: {
      icon: Eye,
      title: 'Aguardando aprovação da análise',
      description: 'Revise a análise estratégica e aprove para gerar o relatório PDF.',
      color: 'amber'
    },
    pdf_generating: {
      icon: FileText,
      title: 'Gerando relatório PDF',
      description: 'O PDF está sendo gerado. Aguarde alguns instantes.',
      color: 'blue',
      animate: true
    },
    pdf_ready: {
      icon: Send,
      title: 'Pronto para enviar',
      description: 'O relatório PDF foi gerado. Libere para o cliente visualizar.',
      color: 'green'
    },
    sent: {
      icon: CheckCircle,
      title: 'Relatório entregue',
      description: 'O cliente já pode acessar e baixar o relatório.',
      color: 'green'
    }
  };
  return configs[stage];
}

function getUserConfig(stage: WorkflowStage): StageConfig {
  const configs: Record<WorkflowStage, StageConfig> = {
    enrichment_pending: {
      icon: Sparkles,
      title: 'Coletando informações',
      description: 'Estamos reunindo dados sobre sua empresa para criar uma análise personalizada.',
      color: 'blue',
      animate: true
    },
    enrichment_completed: {
      icon: Clock,
      title: 'Em preparação',
      description: 'Seus dados estão sendo revisados. Em breve iniciaremos a análise.',
      color: 'blue',
      animate: true
    },
    analysis_pending: {
      icon: BarChart3,
      title: 'Análise em andamento',
      description: 'Estamos aplicando frameworks estratégicos para gerar insights valiosos.',
      color: 'blue',
      animate: true
    },
    analysis_completed: {
      icon: Clock,
      title: 'Finalizando relatório',
      description: 'Sua análise está sendo finalizada. Você será notificado quando estiver pronta.',
      color: 'blue',
      animate: true
    },
    pdf_generating: {
      icon: FileText,
      title: 'Preparando seu relatório',
      description: 'Estamos gerando seu relatório em PDF. Falta pouco!',
      color: 'blue',
      animate: true
    },
    pdf_ready: {
      icon: Clock,
      title: 'Quase lá',
      description: 'Seu relatório está sendo revisado e será liberado em breve.',
      color: 'purple',
      animate: true
    },
    sent: {
      icon: CheckCircle,
      title: 'Seu relatório está pronto!',
      description: 'Você já pode visualizar e baixar sua análise estratégica completa.',
      color: 'green'
    }
  };
  return configs[stage];
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    description: 'text-blue-700'
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-900',
    description: 'text-amber-700'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    description: 'text-green-700'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    title: 'text-purple-900',
    description: 'text-purple-700'
  }
};

export function WorkflowStatusBanner({
  enrichmentStatus,
  analysisStatus,
  pdfReady,
  isAdmin
}: WorkflowStatusBannerProps) {
  const stage = getWorkflowStage(enrichmentStatus, analysisStatus, pdfReady);
  const config = isAdmin ? getAdminConfig(stage) : getUserConfig(stage);
  const colors = colorClasses[config.color];
  const Icon = config.icon;

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5`}>
          <Icon
            className={`w-5 h-5 ${colors.icon} ${config.animate ? 'animate-pulse' : ''}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${colors.title}`}>
            {config.title}
          </h3>
          <p className={`text-sm ${colors.description} mt-0.5`}>
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}
