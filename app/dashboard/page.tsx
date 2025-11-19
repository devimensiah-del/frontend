'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/stats-card';
import { SubmissionsTable } from '@/components/dashboard/submissions-table';
import { FileText, Clock, CheckCircle, Share2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface Submission {
  id: string;
  company_name: string;
  created_at: string;
  status: string;
  payment_status: string;
  report_url?: string;
  pdf_url?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchSubmissions();
    }
  }, [user, authLoading, router]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/submissions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Erro ao carregar submissões');
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
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

  // Calculate stats
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s =>
    ['queued', 'collecting_data', 'analyzing'].includes(s.status)
  ).length;
  const completeCount = submissions.filter(s => s.status === 'delivered').length;
  const sharedCount = submissions.filter(s => s.status === 'delivered').length; // TODO: Track shared separately

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Meus Relatórios
            </h1>
            <p className="text-gray-600">
              Acompanhe o status dos seus diagnósticos estratégicos
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push('/#submission-form')}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Diagnóstico
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <StatsCard
            title="Total de Relatórios"
            value={totalCount}
            icon={FileText}
          />
          <StatsCard
            title="Em Processamento"
            value={pendingCount}
            icon={Clock}
          />
          <StatsCard
            title="Concluídos"
            value={completeCount}
            icon={CheckCircle}
          />
          <StatsCard
            title="Compartilhados"
            value={sharedCount}
            icon={Share2}
          />
        </div>

        {/* Submissions Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[hsl(195_100%_8%)]" />
              </div>
            ) : (
              <SubmissionsTable submissions={submissions} />
            )}
          </CardContent>
        </Card>

        {/* Empty state CTA */}
        {!loading && submissions.length === 0 && (
          <div className="mt-12 text-center bg-[hsl(195_100%_8%)]/10 rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
              <FileText className="w-16 h-16 text-[hsl(195_100%_8%)] mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Bem-vindo ao IMENSIAH!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Comece solicitando seu primeiro diagnóstico estratégico.
                Nossa IA analisará sua empresa em profundidade e entregará
                insights valiosos em até 24 horas.
              </p>
              <Button
                size="lg"
                onClick={() => router.push('/#submission-form')}
                className="text-lg px-8 py-6"
              >
                Solicitar Primeiro Diagnóstico
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
