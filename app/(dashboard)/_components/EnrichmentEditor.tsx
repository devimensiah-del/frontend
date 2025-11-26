import React, { useState } from 'react';
import { Enrichment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
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
  // Use 'any' for flexible JSON editing - the backend data structure varies
  const [data, setData] = useState<Record<string, any>>(enrichment.data as Record<string, any> || {});
  const [activeTab, setActiveTab] = useState("submitted");
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

  const updateNestedSection = (parent: string, child: string, newData: any) => {
    setData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: { ...prev[parent]?.[child], ...newData }
      }
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

      {/* Tab Selector Dropdown */}
      <div className="mb-4">
        <Select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full md:w-[300px]"
        >
          <SelectOption value="submitted">Dados Enviados</SelectOption>
          <SelectOption value="discovered">Dados Descobertos (IA)</SelectOption>
          <SelectOption value="overview">Perfil da Empresa</SelectOption>
          <SelectOption value="strategic">Avaliação Estratégica</SelectOption>
          <SelectOption value="financial">Contexto Financeiro</SelectOption>
          <SelectOption value="market">Posição de Mercado</SelectOption>
          <SelectOption value="macro">Contexto Macroeconômico</SelectOption>
          <SelectOption value="raw">Dados Brutos (JSON)</SelectOption>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        {/* Submitted Data Tab */}
        <TabsContent value="submitted">
          <Card>
            <CardHeader>
              <CardTitle>Dados Enviados pelo Usuário</CardTitle>
              <p className="text-sm text-gray-500">Informações fornecidas pelo usuário no formulário de submissão.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Informações da Empresa</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Empresa</label>
                    <Input
                      value={data.submitted_data?.company_name || ''}
                      onChange={(e) => updateSection('submitted_data', { company_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CNPJ</label>
                    <Input
                      value={data.submitted_data?.cnpj || ''}
                      onChange={(e) => updateSection('submitted_data', { cnpj: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input
                      value={data.submitted_data?.website || ''}
                      onChange={(e) => updateSection('submitted_data', { website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Setor/Indústria</label>
                    <Input
                      value={data.submitted_data?.industry || ''}
                      onChange={(e) => updateSection('submitted_data', { industry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tamanho da Empresa</label>
                    <Input
                      value={data.submitted_data?.company_size || ''}
                      onChange={(e) => updateSection('submitted_data', { company_size: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Localização</label>
                    <Input
                      value={data.submitted_data?.location || ''}
                      onChange={(e) => updateSection('submitted_data', { location: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Informações de Contato</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Contato</label>
                    <Input
                      value={data.submitted_data?.contact_name || ''}
                      onChange={(e) => updateSection('submitted_data', { contact_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email do Contato</label>
                    <Input
                      value={data.submitted_data?.contact_email || ''}
                      onChange={(e) => updateSection('submitted_data', { contact_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      value={data.submitted_data?.contact_phone || ''}
                      onChange={(e) => updateSection('submitted_data', { contact_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cargo</label>
                    <Input
                      value={data.submitted_data?.contact_position || ''}
                      onChange={(e) => updateSection('submitted_data', { contact_position: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Business Context */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Contexto de Negócio</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mercado Alvo</label>
                    <Input
                      value={data.submitted_data?.target_market || ''}
                      onChange={(e) => updateSection('submitted_data', { target_market: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estágio de Financiamento</label>
                    <Input
                      value={data.submitted_data?.funding_stage || ''}
                      onChange={(e) => updateSection('submitted_data', { funding_stage: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Receita Anual (Mín)</label>
                    <Input
                      type="number"
                      value={data.submitted_data?.annual_revenue_min || ''}
                      onChange={(e) => updateSection('submitted_data', { annual_revenue_min: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Receita Anual (Máx)</label>
                    <Input
                      type="number"
                      value={data.submitted_data?.annual_revenue_max || ''}
                      onChange={(e) => updateSection('submitted_data', { annual_revenue_max: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Desafio Principal</label>
                  <Textarea
                    value={data.submitted_data?.business_challenge || ''}
                    onChange={(e) => updateSection('submitted_data', { business_challenge: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notas Adicionais</label>
                  <Textarea
                    value={data.submitted_data?.additional_notes || ''}
                    onChange={(e) => updateSection('submitted_data', { additional_notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Redes Sociais</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn</label>
                    <Input
                      value={data.submitted_data?.linkedin_url || ''}
                      onChange={(e) => updateSection('submitted_data', { linkedin_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter/X</label>
                    <Input
                      value={data.submitted_data?.twitter_handle || ''}
                      onChange={(e) => updateSection('submitted_data', { twitter_handle: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discovered Data Tab */}
        <TabsContent value="discovered">
          <Card>
            <CardHeader>
              <CardTitle>Dados Descobertos pela IA</CardTitle>
              <p className="text-sm text-gray-500">Informações públicas encontradas automaticamente.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNPJ Descoberto</label>
                  <Input
                    value={data.discovered_data?.cnpj || ''}
                    onChange={(e) => updateSection('discovered_data', { cnpj: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website Oficial</label>
                  <Input
                    value={data.discovered_data?.website || ''}
                    onChange={(e) => updateSection('discovered_data', { website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn da Empresa</label>
                  <Input
                    value={data.discovered_data?.linkedin_url || ''}
                    onChange={(e) => updateSection('discovered_data', { linkedin_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Twitter/X</label>
                  <Input
                    value={data.discovered_data?.twitter_handle || ''}
                    onChange={(e) => updateSection('discovered_data', { twitter_handle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Setor/Indústria</label>
                  <Input
                    value={data.discovered_data?.industry || ''}
                    onChange={(e) => updateSection('discovered_data', { industry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tamanho Estimado</label>
                  <Input
                    value={data.discovered_data?.company_size || ''}
                    onChange={(e) => updateSection('discovered_data', { company_size: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Localização</label>
                  <Input
                    value={data.discovered_data?.location || ''}
                    onChange={(e) => updateSection('discovered_data', { location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano de Fundação</label>
                  <Input
                    value={data.discovered_data?.foundation_year || ''}
                    onChange={(e) => updateSection('discovered_data', { foundation_year: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estágio de Financiamento</label>
                  <Input
                    value={data.discovered_data?.funding_stage || ''}
                    onChange={(e) => updateSection('discovered_data', { funding_stage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Faturamento Estimado</label>
                  <Input
                    value={data.discovered_data?.annual_revenue_estimate || ''}
                    onChange={(e) => updateSection('discovered_data', { annual_revenue_estimate: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Mercado Alvo</label>
                  <Input
                    value={data.discovered_data?.target_market || ''}
                    onChange={(e) => updateSection('discovered_data', { target_market: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Perfil da Empresa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium">Ano de Fundação</label>
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
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Proposta de Valor</label>
                  <Textarea
                    value={data.market_position?.value_proposition || ''}
                    onChange={(e) => updateSection('market_position', { value_proposition: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategic Assessment */}
        <TabsContent value="strategic">
          <Card>
            <CardHeader><CardTitle>Avaliação Estratégica</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Setor de Atuação</label>
                  <Input
                    value={data.market_position?.sector || ''}
                    onChange={(e) => updateSection('market_position', { sector: e.target.value })}
                  />
                </div>
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

        {/* Financials */}
        <TabsContent value="financial">
          <Card>
            <CardHeader><CardTitle>Contexto Financeiro</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Faixa de Funcionários</label>
                  <Input
                    value={data.financials?.employees_range || ''}
                    onChange={(e) => updateSection('financials', { employees_range: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimativa de Receita</label>
                  <Input
                    value={data.financials?.revenue_estimate || ''}
                    onChange={(e) => updateSection('financials', { revenue_estimate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo de Negócio</label>
                <Textarea
                  value={data.financials?.business_model || ''}
                  onChange={(e) => updateSection('financials', { business_model: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Position */}
        <TabsContent value="market">
          <Card>
            <CardHeader><CardTitle>Posição de Mercado</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Público Alvo</label>
                  <Input
                    value={data.market_position?.target_audience || ''}
                    onChange={(e) => updateSection('market_position', { target_audience: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status de Market Share</label>
                  <Input
                    value={data.competitive_landscape?.market_share_status || ''}
                    onChange={(e) => updateSection('competitive_landscape', { market_share_status: e.target.value })}
                  />
                </div>
              </div>

              <ListEditor
                label="Principais Concorrentes"
                items={data.competitive_landscape?.competitors || []}
                onChange={(items) => updateSection('competitive_landscape', { competitors: items })}
              />

              {/* Market Signals */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Sinais de Mercado</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sentimento do Consumidor</label>
                    <Input
                      value={data.macro_context?.market_signals?.consumer_sentiment || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'market_signals', { consumer_sentiment: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cadeia de Suprimentos</label>
                    <Input
                      value={data.macro_context?.market_signals?.supply_chain_status || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'market_signals', { supply_chain_status: e.target.value })}
                    />
                  </div>
                </div>
                <ListEditor
                  label="Preços de Commodities"
                  items={data.macro_context?.market_signals?.commodity_prices || []}
                  onChange={(items) => updateNestedSection('macro_context', 'market_signals', { commodity_prices: items })}
                />
                <ListEditor
                  label="Atividade de Concorrentes"
                  items={data.macro_context?.market_signals?.competitor_activity || []}
                  onChange={(items) => updateNestedSection('macro_context', 'market_signals', { competitor_activity: items })}
                />
                <ListEditor
                  label="Ameaças Emergentes"
                  items={data.macro_context?.market_signals?.emerging_threats || []}
                  onChange={(items) => updateNestedSection('macro_context', 'market_signals', { emerging_threats: items })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Macro Context */}
        <TabsContent value="macro">
          <Card>
            <CardHeader><CardTitle>Contexto Macroeconômico</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {/* Economic Indicators */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Indicadores Econômicos</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">País</label>
                    <Input
                      value={data.macro_context?.economic_indicators?.country || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Crescimento PIB</label>
                    <Input
                      value={data.macro_context?.economic_indicators?.gdp_growth || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { gdp_growth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taxa de Inflação</label>
                    <Input
                      value={data.macro_context?.economic_indicators?.inflation_rate || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { inflation_rate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taxa de Juros</label>
                    <Input
                      value={data.macro_context?.economic_indicators?.interest_rate || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { interest_rate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Câmbio</label>
                    <Input
                      value={data.macro_context?.economic_indicators?.exchange_rate || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { exchange_rate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taxa de Desemprego</label>
                    <Input
                      value={data.macro_context?.economic_indicators?.unemployment_rate || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { unemployment_rate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estabilidade Política</label>
                  <Input
                    value={data.macro_context?.economic_indicators?.political_stability || ''}
                    onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { political_stability: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Perspectiva Econômica</label>
                  <Textarea
                    value={data.macro_context?.economic_indicators?.economic_outlook || ''}
                    onChange={(e) => updateNestedSection('macro_context', 'economic_indicators', { economic_outlook: e.target.value })}
                    rows={3}
                  />
                </div>
                <ListEditor
                  label="Mudanças Recentes de Política"
                  items={data.macro_context?.economic_indicators?.recent_policy_changes || []}
                  onChange={(items) => updateNestedSection('macro_context', 'economic_indicators', { recent_policy_changes: items })}
                />
              </div>

              {/* Industry Trends */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Tendências da Indústria</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Setor</label>
                    <Input
                      value={data.macro_context?.industry_trends?.industry_sector || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'industry_trends', { industry_sector: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taxa de Crescimento</label>
                    <Input
                      value={data.macro_context?.industry_trends?.growth_rate || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'industry_trends', { growth_rate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Concentração de Mercado</label>
                    <Input
                      value={data.macro_context?.industry_trends?.market_concentration || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'industry_trends', { market_concentration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Barreiras de Entrada</label>
                    <Input
                      value={data.macro_context?.industry_trends?.barriers_to_entry || ''}
                      onChange={(e) => updateNestedSection('macro_context', 'industry_trends', { barriers_to_entry: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adoção de Tecnologia</label>
                  <Textarea
                    value={data.macro_context?.industry_trends?.technology_adoption || ''}
                    onChange={(e) => updateNestedSection('macro_context', 'industry_trends', { technology_adoption: e.target.value })}
                    rows={2}
                  />
                </div>
                <ListEditor
                  label="Principais Tendências"
                  items={data.macro_context?.industry_trends?.key_trends || []}
                  onChange={(items) => updateNestedSection('macro_context', 'industry_trends', { key_trends: items })}
                />
                <ListEditor
                  label="Fusões e Aquisições"
                  items={data.macro_context?.industry_trends?.mergers_acquisitions || data.macro_context?.industry_trends?.mergers_aquisições || []}
                  onChange={(items) => updateNestedSection('macro_context', 'industry_trends', { mergers_acquisitions: items })}
                />
              </div>

              {/* Regulatory Landscape */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Ambiente Regulatório</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requisitos de Conformidade</label>
                  <Textarea
                    value={data.macro_context?.regulatory_landscape?.compliance_requirements || ''}
                    onChange={(e) => updateNestedSection('macro_context', 'regulatory_landscape', { compliance_requirements: e.target.value })}
                    rows={3}
                  />
                </div>
                <ListEditor
                  label="Regulamentações Recentes"
                  items={data.macro_context?.regulatory_landscape?.recent_regulations || []}
                  onChange={(items) => updateNestedSection('macro_context', 'regulatory_landscape', { recent_regulations: items })}
                />
                <ListEditor
                  label="Mudanças Previstas"
                  items={data.macro_context?.regulatory_landscape?.upcoming_changes || []}
                  onChange={(items) => updateNestedSection('macro_context', 'regulatory_landscape', { upcoming_changes: items })}
                />
                <ListEditor
                  label="Padrões da Indústria"
                  items={data.macro_context?.regulatory_landscape?.industry_standards || []}
                  onChange={(items) => updateNestedSection('macro_context', 'regulatory_landscape', { industry_standards: items })}
                />
              </div>

              {/* Data Sources & Metadata */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Fontes de Dados</h4>
                <ListEditor
                  label="URLs das Fontes"
                  items={data.macro_context?.data_sources || []}
                  onChange={(items) => updateSection('macro_context', { data_sources: items })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Última Atualização</label>
                  <Input
                    value={data.macro_context?.last_updated || ''}
                    onChange={(e) => updateSection('macro_context', { last_updated: e.target.value })}
                  />
                </div>
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
