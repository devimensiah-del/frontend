'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SubtabNavigation, type SubtabItem } from './subtab-navigation'
import { FrameworkExecutionPanel } from './framework-execution-panel'
import { EditableSWOT } from './editors/editable-swot'
import { EditableSWOTCross } from './editors/editable-swot-cross'
import { useFrameworkResults } from '@/lib/hooks/use-frameworks'

// =============================================================================
// Types
// =============================================================================

interface DiagnosticoTabProps {
  companyId: string
  editMode: boolean
}

// =============================================================================
// Main DiagnosticoTab Component
// =============================================================================

export function DiagnosticoTab({
  companyId,
  editMode,
}: DiagnosticoTabProps) {
  const [activeSubtab, setActiveSubtab] = useState('swot')

  // Fetch framework results
  const { data: frameworkResults, isLoading } = useFrameworkResults(companyId)

  // Find specific framework results
  const swotResult = frameworkResults?.results?.find(r => r.framework.code === 'swot')
  const swotCrossResult = frameworkResults?.results?.find(r => r.framework.code === 'swot_cross')

  // Build subtab items with status
  const subtabs: SubtabItem[] = [
    {
      code: 'swot',
      name: 'SWOT',
      status: swotResult?.result?.status,
      isStale: swotResult?.result?.is_stale,
    },
    {
      code: 'swot_cross',
      name: 'SWOT Cruzado',
      status: swotCrossResult?.result?.status,
      isStale: swotCrossResult?.result?.is_stale,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Subtab Navigation */}
      <SubtabNavigation
        tabs={subtabs}
        activeTab={activeSubtab}
        onTabChange={setActiveSubtab}
      />

      {/* Subtab Content */}
      {activeSubtab === 'swot' && (
        <FrameworkExecutionPanel
          companyId={companyId}
          frameworkCode="swot"
          frameworkName="Análise SWOT"
          status={swotResult?.result?.status}
          isStale={swotResult?.result?.is_stale}
          staleReason={swotResult?.result?.stale_reason}
          version={swotResult?.result?.version}
          generatedAt={swotResult?.result?.generated_at}
        >
          {swotResult?.result?.status === 'completed' && swotResult.result.result && (
            <EditableSWOT
              data={swotResult.result.result as Record<string, unknown>}
              editMode={editMode}
              onChange={(data) => {
                // TODO: Handle SWOT result editing
                console.log('SWOT data changed:', data)
              }}
            />
          )}
        </FrameworkExecutionPanel>
      )}

      {activeSubtab === 'swot_cross' && (
        <FrameworkExecutionPanel
          companyId={companyId}
          frameworkCode="swot_cross"
          frameworkName="SWOT Cruzado"
          status={swotCrossResult?.result?.status}
          isStale={swotCrossResult?.result?.is_stale}
          staleReason={swotCrossResult?.result?.stale_reason}
          version={swotCrossResult?.result?.version}
          generatedAt={swotCrossResult?.result?.generated_at}
        >
          {swotCrossResult?.result?.status === 'completed' && swotCrossResult.result.result && (
            <EditableSWOTCross
              data={swotCrossResult.result.result as Record<string, unknown>}
              editMode={editMode}
              onChange={(data) => {
                // TODO: Handle SWOT Cross result editing
                console.log('SWOT Cross data changed:', data)
              }}
            />
          )}
        </FrameworkExecutionPanel>
      )}
    </div>
  )
}
