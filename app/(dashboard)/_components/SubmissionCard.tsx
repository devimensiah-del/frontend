'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface SubmissionData {
  id: string;
  organizationName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  website?: string;
  socialMedia?: string;
  innovationDescription: string;
  targetAudience: string;
  problemSolution: string;
  stage: string;
  teamSize: number;
  hasRevenue: boolean;
  monthlyRevenue?: number;
  fundingReceived?: number;
  businessModel?: string;
  mainChallenge?: string;
  supportNeeded?: string;
  status: string;
  createdAt: string;
}

interface SubmissionCardProps {
  submission: SubmissionData;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  in_review: 'Em Análise',
  enriching: 'Enriquecendo',
  enriched: 'Enriquecido',
  analyzing: 'Analisando',
  completed: 'Concluído',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  in_review: 'bg-blue-100 text-blue-800 border-blue-300',
  enriching: 'bg-purple-100 text-purple-800 border-purple-300',
  enriched: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  analyzing: 'bg-orange-100 text-orange-800 border-orange-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
};

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {submission.organizationName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Enviado em {formatDate(submission.createdAt)}
            </p>
          </div>
          <Badge
            className={`${STATUS_COLORS[submission.status] || 'bg-gray-100 text-gray-800'} border`}
          >
            {STATUS_LABELS[submission.status] || submission.status}
          </Badge>
        </div>

        {/* Organization Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Responsável</p>
            <p className="text-sm text-gray-900 mt-1">{submission.ownerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">E-mail</p>
            <p className="text-sm text-gray-900 mt-1">{submission.ownerEmail}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Telefone</p>
            <p className="text-sm text-gray-900 mt-1">{submission.ownerPhone}</p>
          </div>
          {submission.website && (
            <div>
              <p className="text-sm font-medium text-gray-700">Website</p>
              <a
                href={submission.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#00a859] hover:underline mt-1 block"
              >
                {submission.website}
              </a>
            </div>
          )}
        </div>

        {/* Innovation Description */}
        <div>
          <p className="text-sm font-medium text-gray-700">Descrição da Inovação</p>
          <p className="text-sm text-gray-900 mt-2 leading-relaxed">
            {submission.innovationDescription}
          </p>
        </div>

        {/* Target & Problem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Público-Alvo</p>
            <p className="text-sm text-gray-900 mt-2">{submission.targetAudience}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Problema/Solução</p>
            <p className="text-sm text-gray-900 mt-2">{submission.problemSolution}</p>
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-700">Estágio</p>
            <p className="text-sm text-gray-900 mt-1">{submission.stage}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Equipe</p>
            <p className="text-sm text-gray-900 mt-1">{submission.teamSize} pessoas</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Receita Mensal</p>
            <p className="text-sm text-gray-900 mt-1">
              {submission.hasRevenue
                ? formatCurrency(submission.monthlyRevenue)
                : 'Sem receita'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Investimento</p>
            <p className="text-sm text-gray-900 mt-1">
              {formatCurrency(submission.fundingReceived)}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {(submission.businessModel || submission.mainChallenge || submission.supportNeeded) && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {submission.businessModel && (
              <div>
                <p className="text-sm font-medium text-gray-700">Modelo de Negócio</p>
                <p className="text-sm text-gray-900 mt-1">{submission.businessModel}</p>
              </div>
            )}
            {submission.mainChallenge && (
              <div>
                <p className="text-sm font-medium text-gray-700">Principal Desafio</p>
                <p className="text-sm text-gray-900 mt-1">{submission.mainChallenge}</p>
              </div>
            )}
            {submission.supportNeeded && (
              <div>
                <p className="text-sm font-medium text-gray-700">Apoio Necessário</p>
                <p className="text-sm text-gray-900 mt-1">{submission.supportNeeded}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
