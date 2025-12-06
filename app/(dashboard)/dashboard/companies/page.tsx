"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi, authApi } from "@/lib/api/client";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { AlertBox } from "@/components/molecules/AlertBox";
import { Card, CardBody } from "@/components/organisms/Card";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompaniesListPage() {
  const router = useRouter();

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Fetch user's companies
  const { data: companiesData, isLoading } = useQuery({
    queryKey: ["myCompanies"],
    queryFn: companiesApi.getMyCompanies,
    enabled: !!user,
  });

  const companies = companiesData?.companies || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={500} height={20} />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
            <Building2 className="w-8 h-8 text-gold-600" />
            Minhas Empresas
          </h1>
          <p className="text-base text-text-secondary">
            Veja as empresas que você possui acesso e gerencie suas informações.
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

      {/* Companies Count */}
      {companies.length > 0 && (
        <div>
          <p className="text-sm text-text-tertiary">
            {companies.length} {companies.length === 1 ? "empresa" : "empresas"} disponíveis
          </p>
        </div>
      )}

      {/* Companies Grid */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <AlertBox variant="info" title="Nenhuma empresa ainda">
          <p className="mb-4">
            Você ainda não possui acesso a nenhuma empresa. Quando você enviar uma análise ou for adicionado a uma empresa, ela aparecerá aqui.
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
