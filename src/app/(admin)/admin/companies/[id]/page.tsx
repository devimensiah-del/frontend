'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAdminCompany, useRetryEnrichment } from '@/lib/hooks/use-admin'
import { useChallenges } from '@/lib/hooks/use-challenges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChallengeCard } from '@/components/dashboard/ChallengeCard'
import { ReAnalyzeDialog } from '@/components/features/admin'
import { RefreshCw, Loader2, Building2, Zap } from 'lucide-react'

export default function AdminCompanyPage() {
  const { id } = useParams<{ id: string }>()
  const [reAnalyzeOpen, setReAnalyzeOpen] = useState(false)
  const { data: company, isLoading: companyLoading } = useAdminCompany(id)
  const { data: challenges, isLoading: challengesLoading } = useChallenges(id)
  const retryEnrichment = useRetryEnrichment()

  if (companyLoading || challengesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Empresa não encontrada</p>
      </div>
    )
  }

  const enrichmentVariant = company.enrichment_status === 'completed' ? 'success' :
    company.enrichment_status === 'failed' ? 'error' : 'warning'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-navy-900/5 rounded-lg">
            <Building2 className="h-8 w-8 text-navy-700" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">{company.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={enrichmentVariant}>
                {company.enrichment_status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setReAnalyzeOpen(true)}
            disabled={company.enrichment_status !== 'completed'}
          >
            <Zap className="mr-2 h-4 w-4" />
            Nova Análise (Bypass Wizard)
          </Button>
          <Button
            onClick={() => retryEnrichment.mutate(id)}
            disabled={retryEnrichment.isPending || company.enrichment_status === 'processing'}
            variant="outline"
          >
            {retryEnrichment.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Re-enriquecer
          </Button>
        </div>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {company.website && (
            <div>
              <p className="text-xs text-text-secondary">Website</p>
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                {company.website}
              </a>
            </div>
          )}
          {company.industry && (
            <div>
              <p className="text-xs text-text-secondary">Indústria</p>
              <p className="text-sm">{company.industry}</p>
            </div>
          )}
          {company.location && (
            <div>
              <p className="text-xs text-text-secondary">Localização</p>
              <p className="text-sm">{company.location}</p>
            </div>
          )}
          {company.company_size && (
            <div>
              <p className="text-xs text-text-secondary">Tamanho</p>
              <p className="text-sm">{company.company_size}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Challenges */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Desafios</h2>
        {challenges && challenges.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                companyId={id}
              />
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">Nenhum desafio criado.</p>
        )}
      </div>

      {/* Re-analyze Dialog - Bypasses Wizard */}
      <ReAnalyzeDialog
        companyId={id}
        companyName={company.name}
        open={reAnalyzeOpen}
        onOpenChange={setReAnalyzeOpen}
      />
    </div>
  )
}
