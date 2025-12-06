"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminCompaniesApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, EmptyState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Building2, Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Company } from "@/lib/types";

const PAGE_SIZE = 20;

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch companies with pagination
  const { data: companiesData, isLoading } = useQuery({
    queryKey: ["adminCompanies", page],
    queryFn: () => adminCompaniesApi.listAll({ limit: PAGE_SIZE, offset: page * PAGE_SIZE }),
  });

  const companies = companiesData?.companies || [];
  const total = companiesData?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Filter companies by search query
  const filteredCompanies = searchQuery
    ? companies.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.cnpj?.includes(searchQuery) ||
        c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : companies;

  if (isLoading) {
    return <LoadingState message="Carregando empresas..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Empresas</h1>
          <p className="text-gray-400">
            {total} empresas cadastradas
          </p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, CNPJ ou indústria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <EmptyState
              variant="inbox"
              title="Nenhuma empresa encontrada"
              description="Nenhuma empresa corresponde aos critérios de busca."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="pb-3 text-sm font-medium text-gray-400">Nome</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">CNPJ</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Indústria</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Verificada</th>
                    <th className="pb-3 text-sm font-medium text-gray-400 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company: Company) => (
                    <tr
                      key={company.id}
                      className="border-b border-gray-800 hover:bg-gray-850 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/companies/${company.id}`)}
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-white font-medium">{company.name}</div>
                            {company.legal_name && company.legal_name !== company.name && (
                              <div className="text-xs text-gray-500">{company.legal_name}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-300">
                        {company.cnpj || "-"}
                      </td>
                      <td className="py-4 text-sm text-gray-300">
                        {company.industry || "-"}
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            company.enrichment_status === "completed"
                              ? "success"
                              : company.enrichment_status === "pending"
                              ? "warning"
                              : "error"
                          }
                          className="text-xs"
                        >
                          {company.enrichment_status === "completed"
                            ? "Enriquecido"
                            : company.enrichment_status === "pending"
                            ? "Processando"
                            : company.enrichment_status === "failed"
                            ? "Falhou"
                            : "Não processado"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {company.is_verified ? (
                          <Badge variant="outline" className="text-xs bg-green-950 text-green-400 border-green-800">
                            Verificada
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-gray-800 text-gray-400 border-gray-700">
                            Não verificada
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/companies/${company.id}`);
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
                Mostrando {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} de {total}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="bg-gray-800 border-gray-700 text-gray-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                <div className="text-sm text-gray-400">
                  Página {page + 1} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
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
