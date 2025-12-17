'use client'

import { useState, useEffect } from 'react'
import { PorterAnalysis, PorterForce } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'

interface PorterEditorProps {
  data: PorterAnalysis | null
  onChange: (data: PorterAnalysis) => void
  disabled?: boolean
}

const DEFAULT_FORCE: PorterForce = {
  force: '',
  intensity: 'Medium',
  description: '',
}

const DEFAULT_DATA: PorterAnalysis = {
  forces: [],
  overallAttractiveness: '',
  summary: '',
}

const INTENSITY_OPTIONS = ['Very High', 'High', 'Medium', 'Low', 'Very Low'] as const

export function PorterEditor({ data, onChange, disabled = false }: PorterEditorProps) {
  const [formData, setFormData] = useState<PorterAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: PorterAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addForce = () => {
    const newData = {
      ...formData,
      forces: [...formData.forces, { ...DEFAULT_FORCE }],
    }
    handleChange(newData)
  }

  const removeForce = (index: number) => {
    const newData = {
      ...formData,
      forces: formData.forces.filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateForce = (index: number, field: keyof PorterForce, value: string) => {
    const newData = {
      ...formData,
      forces: formData.forces.map((force, i) =>
        i === index ? { ...force, [field]: value } : force
      ),
    }
    handleChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Forces List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold uppercase tracking-widest">
            Forças Competitivas
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addForce}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Força
          </Button>
        </div>

        {formData.forces.map((force, index) => (
          <div
            key={index}
            className="bg-surface-paper border border-line p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-heading text-sm font-bold uppercase tracking-widest">
                Força {index + 1}
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeForce(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                  Nome da Força
                </label>
                <Input
                  value={force.force}
                  onChange={(e) => updateForce(index, 'force', e.target.value)}
                  placeholder="Edite o nome da força competitiva..."
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                  Intensidade
                </label>
                <Select
                  value={force.intensity}
                  onValueChange={(value) => updateForce(index, 'intensity', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTENSITY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                Descrição
              </label>
              <Textarea
                value={force.description}
                onChange={(e) => updateForce(index, 'description', e.target.value)}
                placeholder="Edite a descrição desta força competitiva..."
                disabled={disabled}
                className="min-h-[100px]"
              />
            </div>
          </div>
        ))}

        {formData.forces.length === 0 && (
          <div className="bg-surface-paper border border-line p-8 text-center">
            <p className="text-sm text-text-tertiary italic">
              Nenhuma força adicionada ainda. Clique em &quot;Adicionar Força&quot; para começar.
            </p>
          </div>
        )}
      </div>

      {/* Overall Attractiveness */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Atratividade Geral do Mercado
        </label>
        <Input
          value={formData.overallAttractiveness}
          onChange={(e) => handleChange({ ...formData, overallAttractiveness: e.target.value })}
          placeholder="Edite a atratividade geral do mercado..."
          disabled={disabled}
        />
      </div>

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Resumo
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Edite o resumo da análise de Porter..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
