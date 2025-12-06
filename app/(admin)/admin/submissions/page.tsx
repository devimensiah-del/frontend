"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, EmptyState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { FileText, Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Submission } from "@/lib/types";

const PAGE_SIZE = 20;

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch submissions with pagination
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ["adminSubmissions", page],
    queryFn: () => adminApi.getAllSubmissions({ page, pageSize: PAGE_SIZE }),
  });

  const submissions = submissionsData?.data || [];
  const total = submissionsData?.total || 0;
  const totalPages = submissionsData?.totalPages || 1;

  // Filter submissions by search query
  const filteredSubmissions = searchQuery
    ? submissions.filter((s) =>
        s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery) ||
        s.cnpj?.includes(searchQuery)
      )
    : submissions;

  if (isLoading) {
    return <LoadingState message="Carregando submissões..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Submissões</h1>
          <p className="text-gray-400">
            {total} submissões cadastradas
          </p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por empresa, ID ou CNPJ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <EmptyState
              variant="inbox"
              title="Nenhuma submissão encontrada"
              description="Nenhuma submissão corresponde aos critérios de busca."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="pb-3 text-sm font-medium text-gray-400">ID</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Empresa</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">CNPJ</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Data</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-400 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission: Submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-gray-800 hover:bg-gray-850 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm font-mono">
                            {submission.id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-white font-medium">{submission.companyName}</div>
                      </td>
                      <td className="py-4 text-sm text-gray-300">
                        {submission.cnpj || "-"}
                      </td>
                      <td className="py-4 text-sm text-gray-300">
                        {format(new Date(submission.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="py-4">
                        <Badge variant="outline" className="text-xs bg-gray-800 border-gray-700 text-gray-400">
                          {submission.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/submissions/${submission.id}`);
                          }}
                          className="text-gold-500 hover:text-gold-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Mostrando {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} de {total}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-gray-800 border-gray-700 text-gray-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                <div className="text-sm text-gray-400">
                  Página {page} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="bg-gray-800 border-gray-700 text-gray-300"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
