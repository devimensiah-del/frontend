'use client';

import { AIStatus, ReviewStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Loader2, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/design';

interface StatusStep {
  id: string;
  label: string;
  description: string;
}

const AI_STEPS: StatusStep[] = [
  { id: 'queued', label: 'Na Fila', description: 'Aguardando processamento' },
  { id: 'collecting_data', label: 'Coletando Dados', description: 'Buscando informações públicas' },
  { id: 'analyzing', label: 'Analisando', description: 'IA processando dados' },
  { id: 'validation', label: 'Validação', description: 'Verificando qualidade' },
  { id: 'complete', label: 'Completo', description: 'IA finalizou análise' },
];

const REVIEW_STEPS: StatusStep[] = [
  { id: 'analysis_complete', label: 'Análise Completa', description: 'Pronto para revisão' },
  { id: 'in_review', label: 'Em Revisão', description: 'Admin revisando relatório' },
  { id: 'approved', label: 'Aprovado', description: 'Relatório aprovado' },
  { id: 'delivered', label: 'Entregue', description: 'Enviado ao cliente' },
];

interface StatusTrackerProps {
  aiStatus: AIStatus;
  reviewStatus: ReviewStatus;
  aiStartedAt?: string;
  aiCompletedAt?: string;
  reviewStartedAt?: string;
  approvedAt?: string;
  deliveredAt?: string;
}

export function StatusTracker({
  aiStatus,
  reviewStatus,
  aiStartedAt,
  aiCompletedAt,
  reviewStartedAt,
  approvedAt,
  deliveredAt,
}: StatusTrackerProps) {
  const renderStatusIcon = (stepId: string, currentStatus: string, isFailed: boolean) => {
    const steps = currentStatus.includes('analysis_complete') || currentStatus.includes('in_review')
      ? REVIEW_STEPS
      : AI_STEPS;

    const currentIndex = steps.findIndex(s => s.id === currentStatus);
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (isFailed && stepId === currentStatus) {
      return <XCircle className="w-6 h-6 text-red-500" />;
    }

    if (stepIndex < currentIndex) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }

    if (stepId === currentStatus) {
      return <Loader2 className="w-6 h-6 text-[hsl(195_100%_8%)] animate-spin" />;
    }

    return <Circle className="w-6 h-6 text-gray-300" />;
  };

  const getStatusColor = (stepId: string, currentStatus: string, isFailed: boolean) => {
    const steps = currentStatus.includes('analysis_complete') || currentStatus.includes('in_review')
      ? REVIEW_STEPS
      : AI_STEPS;

    const currentIndex = steps.findIndex(s => s.id === currentStatus);
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (isFailed && stepId === currentStatus) return 'border-red-500 bg-red-50';
    if (stepIndex < currentIndex) return 'border-green-500 bg-green-50';
    if (stepId === currentStatus) return 'border-[hsl(195_100%_8%)] bg-[hsl(195_100%_8%)]/10';
    return 'border-gray-200 bg-white';
  };

  const getTimeInfo = (type: 'ai' | 'review') => {
    if (type === 'ai') {
      if (aiCompletedAt) {
        return `Concluído ${formatDistanceToNow(new Date(aiCompletedAt), {
          addSuffix: true,
          locale: ptBR
        })}`;
      }
      if (aiStartedAt) {
        return `Iniciado ${formatDistanceToNow(new Date(aiStartedAt), {
          addSuffix: true,
          locale: ptBR
        })}`;
      }
      return 'Aguardando início';
    } else {
      if (deliveredAt) {
        return `Entregue ${formatDistanceToNow(new Date(deliveredAt), {
          addSuffix: true,
          locale: ptBR
        })}`;
      }
      if (approvedAt) {
        return `Aprovado ${formatDistanceToNow(new Date(approvedAt), {
          addSuffix: true,
          locale: ptBR
        })}`;
      }
      if (reviewStartedAt) {
        return `Revisão iniciada ${formatDistanceToNow(new Date(reviewStartedAt), {
          addSuffix: true,
          locale: ptBR
        })}`;
      }
      return 'Aguardando revisão';
    }
  };

  const isFailed = aiStatus === 'failed';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Pipeline Status */}
      <Card className="shadow-lg border-2 border-[hsl(195_100%_8%)]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[hsl(195_100%_8%)]">Status da IA</CardTitle>
              <CardDescription>Pipeline de processamento automático</CardDescription>
            </div>
            {aiStatus === 'complete' && (
              <Badge variant="default" className="bg-green-500">Completo</Badge>
            )}
            {aiStatus === 'failed' && (
              <Badge variant="destructive">Falhou</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {AI_STEPS.filter(s => s.id !== 'validation' || aiStatus === 'validation').map((step, idx) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(step.id, aiStatus, isFailed)}`}
            >
              <div className="flex items-start gap-3">
                {renderStatusIcon(step.id, aiStatus, isFailed)}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{step.label}</div>
                  <div className="text-sm text-gray-600">{step.description}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {getTimeInfo('ai')}
          </div>
        </CardContent>
      </Card>

      {/* Review Workflow Status */}
      <Card className="shadow-lg border-2 border-[hsl(195_100%_8%)]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[hsl(195_100%_8%)]">Status da Revisão</CardTitle>
              <CardDescription>Workflow de aprovação do admin</CardDescription>
            </div>
            {reviewStatus === 'delivered' && (
              <Badge variant="default" className="bg-green-500">Entregue</Badge>
            )}
            {reviewStatus === 'approved' && (
              <Badge variant="default" className="bg-[hsl(195_100%_8%)]">Aprovado</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {REVIEW_STEPS.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(step.id, reviewStatus, false)}`}
            >
              <div className="flex items-start gap-3">
                {renderStatusIcon(step.id, reviewStatus, false)}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{step.label}</div>
                  <div className="text-sm text-gray-600">{step.description}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {getTimeInfo('review')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
