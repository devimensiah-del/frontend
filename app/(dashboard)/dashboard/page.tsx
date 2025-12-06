"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi, submissionsApi, authApi } from "@/lib/api/client";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { SubmissionCard } from "@/components/dashboard/SubmissionCard";
import { Button } from "@/components/atoms/Button";
import { Card, CardHeader, CardBody } from "@/components/organisms/Card";
import { Skeleton } from "@/components/atoms/Skeleton";
import { AlertBox } from "@/components/molecules/AlertBox";
import { cn } from "@/lib/utils/cn";
import {
  Building2,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Redirect admins to admin dashboard
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  React.useEffect(() => {
    if (isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, router]);

  // Fetch user's companies
  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["myCompanies"],
    queryFn: companiesApi.getMyCompanies,
    enabled: !!user && !isAdmin,
  });

  // Fetch user's submissions
  const { data: submissionsData, isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: () => submissionsApi.listSubmissions({ pageSize: 5 }),
    enabled: !!user && !isAdmin,
  });

  const companies = companiesData?.companies || [];
  const submissions = submissionsData?.submissions || [];

  // Auto-redirect if user has exactly 1 company
  React.useEffect(() => {
    if (!isUserLoading && !isCompaniesLoading && !isAdmin && companies.length === 1) {
      router.replace(`/dashboard/companies/${companies[0].id}`);
    }
  }, [isUserLoading, isCompaniesLoading, isAdmin, companies, router]);

  // Show loading while redirecting (admin or single company)
  if (isAdmin || (!isUserLoading && !isCompaniesLoading && companies.length === 1)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (isUserLoading || isCompaniesLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton variant="text" width={200} height={24} />
          <Skeleton variant="text" width={400} height={20} />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardBody>
                <Skeleton variant="rectangular" height={100} />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCompanies = companies.length;
  const totalSubmissions = submissionsData?.total || 0;
  const pendingAnalyses = submissions.filter((s) => {
    // Count submissions without completed analysis
    return !s.analysisId; // Simplified - actual logic would check analysis status
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
          Bem-vindo, {user?.fullName?.split(" ")[0] || "Usuário"}
        </h1>
        <p className="text-base text-text-secondary max-w-2xl">
          Gerencie suas empresas e acompanhe suas análises estratégicas em tempo real.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Companies */}
        <Card variant="bordered" className="hover:shadow-md transition-all">
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
                  Empresas
                </p>
                <p className="text-3xl font-bold text-text-primary mb-1">
                  {totalCompanies}
                </p>
                <p className="text-sm text-text-secondary">
                  {totalCompanies === 1 ? "empresa cadastrada" : "empresas cadastradas"}
                </p>
              </div>
              <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gold-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Total Submissions */}
        <Card variant="bordered" className="hover:shadow-md transition-all">
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
                  Submissões
                </p>
                <p className="text-3xl font-bold text-text-primary mb-1">
                  {totalSubmissions}
                </p>
                <p className="text-sm text-text-secondary">
                  {totalSubmissions === 1 ? "análise solicitada" : "análises solicitadas"}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Pending Analyses */}
        <Card variant="bordered" className="hover:shadow-md transition-all">
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
                  Em Andamento
                </p>
                <p className="text-3xl font-bold text-text-primary mb-1">
                  {pendingAnalyses}
                </p>
                <p className="text-sm text-text-secondary">
                  {pendingAnalyses === 1 ? "análise pendente" : "análises pendentes"}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-lg font-bold text-text-primary">Ações Rápidas</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex items-center gap-2"
              onClick={() => router.push("/dashboard/companies")}
            >
              <Building2 className="w-5 h-5" />
              Ver Minhas Empresas
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
              onClick={() => router.push("/dashboard/submissions")}
            >
              <FileText className="w-5 h-5" />
              Ver Submissões
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <Plus className="w-5 h-5" />
              Nova Análise
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      {submissions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Atividade Recente</h2>
            {totalSubmissions > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/submissions")}
                className="flex items-center gap-2"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.slice(0, 3).map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State for New Users */}
      {companies.length === 0 && submissions.length === 0 && (
        <AlertBox variant="info" title="Comece agora">
          <p className="mb-4">
            Você ainda não possui empresas ou análises cadastradas. Envie sua primeira análise para começar!
          </p>
          <Button
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Análise Estratégica
          </Button>
        </AlertBox>
      )}
    </div>
  );
}
