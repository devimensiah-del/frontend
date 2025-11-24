import React, { useState } from 'react';
import { Enrichment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/use-toast';
import { Save, RotateCcw } from 'lucide-react';
import { ListEditor } from '@/components/admin/editors/ListEditor';
import { JsonEditor } from '@/components/admin/editors/JsonEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnrichmentEditorProps {
  enrichment: Enrichment;
  onSave: (data: any) => void;
}

export function EnrichmentEditor({ enrichment, onSave }: EnrichmentEditorProps) {
  const [data, setData] = useState(enrichment.data || {});
  const { toast } = useToast();

  const handleSave = () => {
    onSave(data);
    toast({ title: "Sucesso", description: "Dados de enriquecimento salvos." });
  };

  const updateSection = (section: string, newData: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], ...newData }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Editor de Enriquecimento</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setData(enrichment.data || {})}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reverter
          </Button>
          <Button onClick={handleSave} className="bg-navy-900 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financials">Financeiro</TabsTrigger>
          <TabsTrigger value="market">Mercado</TabsTrigger>
          <TabsTrigger value="strategy">Estratégia</TabsTrigger>
        </TabsList>

        {/* Profile Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Visão Geral</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Razão Social</label>
                  <Input 
                    value={data.profile_overview?.legal_name || ''} 
                    onChange={(e) => updateSection('profile_overview', { legal_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input 
                    value={data.profile_overview?.website || ''} 
                    onChange={(e) => updateSection('profile_overview', { website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fundação</label>
                  <Input 
                    value={data.profile_overview?.foundation_year || ''} 
                    onChange={(e) => updateSection('profile_overview', { foundation_year: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sede</label>
                  <Input 
                    value={data.profile_overview?.headquarters || ''} 
                    onChange={(e) => updateSection('profile_overview', { headquarters: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financials */}
        <TabsContent value="financials">
          <Card>
            <CardHeader><CardTitle>Dados Financeiros</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Estimativa de Receita</label>
                <Input 
                  value={data.financials?.revenue_estimate || ''} 
                  onChange={(e) => updateSection('financials', { revenue_estimate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Faixa de Funcionários</label>
                <Input 
                  value={data.financials?.employees_range || ''} 
                  onChange={(e) => updateSection('financials', { employees_range: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo de Negócio</label>
                <Input 
                  value={data.financials?.business_model || ''} 
                  onChange={(e) => updateSection('financials', { business_model: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Position */}
        <TabsContent value="market">
          <Card>
            <CardHeader><CardTitle>Posicionamento de Mercado</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Setor</label>
                <Input 
                  value={data.market_position?.sector || ''} 
                  onChange={(e) => updateSection('market_position', { sector: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Público Alvo</label>
                <Input 
                  value={data.market_position?.target_audience || ''} 
                  onChange={(e) => updateSection('market_position', { target_audience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Proposta de Valor</label>
                <Input 
                  value={data.market_position?.value_proposition || ''} 
                  onChange={(e) => updateSection('market_position', { value_proposition: e.target.value })}
                />
              </div>
              
              <div className="pt-4 border-t">
                <ListEditor 
                  label="Concorrentes"
                  items={data.competitive_landscape?.competitors || []}
                  onChange={(items) => updateSection('competitive_landscape', { competitors: items })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategic Assessment */}
        <TabsContent value="strategy">
          <Card>
            <CardHeader><CardTitle>Avaliação Estratégica</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Maturidade Digital (0-10)</label>
                <Input 
                  type="number"
                  min="0"
                  max="10"
                  value={data.strategic_assessment?.digital_maturity || 0} 
                  onChange={(e) => updateSection('strategic_assessment', { digital_maturity: parseInt(e.target.value) })}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <ListEditor 
                  label="Forças Identificadas"
                  items={data.strategic_assessment?.strengths || []}
                  onChange={(items) => updateSection('strategic_assessment', { strengths: items })}
                />
                <ListEditor 
                  label="Pontos de Atenção"
                  items={data.strategic_assessment?.weaknesses || []}
                  onChange={(items) => updateSection('strategic_assessment', { weaknesses: items })}
                />
              </div>

              <div className="pt-6 border-t">
                <label className="text-sm font-medium mb-2 block">Dados Brutos (JSON)</label>
                <JsonEditor 
                  data={data} 
                  onChange={setData} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
