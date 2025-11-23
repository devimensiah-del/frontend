"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, ArrowRight } from "lucide-react";
import { SubmissionDetails } from "./_components/SubmissionDetails";
import type { Submission } from "@/types";

interface SubmissionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SubmissionDetailPage({ params }: SubmissionDetailPageProps) {
  const { id: submissionId } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch submission data ONLY (no enrichment or analysis)
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const submissionData = await adminApi.getSubmission(submissionId);
      setSubmission(submissionData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Não foi possível carregar os dados da submissão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submissionId]);

  const handleRefresh = () => {
    fetchData();
    toast({
      title: "Dados atualizados",
      description: "Os dados foram recarregados com sucesso.",
      variant: "default",
    });
  };

  if (isLoading || !submission) {
    return (
      <div className="min-h-screen bg-surface-paper">
        <header className="bg-white border-b border-line">
          <div className="px-8 py-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </header>
        <div className="p-8">
          <div className="h-96 bg-white border border-line animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- BREADCRUMB HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <Link
              href="/admin/dashboard"
              className="hover:text-gold-600 transition-colors"
            >
              Dashboard
            </Link>
            <span>›</span>
            <Link
              href="/admin/envios"
              className="hover:text-gold-600 transition-colors"
            >
              Envios
            </Link>
            <span>›</span>
            <span className="text-navy-900 font-medium">
              {submission.companyName}
            </span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900">
                Detalhes do Envio
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {submission.companyName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/envios">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="p-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Submission Details */}
          <div className="col-span-12 lg:col-span-8">
            <SubmissionDetails submission={submission} />
          </div>

          {/* Right Column: Next Steps */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-8">
              <div className="bg-white border border-line p-6">
                <h2 className="font-heading text-lg font-medium mb-4">
                  Próximas Etapas
                </h2>
                <div className="space-y-3">
                  <Link href={`/admin/enriquecimento/${submissionId}`}>
                    <Button variant="architect" className="w-full justify-between">
                      <span>Ir para Enriquecimento</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/analise/${submissionId}`}>
                    <Button variant="outline" className="w-full justify-between">
                      <span>Ir para Análise</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-surface-paper rounded">
                  <h3 className="text-sm font-medium mb-2">Fluxo de Trabalho</h3>
                  <ol className="text-xs text-text-secondary space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span><strong>Envio</strong> - Dados do formulário recebidos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span><strong>Enriquecimento</strong> - Dados enriquecidos com IA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span><strong>Análise</strong> - Análise estratégica (SWOT, PESTEL, Porter)</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
