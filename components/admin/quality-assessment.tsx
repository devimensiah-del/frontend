'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/design';

interface QualityMetrics {
  completeness: number;
  totalFields: number;
  filledFields: number;
  avgConfidence: number;
  conflicts: string[];
  suggestions: string[];
  verifiedSources: number;
  totalSources: number;
}

interface QualityAssessmentProps {
  quality: QualityMetrics;
}

export function QualityAssessment({ quality }: QualityAssessmentProps) {
  const completenessPercentage = (quality.filledFields / quality.totalFields) * 100;
  const confidencePercentage = quality.avgConfidence * 100;
  const sourceReliability = (quality.verifiedSources / quality.totalSources) * 100;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const overallScore = (completenessPercentage + confidencePercentage + sourceReliability) / 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliação de Qualidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className={`p-6 rounded-lg border-2 ${getScoreBg(overallScore)}`}>
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
              {overallScore.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Score Geral de Qualidade</div>
            <div className="mt-4">
              {overallScore >= 80 ? (
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Qualidade Excelente</span>
                </div>
              ) : overallScore >= 60 ? (
                <div className="flex items-center justify-center gap-2 text-yellow-700">
                  <Info className="w-5 h-5" />
                  <span className="font-semibold">Qualidade Aceitável</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Necessita Revisão</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Completeness */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Completude dos Dados</span>
            <span className={`text-sm font-semibold ${getScoreColor(completenessPercentage)}`}>
              {quality.filledFields}/{quality.totalFields} campos
            </span>
          </div>
          <Progress value={completenessPercentage} className="h-3" />
          <p className="text-xs text-gray-600">
            {completenessPercentage >= 80
              ? 'Dados muito completos'
              : completenessPercentage >= 60
              ? 'Alguns campos podem estar faltando'
              : 'Muitos campos importantes faltando'}
          </p>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Confiança Média</span>
            <span className={`text-sm font-semibold ${getScoreColor(confidencePercentage)}`}>
              {confidencePercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={confidencePercentage} className="h-3" />
          <p className="text-xs text-gray-600">
            {confidencePercentage >= 80
              ? 'Alta confiança nos dados coletados'
              : confidencePercentage >= 60
              ? 'Confiança moderada, verificação recomendada'
              : 'Baixa confiança, verificação manual necessária'}
          </p>
        </div>

        {/* Source Reliability */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Confiabilidade das Fontes</span>
            <span className={`text-sm font-semibold ${getScoreColor(sourceReliability)}`}>
              {quality.verifiedSources}/{quality.totalSources} verificadas
            </span>
          </div>
          <Progress value={sourceReliability} className="h-3" />
          <p className="text-xs text-gray-600">
            Fontes verificadas e confiáveis utilizadas
          </p>
        </div>

        {/* Conflicts */}
        {quality.conflicts.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Conflitos Detectados ({quality.conflicts.length})</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                {quality.conflicts.map((conflict, i) => (
                  <li key={i}>{conflict}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Suggestions */}
        {quality.suggestions.length > 0 && (
          <div className="bg-[hsl(195_100%_8%)]/10 border border-[hsl(195_100%_8%)]/20 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Info className="w-5 h-5 text-[hsl(195_100%_8%)] flex-shrink-0 mt-0.5" />
              <h4 className="font-semibold text-[hsl(195_100%_8%)]">Sugestões de Melhoria</h4>
            </div>
            <ul className="space-y-2 text-sm text-[hsl(195_100%_8%)]/80">
              {quality.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[hsl(195_100%_8%)]">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Required */}
        {overallScore < 60 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ação Necessária</AlertTitle>
            <AlertDescription>
              A qualidade dos dados está abaixo do aceitável. Recomenda-se:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Coletar dados adicionais manualmente</li>
                <li>Verificar e resolver todos os conflitos</li>
                <li>Buscar fontes alternativas para dados faltantes</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
