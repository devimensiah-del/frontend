'use client'

import { useState, useEffect } from 'react'
import { SWOTAnalysis, SWOTItem } from '@/lib/types/domain'
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

interface SWOTEditorProps {
  data: SWOTAnalysis | null
  onChange: (data: SWOTAnalysis) => void
  disabled?: boolean
}

const DEFAULT_ITEM: SWOTItem = {
  content: '',
  confidence: 'Medium',
  source: '',
}

const DEFAULT_DATA: SWOTAnalysis = {
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
  summary: '',
}

const QUADRANTS = [
  { key: 'strengths', label: 'Strengths', color: 'border-l-green-500' },
  { key: 'weaknesses', label: 'Weaknesses', color: 'border-l-red-500' },
  { key: 'opportunities', label: 'Opportunities', color: 'border-l-blue-500' },
  { key: 'threats', label: 'Threats', color: 'border-l-orange-500' },
] as const

const CONFIDENCE_OPTIONS = ['High', 'Medium', 'Low'] as const

export function SWOTEditor({ data, onChange, disabled = false }: SWOTEditorProps) {
  const [formData, setFormData] = useState<SWOTAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: SWOTAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (quadrant: keyof Omit<SWOTAnalysis, 'summary'>) => {
    const newData = {
      ...formData,
      [quadrant]: [...formData[quadrant], { ...DEFAULT_ITEM }],
    }
    handleChange(newData)
  }

  const removeItem = (quadrant: keyof Omit<SWOTAnalysis, 'summary'>, index: number) => {
    const newData = {
      ...formData,
      [quadrant]: formData[quadrant].filter((_, i) => i !== index),
    }
    handleChange(newData)
  }

  const updateItem = (
    quadrant: keyof Omit<SWOTAnalysis, 'summary'>,
    index: number,
    field: keyof SWOTItem,
    value: string
  ) => {
    const newData = {
      ...formData,
      [quadrant]: formData[quadrant].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }
    handleChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Quadrant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUADRANTS.map(({ key, label, color }) => (
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
                Add
              </Button>
            </div>

            <div className="space-y-4">
              {formData[key].map((item, index) => (
                <div key={index} className="space-y-2 pb-4 border-b border-line last:border-0">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(key, index)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                      Content
                    </label>
                    <Textarea
                      value={item.content}
                      onChange={(e) => updateItem(key, index, 'content', e.target.value)}
                      placeholder="Enter content..."
                      disabled={disabled}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                        Confidence
                      </label>
                      <Select
                        value={item.confidence}
                        onValueChange={(value) => updateItem(key, index, 'confidence', value)}
                        disabled={disabled}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONFIDENCE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                        Source
                      </label>
                      <Input
                        value={item.source}
                        onChange={(e) => updateItem(key, index, 'source', e.target.value)}
                        placeholder="Source..."
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData[key].length === 0 && (
                <p className="text-sm text-text-tertiary italic">
                  No {label.toLowerCase()} items added yet
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Summary
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Enter SWOT analysis summary..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
