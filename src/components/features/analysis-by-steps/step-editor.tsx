'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AnalysisStep, FrameworkCode } from '@/lib/types'
import {
  PESTELEditor,
  SWOTEditor,
  PorterEditor,
  BenchmarkingEditor,
  TamSamSomEditor,
  BlueOceanEditor,
  GrowthHackingEditor,
  ScenariosEditor,
  DecisionMatrixEditor,
  OKRsEditor,
  BSCEditor,
  SynthesisEditor,
  ChallengeRefinementEditor,
  SWOTCrossEditor,
} from './editors'

interface StepEditorProps {
  step: AnalysisStep
  onContentChange: (content: string) => void
  disabled?: boolean
}

// Parse JSON string to object safely
function parseContent<T>(content: string | null | undefined): T | null {
  if (!content) return null
  try {
    return JSON.parse(content) as T
  } catch {
    return null
  }
}

// Framework editor mapping - use explicit any to allow different editor prop types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EDITOR_MAP: Record<FrameworkCode, React.ComponentType<any>> = {
  challenge_refinement: ChallengeRefinementEditor,
  pestel: PESTELEditor,
  porter: PorterEditor,
  benchmarking: BenchmarkingEditor,
  swot: SWOTEditor,
  swotcross: SWOTCrossEditor,
  tam_sam_som: TamSamSomEditor,
  blue_ocean: BlueOceanEditor,
  growth_hacking: GrowthHackingEditor,
  scenarios: ScenariosEditor,
  decision_matrix: DecisionMatrixEditor,
  okrs: OKRsEditor,
  bsc: BSCEditor,
  synthesis: SynthesisEditor,
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

export function StepEditor({ step, onContentChange, disabled }: StepEditorProps) {
  // Use effective output (human_edited if exists, else ai_output)
  const effectiveContent = step.human_edited || step.ai_output || null
  const [data, setData] = useState<unknown>(() => parseContent(effectiveContent))

  // Re-parse when step content changes (e.g., after AI generation)
  useEffect(() => {
    const parsed = parseContent(effectiveContent)
    setData(parsed)
  }, [effectiveContent])

  const handleChange = useCallback((newData: unknown) => {
    setData(newData)
    // Serialize back to JSON string for API
    onContentChange(JSON.stringify(newData, null, 2))
  }, [onContentChange])

  const Editor = EDITOR_MAP[step.framework_code]

  if (!Editor) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
        Editor não disponível para: {step.framework_code}
      </div>
    )
  }

  const frameworkName = FRAMEWORK_NAMES[step.framework_code] || step.framework_code
  const isGenerating = step.status === 'generating'
  const isFailed = step.status === 'failed'

  return (
    <div className="bg-white border border-line p-4 lg:p-6">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 text-xs font-medium uppercase tracking-wide bg-navy-900 text-white rounded">
            Etapa {step.step_number}
          </span>
          <h3 className="text-sm font-medium uppercase tracking-wide text-navy-900">
            {frameworkName}
          </h3>
        </div>
        {step.is_edited && (
          <span className="px-2 py-0.5 text-xs font-medium bg-gold-100 text-gold-700 rounded">
            Editado por humano
          </span>
        )}
      </div>

      {/* Editor Content */}
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gold-500 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Gerando análise com IA...</p>
        </div>
      ) : isFailed ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-sm text-error font-medium">Erro ao gerar análise</p>
          <p className="text-xs text-muted-foreground mt-2">Use o botão "Tentar Novamente" abaixo</p>
        </div>
      ) : (
        <Editor
          data={data}
          onChange={handleChange}
          disabled={disabled}
        />
      )}
    </div>
  )
}
