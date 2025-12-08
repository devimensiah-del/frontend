'use client'

import Link from 'next/link'
import { useAdminCompanies } from '@/lib/hooks'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, AlertCircle, CheckCircle2, Clock, Loader2, ChevronRight } from 'lucide-react'
import type { EnrichmentStatus } from '@/lib/types'

function getEnrichmentBadge(status: EnrichmentStatus) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Enriquecida
        </Badge>
      )
    case 'processing':
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processando
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="text-error border-error/30 bg-error/10">
          <AlertCircle className="w-3 h-3 mr-1" />
          Falhou
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      )
  }
}

function CompanyCardSkeleton() {
  return (
    <div className="bg-white border border-line p-4 lg:p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { data, isLoading, error } = useAdminCompanies()

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h1 className="text-xl font-medium text-navy-900 mb-2">
          Falha ao carregar empresas
        </h1>
        <p className="text-muted-foreground">
          Por favor, tente novamente mais tarde.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500">
            Empresas
          </span>
          <h1 className="text-2xl lg:text-3xl font-medium text-navy-900 mt-1">
            Todas as Empresas
          </h1>
        </div>
        {data?.companies && (
          <div className="text-sm text-muted-foreground">
            {data.companies.length} {data.companies.length === 1 ? 'empresa' : 'empresas'}
          </div>
        )}
      </div>

      {/* Companies List */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            <CompanyCardSkeleton />
            <CompanyCardSkeleton />
            <CompanyCardSkeleton />
          </>
        ) : data?.companies && data.companies.length > 0 ? (
          data.companies.map((company) => (
            <Link
              key={company.id}
              href={`/admin/companies/${company.id}`}
              className="block bg-white border border-line p-4 lg:p-6 hover:border-gold-300 hover:shadow-sm transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Icon */}
                <div className="hidden sm:flex w-10 h-10 bg-navy-900/5 rounded items-center justify-center flex-shrink-0 group-hover:bg-gold-500/10 transition-colors">
                  <Building2 className="w-5 h-5 text-navy-700 group-hover:text-gold-600 transition-colors" />
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base lg:text-lg font-medium text-navy-900 truncate group-hover:text-gold-600 transition-colors">
                      {company.name}
                    </h3>
                    {getEnrichmentBadge(company.enrichment_status)}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {company.industry && (
                      <span>{company.industry}</span>
                    )}
                    {company.location && (
                      <span>{company.location}</span>
                    )}
                    {company.company_size && (
                      <span>{company.company_size}</span>
                    )}
                  </div>

                  {/* Challenges count */}
                  {company.challenges && company.challenges.length > 0 && (
                    <div className="mt-2 text-sm text-gold-600">
                      {company.challenges.length} {company.challenges.length === 1 ? 'desafio' : 'desafios'}
                    </div>
                  )}
                </div>

                {/* Date + Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-xs text-muted-foreground sm:text-right">
                    <div className="sm:hidden inline">Criada em </div>
                    {new Date(company.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-gold-500 transition-colors hidden sm:block" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white border border-line p-8 lg:p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-navy-900 mb-2">
              Nenhuma empresa ainda
            </h3>
            <p className="text-muted-foreground">
              As empresas aparecerão aqui quando os diagnósticos forem criados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
