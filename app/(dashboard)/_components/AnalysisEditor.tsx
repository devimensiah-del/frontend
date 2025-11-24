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

interface AnalysisEditorProps {
  analysis: Analysis;
  onSave: (data: any) => void;
}

export function AnalysisEditor({ analysis, onSave }: AnalysisEditorProps) {
  // Work with the nested 'analysis' object which contains the actual frameworks
  const [data, setData] = useState(analysis.analysis);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(data);
    toast({ title: "Sucesso", description: "Análise atualizada." });
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

      <Tabs defaultValue="synthesis" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="synthesis">Síntese</TabsTrigger>
          <TabsTrigger value="swot">SWOT</TabsTrigger>
          <TabsTrigger value="pestel">PESTEL</TabsTrigger>
          <TabsTrigger value="porter">Porter</TabsTrigger>
          <TabsTrigger value="json">JSON (Avançado)</TabsTrigger>
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
                <SwotListEditor 
                  label="Forças" 
                  items={data.swot?.strengths || []} 
                  onChange={(items) => updateFramework('swot', { strengths: items })} 
                />
                <SwotListEditor 
                  label="Fraquezas" 
                  items={data.swot?.weaknesses || []} 
                  onChange={(items) => updateFramework('swot', { weaknesses: items })} 
                />
                <SwotListEditor 
                  label="Oportunidades" 
                  items={data.swot?.opportunities || []} 
                  onChange={(items) => updateFramework('swot', { opportunities: items })} 
                />
                <SwotListEditor 
                  label="Ameaças" 
                  items={data.swot?.threats || []} 
                  onChange={(items) => updateFramework('swot', { threats: items })} 
                />
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

        {/* JSON Tab (Fallback) */}
        <TabsContent value="json">
          <Card>
            <CardHeader><CardTitle>Editor Avançado (JSON)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Use este editor para modificar frameworks que ainda não possuem interface visual dedicada (ex: OKRs, BSC, etc).</p>
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
