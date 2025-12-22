'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// =============================================================================
// Types
// =============================================================================

interface PESTELData {
  political?: string[]
  economic?: string[]
  social?: string[]
  technological?: string[]
  environmental?: string[]
  legal?: string[]
  summary?: string
}

interface EditablePESTELProps {
  data?: Record<string, unknown>
  editMode: boolean
  onChange: (data: PESTELData) => void
}

interface CategoryConfig {
  key: keyof PESTELData
  label: string
  emoji: string
  bgColor: string
  textColor: string
}

// =============================================================================
// Category Configuration
// =============================================================================

const categories: CategoryConfig[] = [
  { key: 'political', label: 'Político', emoji: '🏛️', bgColor: 'bg-blue-50', textColor: 'text-blue-800' },
  { key: 'economic', label: 'Econômico', emoji: '💰', bgColor: 'bg-green-50', textColor: 'text-green-800' },
  { key: 'social', label: 'Social', emoji: '👥', bgColor: 'bg-purple-50', textColor: 'text-purple-800' },
  { key: 'technological', label: 'Tecnológico', emoji: '💻', bgColor: 'bg-cyan-50', textColor: 'text-cyan-800' },
  { key: 'environmental', label: 'Ambiental', emoji: '🌱', bgColor: 'bg-emerald-50', textColor: 'text-emerald-800' },
  { key: 'legal', label: 'Legal', emoji: '⚖️', bgColor: 'bg-amber-50', textColor: 'text-amber-800' },
]

// =============================================================================
// Editable List Component
// =============================================================================

interface EditableListItemsProps {
  items: string[]
  editMode: boolean
  onChange: (items: string[]) => void
  bgColor: string
  textColor: string
}

function EditableListItems({ items, editMode, onChange, bgColor, textColor }: EditableListItemsProps) {
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {editMode && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Adicionar item..."
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addItem()
              }
            }}
          />
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li
              key={index}
              className={`px-3 py-2 rounded text-sm flex items-start justify-between gap-2 ${bgColor} ${textColor}`}
            >
              <span>{item}</span>
              {editMode && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="flex-shrink-0 hover:text-error transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">Nenhum item</p>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EditablePESTEL({ data, editMode, onChange }: EditablePESTELProps) {
  const pestelData = data as PESTELData | undefined

  const handleCategoryChange = (key: keyof PESTELData, items: string[]) => {
    onChange({
      ...pestelData,
      [key]: items,
    })
  }

  const handleSummaryChange = (summary: string) => {
    onChange({
      ...pestelData,
      summary,
    })
  }

  return (
    <div className="space-y-6">
      {/* PESTEL Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const items = (pestelData?.[category.key] as string[] | undefined) || []

          return (
            <div key={category.key} className="bg-white border border-line rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line">
                <span>{category.emoji}</span>
                <h4 className="text-sm font-medium text-navy-900">{category.label}</h4>
              </div>
              <EditableListItems
                items={items}
                editMode={editMode}
                onChange={(newItems) => handleCategoryChange(category.key, newItems)}
                bgColor={category.bgColor}
                textColor={category.textColor}
              />
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-white border border-line rounded-lg p-4">
        <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-line">
          📋 Resumo PESTEL
        </h4>
        {editMode ? (
          <Textarea
            value={pestelData?.summary || ''}
            onChange={(e) => handleSummaryChange(e.target.value)}
            placeholder="Resumo da análise PESTEL..."
            className="min-h-[100px] text-sm"
          />
        ) : pestelData?.summary ? (
          <p className="text-sm text-navy-800 whitespace-pre-wrap">{pestelData.summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Sem resumo</p>
        )}
      </div>
    </div>
  )
}
