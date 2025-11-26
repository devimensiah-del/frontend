"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { submissionsApi, adminApi, authApi } from "@/lib/api/client";
import { SubmissionCard } from "@/components/dashboard/SubmissionCard";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Eyebrow, Text } from "@/components/ui/Typography";
import type { Submission } from "@/lib/types";
import { LoadingState, EmptyState } from "@/components/ui/state-components";

export default function DashboardPage() {
  // Fetch current user to check role
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  const isAdmin = user?.role === "admin";

  // Fetch submissions (user or admin)
  const { data: submissionsData, isLoading: isSubmissionsLoading } = useQuery<{ submissions: Submission[]; total: number }>({
    queryKey: [isAdmin ? "adminSubmissions" : "submissions"],
    queryFn: async () => {
      if (isAdmin) {
        const response = await adminApi.getAllSubmissions();
        return { submissions: response.data, total: response.total };
      }
      return submissionsApi.getAll();
    },
    enabled: !!user,
  });

  const isLoading = isUserLoading || isSubmissionsLoading;

  if (isLoading) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState
            message="Carregando seus projetos..."
            size="lg"
          />
        </Container>
      </Section>
    );
  }

  // Handle different response structures or default to empty
  const submissions = submissionsData?.submissions || [];

  return (
    <Section className="bg-surface-paper border-0 min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Eyebrow className="mb-4">
            {isAdmin ? "Visão Geral Administrativa" : "Seus Projetos"}
          </Eyebrow>
          <Heading variant="section" className="mb-6">
            {isAdmin ? "Painel de Controle" : "Envios Recentes"}
          </Heading>
          <Text variant="lead" className="max-w-2xl">
            {isAdmin
              ? "Acompanhe o fluxo completo: recebidos, enriquecimento, análise e aprovação do relatório final."
              : "Veja o status dos seus envios enquanto avançam pelas etapas de enriquecimento e análise estratégica."}
          </Text>
        </div>

        {/* Submissions Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {isAdmin && (
            <div className="mb-8">
              <Heading variant="subtitle">
                Todos os Envios
              </Heading>
              <Text variant="small" className="mt-2">
                {submissions.length} {submissions.length === 1 ? "projeto" : "projetos"} no sistema
              </Text>
            </div>
          )}

          {submissions.length === 0 ? (
            <EmptyState
              variant="inbox"
              title="Nenhum projeto ainda"
              description={
                isAdmin
                  ? "Aguardando novos envios de clientes. Quando houver projetos, eles aparecerão aqui."
                  : "Você ainda não enviou nenhum projeto. Comece criando seu primeiro envio para receber análises estratégicas detalhadas."
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission: any) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
