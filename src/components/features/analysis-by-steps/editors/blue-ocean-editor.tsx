'use client'

import { useState, useEffect } from 'react'
import { BlueOceanAnalysis } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface BlueOceanEditorProps {
  data: BlueOceanAnalysis | null
  onChange: (data: BlueOceanAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: BlueOceanAnalysis = {
  eliminate: [],
  reduce: [],
  raise: [],
  create: [],
  newValueCurve: '',
  summary: '',
}

const QUADRANTS = [
  { key: 'eliminate', label: 'Eliminate', color: 'border-l-red-500', description: 'Factors to eliminate' },
  { key: 'reduce', label: 'Reduce', color: 'border-l-orange-500', description: 'Factors to reduce below industry standard' },
  { key: 'raise', label: 'Raise', color: 'border-l-green-500', description: 'Factors to raise above industry standard' },
  { key: 'create', label: 'Create', color: 'border-l-blue-500', description: 'Factors to create that industry has never offered' },
] as const

export function BlueOceanEditor({ data, onChange, disabled = false }: BlueOceanEditorProps) {
  const [formData, setFormData] = useState<BlueOceanAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: BlueOceanAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (quadrant: keyof Omit<BlueOceanAnalysis, 'newValueCurve' | 'summary'>) => {
    const newData = {
      ...formData,
      [quadrant]: [...formData[quadrant], ''],
    }
    handleChange(newData)
  }

  const removeItem = (quadrant: keyof Omit<BlueOceanAnalysis, 'newValueCurve' | 'summary'>, index: number) => {
    const newData = {
      ...formData,
      [quadrant]: formData[quadrant].filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateItem = (
    quadrant: keyof Omit<BlueOceanAnalysis, 'newValueCurve' | 'summary'>,
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
                onClick={() => addItem(key)}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {formData[key].map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(key, index, e.target.value)}
                    placeholder={`Enter factor to ${label.toLowerCase()}...`}
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
                  No factors to {label.toLowerCase()} added yet
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Value Curve */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          New Value Curve
        </label>
        <Textarea
          value={formData.newValueCurve}
          onChange={(e) => handleChange({ ...formData, newValueCurve: e.target.value })}
          placeholder="Describe the new value curve and how it differs from competitors..."
          disabled={disabled}
          className="min-h-[120px]"
        />
      </div>

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Summary
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Enter Blue Ocean analysis summary..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
