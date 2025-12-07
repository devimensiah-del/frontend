'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Zap,
  ArrowRightLeft,
  Swords,
  Banknote,
  Play,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import type { Challenge, AnalysisStatus } from '@/lib/types'
import { useStartWizard } from '@/lib/hooks'

const categoryIcons = {
  growth: TrendingUp,
  transform: Zap,
  transition: ArrowRightLeft,
  compete: Swords,
  funding: Banknote,
}

const categoryLabels = {
  growth: 'Crescimento',
  transform: 'Transformacao',
  transition: 'Transicao',
  compete: 'Competicao',
  funding: 'Financiamento',
}

const typeLabels: Record<string, string> = {
  growth_organic: 'Organico',
  growth_geographic: 'Geografico',
  growth_segment: 'Segmento',
  growth_product: 'Produto',
  growth_channel: 'Canal',
  transform_digital: 'Digital',
  transform_model: 'Modelo',
  transform_culture: 'Cultura',
  transform_operational: 'Operacional',
  transition_succession: 'Sucessao',
  transition_exit: 'Saida',
  transition_merger: 'Fusao',
  transition_turnaround: 'Turnaround',
  compete_differentiate: 'Diferenciacao',
  compete_defend: 'Defesa',
  compete_reposition: 'Reposicionamento',
  funding_raise: 'Captacao',
  funding_debt: 'Divida',
  funding_ipo: 'IPO',
}

interface ChallengeCardProps {
  challenge: Challenge
  companyId: string
}

export function ChallengeCard({ challenge, companyId }: ChallengeCardProps) {
  const router = useRouter()
  const startWizard = useStartWizard()

  const Icon = categoryIcons[challenge.challenge_category] || TrendingUp
  const categoryLabel = categoryLabels[challenge.challenge_category] || challenge.challenge_category
  const typeLabel = typeLabels[challenge.challenge_type] || challenge.challenge_type

  // Determine analysis status
  const analysis = challenge.latest_analysis
  const hasAnalysis = !!analysis
  const analysisStatus = analysis?.status as AnalysisStatus | undefined

  const getStatusBadge = () => {
    if (!hasAnalysis) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          Sem analise
        </Badge>
      )
    }

    switch (analysisStatus) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Pendente
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Em progresso
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluida
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Falhou
          </Badge>
        )
      default:
        return null
    }
  }

  const handleStartAnalysis = async () => {
    try {
      const result = await startWizard.mutateAsync({
        companyId,
        challengeId: challenge.id,
      })
      router.push(`/dashboard/wizard/${result.analysis_id}`)
    } catch {
      // Error handled by mutation
    }
  }

  const handleViewAnalysis = () => {
    if (analysis?.id) {
      router.push(`/dashboard/wizard/${analysis.id}`)
    }
  }

  const handleViewReport = () => {
    if (analysis?.id) {
      router.push(`/dashboard/analysis/${analysis.id}`)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="p-2 bg-navy-900/5 rounded-lg flex-shrink-0">
            <Icon className="h-5 w-5 text-navy-900" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-navy-900">
                {categoryLabel} &gt; {typeLabel}
              </span>
              {getStatusBadge()}
            </div>

            {/* Challenge description */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
              {challenge.business_challenge}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!hasAnalysis && (
                <Button
                  size="sm"
                  onClick={handleStartAnalysis}
                  disabled={startWizard.isPending}
                >
                  {startWizard.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Iniciar Analise
                </Button>
              )}

              {hasAnalysis && analysisStatus === 'processing' && (
                <Button size="sm" variant="outline" onClick={handleViewAnalysis}>
                  <Eye className="h-4 w-4 mr-2" />
                  Continuar
                </Button>
              )}

              {hasAnalysis && analysisStatus === 'completed' && (
                <>
                  <Button size="sm" onClick={handleViewReport}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Relatorio
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleStartAnalysis}
                    disabled={startWizard.isPending}
                  >
                    Nova Analise
                  </Button>
                </>
              )}

              {hasAnalysis && analysisStatus === 'failed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartAnalysis}
                  disabled={startWizard.isPending}
                >
                  {startWizard.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Tentar Novamente
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
