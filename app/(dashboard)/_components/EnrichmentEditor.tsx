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
import { Select, SelectOption } from "@/components/ui/Select";

interface EnrichmentEditorProps {
  enrichment: Enrichment;
  onSave: (data: any) => void;
}

export function EnrichmentEditor({ enrichment, onSave }: EnrichmentEditorProps) {
  const [data, setData] = useState(enrichment.data || {});
  const [activeTab, setActiveTab] = useState("overview");
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

      {/* Mobile Tab Selector */}
      <div className="md:hidden mb-4">
        <Select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full"
        >
          <SelectOption value="overview">Visão Geral</SelectOption>
          <SelectOption value="financial">Financeiro</SelectOption>
          <SelectOption value="market">Mercado</SelectOption>
          <SelectOption value="strategic">Estratégico</SelectOption>
          <SelectOption value="competitive">Competitivo</SelectOption>
          <SelectOption value="raw">Dados Brutos</SelectOption>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden md:flex w-full overflow-x-auto flex-nowrap justify-start bg-white p-2 border border-gray-200 rounded-none text-[13px] md:text-sm font-semibold uppercase tracking-wide scrollbar-hide">
          <TabsTrigger value="overview" className="min-w-[120px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="financial" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="market" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Mercado
          </TabsTrigger>
          <TabsTrigger value="strategic" className="min-w-[110px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Estratégico
          </TabsTrigger>
          <TabsTrigger value="competitive" className="min-w-[110px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Competitivo
          </TabsTrigger>
          <TabsTrigger value="raw" className="min-w-[110px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Dados Brutos
          </TabsTrigger>
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
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={data.profile_overview?.description || ''}
                    onChange={(e) => updateSection('profile_overview', { description: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financials */}
        <TabsContent value="financial">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategic Assessment */}
        <TabsContent value="strategic">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Landscape */}
        <TabsContent value="competitive">
          <Card>
            <CardHeader><CardTitle>Cenário Competitivo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ListEditor
                label="Concorrentes"
                items={data.competitive_landscape?.competitors || []}
                onChange={(items) => updateSection('competitive_landscape', { competitors: items })}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Status de Share de Mercado</label>
                <Input
                  value={data.competitive_landscape?.market_share_status || ''}
                  onChange={(e) => updateSection('competitive_landscape', { market_share_status: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Data */}
        <TabsContent value="raw">
          <Card>
            <CardHeader><CardTitle>Dados Brutos (JSON)</CardTitle></CardHeader>
            <CardContent>
              <JsonEditor
                data={data}
                onChange={setData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
