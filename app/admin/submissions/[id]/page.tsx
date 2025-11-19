'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusTracker } from '@/components/admin/status-tracker';
import { DataQualityDisplay } from '@/components/admin/data-quality-display';
import { ConflictAlertBanner } from '@/components/admin/conflict-alert-banner';
import { EnrichmentApprovalCard } from '@/components/EnrichmentApprovalCard';
import { Loader2, Download, Save, Send, ArrowLeft, FileText, RefreshCw, LogOut, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface SubmissionDetailProps {
  params: Promise<{ id: string }>;
}

export default function SubmissionDetailPage({ params }: SubmissionDetailProps) {
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setSubmissionId(p.id));
  }, [params]);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [submission, setSubmission] = useState<any>(null);
  const [markdown, setMarkdown] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isApprovingEnrichment, setIsApprovingEnrichment] = useState(false);
  const [enrichmentApproved, setEnrichmentApproved] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (user && submissionId) {
      fetchSubmissionDetail();
    }
  }, [user, authLoading, router, submissionId]);

  const fetchSubmissionDetail = async () => {
    if (!submissionId) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/submissions/${submissionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Erro ao carregar submissão');
      }

      const data = await response.json();
      setSubmission(data);
      setMarkdown(data.report_markdown || '');
      setPdfUrl(data.report_pdf_url);
      // Check if enrichment was already approved (AI status indicates it started)
      setEnrichmentApproved(
        data.ai_status &&
        ['analyzing', 'validation', 'complete'].includes(data.ai_status)
      );
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao carregar submissão',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!submissionId) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/submissions/${submissionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ report_markdown: markdown, status: 'draft' }),
        }
      );

      if (!response.ok) throw new Error('Erro ao salvar rascunho');

      toast({
        title: 'Rascunho salvo!',
        description: 'Alterações salvas como rascunho (não visível ao usuário)',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishReport = async () => {
    if (!submissionId) return;
    setIsPublishing(true);
    try {
      const token = localStorage.getItem('token');

      // First save the markdown
      const saveResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/submissions/${submissionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ report_markdown: markdown, status: 'published' }),
        }
      );

      if (!saveResponse.ok) throw new Error('Erro ao publicar relatório');

      toast({
        title: 'Relatório publicado!',
        description: 'O relatório agora está visível para o usuário',
      });

      // Refresh submission data
      fetchSubmissionDetail();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao publicar',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submission.company_name.replace(/\s+/g, '_')}_report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = async () => {
    if (!submissionId) return;
    setIsGeneratingPDF(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/submissions/${submissionId}/generate-pdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erro ao gerar PDF');

      const data = await response.json();
      setPdfUrl(data.pdf_url);

      toast({
        title: 'PDF gerado!',
        description: 'PDF criado com sucesso',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar PDF',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleApproveEnrichment = async () => {
    if (!submissionId) return;
    setIsApprovingEnrichment(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/submissions/${submissionId}/approve-enrichment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (response.status === 404) {
        throw new Error('Submissão não encontrada');
      }

      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.error || 'Enriquecimento já aprovado');
      }

      if (!response.ok) {
        throw new Error('Erro ao aprovar enriquecimento');
      }

      const data = await response.json();

      setEnrichmentApproved(true);

      toast({
        title: 'Enriquecimento aprovado!',
        description: 'Análise de IA em andamento...',
      });

      // Refresh submission data after approval
      setTimeout(() => {
        fetchSubmissionDetail();
      }, 1000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao aprovar enriquecimento',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsApprovingEnrichment(false);
    }
  };

  const handleApproveAndSend = async () => {
    if (!pdfUrl) {
      toast({
        variant: 'destructive',
        title: 'PDF não gerado',
        description: 'Por favor, gere o PDF antes de enviar',
      });
      return;
    }

    if (!submissionId) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/submissions/${submissionId}/approve-and-send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erro ao aprovar e enviar');

      toast({
        title: 'Relatório enviado!',
        description: 'Email enviado com sucesso para o cliente',
      });

      // Refresh data
      fetchSubmissionDetail();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(195_100%_8%)]" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Submissão não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/submissions')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {submission.company_name}
          </h1>
          <p className="text-gray-600">ID: {submission.id}</p>
        </div>

        <div className="space-y-6">
          {/* Enrichment Approval Section */}
          <EnrichmentApprovalCard
            enrichmentData={submission.enrichment_data}
            enrichmentCompletedAt={submission.enrichment_completed_at}
            isApproved={enrichmentApproved}
            onApprove={handleApproveEnrichment}
            isApproving={isApprovingEnrichment}
          />

          {/* Conflict Alert Banner */}
          {submission.conflicts && submission.conflicts.length > 0 && (
            <ConflictAlertBanner conflicts={submission.conflicts} />
          )}

          {/* Status Tracking */}
          <StatusTracker
            aiStatus={submission.ai_status || 'queued'}
            reviewStatus={submission.review_status || 'analysis_complete'}
            aiStartedAt={submission.ai_started_at}
            aiCompletedAt={submission.ai_completed_at}
            reviewStartedAt={submission.review_started_at}
            approvedAt={submission.approved_at}
            deliveredAt={submission.delivered_at}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Data Quality */}
            <div className="space-y-6">
              <DataQualityDisplay
                enrichmentData={submission.enrichment_data}
                submittedData={{
                  company_name: submission.company_name,
                  email: submission.email,
                  website_url: submission.website_url,
                  phone: submission.phone,
                  whatsapp: submission.whatsapp,
                  instagram: submission.instagram,
                  tiktok: submission.tiktok,
                  company_linkedin: submission.company_linkedin,
                  founder_linkedin: submission.founder_linkedin,
                  employee_count: submission.employee_count,
                  founded_year: submission.founded_year,
                }}
                conflicts={submission.conflicts}
              />

              {/* Submission Data */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Dados da Submissão</CardTitle>
                  <CardDescription>Informações fornecidas pelo cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Empresa:</span>{' '}
                      {submission.company_name}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Email:</span>{' '}
                      {submission.email}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Website:</span>{' '}
                      <a
                        href={submission.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[hsl(195_100%_8%)] hover:underline"
                      >
                        {submission.website_url}
                      </a>
                    </div>
                    {submission.main_challenge && (
                      <div className="pt-3 border-t">
                        <span className="font-semibold text-gray-700">Desafio:</span>
                        <p className="mt-1 text-gray-600">{submission.main_challenge}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Report Editor */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Relatório Gerado</CardTitle>
                  <CardDescription>Edite o markdown do relatório final</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit">Editar</TabsTrigger>
                      <TabsTrigger value="preview">Visualizar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="edit" className="mt-4">
                      <Textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="min-h-[500px] font-mono text-sm"
                        placeholder="# Relatório Estratégico&#10;&#10;Digite o conteúdo do relatório aqui..."
                      />
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleSaveDraft} disabled={isSaving || isPublishing} variant="outline">
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Salvar Rascunho
                            </>
                          )}
                        </Button>
                        <Button onClick={handlePublishReport} disabled={isSaving || isPublishing}>
                          {isPublishing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Publicando...
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Publicar (Tornar Visível)
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleDownloadMarkdown}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar .md
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-4">
                      <div className="prose prose-sm md:prose-base max-w-none p-6 border rounded-lg bg-white min-h-[500px]">
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* PDF Generation */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Geração de PDF</CardTitle>
                  <CardDescription>Converta o markdown para PDF profissional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF} size="lg" className="w-full">
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando PDF...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        {pdfUrl ? 'Regenerar PDF' : 'Gerar PDF'}
                      </>
                    )}
                  </Button>

                  {pdfUrl && (
                    <>
                      <iframe src={pdfUrl} className="w-full h-96 border rounded-lg" />
                      <Button variant="outline" onClick={() => window.open(pdfUrl, '_blank')} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PDF
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Approval & Delivery */}
              <Card className="shadow-lg border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-900">Aprovar e Enviar</CardTitle>
                  <CardDescription>Envie o relatório aprovado para o cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleApproveAndSend}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!pdfUrl || isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Aprovar e Enviar para Cliente
                      </>
                    )}
                  </Button>

                  {!pdfUrl && (
                    <p className="text-sm text-red-600 text-center">
                      Por favor, gere o PDF antes de enviar
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
