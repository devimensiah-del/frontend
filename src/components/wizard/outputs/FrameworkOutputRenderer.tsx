/**
 * Framework Output Renderer
 * Routes to appropriate output component based on framework code
 */

import { PESTELOutput } from './PESTELOutput'
import { SWOTOutput } from './SWOTOutput'
import { PorterOutput } from './PorterOutput'
import { TAMOutput } from './TAMOutput'
import { GenericOutput } from './GenericOutput'
import type {
  PESTELAnalysis,
  SWOTAnalysis,
  PorterAnalysis,
  TamSamSomAnalysis,
} from '@/lib/types'

interface FrameworkOutputRendererProps {
  frameworkCode: string
  frameworkName: string
  output: Record<string, unknown>
}

export function FrameworkOutputRenderer({
  frameworkCode,
  frameworkName,
  output,
}: FrameworkOutputRendererProps) {
  // Route to specialized component based on framework code
  switch (frameworkCode) {
    case 'pestel':
      return <PESTELOutput data={output as unknown as PESTELAnalysis} />

    case 'swot':
      return <SWOTOutput data={output as unknown as SWOTAnalysis} />

    case 'porter':
      return <PorterOutput data={output as unknown as PorterAnalysis} />

    case 'tam_sam_som':
      return <TAMOutput data={output as unknown as TamSamSomAnalysis} />

    // Add more specialized renderers as needed
    // For now, use generic renderer for other frameworks
    default:
      return <GenericOutput title={frameworkName} data={output} />
  }
}
