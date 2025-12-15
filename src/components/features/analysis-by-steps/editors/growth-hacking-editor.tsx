'use client'

import { useState, useEffect } from 'react'
import { GrowthHackingAnalysis, GrowthLoop } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface GrowthHackingEditorProps {
  data: GrowthHackingAnalysis | null
  onChange: (data: GrowthHackingAnalysis) => void
  disabled?: boolean
}

const DEFAULT_LOOP: GrowthLoop = {
  name: '',
  type: '',
  steps: [],
  metrics: [],
  bottleneck: '',
}

const DEFAULT_DATA: GrowthHackingAnalysis = {
  leap_loop: DEFAULT_LOOP,
  scale_loop: DEFAULT_LOOP,
  summary: '',
}

interface LoopEditorProps {
  loop: GrowthLoop
  onChange: (loop: GrowthLoop) => void
  title: string
  color: string
  disabled: boolean
}

function LoopEditor({ loop, onChange, title, color, disabled }: LoopEditorProps) {
  const addStep = () => {
    onChange({ ...loop, steps: [...loop.steps, ''] })
  }

  const removeStep = (index: number) => {
    onChange({ ...loop, steps: loop.steps.filter((_, i) => i !== index) })
  }

  const updateStep = (index: number, value: string) => {
    onChange({ ...loop, steps: loop.steps.map((step, i) => (i === index ? value : step)) })
  }

  const addMetric = () => {
    onChange({ ...loop, metrics: [...loop.metrics, ''] })
  }

  const removeMetric = (index: number) => {
    onChange({ ...loop, metrics: loop.metrics.filter((_, i) => i !== index) })
  }

  const updateMetric = (index: number, value: string) => {
    onChange({ ...loop, metrics: loop.metrics.map((metric, i) => (i === index ? value : metric)) })
  }

  return (
    <div className={`border-l-4 ${color} bg-surface-paper border border-line p-6 space-y-6`}>
      <h3 className="font-heading text-lg font-bold uppercase tracking-widest">{title}</h3>

      {/* Name and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Loop Name</label>
          <Input
            value={loop.name}
            onChange={(e) => onChange({ ...loop, name: e.target.value })}
            placeholder="Enter loop name..."
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Loop Type</label>
          <Input
            value={loop.type}
            onChange={(e) => onChange({ ...loop, type: e.target.value })}
            placeholder="Enter loop type..."
            disabled={disabled}
          />
        </div>
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Steps</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
        <div className="space-y-3">
          {loop.steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`Step ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStep(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {loop.steps.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No steps added yet</p>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Metrics</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMetric}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </div>
        <div className="space-y-3">
          {loop.metrics.map((metric, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={metric}
                onChange={(e) => updateMetric(index, e.target.value)}
                placeholder={`Metric ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMetric(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {loop.metrics.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No metrics added yet</p>
          )}
        </div>
      </div>

      {/* Bottleneck */}
      <div>
        <label className="block text-sm font-medium mb-2">Bottleneck</label>
        <Textarea
          value={loop.bottleneck}
          onChange={(e) => onChange({ ...loop, bottleneck: e.target.value })}
          placeholder="Describe the main bottleneck in this loop..."
          disabled={disabled}
          className="min-h-[80px]"
        />
      </div>
    </div>
  )
}

export function GrowthHackingEditor({ data, onChange, disabled = false }: GrowthHackingEditorProps) {
  const [formData, setFormData] = useState<GrowthHackingAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: GrowthHackingAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* LEAP Loop */}
      <LoopEditor
        loop={formData.leap_loop}
        onChange={(leap_loop) => handleChange({ ...formData, leap_loop })}
        title="LEAP Loop"
        color="border-l-green-500"
        disabled={disabled}
      />

      {/* SCALE Loop */}
      <LoopEditor
        loop={formData.scale_loop}
        onChange={(scale_loop) => handleChange({ ...formData, scale_loop })}
        title="SCALE Loop"
        color="border-l-blue-500"
        disabled={disabled}
      />

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Summary
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Enter Growth Hacking analysis summary..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
