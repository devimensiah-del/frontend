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
    if (analysis.status === 'processing') {
      return <Badge className="bg-blue-100 text-blue-800 border border-blue-300">Em Progresso</Badge>;
    }
    if (analysis.status === 'failed') {
      return <Badge className="bg-red-100 text-red-800 border border-red-300">Falhou</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Pendente</Badge>;
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
          </div>
        </div>

        {/* Executive Summary */}
        {analysis.analysis?.synthesis?.executiveSummary && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Sumário Executivo</p>
            <p className="text-sm text-gray-900 leading-relaxed">{analysis.analysis.synthesis.executiveSummary}</p>
          </div>
        )}

        {/* Key Findings */}
        {analysis.analysis?.synthesis?.keyFindings && analysis.analysis.synthesis.keyFindings.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Principais Descobertas
            </p>
            <ul className="space-y-2">
              {analysis.analysis.synthesis.keyFindings.map((finding, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2 text-sm text-gray-900"
                >
                  <span className="text-[#00a859] mt-1">→</span>
                  <span className="leading-relaxed">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strategic Priorities */}
        {analysis.analysis?.synthesis?.strategicPriorities && analysis.analysis.synthesis.strategicPriorities.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Prioridades Estratégicas
            </p>
            <div className="space-y-2">
              {analysis.analysis.synthesis.strategicPriorities.map((priority, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <span className="text-sm text-blue-900">{priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SWOT Analysis Summary */}
        {analysis.analysis?.swot && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Análise SWOT</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs font-semibold text-green-700 uppercase mb-1">Forças</p>
                <p className="text-sm text-gray-900">{analysis.analysis.swot.strengths.length} identificadas</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-xs font-semibold text-red-700 uppercase mb-1">Fraquezas</p>
                <p className="text-sm text-gray-900">{analysis.analysis.swot.weaknesses.length} identificadas</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Oportunidades</p>
                <p className="text-sm text-gray-900">{analysis.analysis.swot.opportunities.length} identificadas</p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <p className="text-xs font-semibold text-orange-700 uppercase mb-1">Ameaças</p>
                <p className="text-sm text-gray-900">{analysis.analysis.swot.threats.length} identificadas</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Frameworks Summary */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Frameworks Aplicados</p>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">PESTEL</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Porter</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">SWOT</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">TAM-SAM-SOM</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Benchmarking</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Blue Ocean</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Growth Hacking</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Scenarios</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">OKRs</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">BSC</Badge>
            <Badge variant="default" className="bg-gray-50 text-gray-700 justify-center">Decision Matrix</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
