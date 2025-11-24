'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  FileText,
  Lightbulb,
  CheckCircle,
  Download,
  Send,
  Globe,
  Shield,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  MapPin,
  BarChart,
  GitBranch,
  Calendar,
} from 'lucide-react';
import {
  Section,
  SWOTQuadrant,
  FrameworkBadge,
  StatusBadge,
} from '@/components/workflow';
import { getFrameworkCompletion } from '@/lib/utils/workflow-helpers';
import type { Analysis } from '@/types';

interface AnalysisCardProps {
  analysis: Analysis;
}

const frameworkIcons: Record<string, React.ReactNode> = {
  PESTEL: <Globe className="w-3.5 h-3.5" />,
  Porter: <Shield className="w-3.5 h-3.5" />,
  SWOT: <Target className="w-3.5 h-3.5" />,
  'TAM/SAM/SOM': <TrendingUp className="w-3.5 h-3.5" />,
  Benchmarking: <BarChart className="w-3.5 h-3.5" />,
  'Blue Ocean': <MapPin className="w-3.5 h-3.5" />,
  'Growth Hacking': <Zap className="w-3.5 h-3.5" />,
  Scenarios: <GitBranch className="w-3.5 h-3.5" />,
  OKRs: <Target className="w-3.5 h-3.5" />,
  BSC: <BarChart className="w-3.5 h-3.5" />,
  'Decision Matrix': <CheckCircle className="w-3.5 h-3.5" />,
};

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const { completed, total } = getFrameworkCompletion(analysis);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="w-5 h-5 text-gold-600" />
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-navy-900">Relatório Estratégico</CardTitle>
                {analysis.version > 1 && (
                  <Badge variant="outline" className="text-xs">
                    v{analysis.version}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 text-text-secondary" />
                <p className="text-xs text-text-secondary">
                  Atualizado em {formatDate(analysis.updatedAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analysis.status === 'sent' && (
              <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                <Send className="w-3 h-3 mr-1" />
                Enviado
              </Badge>
            )}
            {analysis.status === 'approved' && (
              <Badge variant="default" className="bg-gold-50 text-gold-700 border-gold-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Aprovado
              </Badge>
            )}
          </div>
        </div>

        {/* Framework Completion */}
        <div className="mt-4 p-3 bg-surface-paper rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-navy-900 uppercase tracking-wider">
                Frameworks Aplicados
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {completed} de {total} análises completas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-4 border-gold-200 flex items-center justify-center">
                <span className="text-sm font-bold text-gold-600">
                  {Math.round((completed / total) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Executive Summary */}
        {analysis.analysis?.synthesis?.executiveSummary && (
          <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-navy-900 mb-2">Sumário Executivo</h4>
                <p className="text-sm text-navy-900 leading-relaxed">
                  {analysis.analysis.synthesis.executiveSummary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Findings */}
        {analysis.analysis?.synthesis?.keyFindings &&
          analysis.analysis.synthesis.keyFindings.length > 0 && (
            <Section title="Principais Descobertas" icon={<Lightbulb />}>
              <ul className="space-y-3">
                {analysis.analysis.synthesis.keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-navy-900 leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

        {/* Strategic Priorities */}
        {analysis.analysis?.synthesis?.strategicPriorities &&
          analysis.analysis.synthesis.strategicPriorities.length > 0 && (
            <Section title="Prioridades Estratégicas" icon={<Target />}>
              <div className="space-y-2">
                {analysis.analysis.synthesis.strategicPriorities.map((priority, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gold-50 border border-gold-200 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-600 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm text-navy-900">{priority}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

        {/* SWOT Grid */}
        {analysis.analysis?.swot && (
          <Section title="Análise SWOT">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SWOTQuadrant
                title="Forças"
                items={analysis.analysis.swot.strengths}
                color="green"
              />
              <SWOTQuadrant
                title="Fraquezas"
                items={analysis.analysis.swot.weaknesses}
                color="red"
              />
              <SWOTQuadrant
                title="Oportunidades"
                items={analysis.analysis.swot.opportunities}
                color="blue"
              />
              <SWOTQuadrant
                title="Ameaças"
                items={analysis.analysis.swot.threats}
                color="yellow"
              />
            </div>
          </Section>
        )}

        {/* Frameworks Grid */}
        <Section title="Frameworks Estratégicos">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <FrameworkBadge
              name="PESTEL"
              completed={!!analysis.analysis?.pestel}
              icon={frameworkIcons.PESTEL}
            />
            <FrameworkBadge
              name="Porter"
              completed={!!analysis.analysis?.porter}
              icon={frameworkIcons.Porter}
            />
            <FrameworkBadge
              name="SWOT"
              completed={!!analysis.analysis?.swot}
              icon={frameworkIcons.SWOT}
            />
            <FrameworkBadge
              name="TAM/SAM/SOM"
              completed={!!analysis.analysis?.tamSamSom}
              icon={frameworkIcons['TAM/SAM/SOM']}
            />
            <FrameworkBadge
              name="Benchmarking"
              completed={!!analysis.analysis?.benchmarking}
              icon={frameworkIcons.Benchmarking}
            />
            <FrameworkBadge
              name="Blue Ocean"
              completed={!!analysis.analysis?.blueOcean}
              icon={frameworkIcons['Blue Ocean']}
            />
            <FrameworkBadge
              name="Growth Hacking"
              completed={!!analysis.analysis?.growthHacking}
              icon={frameworkIcons['Growth Hacking']}
            />
            <FrameworkBadge
              name="Scenarios"
              completed={!!analysis.analysis?.scenarios}
              icon={frameworkIcons.Scenarios}
            />
            <FrameworkBadge
              name="OKRs"
              completed={!!analysis.analysis?.okrs}
              icon={frameworkIcons.OKRs}
            />
            <FrameworkBadge
              name="BSC"
              completed={!!analysis.analysis?.bsc}
              icon={frameworkIcons.BSC}
            />
            <FrameworkBadge
              name="Decision Matrix"
              completed={!!analysis.analysis?.decisionMatrix}
              icon={frameworkIcons['Decision Matrix']}
            />
          </div>
        </Section>

        {/* Download PDF Button */}
        {analysis.status === 'sent' && (
          <div className="pt-4 border-t border-surface-border">
            <Button
              variant="architect"
              className="w-full"
              onClick={async () => {
                // Get PDF URL from the submission's pdfUrl field
                // Note: Backend should populate submission.pdfUrl when analysis is sent
                const pdfUrl = (analysis as any).pdfUrl || (analysis as any).pdf_url;

                if (!pdfUrl) {
                  toast({
                    title: 'PDF não disponível',
                    description: 'O relatório ainda está sendo gerado. Por favor, aguarde alguns instantes.',
                    variant: 'destructive',
                  });
                  return;
                }

                try {
                  // Open PDF in new tab (works for most browsers)
                  window.open(pdfUrl, '_blank');

                  // Also trigger download
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `relatorio-estrategico-${analysis.id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  toast({
                    title: 'Download iniciado',
                    description: 'Seu relatório está sendo baixado.',
                  });
                } catch (error) {
                  console.error('Error downloading PDF:', error);
                  toast({
                    title: 'Erro no download',
                    description: 'Não foi possível baixar o PDF. Tente novamente.',
                    variant: 'destructive',
                  });
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório Completo (PDF)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
