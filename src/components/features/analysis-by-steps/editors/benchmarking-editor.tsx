'use client'

import { useState, useEffect } from 'react'
import { BenchmarkingAnalysis } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface BenchmarkingEditorProps {
  data: BenchmarkingAnalysis | null
  onChange: (data: BenchmarkingAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: BenchmarkingAnalysis = {
  competitorsAnalyzed: [],
  performanceGaps: [],
  bestPractices: [],
  summary: '',
}

const SECTIONS = [
  {
    key: 'competitorsAnalyzed',
    label: 'Competitors Analyzed',
    placeholder: 'Enter competitor name...',
    emptyText: 'No competitors added yet',
  },
  {
    key: 'performanceGaps',
    label: 'Performance Gaps',
    placeholder: 'Enter performance gap...',
    emptyText: 'No performance gaps added yet',
  },
  {
    key: 'bestPractices',
    label: 'Best Practices',
    placeholder: 'Enter best practice...',
    emptyText: 'No best practices added yet',
  },
] as const

export function BenchmarkingEditor({
  data,
  onChange,
  disabled = false,
}: BenchmarkingEditorProps) {
  const [formData, setFormData] = useState<BenchmarkingAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: BenchmarkingAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (section: keyof Omit<BenchmarkingAnalysis, 'summary'>) => {
    const newData = {
      ...formData,
      [section]: [...formData[section], ''],
    }
    handleChange(newData)
  }

  const removeItem = (section: keyof Omit<BenchmarkingAnalysis, 'summary'>, index: number) => {
    const newData = {
      ...formData,
      [section]: formData[section].filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateItem = (
    section: keyof Omit<BenchmarkingAnalysis, 'summary'>,
    index: number,
    value: string
  ) => {
    const newData = {
      ...formData,
      [section]: formData[section].map((item, i) => (i === index ? value : item)),
    }
    handleChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Editable Lists */}
      {SECTIONS.map(({ key, label, placeholder, emptyText }) => (
        <div key={key} className="bg-surface-paper border border-line p-6 space-y-4">
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
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {formData[key].map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(key, index, e.target.value)}
                  placeholder={placeholder}
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
              <p className="text-sm text-text-tertiary italic">{emptyText}</p>
            )}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Summary
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Enter benchmarking analysis summary..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
