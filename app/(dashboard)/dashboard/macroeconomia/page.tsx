'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, DollarSign, Percent, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Section, Container } from '@/components/editorial/Section';
import { Heading, Eyebrow, Text } from '@/components/ui/Typography';
import { useToast } from '@/components/ui/use-toast';
import { macroApi, type MacroSnapshot, type MacroValue } from '@/lib/api/client';
import { useProfile } from '@/lib/hooks/use-profile';

type IndicatorCode = 'selic' | 'ipca' | 'usd_brl';

interface IndicatorConfig {
  code: IndicatorCode;
  label: string;
  description: string;
  icon: React.ReactNode;
  format: (value: number) => string;
  unit: string;
}

const INDICATORS: IndicatorConfig[] = [
  {
    code: 'selic',
    label: 'Taxa SELIC',
    description: 'Taxa básica de juros do Banco Central',
    icon: <Percent className="w-5 h-5" />,
    format: (v) => v.toFixed(2),
    unit: '% a.a.',
  },
  {
    code: 'ipca',
    label: 'IPCA',
    description: 'Índice de Preços ao Consumidor Amplo (IBGE)',
    icon: <TrendingUp className="w-5 h-5" />,
    format: (v) => v.toFixed(2),
    unit: '%',
  },
  {
    code: 'usd_brl',
    label: 'USD/BRL',
    description: 'Cotação do dólar americano',
    icon: <DollarSign className="w-5 h-5" />,
    format: (v) => v.toFixed(4),
    unit: 'R$',
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function IndicatorCard({
  config,
  value,
  isRefreshing,
  onRefresh,
}: {
  config: IndicatorConfig;
  value?: MacroValue;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold-600">
            {config.icon}
            <CardTitle className="text-lg">{config.label}</CardTitle>
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
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {value ? (
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {config.format(value.value)}
              </span>
              <span className="text-lg text-gray-500">{config.unit}</span>
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Atualizado: {formatDate(value.fetched_at)}</span>
              </div>
              <div>
                Data efetiva: {new Date(value.effective_date).toLocaleDateString('pt-BR')}
              </div>
              {value.reference_period && (
                <div>Período: {value.reference_period}</div>
              )}
              <div className="text-xs text-gray-400">Fonte: {value.source_code}</div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <Text className="text-gray-500">Sem dados disponíveis</Text>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="mt-2"
            >
              {isRefreshing ? 'Buscando...' : 'Buscar dados'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MacroeconomiaPage() {
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useProfile(undefined, { enabled: true });

  const [snapshot, setSnapshot] = useState<MacroSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [refreshingIndicator, setRefreshingIndicator] = useState<IndicatorCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = profile?.role === 'admin';

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
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados macroeconômicos');
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
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados');
      toast({
        title: 'Erro',
        description: err.message || 'Erro ao atualizar indicadores',
        variant: 'error',
      });
    } finally {
      setIsRefreshingAll(false);
    }
  };

  const handleRefreshIndicator = async (code: IndicatorCode) => {
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
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || `Erro ao atualizar ${code}`,
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
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Eyebrow className="mb-2">Administração</Eyebrow>
              <Heading variant="section">Indicadores Macroeconômicos</Heading>
              <Text className="mt-2 text-text-secondary">
                Gerencie os dados de SELIC, IPCA e USD/BRL utilizados nos relatórios.
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
                Dados carregados. Última atualização: {formatDate(snapshot.as_of)}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-full mt-4" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Indicator Cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INDICATORS.map((config) => (
                <IndicatorCard
                  key={config.code}
                  config={config}
                  value={snapshot?.[config.code]}
                  isRefreshing={refreshingIndicator === config.code || isRefreshingAll}
                  onRefresh={() => handleRefreshIndicator(config.code)}
                />
              ))}
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
                      <strong>SELIC:</strong> Atualizada automaticamente às 18h (dias úteis) via API do Banco Central
                    </li>
                    <li>
                      <strong>IPCA:</strong> Atualizado mensalmente no dia 15 via API do IBGE
                    </li>
                    <li>
                      <strong>USD/BRL:</strong> Atualizado a cada 6 horas via API de câmbio
                    </li>
                  </ul>
                  <p className="text-blue-600 mt-2">
                    Os dados são usados automaticamente durante o enriquecimento de submissions para fornecer
                    contexto econômico atualizado nos relatórios.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
