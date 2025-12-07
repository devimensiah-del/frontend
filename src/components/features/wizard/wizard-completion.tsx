'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Eye } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

interface WizardCompletionProps {
  analysisId: string
  companyId?: string
}

export function WizardCompletion({ analysisId, companyId }: WizardCompletionProps) {
  useEffect(() => {
    // Try to use confetti if available
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }).catch(() => {
      // Confetti not available, skip
    })
  }, [])

  return (
    <div className="min-h-screen bg-surface-paper flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center">
        <CardContent className="py-12 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Análise Concluída!
            </h1>
            <p className="text-text-secondary">
              Todos os 12 frameworks foram analisados e aprovados com sucesso.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href={`/dashboard/analysis/${analysisId}`} className="flex-1">
              <Button className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Ver Análise Completa
              </Button>
            </Link>

            {companyId && (
              <Link href={`/dashboard/companies/${companyId}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Voltar à Empresa
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
