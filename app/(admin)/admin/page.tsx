"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi, adminCompaniesApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { Building2, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminHomePage() {
  // Fetch stats
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: adminApi.getAnalytics,
  });

  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["adminCompaniesCount"],
    queryFn: () => adminCompaniesApi.listAll({ limit: 1, offset: 0 }),
  });

  const isLoading = isAnalyticsLoading || isCompaniesLoading;

  if (isLoading) {
    return <LoadingState message="Carregando estatísticas..." size="lg" />;
  }

  const totalCompanies = companiesData?.total || 0;
  const totalSubmissions = analyticsData?.totalSubmissions || 0;
  const activeSubmissions = analyticsData?.activeSubmissions || 0;
  const completedSubmissions = analyticsData?.completedSubmissions || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Visão Geral
        </h1>
        <p className="text-gray-400">
          Painel administrativo do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total de Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCompanies}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total de Submissões
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Análises Pendentes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{activeSubmissions}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Relatórios Gerados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/companies"
              className="block p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gold-500" />
                <div>
                  <div className="text-white font-medium">Gerenciar Empresas</div>
                  <div className="text-sm text-gray-400">
                    Ver todas as empresas cadastradas
                  </div>
                </div>
              </div>
            </a>

            <a
              href="/admin/submissions"
              className="block p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-white font-medium">Ver Submissões</div>
                  <div className="text-sm text-gray-400">
                    Acompanhar todas as submissões
                  </div>
                </div>
              </div>
            </a>

            <a
              href="/admin/macroeconomia"
              className="block p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-white font-medium">Indicadores Macro</div>
                  <div className="text-sm text-gray-400">
                    Atualizar dados econômicos
                  </div>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">
              Nenhuma atividade recente para mostrar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
