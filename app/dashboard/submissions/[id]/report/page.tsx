'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2,
  Lock,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Building2,
  AlertTriangle,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

interface Recommendation {
  title: string;
  description: string;
  priority: string;
  impact: string;
  effort: string;
  timeline: string;
}

interface CompanyOverview {
  name: string;
  industry: string;
  size: string;
  strengths: string[];
  weaknesses: string[];
  key_products: string[];
  target_market: string;
}

interface ReportPreview {
  executive_summary: string;
  swot_strengths: string[];
  sample_recommendation: Recommendation;
  company_overview: CompanyOverview;
  locked_sections: string[];
  unlock_price: string;
  call_to_action: string;
}

interface LimitedReport {
  is_paid: boolean;
  preview?: ReportPreview;
  full_report?: {
    markdown: string;
    pdf_url?: string;
    generated_at: string;
  };
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [data, setData] = useState<LimitedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    fetchReportPreview();
  }, [submissionId]);

  const fetchReportPreview = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/submissions/${submissionId}/report-preview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Falha ao carregar relatório');
      }

      const reportData = await response.json();
      setData(reportData);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar relatório'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockReport = async () => {
    try {
      setUnlocking(true);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Create Stripe checkout session
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            submission_id: submissionId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao criar sessão de pagamento');
      }

      const { checkout_url } = await response.json();

      // Redirect to Stripe checkout
      window.location.href = checkout_url;
    } catch (err) {
      console.error('Error creating checkout:', err);
      setError('Erro ao processar pagamento. Tente novamente.');
      setUnlocking(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    } as const;

    const labels = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'default'}>
        {labels[priority as keyof typeof labels] || priority}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || 'Não foi possível carregar o relatório.'}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  // Show full report if paid
  if (data.is_paid && data.full_report) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Análise Estratégica Completa
                </h1>
                <p className="text-gray-600">
                  Gerado em{' '}
                  {new Date(data.full_report.generated_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <Badge className="bg-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Pago
            </Badge>
          </div>
        </div>

        {/* Full Report Content */}
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{data.full_report.markdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Download PDF Button */}
        {data.full_report.pdf_url && (
          <div className="mt-6 flex justify-end">
            <Button asChild>
              <a href={data.full_report.pdf_url} download>
                <FileText className="mr-2 h-4 w-4" />
                Baixar PDF
              </a>
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show limited preview if not paid
  const preview = data.preview!;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Prévia do Relatório
              </h1>
              <p className="text-gray-600">
                Desbloqueie o relatório completo para acessar todas as análises
              </p>
            </div>
          </div>
          <Badge variant="outline">
            <Lock className="h-3 w-3 mr-1" />
            Bloqueado
          </Badge>
        </div>
      </div>

      {/* Unlock CTA */}
      <Alert className="mb-6 border-blue-600 bg-blue-50">
        <CreditCard className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">
          Desbloqueie sua Análise Estratégica Completa
        </AlertTitle>
        <AlertDescription className="text-blue-800">
          <p className="mb-3">{preview.call_to_action}</p>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-blue-900">
              {preview.unlock_price}
            </div>
            <Button
              onClick={handleUnlockReport}
              disabled={unlocking}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {unlocking ? (
                'Processando...'
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Desbloquear Agora
                </>
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Company Overview */}
      {preview.company_overview && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Visão Geral da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nome</p>
                <p className="text-lg font-semibold">
                  {preview.company_overview.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Setor</p>
                <p className="text-lg">{preview.company_overview.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Porte</p>
                <p className="text-lg">{preview.company_overview.size}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Mercado-Alvo</p>
                <p className="text-lg">{preview.company_overview.target_market}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Forças</p>
              <ul className="list-disc list-inside space-y-1">
                {preview.company_overview.strengths.map((strength, idx) => (
                  <li key={idx} className="text-gray-700">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Sumário Executivo
          </CardTitle>
          <CardDescription>Prévia dos primeiros 200 caracteres</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{preview.executive_summary}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* SWOT Strengths Only */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Análise SWOT - Forças
          </CardTitle>
          <CardDescription>
            Desbloqueie para ver Fraquezas, Oportunidades e Ameaças
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {preview.swot_strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Sample Recommendation */}
      {preview.sample_recommendation && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Recomendação de Amostra
            </CardTitle>
            <CardDescription>
              1 de várias recomendações estratégicas disponíveis no relatório completo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {preview.sample_recommendation.title}
              </h3>
              <p className="text-gray-700 mb-3">
                {preview.sample_recommendation.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Prioridade
                </p>
                {getPriorityBadge(preview.sample_recommendation.priority)}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Impacto</p>
                {getPriorityBadge(preview.sample_recommendation.impact)}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Esforço</p>
                {getPriorityBadge(preview.sample_recommendation.effort)}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Timeline
                </p>
                <Badge variant="outline">
                  {preview.sample_recommendation.timeline}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Sections */}
      <Card className="border-orange-500 border-l-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-600" />
            Seções Bloqueadas
          </CardTitle>
          <CardDescription>
            Desbloqueie o relatório completo para acessar estas análises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preview.locked_sections.map((section, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50"
              >
                <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">{section}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <Card className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              Pronto para a Análise Completa?
            </h2>
            <p className="text-blue-100">
              Desbloqueie todas as 7 frameworks estratégicas, recomendações
              detalhadas e OKRs acionáveis
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-4xl font-bold">{preview.unlock_price}</div>
              <Button
                size="lg"
                onClick={handleUnlockReport}
                disabled={unlocking}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                {unlocking ? (
                  'Processando...'
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Desbloquear Relatório Completo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
