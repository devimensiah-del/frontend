'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Analysis } from '@/types';

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    if (analysis.status === 'completed') {
      return <Badge className="bg-green-100 text-green-800 border border-green-300">Concluído</Badge>;
    }
    if (analysis.status === 'in_progress') {
      return <Badge className="bg-blue-100 text-blue-800 border border-blue-300">Em Progresso</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Pendente</Badge>;
  };

  const getConfidenceBadge = () => {
    const variants = {
      alta: 'bg-green-50 text-green-700 border-green-200',
      média: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      baixa: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <Badge variant="default" className={variants[analysis.confidenceLevel]}>
        Confiança: {analysis.confidenceLevel}
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Análise Estratégica
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Atualizado em {formatDate(analysis.updatedAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            {getConfidenceBadge()}
          </div>
        </div>

        {/* Analysis Quality Score */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Pontuação de Qualidade</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-bold text-[#00a859]">
                {analysis.analysisQualityScore}
              </span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>
          <div className="w-20 h-20">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#00a859"
                strokeWidth="8"
                strokeDasharray={`${(analysis.analysisQualityScore / 100) * 251} 251`}
              />
            </svg>
          </div>
        </div>

        {/* Strategic Recommendations */}
        {analysis.strategicRecommendations && analysis.strategicRecommendations.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Recomendações Estratégicas
            </p>
            <ul className="space-y-2">
              {analysis.strategicRecommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2 text-sm text-gray-900"
                >
                  <span className="text-[#00a859] mt-1">→</span>
                  <span className="leading-relaxed">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Priority Actions */}
        {analysis.priorityActions && analysis.priorityActions.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Ações Prioritárias
            </p>
            <div className="space-y-3">
              {analysis.priorityActions.map((action, index) => {
                const priorityColors = {
                  crítica: 'bg-red-50 border-red-200 text-red-900',
                  alta: 'bg-orange-50 border-orange-200 text-orange-900',
                  média: 'bg-yellow-50 border-yellow-200 text-yellow-900',
                  baixa: 'bg-blue-50 border-blue-200 text-blue-900',
                };

                const timeframeLabels = {
                  curto_prazo: 'Curto Prazo',
                  médio_prazo: 'Médio Prazo',
                  longo_prazo: 'Longo Prazo',
                };

                return (
                  <div
                    key={index}
                    className={`p-3 border rounded ${priorityColors[action.priority]}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold">{action.action}</span>
                      <Badge variant="default" className="text-xs uppercase">
                        {timeframeLabels[action.timeframe]}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed">{action.expectedImpact}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SWOT Analysis Summary */}
        {analysis.swot && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Análise SWOT</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs font-semibold text-green-700 uppercase mb-1">Forças</p>
                <p className="text-sm text-gray-900">{analysis.swot.strengths.length} identificadas</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-xs font-semibold text-red-700 uppercase mb-1">Fraquezas</p>
                <p className="text-sm text-gray-900">{analysis.swot.weaknesses.length} identificadas</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Oportunidades</p>
                <p className="text-sm text-gray-900">{analysis.swot.opportunities.length} identificadas</p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <p className="text-xs font-semibold text-orange-700 uppercase mb-1">Ameaças</p>
                <p className="text-sm text-gray-900">{analysis.swot.threats.length} identificadas</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Frameworks Summary */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Frameworks Aplicados</p>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">PESTEL</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Porter 5 Forças</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">SWOT</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">VRIO</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Cadeia de Valor</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">BCG Matrix</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Ansoff Matrix</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Balanced Scorecard</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">McKinsey 7S</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Blue Ocean</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Core Competencies</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
