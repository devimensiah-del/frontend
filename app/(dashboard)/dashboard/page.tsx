"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi, authApi } from "@/lib/api/client";
import { CompanyCard } from "@/components/dashboard/CompanyCard";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Eyebrow, Text } from "@/components/ui/Typography";
import type { Company } from "@/lib/types";
import { LoadingState, EmptyState } from "@/components/ui/state-components";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Redirect admins to admin dashboard
  const isAdmin = user?.role === "admin";
  React.useEffect(() => {
    if (isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, router]);

  // Fetch user's companies (where user is owner or in allowed_users)
  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["myCompanies"],
    queryFn: companiesApi.getMyCompanies,
    enabled: !!user && !isAdmin,
  });

  const isLoading = isUserLoading || isCompaniesLoading;

  // Don't render while redirecting admin
  if (isAdmin) {
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
            message="Carregando suas empresas..."
            size="lg"
          />
        </Container>
      </Section>
    );
  }

  const companies = companiesData?.companies || [];

  return (
    <Section className="bg-surface-paper border-0 min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Eyebrow className="mb-4">Suas Empresas</Eyebrow>
          <Heading variant="section" className="mb-6">
            Meus Projetos
          </Heading>
          <Text variant="lead" className="max-w-2xl">
            Veja as empresas que você possui acesso. Clique em uma empresa para
            visualizar os relatórios e análises estratégicas.
          </Text>
        </div>

        {/* Companies Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {companies.length === 0 ? (
            <EmptyState
              variant="inbox"
              title="Nenhuma empresa ainda"
              description="Você ainda não possui acesso a nenhuma empresa. Quando você enviar uma análise ou for adicionado a uma empresa, ela aparecerá aqui."
            />
          ) : (
            <>
              <div className="mb-8">
                <Text variant="small" className="text-text-secondary">
                  {companies.length} {companies.length === 1 ? "empresa" : "empresas"} disponíveis
                </Text>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company: Company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
