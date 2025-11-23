'use client';

import Link from 'next/link';
import { SubmissionCard } from '../_components/SubmissionCard';
import { EnrichmentCard } from '../_components/EnrichmentCard';
import { AnalysisCard } from '../_components/AnalysisCard';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { DashboardSkeleton } from '@/components/skeletons';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/lib/providers/AuthProvider';
import { submissionsApi, enrichmentApi, analysisApi } from '@/lib/api/client';
import { toast } from '@/components/ui/use-toast';
import type { Submission, Enrichment, Analysis } from '@/types';

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

  const hasEnrichment = enrichment !== null;
  const hasAnalysis = analysis !== null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Painel</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe o status da sua submissão e acesse os resultados da análise.
        </p>
      </div>

      {/* Accordion Sections */}
      <Accordion type="single" collapsible defaultValue="submission" className="space-y-4">
        {/* 1. Submission Data - Always visible */}
        <AccordionItem value="submission" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#00a859] text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Dados de Envio
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Sempre visível
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <SubmissionCard submission={submission} />
          </AccordionContent>
        </AccordionItem>

        {/* 2. Enrichment Data - Dropdown, only if enriched */}
        {hasEnrichment && (
          <AccordionItem value="enrichment" className="border border-gray-200 rounded-lg bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Enriquecimento de Dados
                  </span>
                </div>
                <span className="text-sm text-indigo-600 font-medium">
                  Disponível
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <EnrichmentCard enrichment={enrichment} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 3. Analysis/Report - Dropdown, only when admin sends it */}
        {hasAnalysis && (
          <AccordionItem value="analysis" className="border border-gray-200 rounded-lg bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Análise e Relatório
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">
                  Relatório disponível
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <AnalysisCard analysis={analysis} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Status Messages */}
      {!hasEnrichment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Sua submissão está em análise
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Estamos processando seus dados. O enriquecimento estará disponível em breve.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasEnrichment && !hasAnalysis && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-purple-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-purple-900">
                Análise em andamento
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Nossos especialistas estão revisando seu caso. O relatório final será disponibilizado em breve.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
