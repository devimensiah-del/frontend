'use client'

import { useState } from 'react'
import {
  Target,
  TrendingUp,
  Shield,
  FileText,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { SubtabNavigation, type SubtabItem } from './subtab-navigation'
import { FrameworkExecutionPanel } from './framework-execution-panel'
import { Step3Card } from './enrichment-steps'
import { EditablePESTEL } from './editors/editable-pestel'
import { EditablePorter } from './editors/editable-porter'
import { useFrameworkResults } from '@/lib/hooks/use-frameworks'
import type { Company } from '@/lib/types'

// =============================================================================
// Types
// =============================================================================

interface AmbienteTabProps {
  companyId: string
  company: Company
  editMode: boolean
  formData: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
  onListChange: (field: string, value: string[]) => void
}

// =============================================================================
// Helper Components (reused from page)
// =============================================================================

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  columns?: 2 | 3
}

function Section({ title, icon, children, columns = 3 }: SectionProps) {
  const colClass = columns === 2
    ? 'grid-cols-1 lg:grid-cols-2'
    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'

  return (
    <div className="bg-white border border-line p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
        <span className="text-gold-500">{icon}</span>
        <h2 className="text-sm font-medium uppercase tracking-wide text-navy-900">{title}</h2>
      </div>
      <div className={`grid ${colClass} gap-4 lg:gap-6`}>
        {children}
      </div>
    </div>
  )
}

interface EditableFieldProps {
  label: string
  field: string
  value: string | number | null | undefined
  editMode: boolean
  formData: Record<string, unknown>
  onChange: (field: string, value: string | number | null) => void
  icon?: React.ReactNode
  type?: 'text' | 'number' | 'url' | 'email' | 'textarea'
  placeholder?: string
}

function EditableField({
  label,
  field,
  value,
  editMode,
  formData,
  onChange,
  icon,
  type = 'text',
  placeholder,
}: EditableFieldProps) {
  const currentValue = formData[field] !== undefined ? formData[field] : value
  const displayValue = currentValue ?? ''

  if (!editMode && !value) return null

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      {editMode ? (
        type === 'textarea' ? (
          <Textarea
            value={displayValue as string}
            onChange={(e) => onChange(field, e.target.value || null)}
            placeholder={placeholder || label}
            className="min-h-[80px] text-sm"
          />
        ) : (
          <Input
            type={type}
            value={displayValue as string}
            onChange={(e) => {
              const val = type === 'number'
                ? (e.target.value ? Number(e.target.value) : null)
                : (e.target.value || null)
              onChange(field, val)
            }}
            placeholder={placeholder || label}
            className="text-sm"
          />
        )
      ) : (
        <div className="flex items-start gap-2">
          {icon && <span className="text-muted-foreground flex-shrink-0 mt-0.5">{icon}</span>}
          <span className="text-navy-900">{value}</span>
        </div>
      )}
    </div>
  )
}

interface EditableListProps {
  title: string
  icon: React.ReactNode
  field: string
  items: string[] | null | undefined
  editMode: boolean
  formData: Record<string, unknown>
  onChange: (field: string, value: string[]) => void
  emptyMessage: string
}

function EditableList({
  title,
  icon,
  field,
  items,
  editMode,
  formData,
  onChange,
  emptyMessage,
}: EditableListProps) {
  const currentItems = (formData[field] as string[] | undefined) ?? items ?? []
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      onChange(field, [...currentItems, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    onChange(field, currentItems.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white border border-line p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
        <span className="text-gold-500">{icon}</span>
        <h2 className="text-sm font-medium uppercase tracking-wide text-navy-900">{title}</h2>
      </div>

      {editMode && (
        <div className="flex gap-2 mb-3">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Adicionar item..."
            className="text-sm"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          />
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            +
          </Button>
        </div>
      )}

      {currentItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {currentItems.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1.5 text-sm rounded bg-navy-900/5 text-navy-900 flex items-center gap-2"
            >
              {item}
              {editMode && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="hover:text-error transition-colors"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  )
}

// =============================================================================
// Mercado Content (Data Display Only)
// =============================================================================

interface MercadoContentProps {
  companyId: string
  company: Company
  editMode: boolean
  formData: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
  onListChange: (field: string, value: string[]) => void
}

function MercadoContent({
  companyId,
  company,
  editMode,
  formData,
  onFieldChange,
  onListChange,
}: MercadoContentProps) {
  return (
    <div className="space-y-6">
      {/* Step 3 Enrichment Status */}
      <Step3Card companyId={companyId} />

      {/* Concorrentes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <EditableList
          title="Concorrentes"
          icon={<Target className="w-4 h-4" />}
          field="competitors"
          items={company.competitors}
          editMode={editMode}
          formData={formData}
          onChange={onListChange}
          emptyMessage="Nenhum concorrente identificado"
        />
        <EditableList
          title="Detalhes dos Concorrentes"
          icon={<Target className="w-4 h-4" />}
          field="competitor_details"
          items={company.competitor_details}
          editMode={editMode}
          formData={formData}
          onChange={onListChange}
          emptyMessage="Nenhum detalhe de concorrente"
        />
      </div>

      {/* Contexto do Setor */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Section title="Contexto do Setor" icon={<TrendingUp className="w-4 h-4" />}>
          <EditableField
            label="Crescimento do Setor"
            field="industry_growth_rate"
            value={company.industry_growth_rate}
            editMode={editMode}
            formData={formData}
            onChange={onFieldChange}
            placeholder="Ex: +12% CAGR"
          />
          <EditableField
            label="Concentração de Mercado"
            field="market_concentration"
            value={company.market_concentration}
            editMode={editMode}
            formData={formData}
            onChange={onFieldChange}
            placeholder="Ex: Fragmentado, Concentrado"
          />
          <EditableField
            label="Posição no Mercado"
            field="market_share_status"
            value={company.market_share_status}
            editMode={editMode}
            formData={formData}
            onChange={onFieldChange}
            placeholder="Ex: Líder, Desafiador, Nicho"
          />
        </Section>

        <Section title="Contexto Regulatório" icon={<Shield className="w-4 h-4" />}>
          <EditableField
            label="Contexto Regulatório"
            field="regulatory_context"
            value={company.regulatory_context}
            editMode={editMode}
            formData={formData}
            onChange={onFieldChange}
            type="textarea"
            placeholder="Marco regulatório relevante"
          />
        </Section>
      </div>

      {/* Tendências */}
      <EditableList
        title="Tendências do Setor"
        icon={<TrendingUp className="w-4 h-4" />}
        field="industry_trends"
        items={company.industry_trends}
        editMode={editMode}
        formData={formData}
        onChange={onListChange}
        emptyMessage="Nenhuma tendência identificada"
      />

      {/* Notícias Recentes */}
      <EditableList
        title="Notícias Recentes"
        icon={<FileText className="w-4 h-4" />}
        field="recent_news"
        items={company.recent_news}
        editMode={editMode}
        formData={formData}
        onChange={onListChange}
        emptyMessage="Nenhuma notícia recente"
      />

      {/* Fontes */}
      <EditableList
        title="Fontes do Enriquecimento"
        icon={<ExternalLink className="w-4 h-4" />}
        field="enrichment_sources"
        items={company.enrichment_sources}
        editMode={editMode}
        formData={formData}
        onChange={onListChange}
        emptyMessage="Nenhuma fonte registrada"
      />
    </div>
  )
}

// =============================================================================
// Main AmbienteTab Component
// =============================================================================

export function AmbienteTab({
  companyId,
  company,
  editMode,
  formData,
  onFieldChange,
  onListChange,
}: AmbienteTabProps) {
  const [activeSubtab, setActiveSubtab] = useState('mercado')

  // Fetch framework results
  const { data: frameworkResults, isLoading } = useFrameworkResults(companyId)

  // Find specific framework results
  const pestelResult = frameworkResults?.results?.find(r => r.framework.code === 'pestel')
  const porterResult = frameworkResults?.results?.find(r => r.framework.code === 'porter')

  // Build subtab items with status
  const subtabs: SubtabItem[] = [
    {
      code: 'mercado',
      name: 'Mercado',
      isDataOnly: true, // No framework, just data display
    },
    {
      code: 'pestel',
      name: 'PESTEL',
      status: pestelResult?.result?.status,
      isStale: pestelResult?.result?.is_stale,
    },
    {
      code: 'porter',
      name: 'Porter',
      status: porterResult?.result?.status,
      isStale: porterResult?.result?.is_stale,
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
      {activeSubtab === 'mercado' && (
        <MercadoContent
          companyId={companyId}
          company={company}
          editMode={editMode}
          formData={formData}
          onFieldChange={onFieldChange}
          onListChange={onListChange}
        />
      )}

      {activeSubtab === 'pestel' && (
        <FrameworkExecutionPanel
          companyId={companyId}
          frameworkCode="pestel"
          frameworkName="PESTEL"
          status={pestelResult?.result?.status}
          isStale={pestelResult?.result?.is_stale}
          staleReason={pestelResult?.result?.stale_reason}
          version={pestelResult?.result?.version}
          generatedAt={pestelResult?.result?.generated_at}
        >
          {pestelResult?.result?.status === 'completed' && pestelResult.result.result && (
            <EditablePESTEL
              data={pestelResult.result.result as Record<string, unknown>}
              editMode={editMode}
              onChange={(data) => {
                // TODO: Handle PESTEL result editing
                console.log('PESTEL data changed:', data)
              }}
            />
          )}
        </FrameworkExecutionPanel>
      )}

      {activeSubtab === 'porter' && (
        <FrameworkExecutionPanel
          companyId={companyId}
          frameworkCode="porter"
          frameworkName="Porter 7 Forças"
          status={porterResult?.result?.status}
          isStale={porterResult?.result?.is_stale}
          staleReason={porterResult?.result?.stale_reason}
          version={porterResult?.result?.version}
          generatedAt={porterResult?.result?.generated_at}
        >
          {porterResult?.result?.status === 'completed' && porterResult.result.result && (
            <EditablePorter
              data={porterResult.result.result as Record<string, unknown>}
              editMode={editMode}
              onChange={(data) => {
                // TODO: Handle Porter result editing
                console.log('Porter data changed:', data)
              }}
            />
          )}
        </FrameworkExecutionPanel>
      )}
    </div>
  )
}
