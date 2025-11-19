'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<{
    submissionsOverTime?: Array<{ month: string; count: number }>;
    revenueByMonth?: Array<{ month: string; revenue: number }>;
    completionRate?: Array<{ name: string; value: number }>;
    topIndustries?: Array<{ industry: string; count: number }>;
    paymentStatus?: Array<{ name: string; value: number }>;
    avgProcessingTime?: string;
    satisfactionRate?: number;
    avgOrderValue?: number;
    repeatCustomerRate?: number;
  } | null>(null);
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
      fetchAnalytics();
    }
  }, [user, authLoading, router]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!response.ok) throw new Error('Erro ao carregar analytics');

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(195_100%_8%)]" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Erro ao carregar analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Análise e Métricas
          </h1>
          <p className="text-gray-600 mb-4">
            Visualizações e insights de performance do sistema
          </p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-2">O que é esta página?</h2>
            <p className="text-sm text-green-800">
              Esta página mostra estatísticas e tendências do negócio IMENSIAH ao longo do tempo.
              Aqui você pode acompanhar:
            </p>
            <ul className="text-sm text-green-800 mt-2 space-y-1 list-disc list-inside">
              <li>Crescimento de submissões mês a mês</li>
              <li>Receita total e por período</li>
              <li>Taxa de conversão (visitas → formulário → pagamento → entrega)</li>
              <li>Setores mais atendidos</li>
              <li>Tempo médio de processamento e satisfação dos clientes</li>
            </ul>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Submissions Over Time */}
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle>Submissões ao Longo do Tempo</CardTitle>
              <CardDescription>Evolução mensal de submissões</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.submissionsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#0088FE"
                    strokeWidth={2}
                    name="Submissões"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Month */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Faturamento por mês (R$)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.revenueByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#00C49F" name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Taxa de Conclusão</CardTitle>
              <CardDescription>Distribuição por status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.completionRate || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(analyticsData.completionRate || []).map((entry, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Industries */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Principais Setores</CardTitle>
              <CardDescription>Setores com mais submissões</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analyticsData.topIndustries || []}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="industry" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FFBB28" name="Submissões" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Status de Pagamento</CardTitle>
              <CardDescription>Distribuição de pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.paymentStatus || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(analyticsData.paymentStatus || []).map((entry, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[hsl(195_100%_8%)] mb-2">
                  {analyticsData.avgProcessingTime || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Tempo Médio de Processamento</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {analyticsData.satisfactionRate || 'N/A'}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Satisfação</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[hsl(195_100%_8%)] mb-2">
                  R$ {analyticsData.avgOrderValue || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Valor Médio por Pedido</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[hsl(45_100%_55%)] mb-2">
                  {analyticsData.repeatCustomerRate || 'N/A'}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Clientes Recorrentes</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
