'use client'

import { useState, useEffect } from 'react'
import { Synthesis } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface SynthesisEditorProps {
  data: Synthesis | null
  onChange: (data: Synthesis) => void
  disabled?: boolean
}

const DEFAULT_DATA: Synthesis = {
  executiveSummary: '',
  keyFindings: [],
  strategicPriorities: [],
  roadmap: [],
  overallRecommendation: '',
}

export function SynthesisEditor({ data, onChange, disabled = false }: SynthesisEditorProps) {
  const [formData, setFormData] = useState<Synthesis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: Synthesis) => {
    setFormData(newData)
    onChange(newData)
  }

  // Key Findings
  const addKeyFinding = () => {
    handleChange({ ...formData, keyFindings: [...formData.keyFindings, ''] })
  }

  const removeKeyFinding = (index: number) => {
    handleChange({
      ...formData,
      keyFindings: formData.keyFindings.filter((_, i) => i !== index),
    })
  }

  const updateKeyFinding = (index: number, value: string) => {
    handleChange({
      ...formData,
      keyFindings: formData.keyFindings.map((item, i) => (i === index ? value : item)),
    })
  }

  // Strategic Priorities
  const addStrategicPriority = () => {
    handleChange({ ...formData, strategicPriorities: [...formData.strategicPriorities, ''] })
  }

  const removeStrategicPriority = (index: number) => {
    handleChange({
      ...formData,
      strategicPriorities: formData.strategicPriorities.filter((_, i) => i !== index),
    })
  }

  const updateStrategicPriority = (index: number, value: string) => {
    handleChange({
      ...formData,
      strategicPriorities: formData.strategicPriorities.map((item, i) => (i === index ? value : item)),
    })
  }

  // Roadmap
  const addRoadmapItem = () => {
    handleChange({ ...formData, roadmap: [...formData.roadmap, ''] })
  }

  const removeRoadmapItem = (index: number) => {
    handleChange({
      ...formData,
      roadmap: formData.roadmap.filter((_, i) => i !== index),
    })
  }

  const updateRoadmapItem = (index: number, value: string) => {
    handleChange({
      ...formData,
      roadmap: formData.roadmap.map((item, i) => (i === index ? value : item)),
    })
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Executive Summary
        </label>
        <Textarea
          value={formData.executiveSummary}
          onChange={(e) => handleChange({ ...formData, executiveSummary: e.target.value })}
          placeholder="Enter comprehensive executive summary..."
          disabled={disabled}
          className="min-h-[200px]"
        />
      </div>

      {/* Key Findings */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Key Findings
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addKeyFinding}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Finding
          </Button>
        </div>
        <div className="space-y-3">
          {formData.keyFindings.map((finding, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={finding}
                onChange={(e) => updateKeyFinding(index, e.target.value)}
                placeholder={`Key finding ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeKeyFinding(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.keyFindings.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No key findings added yet</p>
          )}
        </div>
      </div>

      {/* Strategic Priorities */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Strategic Priorities
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStrategicPriority}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Priority
          </Button>
        </div>
        <div className="space-y-3">
          {formData.strategicPriorities.map((priority, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={priority}
                onChange={(e) => updateStrategicPriority(index, e.target.value)}
                placeholder={`Strategic priority ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStrategicPriority(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.strategicPriorities.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No strategic priorities added yet</p>
          )}
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Roadmap
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRoadmapItem}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {formData.roadmap.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateRoadmapItem(index, e.target.value)}
                placeholder={`Roadmap item ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRoadmapItem(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.roadmap.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No roadmap items added yet</p>
          )}
        </div>
      </div>

      {/* Overall Recommendation */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Overall Recommendation
        </label>
        <Textarea
          value={formData.overallRecommendation}
          onChange={(e) => handleChange({ ...formData, overallRecommendation: e.target.value })}
          placeholder="Enter overall strategic recommendation..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
