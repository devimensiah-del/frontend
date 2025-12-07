'use client'

import Link from 'next/link'
import { CheckCircle2, FileText, Download, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWizardSummary } from '@/lib/hooks/use-wizard'
import { Skeleton } from '@/components/ui/skeleton'

interface CompletionScreenProps {
  analysisId: string
}

export function CompletionScreen({ analysisId }: CompletionScreenProps) {
  const { data: summary, isLoading } = useWizardSummary(analysisId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-full max-w-lg space-y-6 p-8">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="w-full max-w-lg text-center p-8">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">
          Análise Completa!
        </h1>
        <p className="text-muted-foreground mb-8">
          Todas as {summary?.total_steps || 12} etapas foram aprovadas com sucesso.
        </p>

        {/* Framework summary */}
        {summary && (
          <div className="bg-white border border-line rounded-lg p-4 mb-8 text-left">
            <h3 className="font-medium text-navy-900 mb-3">
              Frameworks Analisados
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {summary.frameworks?.map((framework) => (
                <div
                  key={framework.code}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{framework.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href={`/analyses/${analysisId}`}>
              <FileText className="w-4 h-4 mr-2" />
              Ver Análise Completa
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowRight className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Link>
          </Button>
        </div>

        {/* Download PDF - placeholder */}
        <div className="mt-6">
          <Button variant="ghost" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" />
            Download PDF (em breve)
          </Button>
        </div>
      </div>
    </div>
  )
}
