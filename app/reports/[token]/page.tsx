'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, User, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

interface ReportViewProps {
  params: Promise<{ token: string }>;
}

export default function PublicReportViewPage({ params }: ReportViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [reportToken, setReportToken] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setReportToken(p.token));
  }, [params]);

  useEffect(() => {
    if (reportToken) {
      fetchReport();
    }
  }, [reportToken]);

  const fetchReport = async () => {
    if (!reportToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/${reportToken}`);

      if (response.status === 401) {
        setError('Token inválido ou expirado');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao carregar relatório');
      }

      const data = await response.json();
      setReport(data.report);
      setMarkdown(data.markdown || '');
    } catch (error) {
      console.error('Error fetching report:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (report?.pdf_url) {
      window.open(report.pdf_url, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'PDF não disponível',
        description: 'O PDF ainda não foi gerado',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(195_100%_8%)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Acesso Negado</h1>
            <p className="text-gray-600">{error}</p>
            <div className="pt-4">
              <Button onClick={() => router.push('/')} variant="outline">
                Voltar para Página Inicial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-[hsl(195_100%_8%)]">IMENSIAH</div>
              <div className="hidden md:block h-6 w-px bg-gray-300" />
              <div className="hidden md:block">
                <div className="text-sm text-gray-600">Relatório Estratégico</div>
                <div className="font-semibold text-gray-900">{report.company_name}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {report.pdf_url && (
                <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
              )}
              <Button onClick={() => router.push('/auth/signup')} size="sm">
                <User className="mr-2 h-4 w-4" />
                Criar Conta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Report Card */}
          <Card className="shadow-2xl">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="mt-8 bg-gradient-to-r from-blue-600 to-[hsl(195_100%_8%)]/90 text-white shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Gostou do Relatório?
              </h2>
              <p className="text-lg text-white/80">
                Crie sua conta no IMENSIAH para acessar o dashboard completo,
                compartilhar relatórios com sua equipe e solicitar novas análises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-[hsl(195_100%_8%)] hover:bg-[hsl(195_100%_8%)]/10"
                  onClick={() => router.push('/auth/signup')}
                >
                  Criar Conta Grátis
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => router.push('/#submission-form')}
                >
                  Solicitar Novo Diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg">
              <CardContent className="pt-6 text-center space-y-2">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900">Dashboard Completo</h3>
                <p className="text-sm text-gray-600">
                  Acesse todos os seus relatórios em um só lugar
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="pt-6 text-center space-y-2">
                <div className="text-4xl mb-2">🔗</div>
                <h3 className="font-semibold text-gray-900">Compartilhamento</h3>
                <p className="text-sm text-gray-600">
                  Compartilhe relatórios com sua equipe facilmente
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="pt-6 text-center space-y-2">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900">Análises Rápidas</h3>
                <p className="text-sm text-gray-600">
                  Solicite novos diagnósticos a qualquer momento
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Este relatório foi gerado por IMENSIAH</p>
            <p className="mt-2">
              <a href="https://imensiah.com" className="text-[hsl(195_100%_8%)] hover:underline">
                imensiah.com
              </a>
              {' | '}
              <a href="mailto:contato@imensiah.com" className="text-[hsl(195_100%_8%)] hover:underline">
                contato@imensiah.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
