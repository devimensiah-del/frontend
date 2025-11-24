/**
 * Workflow Labels - User-friendly label mappings
 *
 * Maps technical status values to human-readable Portuguese labels.
 * Provides consistent terminology across the application.
 */

import { EnrichmentStatus, AnalysisStatus } from "@/lib/types";

/**
 * Enrichment workflow labels
 */
export const ENRICHMENT_LABELS: Record<EnrichmentStatus, string> = {
  pending: "Coletando dados de mercado...",
  completed: "Análise de mercado concluída",
  approved: "Pronto para relatório estratégico",
};

/**
 * Analysis workflow labels
 */
export const ANALYSIS_LABELS: Record<AnalysisStatus, string> = {
  pending: "Aguardando dados de mercado",
  completed: "Relatório estratégico concluído",
  approved: "Relatório aprovado",
  sent: "Relatório enviado",
};

/**
 * Combined workflow stage labels
 */
export const STAGE_LABELS = {
  submission: {
    label: "Dados Recebidos",
    description: "Informações da empresa coletadas",
  },
  enrichment: {
    label: "Análise de Mercado",
    description: "Pesquisa e enriquecimento de dados",
  },
  analysis: {
    label: "Relatório Estratégico",
    description: "Análise e recomendações",
  },
  delivery: {
    label: "Entrega",
    description: "Relatório finalizado",
  },
} as const;

/**
 * Get workflow stage from statuses
 */
export const getWorkflowStage = (
  enrichmentStatus?: EnrichmentStatus,
  analysisStatus?: AnalysisStatus
): keyof typeof STAGE_LABELS => {
  // If no enrichment yet, submission stage
  if (!enrichmentStatus) {
    return "submission";
  }

  // If enrichment not approved, enrichment stage
  if (enrichmentStatus !== "approved") {
    return "enrichment";
  }

  // If analysis not sent, analysis stage
  if (!analysisStatus || analysisStatus !== "sent") {
    return "analysis";
  }

  // Otherwise, delivery stage
  return "delivery";
};

/**
 * Get current workflow stage number (1-4)
 */
export const getWorkflowStageNumber = (
  enrichmentStatus?: EnrichmentStatus,
  analysisStatus?: AnalysisStatus
): number => {
  const stageMap = {
    submission: 1,
    enrichment: 2,
    analysis: 3,
    delivery: 4,
  };

  const stage = getWorkflowStage(enrichmentStatus, analysisStatus);
  return stageMap[stage];
};

/**
 * Get human-readable status description
 */
export const getStatusDescription = (
  enrichmentStatus?: EnrichmentStatus,
  analysisStatus?: AnalysisStatus
): string => {
  if (!enrichmentStatus) {
    return "Aguardando início da análise de mercado";
  }

  if (enrichmentStatus === "pending") {
    return "Coletando e analisando dados de mercado";
  }

  if (enrichmentStatus === "completed") {
    return "Aguardando revisão dos dados coletados";
  }

  if (enrichmentStatus === "approved" && !analysisStatus) {
    return "Iniciando análise estratégica";
  }

  if (analysisStatus === "pending") {
    return "Gerando relatório estratégico";
  }

  if (analysisStatus === "completed") {
    return "Relatório aguardando aprovação";
  }

  if (analysisStatus === "approved") {
    return "Relatório aprovado, pronto para envio";
  }

  if (analysisStatus === "sent") {
    return "Relatório enviado com sucesso";
  }

  return "Status desconhecido";
};

/**
 * Get estimated completion time based on stage
 */
export const getEstimatedCompletion = (
  enrichmentStatus?: EnrichmentStatus,
  analysisStatus?: AnalysisStatus
): string => {
  const stage = getWorkflowStage(enrichmentStatus, analysisStatus);

  switch (stage) {
    case "submission":
      return "Análise iniciará em breve";
    case "enrichment":
      return "1-2 dias";
    case "analysis":
      return "2-3 dias";
    case "delivery":
      return "Concluído";
    default:
      return "A calcular...";
  }
};

/**
 * Get next action for user
 */
export const getNextAction = (
  enrichmentStatus?: EnrichmentStatus,
  analysisStatus?: AnalysisStatus
): { title: string; description: string } => {
  const stage = getWorkflowStage(enrichmentStatus, analysisStatus);

  switch (stage) {
    case "submission":
      return {
        title: "Análise de Mercado Iniciará em Breve",
        description:
          "Nossa equipe começará a coletar dados de mercado e análise competitiva. Você receberá atualizações por email.",
      };
    case "enrichment":
      return {
        title: "Análise de Mercado em Andamento",
        description:
          "Estamos coletando dados relevantes sobre seu mercado, concorrência e tendências. Este processo pode levar 1-2 dias.",
      };
    case "analysis":
      return {
        title: "Relatório Estratégico em Desenvolvimento",
        description:
          "Com base nos dados coletados, estamos gerando seu relatório estratégico completo com recomendações personalizadas.",
      };
    case "delivery":
      return {
        title: "Relatório Disponível",
        description:
          "Seu relatório estratégico está pronto! Acesse o PDF completo com análises, insights e recomendações.",
      };
    default:
      return {
        title: "Processando",
        description: "Estamos trabalhando em sua solicitação.",
      };
  }
};
