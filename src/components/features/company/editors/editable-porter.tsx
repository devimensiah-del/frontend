'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// =============================================================================
// Types
// =============================================================================

interface PorterForce {
  force: string
  intensity: string
  description: string
}

interface PorterData {
  forces?: PorterForce[]
  overallAttractiveness?: string
  summary?: string
}

interface EditablePorterProps {
  data?: Record<string, unknown>
  editMode: boolean
  onChange: (data: PorterData) => void
}

// =============================================================================
// Intensity Options
// =============================================================================

const intensityOptions = [
  { value: 'muito_baixa', label: 'Muito Baixa', color: 'bg-green-100 text-green-800' },
  { value: 'baixa', label: 'Baixa', color: 'bg-lime-100 text-lime-800' },
  { value: 'moderada', label: 'Moderada', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'muito_alta', label: 'Muito Alta', color: 'bg-red-100 text-red-800' },
]

function getIntensityColor(intensity: string): string {
  const normalized = intensity.toLowerCase().replace(/\s+/g, '_')
  const option = intensityOptions.find(opt =>
    opt.value === normalized ||
    opt.label.toLowerCase() === intensity.toLowerCase()
  )
  return option?.color || 'bg-gray-100 text-gray-800'
}

// =============================================================================
// Force Card Component
// =============================================================================

interface ForceCardProps {
  force: PorterForce
  index: number
  editMode: boolean
  onChange: (index: number, force: PorterForce) => void
  onRemove: (index: number) => void
}

function ForceCard({ force, index, editMode, onChange, onRemove }: ForceCardProps) {
  const [showIntensityDropdown, setShowIntensityDropdown] = useState(false)

  const handleFieldChange = (field: keyof PorterForce, value: string) => {
    onChange(index, { ...force, [field]: value })
  }

  return (
    <div className="bg-white border border-line rounded-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        {editMode ? (
          <Input
            value={force.force}
            onChange={(e) => handleFieldChange('force', e.target.value)}
            placeholder="Nome da força..."
            className="text-sm font-medium"
          />
        ) : (
          <h4 className="text-sm font-medium text-navy-900">{force.force}</h4>
        )}
        {editMode && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-muted-foreground hover:text-error flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Intensity */}
      <div className="mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
          Intensidade
        </span>
        {editMode ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIntensityDropdown(!showIntensityDropdown)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded border border-line ${getIntensityColor(force.intensity)}`}
            >
              <span>{force.intensity || 'Selecionar...'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showIntensityDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-line rounded-lg shadow-lg py-1">
                {intensityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      handleFieldChange('intensity', option.label)
                      setShowIntensityDropdown(false)
                    }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 ${option.color}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getIntensityColor(force.intensity)}`}>
            {force.intensity}
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
          Descrição
        </span>
        {editMode ? (
          <Textarea
            value={force.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Descrição da força..."
            className="text-sm min-h-[60px]"
          />
        ) : (
          <p className="text-sm text-navy-800">{force.description}</p>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EditablePorter({ data, editMode, onChange }: EditablePorterProps) {
  const porterData = data as PorterData | undefined
  const forces = porterData?.forces || []

  const handleForceChange = (index: number, force: PorterForce) => {
    const newForces = [...forces]
    newForces[index] = force
    onChange({
      ...porterData,
      forces: newForces,
    })
  }

  const handleAddForce = () => {
    onChange({
      ...porterData,
      forces: [
        ...forces,
        { force: '', intensity: 'Moderada', description: '' },
      ],
    })
  }

  const handleRemoveForce = (index: number) => {
    onChange({
      ...porterData,
      forces: forces.filter((_, i) => i !== index),
    })
  }

  const handleFieldChange = (field: 'overallAttractiveness' | 'summary', value: string) => {
    onChange({
      ...porterData,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Forces Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-navy-900 uppercase tracking-wide">
            Forças de Porter
          </h3>
          {editMode && (
            <Button type="button" variant="outline" size="sm" onClick={handleAddForce}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Força
            </Button>
          )}
        </div>

        {forces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forces.map((force, index) => (
              <ForceCard
                key={index}
                force={force}
                index={index}
                editMode={editMode}
                onChange={handleForceChange}
                onRemove={handleRemoveForce}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 border border-line rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma força definida</p>
            {editMode && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddForce}
                className="mt-3"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Primeira Força
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Overall Attractiveness */}
      <div className="bg-white border border-line rounded-lg p-4">
        <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-line">
          🎯 Atratividade Geral do Setor
        </h4>
        {editMode ? (
          <Input
            value={porterData?.overallAttractiveness || ''}
            onChange={(e) => handleFieldChange('overallAttractiveness', e.target.value)}
            placeholder="Ex: Alta, Moderada, Baixa..."
            className="text-sm"
          />
        ) : porterData?.overallAttractiveness ? (
          <p className="text-sm text-navy-800">{porterData.overallAttractiveness}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Não definido</p>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white border border-line rounded-lg p-4">
        <h4 className="text-sm font-medium text-navy-900 mb-3 pb-2 border-b border-line">
          📋 Resumo da Análise
        </h4>
        {editMode ? (
          <Textarea
            value={porterData?.summary || ''}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            placeholder="Resumo da análise de Porter..."
            className="min-h-[100px] text-sm"
          />
        ) : porterData?.summary ? (
          <p className="text-sm text-navy-800 whitespace-pre-wrap">{porterData.summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Sem resumo</p>
        )}
      </div>
    </div>
  )
}
