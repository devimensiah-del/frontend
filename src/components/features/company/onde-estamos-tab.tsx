'use client'

import { useState } from 'react'
import { Loader2, Lock, CheckCircle2, XCircle, Clock, Play, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Company, FrameworkResultWithDetails, FrameworkResultStatus } from '@/lib/types'
import { useRunFramework } from '@/lib/hooks/use-frameworks'
import { EnrichmentContextPanel } from './enrichment-context-panel'
import { EditablePESTEL } from './editors/editable-pestel'
import { EditablePorter } from './editors/editable-porter'
import { EditableSWOT } from './editors/editable-swot'

// =============================================================================
// Types
// =============================================================================

interface OndeEstamosTabProps {
  companyId: string
  company: Company
  challengeId?: string
  resultsMap: Map<string, FrameworkResultWithDetails>
  editMode: boolean
  pendingChanges: Record<string, unknown>
  onResultChange: (code: string, data: unknown) => void
  onRefetch: () => void
  isAdmin?: boolean
}

type SubTab = 'pestel' | 'porter' | 'swot'

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status?: FrameworkResultStatus }) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10 text-xs">
          <CheckCircle2 className="w-3 h-3" />
        </Badge>
      )
    case 'processing':
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10 text-xs">
          <Loader2 className="w-3 h-3 animate-spin" />
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="text-error border-error/30 bg-error/10 text-xs">
          <XCircle className="w-3 h-3" />
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 text-xs">
          <Clock className="w-3 h-3" />
        </Badge>
      )
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function OndeEstamosTab({
  companyId,
  company,
  challengeId,
  resultsMap,
  editMode,
  pendingChanges,
  onResultChange,
  onRefetch,
  isAdmin = false,
}: OndeEstamosTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('pestel')
  const runFramework = useRunFramework()

  // Get results for each framework
  const pestelResult = resultsMap.get('pestel')
  const porterResult = resultsMap.get('porter')
  const swotResult = resultsMap.get('swot')

  // Status checks
  const isPestelComplete = pestelResult?.result?.status === 'completed'
  const isPorterComplete = porterResult?.result?.status === 'completed'

  // Sequential execution: Porter requires PESTEL, SWOT requires Porter
  const canRunPorter = isPestelComplete
  const canRunSwot = isPorterComplete

  // Check if framework is running
  const isRunning = runFramework.isPending

  // Handle running a framework
  const handleRun = (code: string) => {
    runFramework.mutate({
      companyId,
      frameworkCode: code,
      challengeId,
    })
  }

  // Get current data (pending changes or original)
  const getPestelData = () => {
    if (pendingChanges['pestel']) return pendingChanges['pestel'] as Record<string, unknown>
    return pestelResult?.result?.result as Record<string, unknown> | undefined
  }

  const getPorterData = () => {
    if (pendingChanges['porter']) return pendingChanges['porter'] as Record<string, unknown>
    return porterResult?.result?.result as Record<string, unknown> | undefined
  }

  const getSwotData = () => {
    if (pendingChanges['swot']) return pendingChanges['swot'] as Record<string, unknown>
    return swotResult?.result?.result as Record<string, unknown> | undefined
  }

  return (
    <div className="space-y-4">
      {/* Sub-tabs for PESTEL, Porter, SWOT */}
      <Tabs
        value={activeSubTab}
        onValueChange={(v) => setActiveSubTab(v as SubTab)}
        className="w-full"
      >
        <TabsList className="flex w-full overflow-x-auto sm:overflow-visible bg-transparent border-b border-line p-0 h-auto">
          {/* PESTEL Tab */}
          <TabsTrigger
            value="pestel"
            className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 border-transparent data-[state=active]:border-gold-500 data-[state=active]:text-navy-900 text-muted-foreground hover:text-navy-900 transition-colors"
          >
            <span className="text-xs sm:text-sm font-medium">PESTEL</span>
            <StatusBadge status={pestelResult?.result?.status} />
          </TabsTrigger>

          {/* Porter Tab */}
          <TabsTrigger
            value="porter"
            disabled={!canRunPorter && !porterResult}
            className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 border-transparent data-[state=active]:border-gold-500 data-[state=active]:text-navy-900 text-muted-foreground hover:text-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xs sm:text-sm font-medium">Porter</span>
            {!canRunPorter && !porterResult ? (
              <Lock className="w-3 h-3 text-muted-foreground" />
            ) : (
              <StatusBadge status={porterResult?.result?.status} />
            )}
          </TabsTrigger>

          {/* SWOT Tab */}
          <TabsTrigger
            value="swot"
            disabled={!canRunSwot && !swotResult}
            className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 border-transparent data-[state=active]:border-gold-500 data-[state=active]:text-navy-900 text-muted-foreground hover:text-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xs sm:text-sm font-medium">SWOT</span>
            {!canRunSwot && !swotResult ? (
              <Lock className="w-3 h-3 text-muted-foreground" />
            ) : (
              <StatusBadge status={swotResult?.result?.status} />
            )}
          </TabsTrigger>
        </TabsList>

        {/* PESTEL Content */}
        <TabsContent value="pestel" className="mt-4 space-y-4">
          <EnrichmentContextPanel company={company} frameworkCode="pestel" />

          <FrameworkActions
            result={pestelResult}
            onRun={() => handleRun('pestel')}
            isRunning={isRunning}
            canRun={true}
          />

          {isPestelComplete && (
            <EditablePESTEL
              data={getPestelData()}
              editMode={editMode}
              onChange={(data) => onResultChange('pestel', data)}
            />
          )}

          {pestelResult?.result?.status === 'failed' && (
            <FailedState
              error={pestelResult.result.error_message}
              onRetry={() => handleRun('pestel')}
              isRetrying={isRunning}
            />
          )}
        </TabsContent>

        {/* Porter Content */}
        <TabsContent value="porter" className="mt-4 space-y-4">
          <EnrichmentContextPanel company={company} frameworkCode="porter" />

          <FrameworkActions
            result={porterResult}
            onRun={() => handleRun('porter')}
            isRunning={isRunning}
            canRun={canRunPorter}
            lockedMessage="Complete o PESTEL primeiro"
          />

          {isPorterComplete && (
            <EditablePorter
              data={getPorterData()}
              editMode={editMode}
              onChange={(data) => onResultChange('porter', data)}
            />
          )}

          {porterResult?.result?.status === 'failed' && (
            <FailedState
              error={porterResult.result.error_message}
              onRetry={() => handleRun('porter')}
              isRetrying={isRunning}
            />
          )}
        </TabsContent>

        {/* SWOT Content */}
        <TabsContent value="swot" className="mt-4 space-y-4">
          <EnrichmentContextPanel company={company} frameworkCode="swot" />

          <FrameworkActions
            result={swotResult}
            onRun={() => handleRun('swot')}
            isRunning={isRunning}
            canRun={canRunSwot}
            lockedMessage="Complete o Porter primeiro"
          />

          {swotResult?.result?.status === 'completed' && (
            <EditableSWOT
              data={getSwotData()}
              editMode={editMode}
              onChange={(data) => onResultChange('swot', data)}
            />
          )}

          {swotResult?.result?.status === 'failed' && (
            <FailedState
              error={swotResult.result.error_message}
              onRetry={() => handleRun('swot')}
              isRetrying={isRunning}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =============================================================================
// Framework Actions Component
// =============================================================================

interface FrameworkActionsProps {
  result?: FrameworkResultWithDetails
  onRun: () => void
  isRunning: boolean
  canRun: boolean
  lockedMessage?: string
}

function FrameworkActions({
  result,
  onRun,
  isRunning,
  canRun,
  lockedMessage,
}: FrameworkActionsProps) {
  const status = result?.result?.status
  const isCompleted = status === 'completed'
  const isProcessing = status === 'processing'
  const isPending = status === 'pending'

  if (!canRun && !result) {
    return (
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg border border-line">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {lockedMessage || 'Bloqueado'}
        </span>
      </div>
    )
  }

  if (isProcessing || isPending) {
    return (
      <div className="flex items-center gap-2 p-4 bg-info/10 rounded-lg border border-info/30">
        <Loader2 className="w-4 h-4 text-info animate-spin" />
        <span className="text-sm text-info">
          {isProcessing ? 'Processando análise...' : 'Aguardando processamento...'}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isCompleted ? 'outline' : 'architect'}
        size="sm"
        onClick={onRun}
        disabled={isRunning}
      >
        {isRunning ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : isCompleted ? (
          <RefreshCw className="w-4 h-4 mr-1" />
        ) : (
          <Play className="w-4 h-4 mr-1" />
        )}
        {isCompleted ? 'Executar Novamente' : 'Executar Análise'}
      </Button>
    </div>
  )
}

// =============================================================================
// Failed State Component
// =============================================================================

interface FailedStateProps {
  error?: string
  onRetry: () => void
  isRetrying: boolean
}

function FailedState({ error, onRetry, isRetrying }: FailedStateProps) {
  return (
    <div className="p-4 bg-error/10 rounded-lg border border-error/30 space-y-3">
      <div className="flex items-center gap-2 text-error">
        <XCircle className="w-5 h-5" />
        <span className="font-medium">Análise falhou</span>
      </div>
      {error && (
        <p className="text-sm text-muted-foreground">{error}</p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
        className="border-error/30 text-error hover:bg-error/10"
      >
        {isRetrying ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4 mr-1" />
        )}
        Tentar Novamente
      </Button>
    </div>
  )
}
