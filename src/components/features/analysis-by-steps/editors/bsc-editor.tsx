'use client'

import { useState, useEffect } from 'react'
import { BSCAnalysis } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface BSCEditorProps {
  data: BSCAnalysis | null
  onChange: (data: BSCAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: BSCAnalysis = {
  financial: [],
  customer: [],
  internal_processes: [],
  learning_growth: [],
  summary: '',
}

const PERSPECTIVES = [
  { key: 'financial', label: 'Perspectiva Financeira', color: 'border-l-yellow-500' },
  { key: 'customer', label: 'Perspectiva do Cliente', color: 'border-l-blue-500' },
  { key: 'internal_processes', label: 'Perspectiva de Processos Internos', color: 'border-l-green-500' },
  { key: 'learning_growth', label: 'Perspectiva de Aprendizado & Crescimento', color: 'border-l-purple-500' },
] as const

export function BSCEditor({ data, onChange, disabled = false }: BSCEditorProps) {
  const [formData, setFormData] = useState<BSCAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: BSCAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (perspective: keyof Omit<BSCAnalysis, 'summary'>) => {
    const newData = {
      ...formData,
      [perspective]: [...formData[perspective], ''],
    }
    handleChange(newData)
  }

  const removeItem = (perspective: keyof Omit<BSCAnalysis, 'summary'>, index: number) => {
    const newData = {
      ...formData,
      [perspective]: formData[perspective].filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateItem = (
    perspective: keyof Omit<BSCAnalysis, 'summary'>,
    index: number,
    value: string
  ) => {
    const newData = {
      ...formData,
      [perspective]: formData[perspective].map((item, i) => (i === index ? value : item)),
    }
    handleChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Perspective Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PERSPECTIVES.map(({ key, label, color }) => (
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
                    placeholder={`Edite a métrica de ${label.toLowerCase()}...`}
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
                  Nenhuma métrica de {label.toLowerCase()} adicionada ainda
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
          placeholder="Edite o resumo do Balanced Scorecard..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
