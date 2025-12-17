'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

export interface SWOTCrossAnalysis {
  so_strategies: string[]
  wo_strategies: string[]
  st_strategies: string[]
  wt_strategies: string[]
  summary: string
}

interface SWOTCrossEditorProps {
  data: SWOTCrossAnalysis | null
  onChange: (data: SWOTCrossAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: SWOTCrossAnalysis = {
  so_strategies: [],
  wo_strategies: [],
  st_strategies: [],
  wt_strategies: [],
  summary: '',
}

const QUADRANTS = [
  {
    key: 'so_strategies',
    label: 'Estratégias FO',
    color: 'border-l-green-500',
    description: 'Usar Forças para capitalizar Oportunidades'
  },
  {
    key: 'wo_strategies',
    label: 'Estratégias frO',
    color: 'border-l-blue-500',
    description: 'Superar Fraquezas aproveitando Oportunidades'
  },
  {
    key: 'st_strategies',
    label: 'Estratégias FA',
    color: 'border-l-orange-500',
    description: 'Usar Forças para evitar ou mitigar Ameaças'
  },
  {
    key: 'wt_strategies',
    label: 'Estratégias frA',
    color: 'border-l-red-500',
    description: 'Minimizar Fraquezas e evitar Ameaças'
  },
] as const

export function SWOTCrossEditor({ data, onChange, disabled = false }: SWOTCrossEditorProps) {
  const [formData, setFormData] = useState<SWOTCrossAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: SWOTCrossAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addStrategy = (quadrant: keyof Omit<SWOTCrossAnalysis, 'summary'>) => {
    const newData = {
      ...formData,
      [quadrant]: [...formData[quadrant], ''],
    }
    handleChange(newData)
  }

  const removeStrategy = (quadrant: keyof Omit<SWOTCrossAnalysis, 'summary'>, index: number) => {
    const newData = {
      ...formData,
      [quadrant]: formData[quadrant].filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateStrategy = (
    quadrant: keyof Omit<SWOTCrossAnalysis, 'summary'>,
    index: number,
    value: string
  ) => {
    const newData = {
      ...formData,
      [quadrant]: formData[quadrant].map((item, i) => (i === index ? value : item)),
    }
    handleChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Quadrant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUADRANTS.map(({ key, label, color, description }) => (
          <div
            key={key}
            className={`border-l-4 ${color} bg-surface-paper border border-line p-6 space-y-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold uppercase tracking-widest">
                  {label}
                </h3>
                <p className="text-sm text-text-tertiary mt-1">{description}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addStrategy(key)}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {formData[key].map((strategy, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={strategy}
                    onChange={(e) => updateStrategy(key, index, e.target.value)}
                    placeholder={`Edite a estratégia ${label}...`}
                    disabled={disabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStrategy(key, index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData[key].length === 0 && (
                <p className="text-sm text-text-tertiary italic">
                  Nenhuma {label.toLowerCase()} adicionada ainda
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Resumo
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Edite o resumo da análise SWOT Cross..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
