'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, Plus, ChevronRight, Loader2, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompanies, useMe } from '@/lib/hooks'
import type { Company } from '@/lib/types'

function EnrichmentStatusBadge({ status }: { status: Company['enrichment_status'] }) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full">
          <CheckCircle2 className="w-3 h-3" />
          Completo
        </span>
      )
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
          <Loader2 className="w-3 h-3 animate-spin" />
          Processando
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50 rounded-full">
          <XCircle className="w-3 h-3" />
          Falhou
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-full">
          <Clock className="w-3 h-3" />
          Pendente
        </span>
      )
  }
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/dashboard/companies/${company.id}`}
      className="block bg-white border border-line p-6 hover:border-gold-500 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <h3 className="font-medium text-navy-900 group-hover:text-gold-600 transition-colors">
              {company.name}
            </h3>
            {company.industry && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {company.industry}
              </p>
            )}
            {company.website && (
              <p className="text-xs text-muted-foreground mt-1">
                {company.website}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EnrichmentStatusBadge status={company.enrichment_status} />
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold-500 transition-colors" />
        </div>
      </div>
      {company.challenges && company.challenges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-xs text-muted-foreground">
            {company.challenges.length} desafio{company.challenges.length !== 1 ? 's' : ''} cadastrado{company.challenges.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Link>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: userData, isLoading: isLoadingUser, isError: isUserError } = useMe()
  const { data: companiesData, isLoading: isLoadingCompanies, isError: isCompaniesError } = useCompanies()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isUserError) {
      router.push('/login')
    }
  }, [isUserError, router])

  // Redirect admins to admin dashboard
  useEffect(() => {
    const role = userData?.user?.role
    if (role === 'admin' || role === 'super_admin') {
      router.push('/admin')
    }
  }, [userData, router])

  // Check if user needs to set password (only for non-admin users with passwordSet explicitly false)
  useEffect(() => {
    if (userData?.user && userData.user.passwordSet === false) {
      router.push('/set-password')
    }
  }, [userData, router])

  const isLoading = isLoadingUser || isLoadingCompanies
  const companies = companiesData?.companies || []

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-paper py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-navy-900">
              Minhas Empresas
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas empresas e acompanhe as analises
            </p>
          </div>
          <Button asChild>
            <Link href="/submit">
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Link>
          </Button>
        </div>

        {/* Error state */}
        {isCompaniesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-medium text-red-900 mb-1">Erro ao carregar empresas</h3>
            <p className="text-sm text-red-700">
              Ocorreu um erro ao buscar suas empresas. Tente recarregar a pagina.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isCompaniesError && companies.length === 0 && (
          <div className="bg-white border border-line rounded-lg p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-navy-900 mb-2">
              Nenhuma empresa cadastrada
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Cadastre sua primeira empresa para iniciar uma analise estrategica personalizada.
            </p>
            <Button asChild>
              <Link href="/submit">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Empresa
              </Link>
            </Button>
          </div>
        )}

        {/* Companies list */}
        {!isCompaniesError && companies.length > 0 && (
          <div className="space-y-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
