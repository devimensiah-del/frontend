import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  FileText,
  Lightbulb,
  CheckCircle,
  Download,
  Eye,
  EyeOff,
  Globe,
  Shield,
  Target,
  TrendingUp,
  BarChart,
  MapPin,
  Zap,
  GitBranch,
} from 'lucide-react';
import {
  Section,
  SWOTQuadrant,
} from '@/components/workflow';
import type { Analysis } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectOption } from "@/components/ui/Select";

interface AnalysisCardProps {
  analysis: Analysis;
  isAdmin?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
}

export function AnalysisCard({ analysis, isAdmin, onToggleVisibility }: AnalysisCardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("synthesis");
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  // Get visibility status (handle both camelCase and snake_case)
  const isVisibleToUser = analysis.isVisibleToUser ?? analysis.is_visible_to_user ?? false;

  // Check if PDF is actually available (has URL in database)
  const pdfUrl = (analysis as any).pdfUrl || (analysis as any).pdf_url;
  const hasPdfAvailable = !!pdfUrl;

  const downloadPdf = async () => {
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
  };

  const handleToggleVisibility = async () => {
    if (!onToggleVisibility) return;

    setIsTogglingVisibility(true);
    try {
      await onToggleVisibility(!isVisibleToUser);
      toast({
        title: isVisibleToUser ? 'Análise ocultada' : 'Análise liberada',
        description: isVisibleToUser
          ? 'O usuário não poderá mais ver esta análise.'
          : 'O usuário agora pode ver esta análise e baixar o PDF.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar a visibilidade.',
        variant: 'destructive',
      });
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  // Show admin controls section when status is approved/sent (for visibility toggle)
  const showAdminControls = analysis.status === 'approved' || analysis.status === 'sent';

  // PDF download only available when PDF actually exists in database
  const canDownloadPdf = hasPdfAvailable;
  const userCanDownload = canDownloadPdf && isVisibleToUser;

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Admin Controls - Visibility Toggle and PDF Download */}
        {isAdmin && showAdminControls && (
          <div className="pb-6 border-b border-surface-border">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              {/* Visibility Toggle */}
              <div className="flex items-center gap-3">
                <Button
                  variant={isVisibleToUser ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleVisibility}
                  disabled={isTogglingVisibility}
                  className={isVisibleToUser
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-gray-300 hover:bg-gray-100"
                  }
                >
                  {isVisibleToUser ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Visível para Usuário
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Oculto do Usuário
                    </>
                  )}
                </Button>
                <span className="text-xs text-gray-500">
                  {isVisibleToUser
                    ? "Usuário pode ver a análise e baixar o PDF"
                    : "Usuário não pode acessar esta análise"
                  }
                </span>
              </div>

              {/* Admin PDF Download - Only show when PDF is available */}
              {canDownloadPdf && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPdf}
                  className="border-navy-300 hover:bg-navy-100"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              )}
            </div>
          </div>
        )}

        {/* User PDF Download - Only when approved AND visible */}
        {!isAdmin && userCanDownload && (
          <div className="pb-6 border-b border-surface-border">
            <Button
              variant="architect"
              className="w-full"
              onClick={downloadPdf}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório Completo (PDF)
            </Button>
          </div>
        )}

        {/* User sees "not available" message if not visible */}
        {!isAdmin && showAdminControls && !isVisibleToUser && (
          <div className="pb-6 border-b border-surface-border">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <EyeOff className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                O relatório ainda não está disponível. Você será notificado quando estiver pronto.
              </p>
            </div>
          </div>
        )}

        {/* Mobile Tab Selector */}
        <div className="md:hidden mb-4">
          <Select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full"
          >
            <SelectOption value="synthesis">Síntese</SelectOption>
            <SelectOption value="pestel">PESTEL</SelectOption>
            <SelectOption value="porter">Porter</SelectOption>
            <SelectOption value="tam_sam_som">TAM/SAM/SOM</SelectOption>
            <SelectOption value="swot">SWOT</SelectOption>
            <SelectOption value="benchmarking">Benchmarking</SelectOption>
            <SelectOption value="blue_ocean">Blue Ocean</SelectOption>
            <SelectOption value="growth_hacking">Growth Hacking</SelectOption>
            <SelectOption value="scenarios">Cenários</SelectOption>
            <SelectOption value="okrs">OKRs</SelectOption>
            <SelectOption value="bsc">BSC</SelectOption>
            <SelectOption value="decision_matrix">Decision Matrix</SelectOption>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:flex w-full overflow-x-auto flex-nowrap justify-start bg-white p-2 border border-gray-200 rounded-none text-[13px] md:text-sm font-semibold uppercase tracking-wide scrollbar-hide">
            <TabsTrigger value="synthesis" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Síntese</TabsTrigger>
            <TabsTrigger value="pestel" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">PESTEL</TabsTrigger>
            <TabsTrigger value="porter" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Porter</TabsTrigger>
            <TabsTrigger value="tam_sam_som" className="min-w-[110px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">TAM/SAM/SOM</TabsTrigger>
            <TabsTrigger value="swot" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">SWOT</TabsTrigger>
            <TabsTrigger value="benchmarking" className="min-w-[120px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Benchmarking</TabsTrigger>
            <TabsTrigger value="blue_ocean" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Blue Ocean</TabsTrigger>
            <TabsTrigger value="growth_hacking" className="min-w-[120px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Growth Hacking</TabsTrigger>
            <TabsTrigger value="scenarios" className="min-w-[90px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Cenários</TabsTrigger>
            <TabsTrigger value="okrs" className="min-w-[70px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">OKRs</TabsTrigger>
            <TabsTrigger value="bsc" className="min-w-[60px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">BSC</TabsTrigger>
            <TabsTrigger value="decision_matrix" className="min-w-[120px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Decision Matrix</TabsTrigger>
          </TabsList>

          {/* Synthesis Tab */}
          <TabsContent value="synthesis" className="space-y-6">
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

            {analysis.analysis?.synthesis?.keyFindings && analysis.analysis.synthesis.keyFindings.length > 0 && (
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

            {analysis.analysis?.synthesis?.strategicPriorities && analysis.analysis.synthesis.strategicPriorities.length > 0 && (
              <Section title="Prioridades Estratégicas" icon={<Target />}>
                <div className="space-y-2">
                  {analysis.analysis.synthesis.strategicPriorities.map((priority, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gold-50 border border-gold-200 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-600 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm text-navy-900">{priority}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* SWOT Tab */}
          <TabsContent value="swot" className="space-y-6">
            {analysis.analysis?.swot && (
              <Section title="Análise SWOT">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SWOTQuadrant title="Forças" items={analysis.analysis.swot.strengths} color="green" />
                  <SWOTQuadrant title="Fraquezas" items={analysis.analysis.swot.weaknesses} color="red" />
                  <SWOTQuadrant title="Oportunidades" items={analysis.analysis.swot.opportunities} color="blue" />
                  <SWOTQuadrant title="Ameaças" items={analysis.analysis.swot.threats} color="yellow" />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* PESTEL Tab */}
          <TabsContent value="pestel" className="space-y-6">
            {analysis.analysis?.pestel && (
              <Section title="Análise PESTEL" icon={<Globe />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.pestel.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Político" items={analysis.analysis.pestel.political} />
                  <ListSection title="Econômico" items={analysis.analysis.pestel.economic} />
                  <ListSection title="Social" items={analysis.analysis.pestel.social} />
                  <ListSection title="Tecnológico" items={analysis.analysis.pestel.technological} />
                  <ListSection title="Ambiental" items={analysis.analysis.pestel.environmental} />
                  <ListSection title="Legal" items={analysis.analysis.pestel.legal} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Porter Tab */}
          <TabsContent value="porter" className="space-y-6">
            {analysis.analysis?.porter && (
              <Section title="5 Forças de Porter" icon={<Shield />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.porter.summary}</p>
                <div className="space-y-4">
                  {(analysis.analysis.porter.forces || []).map((force: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{force.force}</span>
                        <Badge variant="outline">{force.intensity}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{force.description}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* TAM/SAM/SOM Tab */}
          <TabsContent value="tam_sam_som" className="space-y-6">
            {analysis.analysis?.tamSamSom && (
              <Section title="TAM / SAM / SOM" icon={<TrendingUp />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.tamSamSom.summary}</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">TAM (Mercado Total)</h5>
                    <p className="text-sm">{analysis.analysis.tamSamSom.tam}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SAM (Mercado Endereçável)</h5>
                    <p className="text-sm">{analysis.analysis.tamSamSom.sam}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SOM (Mercado Obtenível)</h5>
                    <p className="text-sm">{analysis.analysis.tamSamSom.som}</p>
                  </div>
                </div>
                {analysis.analysis.tamSamSom.assumptions && analysis.analysis.tamSamSom.assumptions.length > 0 && (
                  <div className="mt-4">
                    <ListSection title="Premissas" items={analysis.analysis.tamSamSom.assumptions} />
                  </div>
                )}
              </Section>
            )}
          </TabsContent>

          {/* Benchmarking Tab */}
          <TabsContent value="benchmarking" className="space-y-6">
            {analysis.analysis?.benchmarking && (
              <Section title="Benchmarking" icon={<BarChart />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.benchmarking.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Competidores Analisados" items={analysis.analysis.benchmarking.competitorsAnalyzed} />
                  <ListSection title="Gaps de Performance" items={analysis.analysis.benchmarking.performanceGaps} />
                  <ListSection title="Melhores Práticas" items={analysis.analysis.benchmarking.bestPractices} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Blue Ocean Tab */}
          <TabsContent value="blue_ocean" className="space-y-6">
            {analysis.analysis?.blueOcean && (
              <Section title="Estratégia do Oceano Azul" icon={<MapPin />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.blueOcean.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Eliminar" items={analysis.analysis.blueOcean.eliminate} />
                  <ListSection title="Reduzir" items={analysis.analysis.blueOcean.reduce} />
                  <ListSection title="Elevar" items={analysis.analysis.blueOcean.raise} />
                  <ListSection title="Criar" items={analysis.analysis.blueOcean.create} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Growth Hacking Tab */}
          <TabsContent value="growth_hacking" className="space-y-6">
            {analysis.analysis?.growthHacking && (
              <Section title="Growth Hacking" icon={<Zap />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.growthHacking.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {analysis.analysis.growthHacking.leap_loop && (
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">{analysis.analysis.growthHacking.leap_loop.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{analysis.analysis.growthHacking.leap_loop.type}</p>
                      <ListSection title="Passos" items={analysis.analysis.growthHacking.leap_loop.steps} />
                      <ListSection title="Métricas" items={analysis.analysis.growthHacking.leap_loop.metrics} />
                    </div>
                  )}
                  {analysis.analysis.growthHacking.scale_loop && (
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">{analysis.analysis.growthHacking.scale_loop.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{analysis.analysis.growthHacking.scale_loop.type}</p>
                      <ListSection title="Passos" items={analysis.analysis.growthHacking.scale_loop.steps} />
                      <ListSection title="Métricas" items={analysis.analysis.growthHacking.scale_loop.metrics} />
                    </div>
                  )}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            {analysis.analysis?.scenarios && (
              <Section title="Análise de Cenários" icon={<GitBranch />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.scenarios.summary}</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {analysis.analysis.scenarios.optimistic && (
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-2">Otimista ({analysis.analysis.scenarios.optimistic.probability}%)</h5>
                      <p className="text-sm mb-2">{analysis.analysis.scenarios.optimistic.description}</p>
                      <ListSection title="Ações Necessárias" items={analysis.analysis.scenarios.optimistic.required_actions} />
                    </div>
                  )}
                  {analysis.analysis.scenarios.realist && (
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">Realista ({analysis.analysis.scenarios.realist.probability}%)</h5>
                      <p className="text-sm mb-2">{analysis.analysis.scenarios.realist.description}</p>
                      <ListSection title="Ações Necessárias" items={analysis.analysis.scenarios.realist.required_actions} />
                    </div>
                  )}
                  {analysis.analysis.scenarios.pessimistic && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h5 className="font-semibold text-red-900 mb-2">Pessimista ({analysis.analysis.scenarios.pessimistic.probability}%)</h5>
                      <p className="text-sm mb-2">{analysis.analysis.scenarios.pessimistic.description}</p>
                      <ListSection title="Ações Necessárias" items={analysis.analysis.scenarios.pessimistic.required_actions} />
                    </div>
                  )}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* OKRs Tab */}
          <TabsContent value="okrs" className="space-y-6">
            {analysis.analysis?.okrs && (
              <Section title="OKRs (Objectives & Key Results)" icon={<Target />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.okrs.summary}</p>
                <div className="space-y-4">
                  {analysis.analysis.okrs.quarters && analysis.analysis.okrs.quarters.map((quarter: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold">{quarter.quarter}</h5>
                        <span className="text-sm text-gray-500">{quarter.timeline}</span>
                      </div>
                      <p className="text-sm font-medium text-navy-900 mb-2">{quarter.objective}</p>
                      <ListSection title="Key Results" items={quarter.keyResults} />
                      <p className="text-sm text-gray-600 mt-2">Investimento: {quarter.investment}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* BSC Tab */}
          <TabsContent value="bsc" className="space-y-6">
            {analysis.analysis?.bsc && (
              <Section title="Balanced Scorecard" icon={<BarChart />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.bsc.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Perspectiva Financeira" items={analysis.analysis.bsc.financial} />
                  <ListSection title="Perspectiva do Cliente" items={analysis.analysis.bsc.customer} />
                  <ListSection title="Processos Internos" items={analysis.analysis.bsc.internal_processes} />
                  <ListSection title="Aprendizado e Crescimento" items={analysis.analysis.bsc.learning_growth} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Decision Matrix Tab */}
          <TabsContent value="decision_matrix" className="space-y-6">
            {analysis.analysis?.decisionMatrix && (
              <Section title="Matriz de Decisão" icon={<CheckCircle />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{analysis.analysis.decisionMatrix.summary}</p>

                {analysis.analysis.decisionMatrix.final_recommendation && (
                  <div className="p-4 bg-gold-50 border border-gold-200 rounded-lg mb-4">
                    <h5 className="font-semibold text-gold-900 mb-2">Recomendação Final</h5>
                    <p className="text-sm">{analysis.analysis.decisionMatrix.final_recommendation}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Alternativas" items={analysis.analysis.decisionMatrix.alternatives} />
                  <ListSection title="Critérios" items={analysis.analysis.decisionMatrix.criteria} />
                </div>

                {analysis.analysis.decisionMatrix.priority_recommendations && analysis.analysis.decisionMatrix.priority_recommendations.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recomendações Prioritárias</h5>
                    {analysis.analysis.decisionMatrix.priority_recommendations.map((rec: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center text-sm font-bold">
                            {rec.priority}
                          </div>
                          <div className="flex-1">
                            <h6 className="font-semibold mb-1">{rec.title}</h6>
                            <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>Prazo: {rec.timeline}</span>
                              <span>Orçamento: {rec.budget}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper Component for Lists
function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h5>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-navy-900 flex items-start gap-2">
            <span className="text-gold-500 mt-1.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
