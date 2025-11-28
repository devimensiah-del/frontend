"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, authApi } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Text } from "@/components/ui/Typography";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { AnalysisEditor } from "@/app/(dashboard)/_components/AnalysisEditor";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import type { Analysis } from "@/lib/types";

export default function AdminAnalysisEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const companyId = params.id as string;
  const analysisId = params.analysisId as string;

  // Fetch current user (admin check)
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  const isAdmin = user?.role === "admin";

  // Redirect non-admins
  React.useEffect(() => {
    if (user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isAdmin, router]);

  // Fetch the analysis
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["analysis", analysisId],
    queryFn: () => adminApi.getAnalysisById(analysisId),
    enabled: isAdmin && !!analysisId,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Analysis["analysis"]) =>
      adminApi.updateAnalysis(analysisId, { analysis: data }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise atualizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["analysis", analysisId] });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", companyId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar análise.",
        variant: "destructive",
      });
    },
  });

  // Handle viewing the report
  const handleViewReport = async () => {
    if (!analysis) return;

    const existingCode = analysis.accessCode || analysis.access_code;
    if (existingCode) {
      window.open(`/report/${existingCode}?preview=admin`, "_blank");
      return;
    }

    try {
      const response = await adminApi.generateAccessCode(analysisId);
      window.open(`/report/${response.access_code}?preview=admin`, "_blank");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o código de acesso.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState message="Verificando permissões..." size="lg" />
        </Container>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState message="Carregando análise..." size="lg" />
        </Container>
      </Section>
    );
  }

  if (error || !analysis) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <ErrorState
            title="Análise não encontrada"
            message="A análise solicitada não existe ou você não tem permissão."
            retryLabel="Voltar"
            onRetry={() => router.push(`/admin/companies/${companyId}`)}
          />
        </Container>
      </Section>
    );
  }

  // Check if analysis can be edited (status must be completed)
  const canEdit = analysis.status === "completed";

  return (
    <Section className="bg-surface-paper border-0 min-h-screen">
      <Container className="py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/companies/${companyId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Heading variant="section" className="text-lg">
                Editar Análise
              </Heading>
              <Text variant="small" className="text-text-tertiary">
                ID: {analysisId.slice(0, 8)}...
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleViewReport}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Relatório
            </Button>
          </div>
        </div>

        {/* Status Warning */}
        {!canEdit && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Text variant="small" className="text-amber-800">
              <strong>Atenção:</strong> Esta análise está com status "{analysis.status}" e não pode ser editada.
              Somente análises com status "completed" podem ser modificadas.
            </Text>
          </div>
        )}

        {/* Editor */}
        {canEdit ? (
          <AnalysisEditor
            analysis={analysis}
            onSave={(data) => updateMutation.mutate(data)}
          />
        ) : (
          <div className="p-8 border border-gray-200 rounded-lg bg-gray-50 text-center">
            <Text className="text-text-secondary">
              Esta análise não pode ser editada no momento.
            </Text>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push(`/admin/companies/${companyId}`)}
            >
              Voltar para Empresa
            </Button>
          </div>
        )}

        {/* Save indicator */}
        {updateMutation.isPending && (
          <div className="fixed bottom-6 right-6 bg-navy-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Salvando...
          </div>
        )}
      </Container>
    </Section>
  );
}
