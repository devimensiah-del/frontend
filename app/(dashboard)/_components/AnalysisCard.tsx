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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectOption } from "@/components/ui/Select";
import { normalizeToArray } from '@/lib/utils/format';

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

  // Normalize analysis data to support both snake_case (backend) and camelCase (frontend)
  // Cast to any to handle snake_case keys from backend API
  const rawAnalysis: any = analysis.analysis || {};

  // Normalize synthesis data (backend sends snake_case, frontend expects camelCase)
  const rawSynthesis = rawAnalysis.synthesis || {};
  const normalizedSynthesis = {
    executiveSummary: rawSynthesis.executiveSummary || rawSynthesis.executive_summary,
    keyFindings: rawSynthesis.keyFindings || rawSynthesis.key_findings,
    mainFindings: rawSynthesis.mainFindings || rawSynthesis.main_findings,
    strategicPriorities: rawSynthesis.strategicPriorities || rawSynthesis.strategic_priorities,
    centralChallenge: rawSynthesis.centralChallenge || rawSynthesis.central_challenge,
    overallRecommendation: rawSynthesis.overallRecommendation || rawSynthesis.overall_recommendation,
    importantNotes: rawSynthesis.importantNotes || rawSynthesis.important_notes,
    roadmap: rawSynthesis.roadmap,
  };

  const normalizedAnalysis: any = {
    pestel: rawAnalysis.pestel,
    porter: rawAnalysis.porter,
    swot: rawAnalysis.swot,
    synthesis: normalizedSynthesis,
    tamSamSom: rawAnalysis.tamSamSom || rawAnalysis.tam_sam_som,
    benchmarking: rawAnalysis.benchmarking,
    blueOcean: rawAnalysis.blueOcean || rawAnalysis.blue_ocean,
    growthHacking: rawAnalysis.growthHacking || rawAnalysis.growth_hacking,
    scenarios: rawAnalysis.scenarios,
    okrs: rawAnalysis.okrs,
    bsc: rawAnalysis.bsc,
    decisionMatrix: rawAnalysis.decisionMatrix || rawAnalysis.decision_matrix,
  };

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

        {/* Framework Selector Dropdown */}
        <div className="mb-4">
          <Select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full md:w-[300px]"
          >
            <SelectOption value="synthesis">Síntese Executiva</SelectOption>
            <SelectOption value="pestel">PESTEL</SelectOption>
            <SelectOption value="porter">5 Forças de Porter</SelectOption>
            <SelectOption value="tam_sam_som">TAM/SAM/SOM</SelectOption>
            <SelectOption value="swot">SWOT</SelectOption>
            <SelectOption value="benchmarking">Benchmarking</SelectOption>
            <SelectOption value="blue_ocean">Blue Ocean</SelectOption>
            <SelectOption value="growth_hacking">Growth Hacking</SelectOption>
            <SelectOption value="scenarios">Cenários</SelectOption>
            <SelectOption value="okrs">OKRs</SelectOption>
            <SelectOption value="bsc">Balanced Scorecard</SelectOption>
            <SelectOption value="decision_matrix">Matriz de Decisão</SelectOption>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* Synthesis Tab */}
          <TabsContent value="synthesis" className="space-y-6">
            {normalizedAnalysis.synthesis?.executiveSummary && (
              <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-navy-900 mb-2">Sumário Executivo</h4>
                    <p className="text-sm text-navy-900 leading-relaxed">
                      {normalizedAnalysis.synthesis.executiveSummary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {normalizedAnalysis.synthesis?.keyFindings && normalizedAnalysis.synthesis.keyFindings.length > 0 && (
              <Section title="Principais Descobertas" icon={<Lightbulb />}>
                <ul className="space-y-3">
                  {normalizedAnalysis.synthesis.keyFindings.map((finding: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-navy-900 leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {normalizedAnalysis.synthesis?.strategicPriorities && normalizedAnalysis.synthesis.strategicPriorities.length > 0 && (
              <Section title="Prioridades Estratégicas" icon={<Target />}>
                <div className="space-y-2">
                  {normalizedAnalysis.synthesis.strategicPriorities.map((priority: string, index: number) => (
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
            {normalizedAnalysis.swot && (
              <Section title="Análise SWOT">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SWOTQuadrant title="Forças" items={normalizedAnalysis.swot.strengths} color="green" />
                  <SWOTQuadrant title="Fraquezas" items={normalizedAnalysis.swot.weaknesses} color="red" />
                  <SWOTQuadrant title="Oportunidades" items={normalizedAnalysis.swot.opportunities} color="blue" />
                  <SWOTQuadrant title="Ameaças" items={normalizedAnalysis.swot.threats} color="yellow" />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* PESTEL Tab */}
          <TabsContent value="pestel" className="space-y-6">
            {normalizedAnalysis.pestel && (
              <Section title="Análise PESTEL" icon={<Globe />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.pestel.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Político" items={normalizedAnalysis.pestel.political} />
                  <ListSection title="Econômico" items={normalizedAnalysis.pestel.economic} />
                  <ListSection title="Social" items={normalizedAnalysis.pestel.social} />
                  <ListSection title="Tecnológico" items={normalizedAnalysis.pestel.technological} />
                  <ListSection title="Ambiental" items={normalizedAnalysis.pestel.environmental} />
                  <ListSection title="Legal" items={normalizedAnalysis.pestel.legal} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Porter Tab */}
          <TabsContent value="porter" className="space-y-6">
            {normalizedAnalysis.porter && (
              <Section title="5 Forças de Porter" icon={<Shield />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.porter.summary}</p>
                <div className="space-y-4">
                  {(normalizedAnalysis.porter.forces || []).map((force: any, index: number) => (
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
            {normalizedAnalysis.tamSamSom && (
              <Section title="TAM / SAM / SOM" icon={<TrendingUp />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.tamSamSom.summary}</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">TAM (Mercado Total)</h5>
                    <p className="text-sm">{normalizedAnalysis.tamSamSom.tam}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SAM (Mercado Endereçável)</h5>
                    <p className="text-sm">{normalizedAnalysis.tamSamSom.sam}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SOM (Mercado Obtenível)</h5>
                    <p className="text-sm">{normalizedAnalysis.tamSamSom.som}</p>
                  </div>
                </div>
                {normalizedAnalysis.tamSamSom.assumptions && normalizedAnalysis.tamSamSom.assumptions.length > 0 && (
                  <div className="mt-4">
                    <ListSection title="Premissas" items={normalizedAnalysis.tamSamSom.assumptions} />
                  </div>
                )}
              </Section>
            )}
          </TabsContent>

          {/* Benchmarking Tab */}
          <TabsContent value="benchmarking" className="space-y-6">
            {normalizedAnalysis.benchmarking && (
              <Section title="Benchmarking" icon={<BarChart />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.benchmarking.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Competidores Analisados" items={normalizedAnalysis.benchmarking.competitorsAnalyzed || normalizedAnalysis.benchmarking.competitors_analyzed} />
                  <ListSection title="Gaps de Performance" items={normalizedAnalysis.benchmarking.performanceGaps || normalizedAnalysis.benchmarking.performance_gaps} />
                  <ListSection title="Melhores Práticas" items={normalizedAnalysis.benchmarking.bestPractices || normalizedAnalysis.benchmarking.best_practices} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Blue Ocean Tab */}
          <TabsContent value="blue_ocean" className="space-y-6">
            {normalizedAnalysis.blueOcean && (
              <Section title="Estratégia do Oceano Azul" icon={<MapPin />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.blueOcean.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Eliminar" items={normalizedAnalysis.blueOcean.eliminate} />
                  <ListSection title="Reduzir" items={normalizedAnalysis.blueOcean.reduce} />
                  <ListSection title="Elevar" items={normalizedAnalysis.blueOcean.raise} />
                  <ListSection title="Criar" items={normalizedAnalysis.blueOcean.create} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Growth Hacking Tab */}
          <TabsContent value="growth_hacking" className="space-y-6">
            {normalizedAnalysis.growthHacking && (
              <Section title="Growth Hacking" icon={<Zap />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.growthHacking.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {(normalizedAnalysis.growthHacking.leap_loop || normalizedAnalysis.growthHacking.leapLoop) && (
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">{(normalizedAnalysis.growthHacking.leap_loop || normalizedAnalysis.growthHacking.leapLoop).name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{(normalizedAnalysis.growthHacking.leap_loop || normalizedAnalysis.growthHacking.leapLoop).type}</p>
                      <ListSection title="Passos" items={(normalizedAnalysis.growthHacking.leap_loop || normalizedAnalysis.growthHacking.leapLoop).steps} />
                      <ListSection title="Métricas" items={(normalizedAnalysis.growthHacking.leap_loop || normalizedAnalysis.growthHacking.leapLoop).metrics} />
                    </div>
                  )}
                  {(normalizedAnalysis.growthHacking.scale_loop || normalizedAnalysis.growthHacking.scaleLoop) && (
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">{(normalizedAnalysis.growthHacking.scale_loop || normalizedAnalysis.growthHacking.scaleLoop).name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{(normalizedAnalysis.growthHacking.scale_loop || normalizedAnalysis.growthHacking.scaleLoop).type}</p>
                      <ListSection title="Passos" items={(normalizedAnalysis.growthHacking.scale_loop || normalizedAnalysis.growthHacking.scaleLoop).steps} />
                      <ListSection title="Métricas" items={(normalizedAnalysis.growthHacking.scale_loop || normalizedAnalysis.growthHacking.scaleLoop).metrics} />
                    </div>
                  )}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            {normalizedAnalysis.scenarios && (
              <Section title="Análise de Cenários" icon={<GitBranch />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.scenarios.summary}</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {normalizedAnalysis.scenarios.optimistic && (
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-2">Otimista ({normalizedAnalysis.scenarios.optimistic.probability}%)</h5>
                      <p className="text-sm mb-2">{normalizedAnalysis.scenarios.optimistic.description}</p>
                      <ListSection title="Ações Necessárias" items={normalizedAnalysis.scenarios.optimistic.required_actions || normalizedAnalysis.scenarios.optimistic.requiredActions} />
                    </div>
                  )}
                  {normalizedAnalysis.scenarios.realist && (
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">Realista ({normalizedAnalysis.scenarios.realist.probability}%)</h5>
                      <p className="text-sm mb-2">{normalizedAnalysis.scenarios.realist.description}</p>
                      <ListSection title="Ações Necessárias" items={normalizedAnalysis.scenarios.realist.required_actions || normalizedAnalysis.scenarios.realist.requiredActions} />
                    </div>
                  )}
                  {normalizedAnalysis.scenarios.pessimistic && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h5 className="font-semibold text-red-900 mb-2">Pessimista ({normalizedAnalysis.scenarios.pessimistic.probability}%)</h5>
                      <p className="text-sm mb-2">{normalizedAnalysis.scenarios.pessimistic.description}</p>
                      <ListSection title="Ações Necessárias" items={normalizedAnalysis.scenarios.pessimistic.required_actions || normalizedAnalysis.scenarios.pessimistic.requiredActions} />
                    </div>
                  )}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* OKRs Tab */}
          <TabsContent value="okrs" className="space-y-6">
            {normalizedAnalysis.okrs && (
              <Section title="OKRs (Objectives & Key Results)" icon={<Target />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.okrs.summary}</p>
                <div className="space-y-4">
                  {normalizedAnalysis.okrs.quarters && normalizedAnalysis.okrs.quarters.map((quarter: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold">{quarter.quarter}</h5>
                        <span className="text-sm text-gray-500">{quarter.timeline}</span>
                      </div>
                      <p className="text-sm font-medium text-navy-900 mb-2">{quarter.objective}</p>
                      <ListSection title="Key Results" items={quarter.keyResults || quarter.key_results} />
                      <p className="text-sm text-gray-600 mt-2">Investimento: {quarter.investment}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </TabsContent>

          {/* BSC Tab */}
          <TabsContent value="bsc" className="space-y-6">
            {normalizedAnalysis.bsc && (
              <Section title="Balanced Scorecard" icon={<BarChart />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.bsc.summary}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Perspectiva Financeira" items={normalizedAnalysis.bsc.financial} />
                  <ListSection title="Perspectiva do Cliente" items={normalizedAnalysis.bsc.customer} />
                  <ListSection title="Processos Internos" items={normalizedAnalysis.bsc.internal_processes || normalizedAnalysis.bsc.internalProcesses} />
                  <ListSection title="Aprendizado e Crescimento" items={normalizedAnalysis.bsc.learning_growth || normalizedAnalysis.bsc.learningGrowth} />
                </div>
              </Section>
            )}
          </TabsContent>

          {/* Decision Matrix Tab */}
          <TabsContent value="decision_matrix" className="space-y-6">
            {normalizedAnalysis.decisionMatrix && (
              <Section title="Matriz de Decisão" icon={<CheckCircle />}>
                <p className="text-sm text-navy-900 mb-4 whitespace-pre-line">{normalizedAnalysis.decisionMatrix.summary}</p>

                {(normalizedAnalysis.decisionMatrix.final_recommendation || normalizedAnalysis.decisionMatrix.finalRecommendation) && (
                  <div className="p-4 bg-gold-50 border border-gold-200 rounded-lg mb-4">
                    <h5 className="font-semibold text-gold-900 mb-2">Recomendação Final</h5>
                    <p className="text-sm">{normalizedAnalysis.decisionMatrix.final_recommendation || normalizedAnalysis.decisionMatrix.finalRecommendation}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <ListSection title="Alternativas" items={normalizedAnalysis.decisionMatrix.alternatives} />
                  <ListSection title="Critérios" items={normalizedAnalysis.decisionMatrix.criteria} />
                </div>

                {(normalizedAnalysis.decisionMatrix.priority_recommendations || normalizedAnalysis.decisionMatrix.priorityRecommendations) && (normalizedAnalysis.decisionMatrix.priority_recommendations || normalizedAnalysis.decisionMatrix.priorityRecommendations).length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recomendações Prioritárias</h5>
                    {(normalizedAnalysis.decisionMatrix.priority_recommendations || normalizedAnalysis.decisionMatrix.priorityRecommendations).map((rec: any, index: number) => (
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

// Helper Component for Lists - handles both arrays and comma-separated strings
function ListSection({ title, items }: { title: string; items?: string[] | string }) {
  const normalizedItems = normalizeToArray(items);
  if (normalizedItems.length === 0) return null;

  return (
    <div>
      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h5>
      <ul className="space-y-1.5">
        {normalizedItems.map((item, index) => (
          <li key={index} className="text-sm text-navy-900 flex items-start gap-2">
            <span className="text-gold-500 mt-1.5 flex-shrink-0">•</span>
            <span className="leading-relaxed" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
