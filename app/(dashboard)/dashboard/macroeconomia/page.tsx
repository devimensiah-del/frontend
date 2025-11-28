'use client';

import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, TrendingUp, DollarSign, Percent, Clock, AlertCircle, CheckCircle2, BarChart3, Building2, Users, Factory } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Section, Container } from '@/components/editorial/Section';
import { Heading, Eyebrow, Text } from '@/components/ui/Typography';
import { useToast } from '@/components/ui/use-toast';
import { macroApi, MACRO_CATEGORIES, type MacroSnapshot, type MacroIndicator } from '@/lib/api/client';
import { useProfile } from '@/lib/hooks/use-profile';

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  interest_rate: <Percent className="w-5 h-5" />,
  inflation: <TrendingUp className="w-5 h-5" />,
  exchange_rate: <DollarSign className="w-5 h-5" />,
  gdp: <BarChart3 className="w-5 h-5" />,
  production: <Factory className="w-5 h-5" />,
  employment: <Users className="w-5 h-5" />,
  construction: <Building2 className="w-5 h-5" />,
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatValue(indicator: MacroIndicator): string {
  if (indicator.unit === 'BRL') {
    return `R$ ${indicator.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (indicator.unit === '%') {
    return `${indicator.value.toFixed(2)}%`;
  }
  return `${indicator.value.toFixed(2)} ${indicator.unit}`;
}

function IndicatorCard({
  indicator,
  isRefreshing,
  onRefresh,
}: {
  indicator: MacroIndicator;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  const icon = CATEGORY_ICONS[indicator.category] || <BarChart3 className="w-5 h-5" />;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold-600">
            {icon}
            <CardTitle className="text-base">{indicator.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription className="text-xs">{indicator.code}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatValue(indicator)}
            </span>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Atualizado: {formatDate(indicator.fetched_at)}</span>
            </div>
            {indicator.reference_period && (
              <div>Período: {indicator.reference_period}</div>
            )}
            <div className="text-gray-400">Fonte: {indicator.source_code}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CategorySection({
  category,
  indicators,
  refreshingIndicator,
  onRefresh,
}: {
  category: string;
  indicators: MacroIndicator[];
  refreshingIndicator: string | null;
  onRefresh: (code: string) => void;
}) {
  const categoryConfig = MACRO_CATEGORIES[category];
  const categoryLabel = categoryConfig?.label || category;
  const icon = CATEGORY_ICONS[category] || <BarChart3 className="w-5 h-5" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <h3 className="text-lg font-semibold">{categoryLabel}</h3>
        <span className="text-sm text-gray-400">({indicators.length})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((indicator) => (
          <IndicatorCard
            key={indicator.code}
            indicator={indicator}
            isRefreshing={refreshingIndicator === indicator.code}
            onRefresh={() => onRefresh(indicator.code)}
          />
        ))}
      </div>
    </div>
  );
}

export default function MacroeconomiaPage() {
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useProfile(undefined, { enabled: true });

  const [snapshot, setSnapshot] = useState<MacroSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [refreshingIndicator, setRefreshingIndicator] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = profile?.role === 'admin';

  // Group indicators by category
  const indicatorsByCategory = useMemo(() => {
    if (!snapshot?.indicators) return {};

    const grouped: Record<string, MacroIndicator[]> = {};
    Object.values(snapshot.indicators).forEach((indicator) => {
      if (!grouped[indicator.category]) {
        grouped[indicator.category] = [];
      }
      grouped[indicator.category].push(indicator);
    });

    // Sort by category order
    return Object.entries(grouped)
      .sort(([a], [b]) => {
        const orderA = MACRO_CATEGORIES[a]?.order ?? 999;
        const orderB = MACRO_CATEGORIES[b]?.order ?? 999;
        return orderA - orderB;
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, MacroIndicator[]>);
  }, [snapshot]);

  const totalIndicators = snapshot?.indicators ? Object.keys(snapshot.indicators).length : 0;

  // Fetch initial data
  useEffect(() => {
    if (!profileLoading && isAdmin) {
      fetchSnapshot();
    }
  }, [profileLoading, isAdmin]);

  const fetchSnapshot = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await macroApi.getLatestSnapshot();
      setSnapshot(response.snapshot);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dados macroeconômicos';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAll = async () => {
    try {
      setIsRefreshingAll(true);
      setError(null);
      const response = await macroApi.refreshAll();
      setSnapshot(response.snapshot);
      toast({
        title: 'Dados atualizados',
        description: 'Todos os indicadores foram atualizados com sucesso.',
        variant: 'success',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar dados';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'error',
      });
    } finally {
      setIsRefreshingAll(false);
    }
  };

  const handleRefreshIndicator = async (code: string) => {
    try {
      setRefreshingIndicator(code);
      setError(null);
      const response = await macroApi.refreshIndicator(code);
      setSnapshot(response.snapshot);
      toast({
        title: 'Indicador atualizado',
        description: `${code.toUpperCase()} foi atualizado com sucesso.`,
        variant: 'success',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Erro ao atualizar ${code}`;
      toast({
        title: 'Erro',
        description: message,
        variant: 'error',
      });
    } finally {
      setRefreshingIndicator(null);
    }
  };

  // Show access denied if not admin
  if (!profileLoading && !isAdmin) {
    return (
      <Section className="bg-gray-50 min-h-screen border-0">
        <Container className="py-8">
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Acesso restrito. Esta página é exclusiva para administradores.
            </AlertDescription>
          </Alert>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-gray-50 min-h-screen border-0">
      <Container className="py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Eyebrow className="mb-2">Administração</Eyebrow>
              <Heading variant="section">Indicadores Macroeconômicos</Heading>
              <Text className="mt-2 text-text-secondary">
                Gerencie todos os indicadores econômicos utilizados nos relatórios.
                {totalIndicators > 0 && (
                  <span className="ml-2 text-gold-600 font-medium">
                    ({totalIndicators} indicadores)
                  </span>
                )}
              </Text>
            </div>
            <Button
              onClick={handleRefreshAll}
              disabled={isRefreshingAll || isLoading}
              variant="architect"
              className="shrink-0"
            >
              {isRefreshingAll ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar Todos
                </>
              )}
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Status Banner */}
          {snapshot && (
            <Alert variant="success" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {totalIndicators} indicadores carregados. Última atualização: {formatDate(snapshot.as_of)}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((j) => (
                      <Card key={j} className="animate-pulse">
                        <CardHeader>
                          <div className="h-5 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="h-8 bg-gray-200 rounded w-1/3" />
                          <div className="h-3 bg-gray-200 rounded w-full mt-4" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Indicators by Category */
            <div className="space-y-8">
              {Object.entries(indicatorsByCategory).map(([category, indicators]) => (
                <CategorySection
                  key={category}
                  category={category}
                  indicators={indicators}
                  refreshingIndicator={refreshingIndicator}
                  onRefresh={handleRefreshIndicator}
                />
              ))}

              {totalIndicators === 0 && (
                <Card className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <Text className="text-gray-500 mb-4">
                    Nenhum indicador encontrado no banco de dados.
                  </Text>
                  <Button
                    onClick={handleRefreshAll}
                    disabled={isRefreshingAll}
                    variant="outline"
                  >
                    {isRefreshingAll ? 'Buscando...' : 'Buscar dados'}
                  </Button>
                </Card>
              )}
            </div>
          )}

          {/* Info Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-blue-800">
                  <p className="font-medium">Sobre os dados macroeconômicos</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>
                      <strong>SELIC e USD/BRL:</strong> Atualizados automaticamente via APIs (BCB, AwesomeAPI)
                    </li>
                    <li>
                      <strong>Indicadores IBGE:</strong> Dados alimentados manualmente quando APIs estão indisponíveis
                    </li>
                    <li>
                      <strong>Uso:</strong> Os dados são passados ao LLM durante o enriquecimento, que seleciona os indicadores relevantes para cada empresa/setor
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
