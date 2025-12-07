'use client'

import { useParams } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import { usePublicReport } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  ReportCover,
  ReportActions,
  FrameworkTabs,
  BlurredContent,
  SynthesisView,
  PESTELView,
  PorterView,
  SWOTView,
  TAMView,
  BenchmarkingView,
  BlueOceanView,
  GrowthHackingView,
  ScenariosView,
  OKRsView,
  BSCView,
  DecisionMatrixView,
} from '@/components/report'
import type { FrameworkTab } from '@/components/report/FrameworkTabs'

// Premium frameworks that get blurred
const PREMIUM_FRAMEWORKS = [
  'blueOcean',
  'growthHacking',
  'scenarios',
  'decisionMatrix',
  'okrs',
  'bsc'
]

export default function PublicReportPage() {
  const params = useParams()
  const code = params.code as string
  const { data: report, isLoading, error } = usePublicReport(code)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando relatório...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    const isUnauthorized = (error as any)?.response?.status === 401

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-navy-900 mb-2">
            {isUnauthorized
              ? 'Acesso Restrito'
              : 'Relatório não encontrado'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isUnauthorized
              ? 'Este relatório requer autenticação. Faça login para acessar.'
              : 'O código de acesso fornecido é inválido ou o relatório não está mais disponível.'}
          </p>
          <div className="flex gap-3 justify-center">
            {isUnauthorized && (
              <Button asChild>
                <Link href="/login">Fazer Login</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // isBlurred feature removed - always show full content
  const isBlurred = false
  const frameworks = report.framework_results as any || {}

  const handleContactClick = () => {
    // Scroll to CTA or open contact form
    window.location.href = '/#contato'
  }

  // Build tabs array
  const tabs: FrameworkTab[] = [
    {
      key: 'synthesis',
      title: 'Síntese',
      isPremium: false,
      content: frameworks.synthesis ? (
        <SynthesisView data={frameworks.synthesis as any} />
      ) : null,
    },
    {
      key: 'pestel',
      title: 'PESTEL',
      isPremium: false,
      content: frameworks.pestel ? (
        <PESTELView data={frameworks.pestel as any} />
      ) : null,
    },
    {
      key: 'porter',
      title: 'Porter',
      isPremium: false,
      content: frameworks.porter ? (
        <PorterView data={frameworks.porter as any} />
      ) : null,
    },
    {
      key: 'swot',
      title: 'SWOT',
      isPremium: false,
      content: frameworks.swot ? (
        <SWOTView data={frameworks.swot as any} />
      ) : null,
    },
    {
      key: 'tamSamSom',
      title: 'TAM-SAM-SOM',
      isPremium: false,
      content: frameworks.tamSamSom ? (
        <TAMView data={frameworks.tamSamSom as any} />
      ) : null,
    },
    {
      key: 'benchmarking',
      title: 'Benchmarking',
      isPremium: false,
      content: frameworks.benchmarking ? (
        <BenchmarkingView data={frameworks.benchmarking as any} />
      ) : null,
    },
    {
      key: 'blueOcean',
      title: 'Blue Ocean',
      isPremium: true,
      content: frameworks.blueOcean ? (
        <BlurredContent
          isBlurred={isBlurred}
          frameworkName="Blue Ocean"
          onContactClick={handleContactClick}
        >
          <BlueOceanView data={frameworks.blueOcean as any} />
        </BlurredContent>
      ) : null,
    },
    {
      key: 'growthHacking',
      title: 'Growth Loops',
      isPremium: true,
      content: frameworks.growthHacking ? (
        <BlurredContent
          isBlurred={isBlurred}
          frameworkName="Growth Loops"
          onContactClick={handleContactClick}
        >
          <GrowthHackingView data={frameworks.growthHacking as any} />
        </BlurredContent>
      ) : null,
    },
    {
      key: 'scenarios',
      title: 'Cenários',
      isPremium: true,
      content: frameworks.scenarios ? (
        <BlurredContent
          isBlurred={isBlurred}
          frameworkName="Cenários"
          onContactClick={handleContactClick}
        >
          <ScenariosView data={frameworks.scenarios as any} />
        </BlurredContent>
      ) : null,
    },
    {
      key: 'decisionMatrix',
      title: 'Decisão',
      isPremium: true,
      content: frameworks.decisionMatrix ? (
        <BlurredContent
          isBlurred={isBlurred}
          frameworkName="Matriz de Decisão"
          onContactClick={handleContactClick}
        >
          <DecisionMatrixView data={frameworks.decisionMatrix as any} />
        </BlurredContent>
      ) : null,
    },
    {
      key: 'okrs',
      title: 'OKRs 90 Dias',
      isPremium: true,
      content: frameworks.okrs ? (
        <BlurredContent
          isBlurred={isBlurred}
          frameworkName="Plano 90 Dias (OKRs)"
          onContactClick={handleContactClick}
        >
          <OKRsView data={frameworks.okrs as any} />
        </BlurredContent>
      ) : null,
    },
    {
      key: 'bsc',
      title: 'BSC',
      isPremium: true,
      content: frameworks.bsc ? (
        <BlurredContent
          isBlurred={isBlurred}
          frameworkName="Balanced Scorecard"
          onContactClick={handleContactClick}
        >
          <BSCView data={frameworks.bsc as any} />
        </BlurredContent>
      ) : null,
    },
  ]

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Cover */}
      <ReportCover
        companyName={report.company_name}
        industry={report.industry}
        challenge={report.business_challenge}
        createdAt={report.created_at}
      />

      {/* Actions Bar */}
      <div className="border-b border-line bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-navy-900">
            Diagnóstico Estratégico
          </h2>
          <ReportActions
            accessCode={code}
            pdfUrl={undefined}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FrameworkTabs tabs={tabs} isBlurred={isBlurred} defaultTab="synthesis" />

        {/* Footer CTA */}
        <div className="mt-16 bg-navy-900 text-white p-8 md:p-12 text-center">
          <h3 className="text-2xl font-heading font-medium mb-3">
            Deseja uma análise para sua empresa?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Solicite seu diagnóstico estratégico personalizado em menos de 48 horas.
            Nossa equipe de consultores está pronta para ajudar sua empresa.
          </p>
          <Button size="lg" asChild>
            <Link href="/#diagnostico">Solicitar Diagnóstico</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
