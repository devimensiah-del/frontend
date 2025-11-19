'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { Users, FileText, DollarSign, Clock, Loader2, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface Activity {
  id: string;
  type: 'submission' | 'payment' | 'user' | 'delivery' | 'share' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface AdminStats {
  totalUsers: number;
  totalSubmissions: number;
  revenue: number;
  pendingReviews: number;
  recentActivity: Activity[];
  trends: {
    users: string;
    submissions: string;
    revenue: string;
  };
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchStats();
    }
  }, [user, authLoading, router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!response.ok) throw new Error('Erro ao carregar estatísticas');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">
              Visão geral do sistema e atividades recentes
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <StatsCard
            title="Usuários Totais"
            value={stats.totalUsers}
            icon={Users}
            trend={stats.trends.users}
          />
          <StatsCard
            title="Submissões"
            value={stats.totalSubmissions}
            icon={FileText}
            trend={stats.trends.submissions}
          />
          <StatsCard
            title="Receita Total"
            value={`R$ ${stats.revenue.toLocaleString('pt-BR')}`}
            icon={DollarSign}
            trend={stats.trends.revenue}
          />
          <StatsCard
            title="Revisões Pendentes"
            value={stats.pendingReviews}
            icon={Clock}
            urgent={stats.pendingReviews > 0}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={stats.recentActivity} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4"
                onClick={() => router.push('/admin/submissions?status=in_review')}
              >
                <div className="text-left">
                  <div className="font-semibold">Revisar Pendentes</div>
                  <div className="text-sm text-gray-600">
                    {stats.pendingReviews} aguardando revisão
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4"
                onClick={() => router.push('/admin/submissions')}
              >
                <div className="text-left">
                  <div className="font-semibold">Todas Submissões</div>
                  <div className="text-sm text-gray-600">
                    Ver e gerenciar todas as submissões
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4"
                onClick={() => router.push('/admin/analytics')}
              >
                <div className="text-left">
                  <div className="font-semibold">Análise e Métricas</div>
                  <div className="text-sm text-gray-600">
                    Visualizar dashboards e relatórios
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between h-auto py-4"
                onClick={() => router.push('/admin/enrichment')}
              >
                <div className="text-left">
                  <div className="font-semibold">Performance de Fontes</div>
                  <div className="text-sm text-gray-600">
                    Monitorar fontes de dados
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
                <div className="font-semibold text-green-900">API</div>
                <div className="text-sm text-green-700">Operacional</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
                <div className="font-semibold text-green-900">Database</div>
                <div className="text-sm text-green-700">Operacional</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
                <div className="font-semibold text-green-900">Workers</div>
                <div className="text-sm text-green-700">Processando</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
