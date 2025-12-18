'use client'

import { useState, useEffect } from 'react'
import { PorterAnalysis } from '@/lib/types/domain'
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

const DEFAULT_DATA: PorterAnalysis = {
  competitive_rivalry: '',
  supplier_power: '',
  buyer_power: '',
  threat_new_entrants: '',
  threat_substitutes: '',
  power_partnerships_ecosystems: '',
  disruption_ai_data: '',
  competitive_rivalry_intensity: 'Média',
  supplier_power_intensity: 'Média',
  buyer_power_intensity: 'Média',
  threat_new_entrants_intensity: 'Média',
  threat_substitutes_intensity: 'Média',
  power_partnerships_ecosystems_intensity: 'Média',
  disruption_ai_data_intensity: 'Média',
  strategic_implications: [],
  overall_attractiveness: '',
  summary: '',
}

const INTENSITY_OPTIONS = ['Alta', 'Média', 'Baixa'] as const

// Force configuration for rendering
const FORCES = [
  { key: 'competitive_rivalry', label: 'Rivalidade Competitiva', intensityKey: 'competitive_rivalry_intensity' },
  { key: 'supplier_power', label: 'Poder dos Fornecedores', intensityKey: 'supplier_power_intensity' },
  { key: 'buyer_power', label: 'Poder dos Compradores', intensityKey: 'buyer_power_intensity' },
  { key: 'threat_new_entrants', label: 'Ameaça de Novos Entrantes', intensityKey: 'threat_new_entrants_intensity' },
  { key: 'threat_substitutes', label: 'Ameaça de Substitutos', intensityKey: 'threat_substitutes_intensity' },
  { key: 'power_partnerships_ecosystems', label: 'Poder de Parcerias e Ecossistemas', intensityKey: 'power_partnerships_ecosystems_intensity' },
  { key: 'disruption_ai_data', label: 'Disrupção por IA e Dados', intensityKey: 'disruption_ai_data_intensity' },
] as const

type ForceKey = typeof FORCES[number]['key']
type IntensityKey = typeof FORCES[number]['intensityKey']

export function PorterEditor({ data, onChange, disabled = false }: PorterEditorProps) {
  const [formData, setFormData] = useState<PorterAnalysis>(() => ({
    ...DEFAULT_DATA,
    ...data,
    strategic_implications: data?.strategic_implications ?? DEFAULT_DATA.strategic_implications,
  }))

  useEffect(() => {
    if (data) {
      setFormData({
        ...DEFAULT_DATA,
        ...data,
        strategic_implications: data.strategic_implications ?? DEFAULT_DATA.strategic_implications,
      })
    }
  }, [data])

  const handleChange = (newData: PorterAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const updateField = (field: keyof PorterAnalysis, value: string) => {
    handleChange({ ...formData, [field]: value })
  }

  const addImplication = () => {
    handleChange({
      ...formData,
      strategic_implications: [...formData.strategic_implications, ''],
    })
  }

  const removeImplication = (index: number) => {
    handleChange({
      ...formData,
      strategic_implications: formData.strategic_implications.filter((_, i) => i !== index),
    })
  }

  const updateImplication = (index: number, value: string) => {
    handleChange({
      ...formData,
      strategic_implications: formData.strategic_implications.map((imp, i) =>
        i === index ? value : imp
      ),
    })
  }

  return (
    <div className="space-y-6">
      {/* Forces Section */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold uppercase tracking-widest">
          7 Forças Competitivas
        </h3>

        {FORCES.map(({ key, label, intensityKey }) => (
          <div key={key} className="bg-surface-paper border border-line p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-heading text-sm font-bold uppercase tracking-widest">
                {label}
              </h4>
              <div className="w-32">
                <Select
                  value={formData[intensityKey as IntensityKey] || 'Média'}
                  onValueChange={(value) => updateField(intensityKey, value)}
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

            <Textarea
              value={formData[key as ForceKey] || ''}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={`Descreva a análise de ${label.toLowerCase()}...`}
              disabled={disabled}
              className="min-h-[100px]"
            />
          </div>
        ))}
      </div>

      {/* Strategic Implications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold uppercase tracking-widest">
            Implicações Estratégicas
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImplication}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {formData.strategic_implications.map((implication, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={implication}
              onChange={(e) => updateImplication(index, e.target.value)}
              placeholder={`Implicação estratégica ${index + 1}...`}
              disabled={disabled}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeImplication(index)}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {formData.strategic_implications.length === 0 && (
          <div className="bg-surface-paper border border-line p-4 text-center">
            <p className="text-sm text-text-tertiary italic">
              Nenhuma implicação estratégica adicionada.
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
          value={formData.overall_attractiveness || ''}
          onChange={(e) => updateField('overall_attractiveness', e.target.value)}
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
          value={formData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          placeholder="Edite o resumo da análise de Porter..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
