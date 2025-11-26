import React, { useState } from 'react';
import { Analysis, SWOTItem, PorterForce } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, RotateCcw, Plus, X } from 'lucide-react';
import { ListEditor } from '@/components/admin/editors/ListEditor';
import { JsonEditor } from '@/components/admin/editors/JsonEditor';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Select, SelectOption } from '@/components/ui/Select';

interface AnalysisEditorProps {
  analysis: Analysis;
  onSave: (data: Analysis['analysis']) => void;
}

export function AnalysisEditor({ analysis, onSave }: AnalysisEditorProps) {
  const { toast } = useToast();
  const [data, setData] = useState<any>(analysis.analysis);
  const [activeTab, setActiveTab] = useState<string>('synthesis');

  // Helper to get data with snake_case/camelCase fallback
  const getNormalizedData = (camelKey: string, snakeKey: string) => {
    return data?.[camelKey] || data?.[snakeKey];
  };

  const updateFramework = (key: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [key]: {
        ...(prev?.[key] || {}),
        ...value,
      },
    }));
  };

  const handleSave = () => {
    onSave(data);
    toast({
      title: "Salvo",
      description: "Análise atualizada.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Editor de Análise Estratégica</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setData(analysis.analysis)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reverter
          </Button>
          <Button onClick={handleSave} className="bg-navy-900 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Tab Selector Dropdown */}
      <div className="mb-4">
        <Select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full md:w-[300px]"
        >
          <SelectOption value="synthesis">Síntese Executiva</SelectOption>
          <SelectOption value="swot">SWOT</SelectOption>
          <SelectOption value="pestel">PESTEL</SelectOption>
          <SelectOption value="porter">5 Forças de Porter</SelectOption>
          <SelectOption value="tam_sam_som">TAM / SAM / SOM</SelectOption>
          <SelectOption value="benchmarking">Benchmarking</SelectOption>
          <SelectOption value="blue_ocean">Oceano Azul</SelectOption>
          <SelectOption value="growth_hacking">Growth Hacking</SelectOption>
          <SelectOption value="scenarios">Cenários</SelectOption>
          <SelectOption value="okrs">OKRs</SelectOption>
          <SelectOption value="bsc">Balanced Scorecard</SelectOption>
          <SelectOption value="decision_matrix">Matriz de Decisão</SelectOption>
          <SelectOption value="json">Dados Brutos (JSON)</SelectOption>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Synthesis Tab */}
        <TabsContent value="synthesis">
          <Card>
            <CardHeader>
              <CardTitle>Síntese Executiva</CardTitle>
              <p className="text-sm text-gray-500">Resumo consolidado de todas as análises estratégicas.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo Executivo</label>
                <Textarea
                  className="min-h-[150px]"
                  value={data.synthesis?.executiveSummary || data.synthesis?.executive_summary || ''}
                  onChange={(e) => updateFramework('synthesis', { executiveSummary: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor
                  label="Principais Descobertas"
                  items={data.synthesis?.keyFindings || data.synthesis?.key_findings || []}
                  onChange={(items) => updateFramework('synthesis', { keyFindings: items })}
                />
                <ListEditor
                  label="Prioridades Estratégicas"
                  items={data.synthesis?.strategicPriorities || data.synthesis?.strategic_priorities || []}
                  onChange={(items) => updateFramework('synthesis', { strategicPriorities: items })}
                />
              </div>

              <ListEditor
                label="Roadmap Sugerido"
                items={data.synthesis?.roadmap || []}
                onChange={(items) => updateFramework('synthesis', { roadmap: items })}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Recomendação Geral</label>
                <Input
                  value={data.synthesis?.overallRecommendation || data.synthesis?.overall_recommendation || ''}
                  onChange={(e) => updateFramework('synthesis', { overallRecommendation: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SWOT Tab */}
        <TabsContent value="swot">
          <Card>
            <CardHeader>
              <CardTitle>Análise SWOT</CardTitle>
              <p className="text-sm text-gray-500">Forças, Fraquezas, Oportunidades e Ameaças.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo da Análise SWOT</label>
                <Textarea
                  value={data.swot?.summary || ''}
                  onChange={(e) => updateFramework('swot', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <SwotListEditor label="Forças" items={data.swot?.strengths || []} onChange={(items) => updateFramework('swot', { strengths: items })} />
                <SwotListEditor label="Fraquezas" items={data.swot?.weaknesses || []} onChange={(items) => updateFramework('swot', { weaknesses: items })} />
                <SwotListEditor label="Oportunidades" items={data.swot?.opportunities || []} onChange={(items) => updateFramework('swot', { opportunities: items })} />
                <SwotListEditor label="Ameaças" items={data.swot?.threats || []} onChange={(items) => updateFramework('swot', { threats: items })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PESTEL Tab */}
        <TabsContent value="pestel">
          <Card>
            <CardHeader>
              <CardTitle>Análise PESTEL</CardTitle>
              <p className="text-sm text-gray-500">Fatores Políticos, Econômicos, Sociais, Tecnológicos, Ambientais e Legais.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo PESTEL</label>
                <Textarea
                  value={data.pestel?.summary || ''}
                  onChange={(e) => updateFramework('pestel', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Político" items={data.pestel?.political || []} onChange={(i) => updateFramework('pestel', { political: i })} />
                <ListEditor label="Econômico" items={data.pestel?.economic || []} onChange={(i) => updateFramework('pestel', { economic: i })} />
                <ListEditor label="Social" items={data.pestel?.social || []} onChange={(i) => updateFramework('pestel', { social: i })} />
                <ListEditor label="Tecnológico" items={data.pestel?.technological || []} onChange={(i) => updateFramework('pestel', { technological: i })} />
                <ListEditor label="Ambiental" items={data.pestel?.environmental || []} onChange={(i) => updateFramework('pestel', { environmental: i })} />
                <ListEditor label="Legal" items={data.pestel?.legal || []} onChange={(i) => updateFramework('pestel', { legal: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Porter Tab */}
        <TabsContent value="porter">
          <Card>
            <CardHeader>
              <CardTitle>5 Forças de Porter</CardTitle>
              <p className="text-sm text-gray-500">Análise competitiva do ambiente de mercado.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo Porter</label>
                <Textarea
                  value={data.porter?.summary || ''}
                  onChange={(e) => updateFramework('porter', { summary: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                {(data.porter?.forces || []).map((force: PorterForce, index: number) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Força</label>
                        <Input
                          value={force.force}
                          onChange={(e) => {
                            const newForces = [...data.porter.forces];
                            newForces[index] = { ...force, force: e.target.value };
                            updateFramework('porter', { forces: newForces });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Intensidade</label>
                        <Input
                          value={force.intensity}
                          onChange={(e) => {
                            const newForces = [...data.porter.forces];
                            newForces[index] = { ...force, intensity: e.target.value };
                            updateFramework('porter', { forces: newForces });
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600">Descrição</label>
                      <Textarea
                        value={force.description}
                        onChange={(e) => {
                          const newForces = [...data.porter.forces];
                          newForces[index] = { ...force, description: e.target.value };
                          updateFramework('porter', { forces: newForces });
                        }}
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAM/SAM/SOM Tab */}
        <TabsContent value="tam_sam_som">
          <Card>
            <CardHeader>
              <CardTitle>TAM / SAM / SOM</CardTitle>
              <p className="text-sm text-gray-500">Dimensionamento de mercado total, endereçável e obtenível.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={getNormalizedData('tamSamSom', 'tam_sam_som')?.summary || ''}
                  onChange={(e) => updateFramework('tamSamSom', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">TAM (Mercado Total)</label>
                  <Textarea
                    value={getNormalizedData('tamSamSom', 'tam_sam_som')?.tam || ''}
                    onChange={(e) => updateFramework('tamSamSom', { tam: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SAM (Mercado Endereçável)</label>
                  <Textarea
                    value={getNormalizedData('tamSamSom', 'tam_sam_som')?.sam || ''}
                    onChange={(e) => updateFramework('tamSamSom', { sam: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SOM (Mercado Obtenível)</label>
                  <Textarea
                    value={getNormalizedData('tamSamSom', 'tam_sam_som')?.som || ''}
                    onChange={(e) => updateFramework('tamSamSom', { som: e.target.value })}
                  />
                </div>
              </div>
              <ListEditor
                label="Premissas"
                items={getNormalizedData('tamSamSom', 'tam_sam_som')?.assumptions || []}
                onChange={(items) => updateFramework('tamSamSom', { assumptions: items })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benchmarking Tab */}
        <TabsContent value="benchmarking">
          <Card>
            <CardHeader>
              <CardTitle>Benchmarking</CardTitle>
              <p className="text-sm text-gray-500">Comparação com concorrentes e melhores práticas do mercado.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={data.benchmarking?.summary || ''}
                  onChange={(e) => updateFramework('benchmarking', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor
                  label="Competidores Analisados"
                  items={data.benchmarking?.competitorsAnalyzed || data.benchmarking?.competitors_analyzed || []}
                  onChange={(items) => updateFramework('benchmarking', { competitorsAnalyzed: items })}
                />
                <ListEditor
                  label="Gaps de Performance"
                  items={data.benchmarking?.performanceGaps || data.benchmarking?.performance_gaps || []}
                  onChange={(items) => updateFramework('benchmarking', { performanceGaps: items })}
                />
                <ListEditor
                  label="Melhores Práticas"
                  items={data.benchmarking?.bestPractices || data.benchmarking?.best_practices || []}
                  onChange={(items) => updateFramework('benchmarking', { bestPractices: items })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blue Ocean Tab */}
        <TabsContent value="blue_ocean">
          <Card>
            <CardHeader>
              <CardTitle>Estratégia do Oceano Azul</CardTitle>
              <p className="text-sm text-gray-500">Identificação de novos espaços de mercado inexplorados.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={getNormalizedData('blueOcean', 'blue_ocean')?.summary || ''}
                  onChange={(e) => updateFramework('blueOcean', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor
                  label="Eliminar"
                  items={getNormalizedData('blueOcean', 'blue_ocean')?.eliminate || []}
                  onChange={(items) => updateFramework('blueOcean', { eliminate: items })}
                />
                <ListEditor
                  label="Reduzir"
                  items={getNormalizedData('blueOcean', 'blue_ocean')?.reduce || []}
                  onChange={(items) => updateFramework('blueOcean', { reduce: items })}
                />
                <ListEditor
                  label="Elevar"
                  items={getNormalizedData('blueOcean', 'blue_ocean')?.raise || []}
                  onChange={(items) => updateFramework('blueOcean', { raise: items })}
                />
                <ListEditor
                  label="Criar"
                  items={getNormalizedData('blueOcean', 'blue_ocean')?.create || []}
                  onChange={(items) => updateFramework('blueOcean', { create: items })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Hacking Tab */}
        <TabsContent value="growth_hacking">
          <Card>
            <CardHeader>
              <CardTitle>Growth Hacking</CardTitle>
              <p className="text-sm text-gray-500">Estratégias de crescimento acelerado e loops virais.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={getNormalizedData('growthHacking', 'growth_hacking')?.summary || ''}
                  onChange={(e) => updateFramework('growthHacking', { summary: e.target.value })}
                />
              </div>

              {/* Leap Loop */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Leap Loop (Aquisição)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop?.name || getNormalizedData('growthHacking', 'growth_hacking')?.leapLoop?.name || ''}
                      onChange={(e) => updateFramework('growthHacking', { leap_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop, name: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Input
                      value={getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop?.type || getNormalizedData('growthHacking', 'growth_hacking')?.leapLoop?.type || ''}
                      onChange={(e) => updateFramework('growthHacking', { leap_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop, type: e.target.value } })}
                    />
                  </div>
                </div>
                <ListEditor
                  label="Passos"
                  items={getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop?.steps || getNormalizedData('growthHacking', 'growth_hacking')?.leapLoop?.steps || []}
                  onChange={(items) => updateFramework('growthHacking', { leap_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop, steps: items } })}
                />
                <ListEditor
                  label="Métricas"
                  items={getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop?.metrics || getNormalizedData('growthHacking', 'growth_hacking')?.leapLoop?.metrics || []}
                  onChange={(items) => updateFramework('growthHacking', { leap_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.leap_loop, metrics: items } })}
                />
              </div>

              {/* Scale Loop */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Scale Loop (Retenção)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop?.name || getNormalizedData('growthHacking', 'growth_hacking')?.scaleLoop?.name || ''}
                      onChange={(e) => updateFramework('growthHacking', { scale_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop, name: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Input
                      value={getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop?.type || getNormalizedData('growthHacking', 'growth_hacking')?.scaleLoop?.type || ''}
                      onChange={(e) => updateFramework('growthHacking', { scale_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop, type: e.target.value } })}
                    />
                  </div>
                </div>
                <ListEditor
                  label="Passos"
                  items={getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop?.steps || getNormalizedData('growthHacking', 'growth_hacking')?.scaleLoop?.steps || []}
                  onChange={(items) => updateFramework('growthHacking', { scale_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop, steps: items } })}
                />
                <ListEditor
                  label="Métricas"
                  items={getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop?.metrics || getNormalizedData('growthHacking', 'growth_hacking')?.scaleLoop?.metrics || []}
                  onChange={(items) => updateFramework('growthHacking', { scale_loop: { ...getNormalizedData('growthHacking', 'growth_hacking')?.scale_loop, metrics: items } })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Cenários</CardTitle>
              <p className="text-sm text-gray-500">Projeções otimista, realista e pessimista.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={data.scenarios?.summary || ''}
                  onChange={(e) => updateFramework('scenarios', { summary: e.target.value })}
                />
              </div>

              {/* Optimistic */}
              <div className="space-y-4 pt-4 border-t border-green-200 bg-green-50/50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wider">Cenário Otimista</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={data.scenarios?.optimistic?.description || ''}
                      onChange={(e) => updateFramework('scenarios', { optimistic: { ...data.scenarios?.optimistic, description: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Probabilidade (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={data.scenarios?.optimistic?.probability || ''}
                      onChange={(e) => updateFramework('scenarios', { optimistic: { ...data.scenarios?.optimistic, probability: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                </div>
                <ListEditor
                  label="Ações Necessárias"
                  items={data.scenarios?.optimistic?.required_actions || data.scenarios?.optimistic?.requiredActions || []}
                  onChange={(items) => updateFramework('scenarios', { optimistic: { ...data.scenarios?.optimistic, required_actions: items } })}
                />
              </div>

              {/* Realist (note: backend uses 'realist' not 'realistic') */}
              <div className="space-y-4 pt-4 border-t border-blue-200 bg-blue-50/50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Cenário Realista</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={data.scenarios?.realist?.description || ''}
                      onChange={(e) => updateFramework('scenarios', { realist: { ...data.scenarios?.realist, description: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Probabilidade (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={data.scenarios?.realist?.probability || ''}
                      onChange={(e) => updateFramework('scenarios', { realist: { ...data.scenarios?.realist, probability: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                </div>
                <ListEditor
                  label="Ações Necessárias"
                  items={data.scenarios?.realist?.required_actions || data.scenarios?.realist?.requiredActions || []}
                  onChange={(items) => updateFramework('scenarios', { realist: { ...data.scenarios?.realist, required_actions: items } })}
                />
              </div>

              {/* Pessimistic */}
              <div className="space-y-4 pt-4 border-t border-red-200 bg-red-50/50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-red-700 uppercase tracking-wider">Cenário Pessimista</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={data.scenarios?.pessimistic?.description || ''}
                      onChange={(e) => updateFramework('scenarios', { pessimistic: { ...data.scenarios?.pessimistic, description: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Probabilidade (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={data.scenarios?.pessimistic?.probability || ''}
                      onChange={(e) => updateFramework('scenarios', { pessimistic: { ...data.scenarios?.pessimistic, probability: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                </div>
                <ListEditor
                  label="Ações Necessárias"
                  items={data.scenarios?.pessimistic?.required_actions || data.scenarios?.pessimistic?.requiredActions || []}
                  onChange={(items) => updateFramework('scenarios', { pessimistic: { ...data.scenarios?.pessimistic, required_actions: items } })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OKRs Tab */}
        <TabsContent value="okrs">
          <Card>
            <CardHeader>
              <CardTitle>OKRs (Objectives & Key Results)</CardTitle>
              <p className="text-sm text-gray-500">Objetivos e resultados-chave por trimestre.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={data.okrs?.summary || ''}
                  onChange={(e) => updateFramework('okrs', { summary: e.target.value })}
                />
              </div>

              {/* Quarters - Dynamic array */}
              {(data.okrs?.quarters || []).map((quarter: any, index: number) => (
                <div key={index} className="space-y-4 pt-4 border-t p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{quarter.quarter || `Trimestre ${index + 1}`}</h4>
                    <span className="text-sm text-gray-500">{quarter.timeline}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trimestre</label>
                      <Input
                        value={quarter.quarter || ''}
                        onChange={(e) => {
                          const newQuarters = [...(data.okrs?.quarters || [])];
                          newQuarters[index] = { ...quarter, quarter: e.target.value };
                          updateFramework('okrs', { quarters: newQuarters });
                        }}
                        placeholder="Ex: Q1 2025"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duração</label>
                      <Input
                        value={quarter.timeline || ''}
                        onChange={(e) => {
                          const newQuarters = [...(data.okrs?.quarters || [])];
                          newQuarters[index] = { ...quarter, timeline: e.target.value };
                          updateFramework('okrs', { quarters: newQuarters });
                        }}
                        placeholder="Ex: 3 meses"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Objetivo</label>
                    <Textarea
                      value={quarter.objective || ''}
                      onChange={(e) => {
                        const newQuarters = [...(data.okrs?.quarters || [])];
                        newQuarters[index] = { ...quarter, objective: e.target.value };
                        updateFramework('okrs', { quarters: newQuarters });
                      }}
                    />
                  </div>
                  <ListEditor
                    label="Key Results"
                    items={quarter.keyResults || quarter.key_results || []}
                    onChange={(items) => {
                      const newQuarters = [...(data.okrs?.quarters || [])];
                      newQuarters[index] = { ...quarter, keyResults: items };
                      updateFramework('okrs', { quarters: newQuarters });
                    }}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Investimento Estimado</label>
                    <Input
                      value={quarter.investment || ''}
                      onChange={(e) => {
                        const newQuarters = [...(data.okrs?.quarters || [])];
                        newQuarters[index] = { ...quarter, investment: e.target.value };
                        updateFramework('okrs', { quarters: newQuarters });
                      }}
                      placeholder="Ex: R$ 30-50 mil"
                    />
                  </div>
                </div>
              ))}

              {/* Add Quarter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newQuarters = [...(data.okrs?.quarters || []), {
                    quarter: `Q${(data.okrs?.quarters?.length || 0) + 1} ${new Date().getFullYear()}`,
                    timeline: '3 meses',
                    objective: '',
                    keyResults: [],
                    investment: ''
                  }];
                  updateFramework('okrs', { quarters: newQuarters });
                }}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Trimestre
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BSC Tab */}
        <TabsContent value="bsc">
          <Card>
            <CardHeader>
              <CardTitle>Balanced Scorecard</CardTitle>
              <p className="text-sm text-gray-500">Perspectivas financeira, cliente, processos e aprendizado.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={data.bsc?.summary || ''}
                  onChange={(e) => updateFramework('bsc', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor
                  label="Perspectiva Financeira"
                  items={data.bsc?.financial || []}
                  onChange={(items) => updateFramework('bsc', { financial: items })}
                />
                <ListEditor
                  label="Perspectiva do Cliente"
                  items={data.bsc?.customer || []}
                  onChange={(items) => updateFramework('bsc', { customer: items })}
                />
                <ListEditor
                  label="Processos Internos"
                  items={data.bsc?.internal_processes || data.bsc?.internalProcesses || []}
                  onChange={(items) => updateFramework('bsc', { internal_processes: items })}
                />
                <ListEditor
                  label="Aprendizado e Crescimento"
                  items={data.bsc?.learning_growth || data.bsc?.learningGrowth || []}
                  onChange={(items) => updateFramework('bsc', { learning_growth: items })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decision Matrix Tab */}
        <TabsContent value="decision_matrix">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Decisão</CardTitle>
              <p className="text-sm text-gray-500">Avaliação ponderada de alternativas estratégicas.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={getNormalizedData('decisionMatrix', 'decision_matrix')?.summary || ''}
                  onChange={(e) => updateFramework('decisionMatrix', { summary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recomendação Final</label>
                <Textarea
                  value={getNormalizedData('decisionMatrix', 'decision_matrix')?.final_recommendation || getNormalizedData('decisionMatrix', 'decision_matrix')?.finalRecommendation || ''}
                  onChange={(e) => updateFramework('decisionMatrix', { final_recommendation: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor
                  label="Alternativas"
                  items={getNormalizedData('decisionMatrix', 'decision_matrix')?.alternatives || []}
                  onChange={(items) => updateFramework('decisionMatrix', { alternatives: items })}
                />
                <ListEditor
                  label="Critérios de Avaliação"
                  items={getNormalizedData('decisionMatrix', 'decision_matrix')?.criteria || []}
                  onChange={(items) => updateFramework('decisionMatrix', { criteria: items })}
                />
              </div>

              {/* Priority Recommendations */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recomendações Prioritárias</h4>
                <ListEditor
                  label="Alta Prioridade"
                  items={getNormalizedData('decisionMatrix', 'decision_matrix')?.priorityRecommendations?.high || []}
                  onChange={(items) => updateFramework('decisionMatrix', {
                    priorityRecommendations: {
                      ...getNormalizedData('decisionMatrix', 'decision_matrix')?.priorityRecommendations,
                      high: items
                    }
                  })}
                />
                <ListEditor
                  label="Média Prioridade"
                  items={getNormalizedData('decisionMatrix', 'decision_matrix')?.priorityRecommendations?.medium || []}
                  onChange={(items) => updateFramework('decisionMatrix', {
                    priorityRecommendations: {
                      ...getNormalizedData('decisionMatrix', 'decision_matrix')?.priorityRecommendations,
                      medium: items
                    }
                  })}
                />
                <ListEditor
                  label="Baixa Prioridade"
                  items={getNormalizedData('decisionMatrix', 'decision_matrix')?.priorityRecommendations?.low || []}
                  onChange={(items) => updateFramework('decisionMatrix', {
                    priorityRecommendations: {
                      ...getNormalizedData('decisionMatrix', 'decision_matrix')?.priorityRecommendations,
                      low: items
                    }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSON Tab */}
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Dados Brutos (JSON)</CardTitle>
              <p className="text-sm text-gray-500">Editor avançado para visualizar e modificar todos os dados da análise.</p>
            </CardHeader>
            <CardContent>
              <JsonEditor data={data} onChange={setData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper for SWOT Items
function SwotListEditor({ label, items, onChange }: { label: string, items: SWOTItem[], onChange: (i: SWOTItem[]) => void }) {
  const handleAdd = () => {
    onChange([...items, { content: "", confidence: "Alta", source: "Admin" }]);
  };

  const handleChange = (index: number, content: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], content };
    onChange(newItems);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Textarea
              value={item.content}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 min-h-[2.5rem]"
            />
            <Button variant="ghost" size="icon" onClick={() => handleRemove(index)} className="text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={handleAdd} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-2" /> Adicionar
      </Button>
    </div>
  );
}
