'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { analysisApi } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';

interface AnalysisData {
  id: string;
  summary: string;
  score?: number;
  recommendations?: string[];
  pdfUrl?: string;
  status: string;
  createdAt: string;
  sentAt?: string;
}

interface AnalysisCardProps {
  analysis: AnalysisData;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Call the API to get the PDF blob
      const blob = await analysisApi.getPdf(analysis.id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analise-${analysis.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'PDF Baixado',
        description: 'O relatório foi baixado com sucesso.',
        variant: 'success',
      });
    } catch (error: any) {
      console.error('Erro ao baixar PDF:', error);

      toast({
        title: 'Erro ao Baixar',
        description: error.message || 'Erro ao baixar o relatório. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Necessita Melhorias';
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Análise e Relatório
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {analysis.sentAt
                ? `Enviado em ${formatDate(analysis.sentAt)}`
                : `Criado em ${formatDate(analysis.createdAt)}`}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 border border-green-300">
            Concluído
          </Badge>
        </div>

        {/* Score */}
        {analysis.score !== undefined && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Pontuação Geral</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </span>
                <span className="text-sm text-gray-500">/ 100</span>
              </div>
              <p className={`text-sm font-medium mt-1 ${getScoreColor(analysis.score)}`}>
                {getScoreLabel(analysis.score)}
              </p>
            </div>
            <div className="w-24 h-24">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${(analysis.score / 100) * 283} 283`}
                  className={getScoreColor(analysis.score)}
                />
              </svg>
            </div>
          </div>
        )}

        {/* Summary */}
        <div>
          <p className="text-sm font-medium text-gray-700">Resumo Executivo</p>
          <p className="text-sm text-gray-900 mt-2 leading-relaxed whitespace-pre-line">
            {analysis.summary}
          </p>
        </div>

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Recomendações Principais
            </p>
            <ul className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-[#00a859] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {recommendation}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Download Button */}
        {analysis.pdfUrl && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full bg-[#00a859] hover:bg-[#008a47] text-white"
            >
              {downloading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Baixando...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Baixar Relatório Completo (PDF)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
