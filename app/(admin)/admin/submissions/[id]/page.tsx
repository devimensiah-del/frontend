"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { ArrowLeft, Building2, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Fetch submission details
  const { data: submission, isLoading, error } = useQuery({
    queryKey: ["adminSubmission", id],
    queryFn: () => adminApi.getSubmission(id),
  });

  if (isLoading) {
    return <LoadingState message="Carregando submissão..." size="lg" />;
  }

  if (error || !submission) {
    return (
      <ErrorState
        title="Submissão não encontrada"
        message="A submissão solicitada não existe."
        retryLabel="Voltar"
        onRetry={() => router.push("/admin/submissions")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/submissions")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Submissão #{submission.id.slice(0, 8)}
        </h1>
        <p className="text-gray-400">
          Criada em {format(new Date(submission.createdAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Nome da Empresa</div>
              <div className="text-white font-medium">{submission.companyName}</div>
            </div>
            {submission.cnpj && (
              <div>
                <div className="text-sm text-gray-400">CNPJ</div>
                <div className="text-white">{submission.cnpj}</div>
              </div>
            )}
            {submission.industry && (
              <div>
                <div className="text-sm text-gray-400">Indústria</div>
                <div className="text-white">{submission.industry}</div>
              </div>
            )}
            {submission.companySize && (
              <div>
                <div className="text-sm text-gray-400">Porte</div>
                <div className="text-white">{submission.companySize}</div>
              </div>
            )}
            {submission.website && (
              <div>
                <div className="text-sm text-gray-400">Website</div>
                <a
                  href={submission.website.startsWith("http") ? submission.website : `https://${submission.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-500 hover:text-gold-400"
                >
                  {submission.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contexto Estratégico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submission.strategicGoal && (
              <div>
                <div className="text-sm text-gray-400">Objetivo Estratégico</div>
                <div className="text-white">{submission.strategicGoal}</div>
              </div>
            )}
            {submission.currentChallenges && (
              <div>
                <div className="text-sm text-gray-400">Desafios Atuais</div>
                <div className="text-white">{submission.currentChallenges}</div>
              </div>
            )}
            {submission.competitivePosition && (
              <div>
                <div className="text-sm text-gray-400">Posição Competitiva</div>
                <div className="text-white">{submission.competitivePosition}</div>
              </div>
            )}
            {submission.additionalInfo && (
              <div>
                <div className="text-sm text-gray-400">Informações Adicionais</div>
                <div className="text-white">{submission.additionalInfo}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Metadados
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">ID da Submissão</div>
            <div className="text-white font-mono text-sm">{submission.id}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Status</div>
            <div className="text-white">{submission.status}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Criado em</div>
            <div className="text-white">
              {format(new Date(submission.createdAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Atualizado em</div>
            <div className="text-white">
              {format(new Date(submission.updatedAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
