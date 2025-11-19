'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EnrichmentSource {
  name: string;
  successRate: number;
  avgLatency: number;
  totalCost: number;
  totalCalls: number;
  lastUsedAt: string;
  trend: 'up' | 'down' | 'stable';
  status: 'operational' | 'degraded' | 'down';
}

export default function EnrichmentPerformancePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sources, setSources] = useState<EnrichmentSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchEnrichmentPerformance();
    }
  }, [user, authLoading, router]);

  const fetchEnrichmentPerformance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/enrichment/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!response.ok) throw new Error('Erro ao carregar performance');

      const data = await response.json();
      setSources(data.sources || []);
    } catch (error) {
      console.error('Error fetching enrichment performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const config = {
      operational: 'bg-green-100 text-green-800',
      degraded: 'bg-yellow-100 text-yellow-800',
      down: 'bg-red-100 text-red-800',
    };
    return config[status as keyof typeof config] || config.operational;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      operational: 'Operacional',
      degraded: 'Degradado',
      down: 'Fora do Ar',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(195_100%_8%)]" />
      </div>
    );
  }

  const totalCalls = sources.reduce((sum, s) => sum + s.totalCalls, 0);
  const totalCost = sources.reduce((sum, s) => sum + s.totalCost, 0);
  const avgSuccessRate = sources.reduce((sum, s) => sum + s.successRate, 0) / sources.length;
  const avgLatency = sources.reduce((sum, s) => sum + s.avgLatency, 0) / sources.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Performance das Fontes de Dados
          </h1>
          <p className="text-gray-600 mb-4">
            Monitoramento de todas as fontes de enriquecimento
          </p>
          <div className="bg-[hsl(195_100%_8%)]/10 border-l-4 border-[hsl(195_100%_8%)] p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-[hsl(195_100%_8%)] mb-2">O que é esta página?</h2>
            <p className="text-sm text-[hsl(195_100%_8%)]/80">
              Esta página mostra a performance técnica de todas as APIs e serviços que a IMENSIAH usa para coletar dados públicos automaticamente.
              Inclui LinkedIn, ReceitaWS, raspagem de websites e redes sociais. Use esta página para:
            </p>
            <ul className="text-sm text-[hsl(195_100%_8%)]/80 mt-2 space-y-1 list-disc list-inside">
              <li>Identificar fontes com problemas (baixa taxa de sucesso ou alta latência)</li>
              <li>Monitorar custos de APIs pagas</li>
              <li>Verificar tendências de performance ao longo do tempo</li>
            </ul>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[hsl(195_100%_8%)] mb-2">
                  {totalCalls.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-gray-600">Total de Chamadas</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {avgSuccessRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Sucesso Média</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[hsl(195_100%_8%)] mb-2">
                  {avgLatency.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-600">Latência Média</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[hsl(45_100%_55%)] mb-2">
                  R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Custo Total</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sources Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Fontes de Dados</CardTitle>
            <CardDescription>Performance detalhada de cada fonte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fonte</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Taxa de Sucesso</TableHead>
                    <TableHead>Latência Média</TableHead>
                    <TableHead>Total de Chamadas</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead>Custo/Chamada</TableHead>
                    <TableHead>Último Uso</TableHead>
                    <TableHead>Tendência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((source) => (
                    <TableRow key={source.name}>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(source.status)}>
                          {getStatusLabel(source.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Progress value={source.successRate} className="w-24 h-2" />
                            <span className={`text-sm font-semibold ${getSuccessRateColor(source.successRate)}`}>
                              {source.successRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={source.avgLatency < 1000 ? 'text-green-600' : source.avgLatency < 3000 ? 'text-yellow-600' : 'text-red-600'}>
                          {source.avgLatency.toFixed(0)}ms
                        </span>
                      </TableCell>
                      <TableCell>{source.totalCalls.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>R$ {source.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        R$ {(source.totalCost / source.totalCalls).toLocaleString('pt-BR', { minimumFractionDigits: 4 })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(source.lastUsedAt), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </TableCell>
                      <TableCell>
                        {source.trend === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : source.trend === 'down' ? (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        ) : (
                          <div className="w-5 h-0.5 bg-gray-400" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mt-8 shadow-lg bg-[hsl(195_100%_8%)]/10 border-[hsl(195_100%_8%)]/20">
          <CardHeader>
            <CardTitle className="text-[hsl(195_100%_8%)]">Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-[hsl(195_100%_8%)]/80">
              {sources.some(s => s.successRate < 90) && (
                <li>• Investigar fontes com taxa de sucesso abaixo de 90%</li>
              )}
              {sources.some(s => s.avgLatency > 3000) && (
                <li>• Otimizar ou substituir fontes com latência acima de 3 segundos</li>
              )}
              {sources.some(s => s.status !== 'operational') && (
                <li>• Verificar fontes com status degradado ou fora do ar</li>
              )}
              <li>• Considerar implementar cache para fontes mais custosas</li>
              <li>• Monitorar tendências de queda em performance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
