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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectOption } from '@/components/ui/Select';

interface AnalysisEditorProps {
  analysis: Analysis;
  onSave: (data: Analysis['analysis']) => void;
}

export function AnalysisEditor({ analysis, onSave }: AnalysisEditorProps) {
  const { toast } = useToast();
  // Use any type to handle snake_case keys from backend API
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
      description: "AnA­lise atualizada.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
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
          <SelectOption value="json">JSON</SelectOption>
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
          <TabsTrigger value="json" className="min-w-[60px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">JSON</TabsTrigger>
        </TabsList>

        {/* Synthesis Tab */}
        <TabsContent value="synthesis">
          <Card>
            <CardHeader><CardTitle>Síntese Executiva</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo Executivo</label>
                <Textarea
                  className="min-h-[150px]"
                  value={data.synthesis?.executiveSummary || ''}
                  onChange={(e) => updateFramework('synthesis', { executiveSummary: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor
                  label="Principais Descobertas"
                  items={data.synthesis?.keyFindings || []}
                  onChange={(items) => updateFramework('synthesis', { keyFindings: items })}
                />
                <ListEditor
                  label="Prioridades Estratégicas"
                  items={data.synthesis?.strategicPriorities || []}
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
                  value={data.synthesis?.overallRecommendation || ''}
                  onChange={(e) => updateFramework('synthesis', { overallRecommendation: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SWOT Tab */}
        <TabsContent value="swot">
          <Card>
            <CardHeader><CardTitle>Análise SWOT</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
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
            <CardHeader><CardTitle>Análise PESTEL</CardTitle></CardHeader>
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
            <CardHeader><CardTitle>5 Forças de Porter</CardTitle></CardHeader>
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
                        <label className="text-xs font-medium">Força</label>
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
                        <label className="text-xs font-medium">Intensidade</label>
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
                      <label className="text-xs font-medium">Descrição</label>
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
            <CardHeader><CardTitle>TAM / SAM / SOM</CardTitle></CardHeader>
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
            <CardHeader><CardTitle>Benchmarking</CardTitle></CardHeader>
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
            <CardHeader><CardTitle>Estratégia do Oceano Azul</CardTitle></CardHeader>
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
            <CardHeader><CardTitle>Growth Hacking</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={getNormalizedData('growthHacking', 'growth_hacking')?.summary || ''}
                  onChange={(e) => updateFramework('growthHacking', { summary: e.target.value })}
                />
              </div>
              <p className="text-sm text-gray-500">Para edição detalhada dos loops (Leap Loop e Scale Loop), use o editor JSON.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios">
          <Card>
            <CardHeader><CardTitle>Análise de Cenários</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={data.scenarios?.summary || ''}
                  onChange={(e) => updateFramework('scenarios', { summary: e.target.value })}
                />
              </div>
              <p className="text-sm text-gray-500">Para edição detalhada dos cenários (Otimista, Realista, Pessimista), use o editor JSON.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OKRs Tab */}
        <TabsContent value="okrs">
          <Card>
            <CardHeader><CardTitle>OKRs (Objectives & Key Results)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo</label>
                <Textarea
                  value={data.okrs?.summary || ''}
                  onChange={(e) => updateFramework('okrs', { summary: e.target.value })}
                />
              </div>
              <p className="text-sm text-gray-500">Para edição detalhada dos OKRs por trimestre, use o editor JSON.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BSC Tab */}
        <TabsContent value="bsc">
          <Card>
            <CardHeader><CardTitle>Balanced Scorecard</CardTitle></CardHeader>
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
            <CardHeader><CardTitle>Matriz de Decisão</CardTitle></CardHeader>
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
                  label="Critérios"
                  items={getNormalizedData('decisionMatrix', 'decision_matrix')?.criteria || []}
                  onChange={(items) => updateFramework('decisionMatrix', { criteria: items })}
                />
              </div>
              <p className="text-sm text-gray-500">Para edição detalhada das recomendações prioritárias, use o editor JSON.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSON Tab (Fallback for all frameworks) */}
        <TabsContent value="json">
          <Card>
            <CardHeader><CardTitle>Editor Avançado (JSON)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Use este editor para visualizar ou editar todos os frameworks em formato JSON.</p>
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
