"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useAnalysis } from "@/lib/hooks/use-analysis";
import { useAdminAnalysis } from "@/lib/hooks/use-admin-analysis";
import { toast } from "@/components/ui/use-toast";
import { WarRoomEditor } from "./_components/v3/WarRoomEditor";
import { WarRoomSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { MobileWarning } from "@/components/mobile";
import { ArrowLeft } from "lucide-react";



interface WarRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WarRoomPage({ params }: WarRoomPageProps) {
  const { id: submissionId } = use(params);
  const [showMobileWarning, setShowMobileWarning] = useState(true);

  // Fetch analysis data (read-only)
  const {
    analysis,
    isLoading,
    refetch,
    publishReport,
    isPublishing,
  } = useAnalysis(submissionId);

  // Admin operations (update, approve, send, versioning)
  const {
    update,
    isUpdating,
    approve,
    isApproving,
    send,
    isSending,
    createVersion,
    isCreatingVersion,
  } = useAdminAnalysis();





  if (!analysis || isLoading) {
    return <WarRoomSkeleton />;
  }

  return (
    <>
      {/* Mobile Warning (shown on screens below lg) */}
      {showMobileWarning && (
        <div className="lg:hidden">
          <MobileWarning
            title="War Room - Editor Avançado"
            message="O War Room é uma ferramenta complexa de edição estratégica com múltiplos painéis, editores de texto e visualizações simultâneas. Para a melhor experiência de edição, recomendamos usar um computador desktop ou laptop com resolução mínima de 1280px."
            showContinueButton={true}
            onContinue={() => setShowMobileWarning(false)}
          />
        </div>
      )}

      {/* Desktop View (lg and up) or Mobile View if user clicked Continue */}
      <div className={showMobileWarning ? "hidden lg:block min-h-screen bg-[var(--surface-paper)]" : "min-h-screen bg-[var(--surface-paper)]"}>
        {/* Breadcrumb Header */}
        <header className="bg-white border-b border-line sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href={`/admin/analise`}>
                  <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar à Lista de Análises
                  </Button>
                </Link>
                <div className="hidden sm:block h-4 w-px bg-line" />
                <div>
                  <h1 className="font-heading text-lg sm:text-xl font-medium tracking-tight text-navy-900">
                    War Room - Analysis v{analysis.version}
                  </h1>
                  <p className="text-xs text-text-secondary">
                    Análise estratégica completa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {analysis && (
          <WarRoomEditor
            analysis={analysis}
            onSave={async (updatedAnalysis) => {
              try {
                await update({
                  analysisId: analysis.id,
                  data: updatedAnalysis.analysis
                });
                toast({
                  title: "Rascunho salvo",
                  description: "As alterações foram salvas com sucesso.",
                  variant: "default"
                });
                refetch();
              } catch (error: any) {
                toast({
                  title: "Erro ao salvar",
                  description: error.message || "Não foi possível salvar as alterações.",
                  variant: "destructive"
                });
              }
            }}
            onApprove={async () => {
              if (!analysis?.id) return;
              try {
                await approve(analysis.id);
                toast({
                  title: "Análise Aprovada",
                  description: "A análise foi aprovada com sucesso.",
                  variant: "default"
                });
                refetch();
              } catch (error: any) {
                toast({
                  title: "Erro ao aprovar",
                  description: error.message || "Não foi possível aprovar a análise.",
                  variant: "destructive"
                });
              }
            }}
            isSaving={isUpdating}
          />
        )}
      </div>
    </>
  );
}
