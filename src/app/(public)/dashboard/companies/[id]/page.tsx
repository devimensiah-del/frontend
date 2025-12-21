'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Target,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompany, useMe, useEnrichmentStatus } from '@/lib/hooks'
import type { Company, Challenge, EnrichmentStatus } from '@/lib/types'

function EnrichmentStatusBadge({ status }: { status: EnrichmentStatus }) {
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

function InfoItem({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-navy-900">{value}</p>
      </div>
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const categoryLabels: Record<string, string> = {
    growth: 'Crescimento',
    transform: 'Transformacao',
    compete: 'Competitividade',
  }

  return (
    <div className="bg-white border border-line p-4 hover:border-gold-500 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gold-700 bg-gold-50 rounded-full">
          <Target className="w-3 h-3" />
          {categoryLabels[challenge.challenge_category] || challenge.challenge_category}
        </span>
        {challenge.latest_analysis && (
          <Link
            href={`/dashboard/analysis/${challenge.latest_analysis.id}`}
            className="text-xs text-gold-600 hover:underline flex items-center gap-1"
          >
            Ver Analise
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <p className="text-sm text-navy-900 line-clamp-2">
        {challenge.business_challenge}
      </p>
    </div>
  )
}

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const { data: userData, isError: isUserError } = useMe()
  const { data: company, isLoading, isError } = useCompany(companyId)
  const { data: enrichmentStatus } = useEnrichmentStatus(companyId)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isUserError) {
      router.push('/login')
    }
  }, [isUserError, router])

  // Redirect to set-password if needed
  useEffect(() => {
    if (userData?.user && !userData.user.passwordSet) {
      router.push('/set-password')
    }
  }, [userData, router])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando empresa...</p>
        </div>
      </div>
    )
  }

  if (isError || !company) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-paper py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-medium text-red-900 mb-1">Empresa nao encontrada</h3>
            <p className="text-sm text-red-700 mb-4">
              Nao foi possivel carregar as informacoes da empresa.
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-paper py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>

        {/* Company header */}
        <div className="bg-white border border-line p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-navy-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-navy-900">{company.name}</h1>
                {company.industry && (
                  <p className="text-muted-foreground mt-0.5">{company.industry}</p>
                )}
              </div>
            </div>
            <EnrichmentStatusBadge status={company.enrichment_status} />
          </div>

          {/* Company info grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-line">
            <InfoItem icon={Globe} label="Website" value={company.website} />
            <InfoItem icon={MapPin} label="Localizacao" value={company.location || company.headquarters} />
            <InfoItem icon={Users} label="Tamanho" value={company.employees_range || company.company_size} />
          </div>

          {company.website && (
            <div className="mt-4 pt-4 border-t border-line">
              <a
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700"
              >
                Visitar website
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Enrichment status */}
        {enrichmentStatus && (
          <div className="bg-white border border-line p-6 mb-6">
            <h2 className="text-lg font-medium text-navy-900 mb-4">Status do Enriquecimento</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-700">Etapa 1: Informacoes Basicas</span>
                <EnrichmentStatusBadge status={enrichmentStatus.step1_status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-700">Etapa 2: Modelo de Negocio</span>
                <EnrichmentStatusBadge status={enrichmentStatus.step2_status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-700">Etapa 3: Inteligencia Competitiva</span>
                <EnrichmentStatusBadge status={enrichmentStatus.step3_status} />
              </div>
            </div>
          </div>
        )}

        {/* Challenges section */}
        <div className="bg-white border border-line p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-navy-900">Desafios</h2>
          </div>

          {company.challenges && company.challenges.length > 0 ? (
            <div className="space-y-3">
              {company.challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-surface-paper rounded-lg">
              <Target className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum desafio cadastrado ainda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
