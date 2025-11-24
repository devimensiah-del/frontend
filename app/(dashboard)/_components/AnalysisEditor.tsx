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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectOption } from "@/components/ui/Select";

interface AnalysisEditorProps {
  analysis: Analysis;
  onSave: (data: any) => void;
}

export function AnalysisEditor({ analysis, onSave }: AnalysisEditorProps) {
  // Work with the nested 'analysis' object which contains the actual frameworks
  const [data, setData] = useState(analysis.analysis);
  const [activeTab, setActiveTab] = useState("synthesis");
  const { toast } = useToast();

  const handleSave = () => {
    onSave(data);
    toast({ title: "Sucesso", description: "Nova versão criada com sucesso." });
  };

  const updateFramework = (framework: string, newData: any) => {
    setData((prev: any) => ({
      ...prev,
      [framework]: { ...prev[framework], ...newData }
    }));
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
          <SelectOption value="swot">SWOT</SelectOption>
          <SelectOption value="pestel">PESTEL</SelectOption>
          <SelectOption value="porter">Porter</SelectOption>
          <SelectOption value="ansoff">Ansoff</SelectOption>
          <SelectOption value="bcg">BCG</SelectOption>
          <SelectOption value="blue_ocean">Blue Ocean</SelectOption>
          <SelectOption value="marketing_mix">4Ps</SelectOption>
          <SelectOption value="mckinsey_7s">7S</SelectOption>
          <SelectOption value="vrio">VRIO</SelectOption>
          <SelectOption value="value_chain">Value Chain</SelectOption>
          <SelectOption value="business_model_canvas">Canvas</SelectOption>
          <SelectOption value="json">JSON</SelectOption>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden md:flex w-full overflow-x-auto flex-nowrap justify-start bg-white p-2 border border-gray-200 rounded-none text-[13px] md:text-sm font-semibold uppercase tracking-wide scrollbar-hide">
          <TabsTrigger value="synthesis" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Síntese</TabsTrigger>
          <TabsTrigger value="swot" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">SWOT</TabsTrigger>
          <TabsTrigger value="pestel" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">PESTEL</TabsTrigger>
          <TabsTrigger value="porter" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Porter</TabsTrigger>
          <TabsTrigger value="ansoff" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Ansoff</TabsTrigger>
          <TabsTrigger value="bcg" className="min-w-[60px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">BCG</TabsTrigger>
          <TabsTrigger value="blue_ocean" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Blue Ocean</TabsTrigger>
          <TabsTrigger value="marketing_mix" className="min-w-[60px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">4Ps</TabsTrigger>
          <TabsTrigger value="mckinsey_7s" className="min-w-[60px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">7S</TabsTrigger>
          <TabsTrigger value="vrio" className="min-w-[60px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">VRIO</TabsTrigger>
          <TabsTrigger value="value_chain" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Value Chain</TabsTrigger>
          <TabsTrigger value="business_model_canvas" className="min-w-[80px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Canvas</TabsTrigger>
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

        {/* Ansoff Tab */}
        <TabsContent value="ansoff">
          <Card>
            <CardHeader><CardTitle>Matriz Ansoff</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo Ansoff</label>
                <Textarea
                  value={data.ansoff?.summary || ''}
                  onChange={(e) => updateFramework('ansoff', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Penetração de Mercado" items={data.ansoff?.marketPenetration || []} onChange={(i) => updateFramework('ansoff', { marketPenetration: i })} />
                <ListEditor label="Desenvolvimento de Produto" items={data.ansoff?.productDevelopment || []} onChange={(i) => updateFramework('ansoff', { productDevelopment: i })} />
                <ListEditor label="Desenvolvimento de Mercado" items={data.ansoff?.marketDevelopment || []} onChange={(i) => updateFramework('ansoff', { marketDevelopment: i })} />
                <ListEditor label="Diversificação" items={data.ansoff?.diversification || []} onChange={(i) => updateFramework('ansoff', { diversification: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BCG Tab */}
        <TabsContent value="bcg">
          <Card>
            <CardHeader><CardTitle>Matriz BCG</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo BCG</label>
                <Textarea
                  value={data.bcg?.summary || ''}
                  onChange={(e) => updateFramework('bcg', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Estrelas" items={data.bcg?.stars || []} onChange={(i) => updateFramework('bcg', { stars: i })} />
                <ListEditor label="Vacas Leiteiras" items={data.bcg?.cashCows || []} onChange={(i) => updateFramework('bcg', { cashCows: i })} />
                <ListEditor label="Interrogações" items={data.bcg?.questionMarks || []} onChange={(i) => updateFramework('bcg', { questionMarks: i })} />
                <ListEditor label="Abacaxis" items={data.bcg?.dogs || []} onChange={(i) => updateFramework('bcg', { dogs: i })} />
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
                <label className="text-sm font-medium">Resumo Oceano Azul</label>
                <Textarea
                  value={data.blue_ocean?.summary || ''}
                  onChange={(e) => updateFramework('blue_ocean', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Eliminar" items={data.blue_ocean?.eliminate || []} onChange={(i) => updateFramework('blue_ocean', { eliminate: i })} />
                <ListEditor label="Reduzir" items={data.blue_ocean?.reduce || []} onChange={(i) => updateFramework('blue_ocean', { reduce: i })} />
                <ListEditor label="Elevar" items={data.blue_ocean?.raise || []} onChange={(i) => updateFramework('blue_ocean', { raise: i })} />
                <ListEditor label="Criar" items={data.blue_ocean?.create || []} onChange={(i) => updateFramework('blue_ocean', { create: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4Ps Tab */}
        <TabsContent value="marketing_mix">
          <Card>
            <CardHeader><CardTitle>Mix de Marketing (4Ps)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo 4Ps</label>
                <Textarea
                  value={data.marketing_mix?.summary || ''}
                  onChange={(e) => updateFramework('marketing_mix', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Produto" items={data.marketing_mix?.product || []} onChange={(i) => updateFramework('marketing_mix', { product: i })} />
                <ListEditor label="Preço" items={data.marketing_mix?.price || []} onChange={(i) => updateFramework('marketing_mix', { price: i })} />
                <ListEditor label="Praça" items={data.marketing_mix?.place || []} onChange={(i) => updateFramework('marketing_mix', { place: i })} />
                <ListEditor label="Promoção" items={data.marketing_mix?.promotion || []} onChange={(i) => updateFramework('marketing_mix', { promotion: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7S Tab */}
        <TabsContent value="mckinsey_7s">
          <Card>
            <CardHeader><CardTitle>McKinsey 7S</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo 7S</label>
                <Textarea
                  value={data.mckinsey_7s?.summary || ''}
                  onChange={(e) => updateFramework('mckinsey_7s', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Estratégia" items={data.mckinsey_7s?.strategy || []} onChange={(i) => updateFramework('mckinsey_7s', { strategy: i })} />
                <ListEditor label="Estrutura" items={data.mckinsey_7s?.structure || []} onChange={(i) => updateFramework('mckinsey_7s', { structure: i })} />
                <ListEditor label="Sistemas" items={data.mckinsey_7s?.systems || []} onChange={(i) => updateFramework('mckinsey_7s', { systems: i })} />
                <ListEditor label="Valores Compartilhados" items={data.mckinsey_7s?.sharedValues || []} onChange={(i) => updateFramework('mckinsey_7s', { sharedValues: i })} />
                <ListEditor label="Estilo" items={data.mckinsey_7s?.style || []} onChange={(i) => updateFramework('mckinsey_7s', { style: i })} />
                <ListEditor label="Staff" items={data.mckinsey_7s?.staff || []} onChange={(i) => updateFramework('mckinsey_7s', { staff: i })} />
                <ListEditor label="Habilidades" items={data.mckinsey_7s?.skills || []} onChange={(i) => updateFramework('mckinsey_7s', { skills: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VRIO Tab */}
        <TabsContent value="vrio">
          <Card>
            <CardHeader><CardTitle>Análise VRIO</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo VRIO</label>
                <Textarea
                  value={data.vrio?.summary || ''}
                  onChange={(e) => updateFramework('vrio', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Valioso" items={data.vrio?.valuable || []} onChange={(i) => updateFramework('vrio', { valuable: i })} />
                <ListEditor label="Raro" items={data.vrio?.rare || []} onChange={(i) => updateFramework('vrio', { rare: i })} />
                <ListEditor label="Inimitável" items={data.vrio?.inimitable || []} onChange={(i) => updateFramework('vrio', { inimitable: i })} />
                <ListEditor label="Organizado" items={data.vrio?.organized || []} onChange={(i) => updateFramework('vrio', { organized: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Value Chain Tab */}
        <TabsContent value="value_chain">
          <Card>
            <CardHeader><CardTitle>Cadeia de Valor</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo Cadeia de Valor</label>
                <Textarea
                  value={data.value_chain?.summary || ''}
                  onChange={(e) => updateFramework('value_chain', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor label="Atividades Primárias" items={data.value_chain?.primaryActivities || []} onChange={(i) => updateFramework('value_chain', { primaryActivities: i })} />
                <ListEditor label="Atividades de Suporte" items={data.value_chain?.supportActivities || []} onChange={(i) => updateFramework('value_chain', { supportActivities: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Model Canvas Tab */}
        <TabsContent value="business_model_canvas">
          <Card>
            <CardHeader><CardTitle>Business Model Canvas</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resumo Canvas</label>
                <Textarea
                  value={data.business_model_canvas?.summary || ''}
                  onChange={(e) => updateFramework('business_model_canvas', { summary: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <ListEditor label="Parceiros Chave" items={data.business_model_canvas?.keyPartners || []} onChange={(i) => updateFramework('business_model_canvas', { keyPartners: i })} />
                <ListEditor label="Atividades Chave" items={data.business_model_canvas?.keyActivities || []} onChange={(i) => updateFramework('business_model_canvas', { keyActivities: i })} />
                <ListEditor label="Recursos Chave" items={data.business_model_canvas?.keyResources || []} onChange={(i) => updateFramework('business_model_canvas', { keyResources: i })} />
                <ListEditor label="Proposta de Valor" items={data.business_model_canvas?.valuePropositions || []} onChange={(i) => updateFramework('business_model_canvas', { valuePropositions: i })} />
                <ListEditor label="Relacionamento" items={data.business_model_canvas?.customerRelationships || []} onChange={(i) => updateFramework('business_model_canvas', { customerRelationships: i })} />
                <ListEditor label="Canais" items={data.business_model_canvas?.channels || []} onChange={(i) => updateFramework('business_model_canvas', { channels: i })} />
                <ListEditor label="Segmentos de Clientes" items={data.business_model_canvas?.customerSegments || []} onChange={(i) => updateFramework('business_model_canvas', { customerSegments: i })} />
                <ListEditor label="Estrutura de Custos" items={data.business_model_canvas?.costStructure || []} onChange={(i) => updateFramework('business_model_canvas', { costStructure: i })} />
                <ListEditor label="Fontes de Receita" items={data.business_model_canvas?.revenueStreams || []} onChange={(i) => updateFramework('business_model_canvas', { revenueStreams: i })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSON Tab (Fallback) */}
        <TabsContent value="json">
          <Card>
            <CardHeader><CardTitle>Editor Avançado (JSON)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Use este editor para visualizar ou editar a estrutura completa dos dados.</p>
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
