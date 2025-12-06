"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { ReportVisibilityControls } from "@/components/admin/ReportVisibilityControls";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function AdminAnalysisEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [updatingVisibility, setUpdatingVisibility] = React.useState(false);

  // Fetch analysis details
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["adminAnalysis", id],
    queryFn: () => adminApi.getAnalysisById(id),
  });

  // Handle visibility toggles
  const handleVisibilityToggle = async (visible: boolean) => {
    setUpdatingVisibility(true);
    try {
      await adminApi.toggleVisibility(id, visible);
      queryClient.invalidateQueries({ queryKey: ["adminAnalysis", id] });
      toast({
        title: visible ? "Relatório visível" : "Relatório oculto",
        description: visible
          ? "O relatório agora está visível para o usuário."
          : "O relatório não está mais visível para o usuário.",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível alterar a visibilidade.", variant: "destructive" });
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handlePublicToggle = async (isPublic: boolean) => {
    setUpdatingVisibility(true);
    try {
      await adminApi.togglePublic(id, isPublic);
      queryClient.invalidateQueries({ queryKey: ["adminAnalysis", id] });
      toast({
        title: isPublic ? "Acesso público" : "Acesso privado",
        description: isPublic
          ? "Qualquer pessoa com o link pode acessar o relatório."
          : "O relatório requer login para acesso.",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível alterar o acesso público.", variant: "destructive" });
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handleBlurToggle = async (blurred: boolean) => {
    setUpdatingVisibility(true);
    try {
      await adminApi.toggleBlur(id, blurred);
      queryClient.invalidateQueries({ queryKey: ["adminAnalysis", id] });
      toast({
        title: blurred ? "Premium bloqueado" : "Premium liberado",
        description: blurred
          ? "As seções premium estão com blur (paywall)."
          : "Todas as seções estão totalmente visíveis.",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível alterar o blur.", variant: "destructive" });
    } finally {
      setUpdatingVisibility(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando análise..." size="lg" />;
  }

  if (error || !analysis) {
    return (
      <ErrorState
        title="Análise não encontrada"
        message="A análise solicitada não existe."
        retryLabel="Voltar"
        onRetry={() => router.push("/admin/companies")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Editor de Análise
        </h1>
        <p className="text-gray-400">
          ID: {analysis.id.slice(0, 8)}...
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Conteúdo da Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Editor completo de análise será implementado aqui.
                Por enquanto, use a visualização do relatório para revisar o conteúdo.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Controles de Visibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportVisibilityControls
                isVisibleToUser={analysis.is_visible_to_user ?? false}
                isPublic={analysis.is_public ?? false}
                isBlurred={analysis.is_blurred ?? true}
                isLoading={updatingVisibility}
                onVisibilityChange={handleVisibilityToggle}
                onPublicChange={handlePublicToggle}
                onBlurChange={handleBlurToggle}
                variant="full"
              />
            </CardContent>
          </Card>

          {analysis.access_code && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Código de Acesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Código</div>
                  <div className="text-white font-mono text-sm">{analysis.access_code}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full bg-gray-800 border-gray-700 text-white"
                  onClick={() => router.push(`/report/${analysis.access_code}?preview=admin`)}
                >
                  Ver Relatório
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
