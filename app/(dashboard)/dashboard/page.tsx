"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { submissionsApi, adminApi, authApi } from "@/lib/api/client";
import { SubmissionCard } from "@/components/dashboard/SubmissionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Spinner } from "@/components/ui/loading-indicator";
import { Loader, CheckCircle, BarChart3 } from "lucide-react";
import type { Submission } from "@/lib/types";

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

  // Fetch analytics (admin only)
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: adminApi.getAnalytics,
    enabled: isAdmin,
  });

  const isLoading = isUserLoading || isSubmissionsLoading || (isAdmin && isAnalyticsLoading);

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </Container>
    );
  }

  // Handle different response structures or default to empty
  const submissions = submissionsData?.submissions || [];

  return (
    <Section className="bg-gray-50 border-0">
      <Container className="py-8">
        <div className="mb-10">
          <Eyebrow className="mb-2">
            {isAdmin ? "Visão Geral Administrativa" : "Seus Projetos"}
          </Eyebrow>
          <Heading variant="section">
            {isAdmin ? "Painel de Controle" : "Envios Recentes"}
          </Heading>
          {isAdmin ? (
            <Text className="text-text-secondary mt-2">
              Acompanhe o fluxo: recebidos, enriquecimento, análise e aprovação/envio do relatório.
            </Text>
          ) : (
            <Text className="text-text-secondary mt-2">
              Veja o status dos seus envios enquanto avançam por enriquecimento e análise.
            </Text>
          )}
        </div>

        {/* Admin Analytics Cards */}
        {isAdmin && analytics && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <StatCard
              label="Total"
              value={analytics.totalSubmissions}
              icon={BarChart3}
            />
            <StatCard
              label="Em Andamento"
              value={analytics.activeSubmissions}
              variant="warning"
              icon={Loader}
            />
            <StatCard
              label="Concluídos"
              value={analytics.completedSubmissions}
              variant="success"
              icon={CheckCircle}
            />
          </div>
        )}

        {isAdmin && (
          <Heading variant="subtitle" className="mb-6">
            Todos os Envios
          </Heading>
        )}

        {submissions.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg">
            <p className="text-text-secondary">Nenhum envio encontrado.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission: any) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
