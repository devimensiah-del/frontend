'use client'

import { useState, useEffect } from 'react'
import { TamSamSomAnalysis } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface TamSamSomEditorProps {
  data: TamSamSomAnalysis | null
  onChange: (data: TamSamSomAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: TamSamSomAnalysis = {
  tam: '',
  sam: '',
  som: '',
  assumptions: [],
  cagr: '',
  summary: '',
}

const MARKET_SIZES = [
  { key: 'tam', label: 'TAM (Total Addressable Market)', description: 'Total market demand' },
  { key: 'sam', label: 'SAM (Serviceable Addressable Market)', description: 'Target market segment' },
  { key: 'som', label: 'SOM (Serviceable Obtainable Market)', description: 'Realistic capture' },
] as const

export function TamSamSomEditor({ data, onChange, disabled = false }: TamSamSomEditorProps) {
  const [formData, setFormData] = useState<TamSamSomAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: TamSamSomAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addAssumption = () => {
    const newData = {
      ...formData,
      assumptions: [...formData.assumptions, ''],
    }
    handleChange(newData)
  }

  const removeAssumption = (index: number) => {
    const newData = {
      ...formData,
      assumptions: formData.assumptions.filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateAssumption = (index: number, value: string) => {
    const newData = {
      ...formData,
      assumptions: formData.assumptions.map((item, i) => (i === index ? value : item)),
    }
    handleChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Market Size Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MARKET_SIZES.map(({ key, label, description }) => (
          <div
            key={key}
            className="bg-blue-50 border-l-4 border-l-blue-500 border border-line p-6"
          >
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest mb-2">
              {label}
            </h3>
            <p className="text-xs text-text-secondary mb-4">{description}</p>
            <Input
              value={formData[key as keyof Pick<TamSamSomAnalysis, 'tam' | 'sam' | 'som'>]}
              onChange={(e) =>
                handleChange({
                  ...formData,
                  [key]: e.target.value,
                })
              }
              placeholder="e.g., $500M USD"
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {/* CAGR */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          CAGR (Compound Annual Growth Rate)
        </label>
        <Input
          value={formData.cagr}
          onChange={(e) => handleChange({ ...formData, cagr: e.target.value })}
          placeholder="e.g., 12.5%"
          disabled={disabled}
        />
      </div>

      {/* Assumptions */}
      <div className="bg-surface-paper border border-line p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold uppercase tracking-widest">
            Assumptions
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAssumption}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {formData.assumptions.map((assumption, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={assumption}
                onChange={(e) => updateAssumption(index, e.target.value)}
                placeholder="Enter assumption..."
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAssumption(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.assumptions.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No assumptions added yet</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Summary
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Enter TAM-SAM-SOM analysis summary..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
