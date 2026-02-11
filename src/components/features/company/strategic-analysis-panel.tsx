'use client'

import { useState, useMemo } from 'react'
import { Loader2, Save, Pencil, X, MapPin, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import type { Company, FrameworkResultWithDetails } from '@/lib/types'
import { useFrameworkResults, useUpdateFrameworkResult } from '@/lib/hooks/use-frameworks'
import { OndeEstamosTab } from './onde-estamos-tab'
import { DesafiosTab } from './desafios-tab'

// =============================================================================
// Types
// =============================================================================

interface StrategicAnalysisPanelProps {
  companyId: string
  company: Company
  challengeId?: string
  isAdmin?: boolean
}

// =============================================================================
// Main Component
// =============================================================================

export function StrategicAnalysisPanel({
  companyId,
  company,
  challengeId,
  isAdmin = false,
}: StrategicAnalysisPanelProps) {
  // State
  const [activeTab, setActiveTab] = useState<'onde-estamos' | 'desafios'>('onde-estamos')
  const [editMode, setEditMode] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Record<string, unknown>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Hooks
  const { data: frameworkData, isLoading, refetch } = useFrameworkResults(companyId, challengeId)
  const updateResult = useUpdateFrameworkResult()

  // Build results map for easy access
  const resultsMap = useMemo(() => {
    const map = new Map<string, FrameworkResultWithDetails>()
    if (frameworkData?.results) {
      for (const r of frameworkData.results) {
        if (r.framework?.code) {
          map.set(r.framework.code, r)
        }
      }
    }
    return map
  }, [frameworkData])

  // Track changes for a specific framework
  const handleResultChange = (code: string, data: unknown) => {
    setPendingChanges(prev => ({
      ...prev,
      [code]: data,
    }))
  }

  // Save all pending changes
  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      setEditMode(false)
      return
    }

    setIsSaving(true)
    try {
      for (const [code, data] of Object.entries(pendingChanges)) {
        const result = resultsMap.get(code)
        if (result?.result?.id) {
          await updateResult.mutateAsync({
            companyId,
            resultId: result.result.id,
            result: data as Record<string, unknown>,
          })
        }
      }
      setPendingChanges({})
      setEditMode(false)
      toast.success('Alterações salvas com sucesso')
    } catch (error) {
      toast.error('Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setPendingChanges({})
    setEditMode(false)
  }

  // Check if there are unsaved changes
  const hasChanges = Object.keys(pendingChanges).length > 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Edit Controls */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-navy-900">
          Análise Estratégica
        </h2>
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-gold-500 hover:bg-gold-600 text-white"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Salvar
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'onde-estamos' | 'desafios')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-12 bg-surface-paper border border-line">
          <TabsTrigger
            value="onde-estamos"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:border-b-2 data-[state=active]:border-gold-500"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Onde Estamos</span>
            <span className="sm:hidden">Situação</span>
          </TabsTrigger>
          <TabsTrigger
            value="desafios"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:border-b-2 data-[state=active]:border-gold-500"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Desafios</span>
            <span className="sm:hidden">Desafio</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="onde-estamos" className="mt-4">
          <OndeEstamosTab
            companyId={companyId}
            company={company}
            challengeId={challengeId}
            resultsMap={resultsMap}
            editMode={editMode}
            pendingChanges={pendingChanges}
            onResultChange={handleResultChange}
            onRefetch={refetch}
            isAdmin={isAdmin}
          />
        </TabsContent>

        <TabsContent value="desafios" className="mt-4">
          <DesafiosTab
            companyId={companyId}
            company={company}
            challengeId={challengeId}
            result={resultsMap.get('challenge_refinement')}
            editMode={editMode}
            pendingChanges={pendingChanges}
            onResultChange={handleResultChange}
            onRefetch={refetch}
            isAdmin={isAdmin}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
