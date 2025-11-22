'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSubmission } from '@/lib/hooks/use-submission';
import { useEnrichment } from '@/lib/hooks/use-enrichment';
import { EnrichmentDisplay } from './_components/EnrichmentDisplay';
import { useToast } from '@/components/ui/use-toast';

// --- FIXED: Status Mapping to match Go Backend (English Keys) ---
const getStatusVariant = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'enriching':
    case 'enriched':
    case 'analyzing':
    case 'analyzed':
    case 'ready_for_review':
    case 'generating_report':
      return 'primary'; // Blue/Indigo for "In Progress"
    case 'pending':
      return 'warning';
    case 'failed':
    case 'enrichment_failed':
    case 'analysis_failed':
    case 'report_failed':
      return 'error';
    default:
      return 'default';
  }
};

// Status label mapping
const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Pendente',
    enriching: 'Em Enriquecimento',
    enriched: 'Enriquecido',
    analyzing: 'Em Análise',
    analyzed: 'Análise Concluída',
    ready_for_review: 'Aguardando Publicação',
    generating_report: 'Gerando Relatório',
    completed: 'Concluído',
    failed: 'Falhou',
    enrichment_failed: 'Falha no Enriquecimento',
    analysis_failed: 'Falha na Análise',
    report_failed: 'Falha no Relatório'
  };
  return map[status] || status;
};

// Format date to Brazilian format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function EnvioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const { submission, isLoading, error } = useSubmission(resolvedParams.id);
  const { enrichment, isLoading: enrichmentLoading } = useEnrichment(resolvedParams.id);

  // --- NEW: Handler for PDF Download ---
  const handleDownloadPDF = () => {
    // The backend API returns pdf_url (or pdfUrl via camelCase mapper) in the submission details
    const url = (submission as any)?.pdfUrl || (submission as any)?.pdf_url;

    if (url) {
      window.open(url, '_blank');
      toast({
        title: "PDF Aberto",
        description: "O relatório foi aberto em uma nova guia.",
        variant: "default"
      });
    } else {
      toast({
        title: "PDF Não Disponível",
        description: "O PDF ainda não está disponível. Tente recarregar a página.",
        variant: "destructive"
      });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/painel" className="hover:text-[#00a859]">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/envios" className="hover:text-[#00a859]">
            Envios
          </Link>
          <span>/</span>
          <Skeleton width={100} height={20} />
        </div>

        <Card className="p-6">
          <SkeletonText lines={5} />
        </Card>
      </div>
    );
  }

  // Error State
  if (error || !submission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/painel" className="hover:text-[#00a859]">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/envios" className="hover:text-[#00a859]">
            Envios
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Erro</span>
        </div>

        <Alert variant="error">
          <AlertTitle>Erro ao carregar envio</AlertTitle>
          <AlertDescription>
            {error?.message || 'Envio não encontrado. Verifique o ID e tente novamente.'}
          </AlertDescription>
        </Alert>

        <Link href="/envios">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Envios
          </Button>
        </Link>
      </div>
    );
  }

  // Use submission fields directly (new structure)
  const companyName = submission.companyName || 'N/A';
  const hasEnrichment = !!enrichment;

  // --- FIXED: Check for correct backend status ---
  const hasAnalysis = submission.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/painel" className="hover:text-[#00a859]">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/envios" className="hover:text-[#00a859]">
          Envios
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{submission.id.substring(0, 8)}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
          <p className="text-gray-600 mt-2">
            Enviado em {formatDate(submission.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusVariant(submission.status)}>
            {getStatusLabel(submission.status)}
          </Badge>
          <Link href="/envios">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion type="single" collapsible defaultValue="submission" className="space-y-4">
        {/* 1. Submission Data - Always visible */}
        <AccordionItem value="submission" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#00a859] text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="text-lg font-semibold text-gray-900">Dados de Envio</span>
              </div>
              <span className="text-sm text-gray-500">Sempre visível</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Company Information */}
              <Card className="p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Informações da Empresa</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-gray-700">Nome:</dt>
                    <dd className="text-gray-600">{companyName}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">CNPJ:</dt>
                    <dd className="text-gray-600">{submission.cnpj || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Setor:</dt>
                    <dd className="text-gray-600">{submission.industry || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Tamanho:</dt>
                    <dd className="text-gray-600">{submission.companySize || 'N/A'}</dd>
                  </div>
                  {submission.website && (
                    <div>
                      <dt className="font-medium text-gray-700">Website:</dt>
                      <dd className="text-gray-600">
                        <a
                          href={submission.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00a859] hover:underline"
                        >
                          {submission.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </Card>

              {/* Strategic Context */}
              <Card className="p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Contexto Estratégico</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-gray-700">Objetivo Estratégico:</dt>
                    <dd className="text-gray-600">{submission.strategicGoal || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Posição Competitiva:</dt>
                    <dd className="text-gray-600">{submission.competitivePosition || 'N/A'}</dd>
                  </div>
                </dl>
              </Card>

              {/* Current Challenges */}
              {submission.currentChallenges && (
                <Card className="p-4 bg-gray-50 md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Desafios Atuais</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {submission.currentChallenges}
                  </p>
                </Card>
              )}

              {/* Additional Information */}
              {submission.additionalInfo && (
                <Card className="p-4 bg-gray-50 md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Informações Adicionais</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {submission.additionalInfo}
                  </p>
                </Card>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Enrichment Data - Show loading, empty, or data state */}
        <AccordionItem value="enrichment" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Enriquecimento de Dados
                </span>
              </div>
              {hasEnrichment && (
                <span className="text-sm text-indigo-600 font-medium">Disponível</span>
              )}
              {enrichmentLoading && (
                <span className="text-sm text-gray-500">Carregando...</span>
              )}
              {!hasEnrichment && !enrichmentLoading && (
                <span className="text-sm text-gray-500">Processando</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {/* Loading State */}
            {enrichmentLoading && (
              <div className="space-y-4">
                <Skeleton width="100%" height={100} />
                <Skeleton width="100%" height={100} />
                <Skeleton width="100%" height={80} />
              </div>
            )}

            {/* No Enrichment Yet */}
            {!enrichmentLoading && !hasEnrichment && (
              <Alert variant="info">
                <AlertTitle>Dados em processamento</AlertTitle>
                <AlertDescription>
                  Os dados de enriquecimento ainda não estão disponíveis. Nossa equipe está processando sua submissão e os dados serão disponibilizados em breve.
                </AlertDescription>
              </Alert>
            )}

            {/* Enrichment Data Available */}
            {!enrichmentLoading && hasEnrichment && enrichment && (
              <EnrichmentDisplay enrichment={enrichment as any} />
            )}
          </AccordionContent>
        </AccordionItem>

        {/* 3. Analysis - Only if completed */}
        {hasAnalysis && (
          <AccordionItem value="analysis" className="border border-gray-200 rounded-lg bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Análise e Relatório
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">Relatório disponível</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <Alert variant="success">
                  <AlertTitle>Análise Concluída</AlertTitle>
                  <AlertDescription>
                    Seu relatório está pronto para download.
                  </AlertDescription>
                </Alert>

                {/* --- FIXED: Added onClick Handler --- */}
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full bg-[#00a859] hover:bg-[#008a47] text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Relatório PDF
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Status Messages */}
      {!hasEnrichment && (
        <Alert variant="info">
          <AlertTitle>Sua submissão está em análise</AlertTitle>
          <AlertDescription>
            Estamos processando seus dados. O enriquecimento estará disponível em breve.
          </AlertDescription>
        </Alert>
      )}

      {hasEnrichment && !hasAnalysis && (
        <Alert variant="warning">
          <AlertTitle>Análise em andamento</AlertTitle>
          <AlertDescription>
            Nossos especialistas estão revisando seu caso. O relatório final será disponibilizado em
            breve.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
