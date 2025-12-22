'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// =============================================================================
// Types
// =============================================================================

interface SWOTItem {
  content: string
  confidence: string
  source: string
}

interface SWOTData {
  strengths?: SWOTItem[]
  weaknesses?: SWOTItem[]
  opportunities?: SWOTItem[]
  threats?: SWOTItem[]
  summary?: string
}

interface EditableSWOTProps {
  data?: Record<string, unknown>
  editMode: boolean
  onChange: (data: SWOTData) => void
}

interface QuadrantConfig {
  key: keyof Omit<SWOTData, 'summary'>
  label: string
  emoji: string
  bgColor: string
  borderColor: string
  headerBg: string
}

// =============================================================================
// Quadrant Configuration
// =============================================================================

const quadrants: QuadrantConfig[] = [
  {
    key: 'strengths',
    label: 'Forças',
    emoji: '💪',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    headerBg: 'bg-green-100',
  },
  {
    key: 'weaknesses',
    label: 'Fraquezas',
    emoji: '⚠️',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    headerBg: 'bg-red-100',
  },
  {
    key: 'opportunities',
    label: 'Oportunidades',
    emoji: '🚀',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    headerBg: 'bg-blue-100',
  },
  {
    key: 'threats',
    label: 'Ameaças',
    emoji: '⚡',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    headerBg: 'bg-amber-100',
  },
]

// =============================================================================
// Confidence Options
// =============================================================================

const confidenceOptions = ['Alta', 'Média', 'Baixa']

// =============================================================================
// SWOT Item Component
// =============================================================================

interface SWOTItemCardProps {
  item: SWOTItem
  index: number
  editMode: boolean
  onChange: (index: number, item: SWOTItem) => void
  onRemove: (index: number) => void
  bgColor: string
}

function SWOTItemCard({ item, index, editMode, onChange, onRemove, bgColor }: SWOTItemCardProps) {
  const handleFieldChange = (field: keyof SWOTItem, value: string) => {
    onChange(index, { ...item, [field]: value })
  }

  if (editMode) {
    return (
      <div className={`p-3 rounded-lg border ${bgColor} space-y-2`}>
        <div className="flex items-start gap-2">
          <Textarea
            value={item.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            placeholder="Descrição..."
            className="text-sm min-h-[60px] flex-1 bg-white"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-muted-foreground hover:text-error flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-muted-foreground">Confiança</span>
            <select
              value={item.confidence}
              onChange={(e) => handleFieldChange('confidence', e.target.value)}
              className="w-full mt-1 text-sm rounded border border-line bg-white px-2 py-1.5"
            >
              <option value="">Selecionar...</option>
              {confidenceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Fonte</span>
            <Input
              value={item.source}
              onChange={(e) => handleFieldChange('source', e.target.value)}
              placeholder="Fonte..."
              className="text-sm mt-1 bg-white"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-3 rounded-lg ${bgColor}`}>
      <p className="text-sm text-navy-800 mb-2">{item.content}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {item.confidence && (
          <span className="flex items-center gap-1">
            <span className="font-medium">Confiança:</span> {item.confidence}
          </span>
        )}
        {item.source && (
          <span className="flex items-center gap-1">
            <span className="font-medium">Fonte:</span> {item.source}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Quadrant Component
// =============================================================================

interface QuadrantProps {
  config: QuadrantConfig
  items: SWOTItem[]
  editMode: boolean
  onChange: (items: SWOTItem[]) => void
}

function Quadrant({ config, items, editMode, onChange }: QuadrantProps) {
  const handleItemChange = (index: number, item: SWOTItem) => {
    const newItems = [...items]
    newItems[index] = item
    onChange(newItems)
  }

  const handleAddItem = () => {
    onChange([...items, { content: '', confidence: 'Média', source: '' }])
  }

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className={`border ${config.borderColor} rounded-lg overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 py-3 ${config.headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span>{config.emoji}</span>
          <h4 className="text-sm font-medium text-navy-900">{config.label}</h4>
          <span className="text-xs text-muted-foreground">({items.length})</span>
        </div>
        {editMode && (
          <Button type="button" variant="ghost" size="sm" onClick={handleAddItem}>
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Items */}
      <div className={`p-3 space-y-2 ${config.bgColor} min-h-[120px]`}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <SWOTItemCard
              key={index}
              item={item}
              index={index}
              editMode={editMode}
              onChange={handleItemChange}
              onRemove={handleRemoveItem}
              bgColor="bg-white/70"
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full py-6">
            <p className="text-sm text-muted-foreground italic">Nenhum item</p>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EditableSWOT({ data, editMode, onChange }: EditableSWOTProps) {
  const swotData = data as SWOTData | undefined

  const handleQuadrantChange = (key: keyof Omit<SWOTData, 'summary'>, items: SWOTItem[]) => {
    onChange({
      ...swotData,
      [key]: items,
    })
  }

  const handleSummaryChange = (summary: string) => {
    onChange({
      ...swotData,
      summary,
    })
  }

  return (
    <div className="space-y-6">
      {/* SWOT Grid - 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <Quadrant
            key={quadrant.key}
            config={quadrant}
            items={(swotData?.[quadrant.key] as SWOTItem[] | undefined) || []}
            editMode={editMode}
            onChange={(items) => handleQuadrantChange(quadrant.key, items)}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border border-line rounded-lg p-4">
        <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-line">
          📋 Resumo SWOT
        </h4>
        {editMode ? (
          <Textarea
            value={swotData?.summary || ''}
            onChange={(e) => handleSummaryChange(e.target.value)}
            placeholder="Resumo da análise SWOT..."
            className="min-h-[100px] text-sm"
          />
        ) : swotData?.summary ? (
          <p className="text-sm text-navy-800 whitespace-pre-wrap">{swotData.summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Sem resumo</p>
        )}
      </div>
    </div>
  )
}
