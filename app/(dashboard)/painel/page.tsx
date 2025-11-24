'use client';

import Link from 'next/link';
import { SubmissionCard } from '../_components/SubmissionCard';
import { EnrichmentCard } from '../_components/EnrichmentCard';
import { AnalysisCard } from '../_components/AnalysisCard';
import { DashboardSkeleton } from '@/components/skeletons';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/lib/providers/AuthProvider';
import { submissionsApi, enrichmentApi, analysisApi } from '@/lib/api/client';
import { toast } from '@/components/ui/use-toast';
import type { Submission, Enrichment, Analysis } from '@/types';
import {
  ProgressStepper,
  StatusTimeline,
  NextActionCard,
} from '@/components/workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getWorkflowStages,
  getTimelineEvents,
  getNextAction,
} from '@/lib/utils/workflow-helpers';
import { getStageNumber, getWorkflowStage } from '@/lib/utils/workflow';

export default function PainelPage() {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [enrichment, setEnrichment] = useState<Enrichment | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user's submissions
        const response = await submissionsApi.getAll();

        if (response && response.submissions && response.submissions.length > 0) {
          // Get the most recent submission
          const latestSubmission = response.submissions[0];
          setSubmission(latestSubmission);

          // Try to fetch enrichment data
          try {
            const enrichmentData = await enrichmentApi.getBySubmissionId(latestSubmission.id);
            setEnrichment(enrichmentData);
          } catch (enrichmentError) {
            console.log('No enrichment data available yet');
            setEnrichment(null); // Clear any stale data
          }

          // Try to fetch analysis data
          try {
            const analysisData = await analysisApi.getBySubmissionId(latestSubmission.id);
            setAnalysis(analysisData);
          } catch (analysisError) {
            console.log('No analysis data available yet');
            setAnalysis(null); // Clear any stale data
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Erro ao carregar seus dados. Por favor, tente novamente.');
        toast({
          title: 'Erro ao Carregar Dados',
          description: 'Não foi possível carregar suas informações. Verifique sua conexão.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center p-4">
        <div className="bg-white border border-line p-8 max-w-md w-full text-center">
          <h2 className="font-heading text-2xl font-medium text-navy-900 mb-4">
            {error ? 'Erro ao Carregar' : 'Nenhuma Submissão Encontrada'}
          </h2>
          <p className="text-text-secondary mb-6">
            {error || 'Você ainda não realizou nenhuma submissão. Comece criando uma nova análise.'}
          </p>
          {!error && (
            <Link
              href="/#diagnostico"
              className="inline-block px-6 py-3 bg-navy-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-navy-800 transition-colors"
            >
              Criar Nova Análise
            </Link>
          )}
          {error && (
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 bg-navy-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-navy-800 transition-colors"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Progress Header */}
      <div className="bg-white border-b border-line">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-heading text-2xl md:text-3xl font-medium text-navy-900 mb-6">
            Seu Relatório Estratégico
          </h1>
          <ProgressStepper
            currentStage={getStageNumber(getWorkflowStage(enrichment, analysis))}
            stages={getWorkflowStages()}
            estimatedCompletion="2-3 dias"
          />
        </div>
      </div>

      {/* Main Content: 2-column layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main content (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Data Card - Always visible */}
            <SubmissionCard submission={submission} />

            {/* Enrichment Card - Show when exists */}
            {enrichment && <EnrichmentCard enrichment={enrichment} />}

            {/* Analysis Card - Show when sent */}
            {analysis?.status === 'sent' && <AnalysisCard analysis={analysis} />}

            {/* Next Action Card */}
            <NextActionCard {...getNextAction(enrichment, analysis)} />
          </div>

          {/* Right Column: Sidebar (1/3 width on desktop) */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline
                  events={getTimelineEvents(submission, enrichment, analysis)}
                />
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-navy-50 border-navy-200">
              <CardHeader>
                <CardTitle className="text-navy-900">Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-4">
                  Nossa equipe está disponível para esclarecer dúvidas sobre seu relatório.
                </p>
                <Link
                  href="mailto:contato@imensiah.com"
                  className="inline-block w-full px-4 py-2 bg-navy-900 text-white text-sm font-medium text-center uppercase tracking-wider hover:bg-navy-800 transition-colors"
                >
                  Entrar em Contato
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
