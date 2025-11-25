'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { analysisApi, authApi } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading-indicator';
import { Heading, Text, Eyebrow } from '@/components/ui/Typography';
import { Section, Container } from '@/components/editorial/Section';

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  // 1. Check Auth & Role
  const { data: _user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
  });

  // 2. Fetch Analysis
  const { data: analysis, isLoading: isAnalysisLoading, error: analysisError } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analysisApi.getBySubmissionId(id), // Use submission ID to get analysis
  });

  const isLoading = isUserLoading || isAnalysisLoading;

  const handleDownloadPDF = async () => {
    if (!analysis) return;
    setDownloading(true);
    try {
      // analysisApi.downloadReport expects submissionId
      const response = await analysisApi.downloadReport(analysis.submissionId);
      
      if (response && response.pdf_url) {
        window.open(response.pdf_url, '_blank');
        toast({
          title: 'PDF Aberto',
          description: 'O relatório foi aberto em uma nova guia.',
          variant: 'success',
        });
      } else {
        throw new Error('URL do PDF indisponível.');
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível baixar o PDF. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-paper">
        <Spinner size={40} />
      </div>
    );
  }

  if (analysisError || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-paper">
        <div className="text-center max-w-md px-4">
          <Heading variant="subtitle" className="mb-2 text-red-600">Erro ao carregar relatório</Heading>
          <Text>Não foi possível encontrar o relatório para este ID ou você não tem permissão para visualizá-lo.</Text>
          <Button variant="outline" className="mt-6" onClick={() => router.push('/dashboard')}>Voltar ao Painel</Button>
        </div>
      </div>
    );
  }

  const { analysis: data } = analysis;

  return (
    <div className="bg-surface-paper min-h-screen font-sans print:bg-white">
      {/* Navigation & Actions */}
      <div className="fixed top-8 left-8 z-50 print:hidden">
        <Button 
            variant="outline" 
            className="bg-white/80 backdrop-blur border-none shadow-sm hover:bg-white"
            onClick={() => router.push(`/submissions/${id}`)}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
        </Button>
      </div>

      {/* PDF DISABLED - TEMPORARY
      <div className="fixed bottom-8 right-8 z-50 print:hidden">
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="shadow-2xl btn-architect rounded-full px-8 py-6 h-auto text-sm"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
          Baixar PDF Oficial
        </Button>
      </div>
      */}

      {/* REPORT HEADER */}
      <Section className="bg-navy-900 text-white text-center py-24">
        <Container>
          <Eyebrow className="text-gold-500 mb-6">Relatório de Inteligência Estratégica</Eyebrow>
          <Heading as="h1" className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
            {data.synthesis.executiveSummary.split('.')[0] || "Análise Executiva"}
          </Heading>
          <div className="flex justify-center gap-4 text-sm uppercase tracking-widest text-gray-400">
            <span>Confidencial</span>
            <span>•</span>
            <span>{new Date(analysis.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </Container>
      </Section>

      {/* EXECUTIVE SUMMARY */}
      <Section className="bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg prose-headings:font-heading prose-headings:font-medium max-w-none">
            <h2 className="text-3xl text-navy-900 mb-8">Síntese Executiva</h2>
            <div className="whitespace-pre-wrap leading-relaxed text-gray-600">
              {data.synthesis.executiveSummary}
            </div>
            
            <div className="mt-12 grid md:grid-cols-2 gap-8 not-prose">
              <div className="bg-surface-paper p-8 border border-line">
                <h3 className="font-heading font-medium text-xl mb-4 text-navy-900">Principais Descobertas</h3>
                <ul className="space-y-3">
                  {data.synthesis.keyFindings.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600">
                      <span className="text-gold-500 font-bold">0{i+1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-navy-900 p-8 text-white">
                <h3 className="font-heading font-medium text-xl mb-4 text-white">Prioridades Estratégicas</h3>
                <ul className="space-y-3">
                  {data.synthesis.strategicPriorities.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <span className="text-gold-500 font-bold">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* SWOT ANALYSIS */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="text-center mb-16">
            <Eyebrow className="mb-4">Análise Interna & Externa</Eyebrow>
            <Heading variant="section">Matriz SWOT</Heading>
          </div>
          
          <div className="grid md:grid-cols-2 gap-1 max-w-6xl mx-auto border border-gray-200 bg-gray-200">
            {/* Strengths */}
            <div className="bg-white p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">FORÇAS</span>
              </div>
              <ul className="space-y-4">
                {data.swot.strengths.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 border-l-2 border-green-500 pl-4">
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">FRAQUEZAS</span>
              </div>
              <ul className="space-y-4">
                {data.swot.weaknesses.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 border-l-2 border-red-500 pl-4">
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-white p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">OPORTUNIDADES</span>
              </div>
              <ul className="space-y-4">
                {data.swot.opportunities.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 border-l-2 border-blue-500 pl-4">
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-white p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">AMEAÇAS</span>
              </div>
              <ul className="space-y-4">
                {data.swot.threats.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 border-l-2 border-orange-500 pl-4">
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* PESTEL & PORTER GRID */}
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* PESTEL */}
            <div>
              <Eyebrow className="mb-4">Macroambiente</Eyebrow>
              <Heading variant="title" className="mb-8">Análise PESTEL</Heading>
              <div className="space-y-6">
                <PestelItem label="Político" items={data.pestel.political} />
                <PestelItem label="Econômico" items={data.pestel.economic} />
                <PestelItem label="Social" items={data.pestel.social} />
                <PestelItem label="Tecnológico" items={data.pestel.technological} />
                <PestelItem label="Ambiental" items={data.pestel.environmental} />
                <PestelItem label="Legal" items={data.pestel.legal} />
              </div>
            </div>

            {/* PORTER */}
            <div>
              <Eyebrow className="mb-4">Microambiente</Eyebrow>
              <Heading variant="title" className="mb-8">5 Forças de Porter</Heading>
              <div className="space-y-6">
                {data.porter.forces.map((force, i) => (
                  <div key={i} className="bg-surface-paper p-6 border border-line">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-navy-900">{force.force}</h4>
                      <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded">{force.intensity}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{force.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ROADMAP */}
      <Section className="bg-navy-900 text-white">
        <Container className="max-w-4xl">
          <div className="text-center mb-16">
            <Eyebrow className="mb-4">Próximos Passos</Eyebrow>
            <Heading as="h2" className="text-3xl font-medium text-white">Roadmap Estratégico</Heading>
          </div>

          <div className="space-y-8">
            {data.synthesis.roadmap.map((step, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/20 rounded-full text-gold-500 font-heading font-medium group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors">
                  {i + 1}
                </div>
                <div className="pt-2 border-b border-white/10 pb-8 w-full group-last:border-0">
                  <p className="text-lg text-gray-200 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-line py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Powered by Imensiah AI</p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Imensiah. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper Component
function PestelItem({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="border-b border-line pb-4 last:border-0">
      <h4 className="font-medium text-navy-900 mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
        {label}
      </h4>
      <ul className="pl-4 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600">• {item}</li>
        ))}
      </ul>
    </div>
  );
}
