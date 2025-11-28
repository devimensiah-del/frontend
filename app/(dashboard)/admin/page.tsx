"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminCompaniesApi, authApi } from "@/lib/api/client";
import { AdminCompanyCard } from "@/components/dashboard/CompanyCard";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Eyebrow, Text } from "@/components/ui/Typography";
import type { Company } from "@/lib/types";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/state-components";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

export default function AdminDashboardPage() {
  const [page, setPage] = React.useState(0);
  const router = useRouter();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Redirect non-admins to user dashboard
  const isAdmin = user?.role === "admin";
  React.useEffect(() => {
    if (user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isAdmin, router]);

  // Fetch all companies with pagination
  const { data: companiesData, isLoading: isCompaniesLoading, error } = useQuery({
    queryKey: ["adminCompanies", page],
    queryFn: () => adminCompaniesApi.listAll({ limit: PAGE_SIZE, offset: page * PAGE_SIZE }),
    enabled: isAdmin,
  });

  const isLoading = isUserLoading || isCompaniesLoading;

  // Don't render while redirecting non-admin
  if (user && !isAdmin) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState
            message="Redirecionando..."
            size="lg"
          />
        </Container>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState
            message="Carregando empresas..."
            size="lg"
          />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <ErrorState
            title="Erro ao carregar"
            message="Não foi possível carregar as empresas. Tente novamente."
            retryLabel="Tentar novamente"
            onRetry={() => window.location.reload()}
          />
        </Container>
      </Section>
    );
  }

  const companies = companiesData?.companies || [];
  const total = companiesData?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Section className="bg-surface-paper border-0 min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Eyebrow className="mb-4">Administração</Eyebrow>
          <Heading variant="section" className="mb-6">
            Gerenciamento de Empresas
          </Heading>
          <Text variant="lead" className="max-w-2xl">
            Gerencie todas as empresas cadastradas na plataforma. Clique em uma empresa
            para visualizar detalhes e gerenciar relatórios.
          </Text>
        </div>

        {/* Companies Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {companies.length === 0 ? (
            <EmptyState
              variant="inbox"
              title="Nenhuma empresa cadastrada"
              description="Ainda não há empresas cadastradas na plataforma."
            />
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <Text variant="small" className="text-text-secondary">
                  Mostrando {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} de {total} empresas
                </Text>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company: Company) => (
                  <AdminCompanyCard
                    key={company.id}
                    company={company}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <Text variant="small" className="text-text-secondary">
                    Página {page + 1} de {totalPages}
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
