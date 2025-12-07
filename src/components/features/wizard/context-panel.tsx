'use client'

import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { WizardStepSummary } from '@/lib/types'

interface ContextPanelProps {
  previousSteps: WizardStepSummary[]
  iterationCount: number
}

export function ContextPanel({ previousSteps, iterationCount }: ContextPanelProps) {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])

  const toggleStep = (step: number) => {
    setExpandedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    )
  }

  return (
    <div className="p-4">
      {/* Iteration count */}
      <div className="mb-6 p-3 bg-white rounded-lg border border-line">
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 text-gold-500" />
          <span className="text-navy-900 font-medium">
            Iteração atual: {iterationCount}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Número de vezes que esta etapa foi gerada/refinada
        </p>
      </div>

      {/* Previous steps */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Etapas Anteriores
        </h4>

        {previousSteps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma etapa completada ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {previousSteps.map((step) => {
              const isExpanded = expandedSteps.includes(step.step)
              return (
                <div
                  key={step.step}
                  className="bg-white border border-line rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                    onClick={() => toggleStep(step.step)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium text-navy-900">
                        {step.framework_name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        step.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {step.status === 'approved' ? 'Aprovado' : step.status}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-line">
                      <p className="text-xs text-muted-foreground mt-2">
                        Aprovado em:{' '}
                        {step.approved_at
                          ? new Date(step.approved_at).toLocaleString('pt-BR')
                          : '-'}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
