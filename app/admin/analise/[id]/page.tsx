"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalysis } from "@/lib/hooks/use-analysis";
import { useAdminAnalysis } from "@/lib/hooks/use-admin-analysis";
import { adminApi } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Check, Send, FileText } from "lucide-react";
import type { Submission, Analysis } from "@/types";

/* ============================================
   ANALYSIS EDITOR PAGE - Stage 3 Editor
   Edit, approve, and send analysis
   ============================================ */

interface AnalysisEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnalysisEditorPage({
  params,
}: AnalysisEditorPageProps) {
  const { id: submissionId } = use(params);
  const router = useRouter();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [localAnalysisData, setLocalAnalysisData] = useState<any>({});
  const [userEmail, setUserEmail] = useState("");
  const [showSendDialog, setShowSendDialog] = useState(false);

  const {
    analysis,
    isLoading,
    refetch,
  } = useAnalysis(submissionId);

  const adminAnalysis = useAdminAnalysis();

  // Fetch submission data
  useEffect(() => {
    async function fetchSubmission() {
      try {
        const data = await adminApi.getSubmission(submissionId);
        setSubmission(data);
        // Pre-fill user email if available
        if ((data as any).contactEmail) {
          setUserEmail((data as any).contactEmail);
        }
      } catch (error: any) {
        toast({
          title: "Erro ao carregar submissão",
          description: error.message || "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      }
    }

    fetchSubmission();
  }, [submissionId]);

  // Initialize local analysis data (edit the frameworks object, not the whole analysis)
  useEffect(() => {
    if (analysis?.analysis) {
      setLocalAnalysisData(analysis.analysis);
    }
  }, [analysis]);

  // Save draft
  const handleSave = async () => {
    if (!analysis?.id) {
      toast({
        title: "Erro",
        description: "ID da análise não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminAnalysis.update({
        analysisId: analysis.id,
        data: localAnalysisData,
      });

      toast({
        title: "Análise salva",
        description: "As alterações foram salvas com sucesso.",
        variant: "default",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  // Approve analysis (triggers PDF generation)
  const handleApprove = async () => {
    if (!analysis?.id) {
      toast({
        title: "Erro",
        description: "ID da análise não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (analysis.status !== 'completed') {
      toast({
        title: "Status inválido",
        description: "A análise deve estar no status 'completed' para ser aprovada.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save current changes first
      await adminAnalysis.update({
        analysisId: analysis.id,
        data: localAnalysisData,
      });

      // Then approve (triggers PDF generation)
      const response = await adminAnalysis.approve(analysis.id);

      toast({
        title: "Análise aprovada",
        description: "PDF será gerado automaticamente. Aguarde...",
        variant: "default",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar",
        description: error.message || "Não foi possível aprovar a análise.",
        variant: "destructive",
      });
    }
  };

  // Send analysis to user
  const handleSend = async () => {
    if (!analysis?.id) {
      toast({
        title: "Erro",
        description: "ID da análise não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail || !userEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    if (analysis.status !== 'approved') {
      toast({
        title: "Status inválido",
        description: "A análise deve estar aprovada antes de ser enviada.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await adminAnalysis.send({
        analysisId: analysis.id,
        userEmail,
      });

      toast({
        title: "Análise enviada",
        description: `Análise enviada para ${userEmail} com sucesso.`,
        variant: "default",
      });

      setShowSendDialog(false);
      refetch();

      // Redirect to list after sending
      setTimeout(() => {
        router.push("/admin/analise");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message || "Não foi possível enviar a análise.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !submission) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center">
        <div className="text-text-secondary">Carregando análise...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-surface-paper">
        <header className="bg-white border-b border-line">
          <div className="px-8 py-4">
            <Link href="/admin/analise" className="inline-flex items-center text-sm text-text-secondary hover:text-gold-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para lista
            </Link>
            <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900 mt-3">
              Análise não encontrada
            </h1>
          </div>
        </header>
        <div className="p-8">
          <Card className="p-8 text-center">
            <p className="text-text-secondary mb-4">
              A análise ainda não foi gerada para esta submissão.
            </p>
            <p className="text-sm text-text-tertiary">
              Aguarde o processamento ou verifique se o enriquecimento foi aprovado.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const analysisStatus = analysis.status || 'pending';
  const canApprove = analysisStatus === 'completed';
  const canSend = analysisStatus === 'approved';

  return (
    <div className="min-h-screen bg-surface-paper pb-20">
      {/* --- BREADCRUMB HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-secondary">
            <Link
              href="/admin/dashboard"
              className="hover:text-gold-600 transition-colors"
            >
              Dashboard
            </Link>
            <span>›</span>
            <Link
              href="/admin/analise"
              className="hover:text-gold-600 transition-colors"
            >
              Análise
            </Link>
            <span>›</span>
            <span className="text-navy-900 font-medium">
              {submission.companyName}
            </span>
          </nav>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900">
                Editar Análise
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Status: <span className="font-medium capitalize">{analysisStatus}</span>
                {analysis.version && ` • Versão ${analysis.version}`}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={adminAnalysis.isUpdating}
              >
                <Save className="w-4 h-4 mr-2" />
                {adminAnalysis.isUpdating ? "Salvando..." : "Salvar"}
              </Button>

              {canApprove && (
                <Button
                  variant="architect"
                  size="sm"
                  onClick={handleApprove}
                  disabled={adminAnalysis.isApproving}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {adminAnalysis.isApproving ? "Aprovando..." : "Aprovar"}
                </Button>
              )}

              {canSend && (
                <Button
                  variant="architect"
                  size="sm"
                  onClick={() => setShowSendDialog(true)}
                  disabled={adminAnalysis.isSending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar para Usuário
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="px-8 py-8">
        <Card className="p-6">
          <h2 className="font-heading text-lg font-medium mb-4">
            Dados da Análise
          </h2>
          <div className="bg-surface-paper p-4 font-mono text-sm overflow-auto max-h-96">
            <pre>{JSON.stringify(localAnalysisData, null, 2)}</pre>
          </div>
          <p className="text-sm text-text-tertiary mt-4">
            Nota: Editor visual de frameworks será implementado em breve. Por enquanto, edite o JSON diretamente conforme necessário.
          </p>
        </Card>
      </div>

      {/* Send Dialog */}
      {showSendDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="font-heading text-xl font-medium mb-4">
              Enviar Análise para Usuário
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email do destinatário
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="usuario@exemplo.com"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSendDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="architect"
                onClick={handleSend}
                disabled={adminAnalysis.isSending || !userEmail}
              >
                <Send className="w-4 h-4 mr-2" />
                {adminAnalysis.isSending ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
