'use client'

import { useState, useEffect } from 'react'
import { PESTELAnalysis } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface PESTELEditorProps {
  data: PESTELAnalysis | null
  onChange: (data: PESTELAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: PESTELAnalysis = {
  political: [],
  economic: [],
  social: [],
  technological: [],
  environmental: [],
  legal: [],
  summary: '',
}

const CATEGORIES = [
  { key: 'political', label: 'Político', color: 'border-l-purple-500' },
  { key: 'economic', label: 'Econômico', color: 'border-l-blue-500' },
  { key: 'social', label: 'Social', color: 'border-l-green-500' },
  { key: 'technological', label: 'Tecnológico', color: 'border-l-orange-500' },
  { key: 'environmental', label: 'Ambiental', color: 'border-l-teal-500' },
  { key: 'legal', label: 'Legal', color: 'border-l-red-500' },
] as const

export function PESTELEditor({ data, onChange, disabled = false }: PESTELEditorProps) {
  const [formData, setFormData] = useState<PESTELAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: PESTELAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (category: keyof Omit<PESTELAnalysis, 'summary'>) => {
    const newData = {
      ...formData,
      [category]: [...formData[category], ''],
    }
    handleChange(newData)
  }

  const removeItem = (category: keyof Omit<PESTELAnalysis, 'summary'>, index: number) => {
    const newData = {
      ...formData,
      [category]: formData[category].filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateItem = (
    category: keyof Omit<PESTELAnalysis, 'summary'>,
    index: number,
    value: string
  ) => {
    const newData = {
      ...formData,
      [category]: formData[category].map((item, i) => (i === index ? value : item)),
    }
    handleChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map(({ key, label, color }) => (
          <div
            key={key}
            className={`border-l-4 ${color} bg-surface-paper border border-line p-6 space-y-4`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold uppercase tracking-widest">
                {label}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(key)}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {formData[key].map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(key, index, e.target.value)}
                    placeholder={`Fator ${label.toLowerCase()}...`}
                    disabled={disabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(key, index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData[key].length === 0 && (
                <p className="text-sm text-text-tertiary italic">
                  Nenhum fator {label.toLowerCase()} adicionado ainda
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
          placeholder="Edite o resumo da análise PESTEL..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
