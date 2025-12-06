"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { submissionsApi, authApi } from "@/lib/api/client";
import { SubmissionCard } from "@/components/dashboard/SubmissionCard";
import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { AlertBox } from "@/components/molecules/AlertBox";
import { Card, CardBody } from "@/components/organisms/Card";
import { FileText, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmissionsListPage() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const pageSize = 12;

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Fetch user's submissions with pagination
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ["mySubmissions", page],
    queryFn: () => submissionsApi.listSubmissions({ page, pageSize }),
    enabled: !!user,
  });

  const submissions = submissionsData?.submissions || [];
  const total = submissionsData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton variant="text" width={250} height={32} />
          <Skeleton variant="text" width={600} height={20} />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardBody>
                <Skeleton variant="rectangular" height={200} />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-gold-600" />
            Minhas Submissões
          </h1>
          <p className="text-base text-text-secondary">
            Acompanhe o status de todas as suas análises estratégicas.
          </p>
        </div>

        <Button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Análise
        </Button>
      </div>

      {/* Submissions Count */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-tertiary">
            {total} {total === 1 ? "submissão" : "submissões"} no total
          </p>

          {/* Pagination Info */}
          {totalPages > 1 && (
            <p className="text-sm text-text-tertiary">
              Página {page} de {totalPages}
            </p>
          )}
        </div>
      )}

      {/* Submissions Grid */}
      {submissions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;

                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "architect" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <AlertBox variant="info" title="Nenhuma submissão ainda">
          <p className="mb-4">
            Você ainda não enviou nenhuma análise. Comece agora para obter insights estratégicos sobre sua empresa!
          </p>
          <Button
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Enviar Primeira Análise
          </Button>
        </AlertBox>
      )}
    </div>
  );
}
