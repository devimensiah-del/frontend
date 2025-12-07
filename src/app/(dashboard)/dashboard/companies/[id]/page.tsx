'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCompany } from '@/lib/hooks/use-companies'
import { useChallenges } from '@/lib/hooks/use-challenges'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { ChallengeCard } from '@/components/dashboard/ChallengeCard'
import { NewChallengeModal } from '@/components/dashboard/NewChallengeModal'
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  FileText,
} from 'lucide-react'

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string
  const { data: company, isLoading: companyLoading, error: companyError } = useCompany(companyId)
  const { data: challenges, isLoading: challengesLoading } = useChallenges(companyId)
  const [isNewChallengeOpen, setIsNewChallengeOpen] = useState(false)

  if (companyLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (companyError || !company) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
            <p className="text-text-secondary text-center">
              Empresa nao encontrada ou voce nao tem permissao para visualiza-la.
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const InfoSection = ({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-navy-900" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )

  const InfoItem = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-navy-900">{value || '-'}</span>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-navy-900/5 rounded-lg">
            <Building2 className="h-8 w-8 text-navy-900" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-navy-900">
              {company.name}
            </h1>
            {company.legal_name && company.legal_name !== company.name && (
              <p className="text-sm text-text-secondary mt-1">{company.legal_name}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <StatusBadge status={company.enrichment_status} />
              {company.enrichment_status === 'completed' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Enriquecida
                </span>
              )}
            </div>
          </div>
        </div>
        <Button onClick={() => setIsNewChallengeOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Desafio
        </Button>
      </div>

      {/* Challenges Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-navy-900" />
              <CardTitle className="text-lg">Desafios</CardTitle>
            </div>
            {challenges && challenges.length > 0 && (
              <span className="text-sm text-text-secondary">
                {challenges.length} desafio{challenges.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <CardDescription>
            Cada desafio representa uma questao estrategica que pode ser analisada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {challengesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : challenges && challenges.length > 0 ? (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  companyId={companyId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-text-secondary/50 mb-4" />
              <h3 className="text-lg font-medium text-navy-900 mb-2">
                Nenhum desafio ainda
              </h3>
              <p className="text-sm text-text-secondary mb-4 max-w-md">
                Crie um novo desafio para iniciar uma analise estrategica para esta empresa.
              </p>
              <Button onClick={() => setIsNewChallengeOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Desafio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Identity Section */}
      <InfoSection title="Identidade" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Nome Legal" value={company.legal_name} />
          <InfoItem label="CNPJ" value={company.cnpj} />
          <InfoItem label="Setor" value={company.sector || company.industry} />
          <InfoItem label="Ano de Fundacao" value={company.foundation_year} />
          {company.website && (
            <div className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm text-text-secondary">Website</span>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-navy-900 hover:underline flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                {company.website}
              </a>
            </div>
          )}
        </div>
      </InfoSection>

      {/* Business Information */}
      <InfoSection title="Informacoes de Negocio" icon={Target}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Modelo de Negocio" value={company.business_model} />
          <InfoItem label="Publico-Alvo" value={company.target_audience} />
          <InfoItem label="Mercado Alvo" value={company.target_market} />
          <InfoItem label="Estagio de Funding" value={company.funding_stage} />
          {company.value_proposition && (
            <div className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm text-text-secondary">Proposta de Valor</span>
              <span className="text-sm font-medium text-navy-900">{company.value_proposition}</span>
            </div>
          )}
        </div>
      </InfoSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Size & Performance */}
        <InfoSection title="Tamanho & Performance" icon={TrendingUp}>
          <div className="space-y-4">
            <InfoItem label="Tamanho" value={company.company_size} />
            <InfoItem label="Funcionarios" value={company.employees_range} />
            <InfoItem label="Receita Estimada" value={company.revenue_estimate} />
            {company.annual_revenue_min && company.annual_revenue_max && (
              <InfoItem
                label="Faixa de Receita Anual"
                value={`R$ ${company.annual_revenue_min.toLocaleString()} - R$ ${company.annual_revenue_max.toLocaleString()}`}
              />
            )}
          </div>
        </InfoSection>

        {/* Location */}
        <InfoSection title="Localizacao" icon={MapPin}>
          <div className="space-y-4">
            <InfoItem label="Sede" value={company.headquarters || company.location} />
            <InfoItem label="Maturidade Digital" value={company.digital_maturity ? `${company.digital_maturity}/10` : undefined} />
          </div>
        </InfoSection>
      </div>

      {/* Market Position */}
      {(company.competitors && company.competitors.length > 0) || company.market_share_status ? (
        <InfoSection title="Posicao de Mercado" icon={Target}>
          <div className="space-y-4">
            {company.market_share_status && (
              <InfoItem label="Status de Market Share" value={company.market_share_status} />
            )}
            {company.competitors && company.competitors.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-text-secondary">Concorrentes</span>
                <div className="flex flex-wrap gap-2">
                  {company.competitors.map((competitor, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-navy-900/5 rounded-md text-sm font-medium text-navy-900"
                    >
                      {competitor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoSection>
      ) : null}

      {/* SWOT Preview */}
      {(company.strengths && company.strengths.length > 0) || (company.weaknesses && company.weaknesses.length > 0) ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analise SWOT (Preview)</CardTitle>
            <CardDescription>Dados preliminares do enriquecimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.strengths && company.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Forcas</h4>
                  <ul className="space-y-1">
                    {company.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {company.weaknesses && company.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Fraquezas</h4>
                  <ul className="space-y-1">
                    {company.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Social Links */}
      {(company.linkedin_url || company.twitter_handle) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Links Sociais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {company.linkedin_url && (
                <a
                  href={company.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy-900 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {company.twitter_handle && (
                <a
                  href={`https://twitter.com/${company.twitter_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy-900 hover:underline"
                >
                  Twitter: {company.twitter_handle}
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Challenge Modal */}
      <NewChallengeModal
        open={isNewChallengeOpen}
        onOpenChange={setIsNewChallengeOpen}
        companyId={companyId}
      />
    </div>
  )
}
