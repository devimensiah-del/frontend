'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

// =============================================================================
// Types
// =============================================================================

interface ChallengeRefinementData {
  original_challenge?: string
  refined_problem?: string
  root_causes?: string[]
  success_criteria?: string[]
  constraints?: string[]
  stakeholders?: string[]
  recommended_approach?: string
  summary?: string
}

interface EditableChallengeRefinementProps {
  data?: Record<string, unknown>
  editMode: boolean
  onChange: (data: ChallengeRefinementData) => void
}

// =============================================================================
// Editable List Component
// =============================================================================

interface EditableListProps {
  label: string
  items: string[]
  editMode: boolean
  onChange: (items: string[]) => void
  placeholder?: string
}

function EditableList({ label, items, editMode, onChange, placeholder }: EditableListProps) {
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
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>

      {editMode && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder || 'Adicionar item...'}
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
              className="px-3 py-2 bg-navy-900/5 text-navy-800 rounded text-sm flex items-start justify-between gap-2"
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

export function EditableChallengeRefinement({ data, editMode, onChange }: EditableChallengeRefinementProps) {
  const refinementData = data as ChallengeRefinementData | undefined

  const handleFieldChange = (field: keyof ChallengeRefinementData, value: string | string[]) => {
    onChange({
      ...refinementData,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Challenge Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Challenge */}
        <div className="bg-white border border-line rounded-lg p-4">
          <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-line">
            📝 Desafio Original
          </h4>
          {editMode ? (
            <Textarea
              value={refinementData?.original_challenge || ''}
              onChange={(e) => handleFieldChange('original_challenge', e.target.value)}
              placeholder="Desafio conforme informado inicialmente..."
              className="min-h-[100px] text-sm"
            />
          ) : refinementData?.original_challenge ? (
            <p className="text-sm text-navy-800 whitespace-pre-wrap">{refinementData.original_challenge}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Não informado</p>
          )}
        </div>

        {/* Refined Problem */}
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-gold-200">
            ✨ Problema Refinado
          </h4>
          {editMode ? (
            <Textarea
              value={refinementData?.refined_problem || ''}
              onChange={(e) => handleFieldChange('refined_problem', e.target.value)}
              placeholder="Declaração refinada do problema..."
              className="min-h-[100px] text-sm bg-white"
            />
          ) : refinementData?.refined_problem ? (
            <p className="text-sm text-navy-800 whitespace-pre-wrap">{refinementData.refined_problem}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Não definido</p>
          )}
        </div>
      </div>

      {/* Root Causes & Success Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-line rounded-lg p-4">
          <EditableList
            label="🔍 Causas Raiz"
            items={refinementData?.root_causes || []}
            editMode={editMode}
            onChange={(items) => handleFieldChange('root_causes', items)}
            placeholder="Adicionar causa raiz..."
          />
        </div>

        <div className="bg-white border border-line rounded-lg p-4">
          <EditableList
            label="🎯 Critérios de Sucesso"
            items={refinementData?.success_criteria || []}
            editMode={editMode}
            onChange={(items) => handleFieldChange('success_criteria', items)}
            placeholder="Adicionar critério..."
          />
        </div>
      </div>

      {/* Constraints & Stakeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-line rounded-lg p-4">
          <EditableList
            label="⚠️ Restrições"
            items={refinementData?.constraints || []}
            editMode={editMode}
            onChange={(items) => handleFieldChange('constraints', items)}
            placeholder="Adicionar restrição..."
          />
        </div>

        <div className="bg-white border border-line rounded-lg p-4">
          <EditableList
            label="👥 Stakeholders"
            items={refinementData?.stakeholders || []}
            editMode={editMode}
            onChange={(items) => handleFieldChange('stakeholders', items)}
            placeholder="Adicionar stakeholder..."
          />
        </div>
      </div>

      {/* Recommended Approach */}
      <div className="bg-white border border-line rounded-lg p-4">
        <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-line">
          🛤️ Abordagem Recomendada
        </h4>
        {editMode ? (
          <Textarea
            value={refinementData?.recommended_approach || ''}
            onChange={(e) => handleFieldChange('recommended_approach', e.target.value)}
            placeholder="Sugestão de abordagem para resolver o problema..."
            className="min-h-[80px] text-sm"
          />
        ) : refinementData?.recommended_approach ? (
          <p className="text-sm text-navy-800 whitespace-pre-wrap">{refinementData.recommended_approach}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Não definido</p>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white border border-line rounded-lg p-4">
        <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-line">
          📋 Resumo do Refinamento
        </h4>
        {editMode ? (
          <Textarea
            value={refinementData?.summary || ''}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            placeholder="Resumo geral do refinamento do desafio..."
            className="min-h-[100px] text-sm"
          />
        ) : refinementData?.summary ? (
          <p className="text-sm text-navy-800 whitespace-pre-wrap">{refinementData.summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Sem resumo</p>
        )}
      </div>
    </div>
  )
}
