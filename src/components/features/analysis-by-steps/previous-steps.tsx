'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { AnalysisStep } from '@/lib/types'

interface PreviousStepsProps {
  steps: AnalysisStep[]
}

const FRAMEWORK_NAMES: Record<string, string> = {
  challenge_refinement: 'Refinamento do Desafio',
  pestel: 'Análise PESTEL',
  porter: 'Forças de Porter',
  benchmarking: 'Benchmarking',
  swot: 'Análise SWOT',
  swotcross: 'Estratégias Cruzadas SWOT',
  tam_sam_som: 'TAM-SAM-SOM',
  blue_ocean: 'Estratégia Oceano Azul',
  growth_hacking: 'Growth Hacking',
  scenarios: 'Cenários Estratégicos',
  decision_matrix: 'Matriz de Decisão',
  okrs: 'OKRs',
  bsc: 'Balanced Scorecard',
  synthesis: 'Síntese Executiva',
}

export function PreviousSteps({ steps }: PreviousStepsProps) {
  if (steps.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-medium uppercase tracking-widest text-text-secondary">
        Etapas Anteriores ({steps.length})
      </h3>

      <Accordion type="single" collapsible className="w-full">
        {steps.map((step) => (
          <AccordionItem key={step.id} value={step.id}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span>Etapa {step.step_number}</span>
                <span className="text-text-primary">
                  {FRAMEWORK_NAMES[step.framework_code] || step.framework_code}
                </span>
                {step.is_edited && (
                  <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
                    editado
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-lg bg-surface-paper p-4">
                <pre className="whitespace-pre-wrap text-sm text-text-secondary font-mono">
                  {step.effective_output || 'Sem conteúdo'}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
