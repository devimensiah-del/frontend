'use client'

import { useState, useEffect } from 'react'
import { ScenariosAnalysis, Scenario } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface ScenariosEditorProps {
  data: ScenariosAnalysis | null
  onChange: (data: ScenariosAnalysis) => void
  disabled?: boolean
}

const DEFAULT_SCENARIO: Scenario = {
  name: '',
  probability: 0,
  description: '',
  required_actions: [],
}

const DEFAULT_DATA: ScenariosAnalysis = {
  optimistic: DEFAULT_SCENARIO,
  realist: DEFAULT_SCENARIO,
  pessimistic: DEFAULT_SCENARIO,
  mitigation_tactics: [],
  early_warning_signals: [],
  summary: '',
}

interface ScenarioCardProps {
  scenario: Scenario
  onChange: (scenario: Scenario) => void
  title: string
  color: string
  disabled: boolean
}

function ScenarioCard({ scenario, onChange, title, color, disabled }: ScenarioCardProps) {
  const addAction = () => {
    onChange({ ...scenario, required_actions: [...scenario.required_actions, ''] })
  }

  const removeAction = (index: number) => {
    onChange({
      ...scenario,
      required_actions: scenario.required_actions.filter((_, i) => i !== index),
    })
  }

  const updateAction = (index: number, value: string) => {
    onChange({
      ...scenario,
      required_actions: scenario.required_actions.map((action, i) => (i === index ? value : action)),
    })
  }

  return (
    <div className={`border-l-4 ${color} bg-surface-paper border border-line p-6 space-y-4`}>
      <h3 className="font-heading text-lg font-bold uppercase tracking-widest">{title}</h3>

      {/* Name and Probability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            value={scenario.name}
            onChange={(e) => onChange({ ...scenario, name: e.target.value })}
            placeholder="Scenario name..."
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Probability (%)</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={scenario.probability}
            onChange={(e) => onChange({ ...scenario, probability: parseFloat(e.target.value) || 0 })}
            placeholder="0-100"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={scenario.description}
          onChange={(e) => onChange({ ...scenario, description: e.target.value })}
          placeholder="Describe this scenario..."
          disabled={disabled}
          className="min-h-[100px]"
        />
      </div>

      {/* Required Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Required Actions</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAction}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        </div>
        <div className="space-y-3">
          {scenario.required_actions.map((action, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={action}
                onChange={(e) => updateAction(index, e.target.value)}
                placeholder={`Action ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAction(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {scenario.required_actions.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No required actions added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ScenariosEditor({ data, onChange, disabled = false }: ScenariosEditorProps) {
  const [formData, setFormData] = useState<ScenariosAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: ScenariosAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  const addMitigationTactic = () => {
    handleChange({ ...formData, mitigation_tactics: [...formData.mitigation_tactics, ''] })
  }

  const removeMitigationTactic = (index: number) => {
    handleChange({
      ...formData,
      mitigation_tactics: formData.mitigation_tactics.filter((_, i) => i !== index),
    })
  }

  const updateMitigationTactic = (index: number, value: string) => {
    handleChange({
      ...formData,
      mitigation_tactics: formData.mitigation_tactics.map((tactic, i) => (i === index ? value : tactic)),
    })
  }

  const addWarningSignal = () => {
    handleChange({ ...formData, early_warning_signals: [...formData.early_warning_signals, ''] })
  }

  const removeWarningSignal = (index: number) => {
    handleChange({
      ...formData,
      early_warning_signals: formData.early_warning_signals.filter((_, i) => i !== index),
    })
  }

  const updateWarningSignal = (index: number, value: string) => {
    handleChange({
      ...formData,
      early_warning_signals: formData.early_warning_signals.map((signal, i) => (i === index ? value : signal)),
    })
  }

  return (
    <div className="space-y-6">
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 gap-6">
        <ScenarioCard
          scenario={formData.optimistic}
          onChange={(optimistic) => handleChange({ ...formData, optimistic })}
          title="Optimistic Scenario"
          color="border-l-green-500"
          disabled={disabled}
        />
        <ScenarioCard
          scenario={formData.realist}
          onChange={(realist) => handleChange({ ...formData, realist })}
          title="Realist Scenario"
          color="border-l-blue-500"
          disabled={disabled}
        />
        <ScenarioCard
          scenario={formData.pessimistic}
          onChange={(pessimistic) => handleChange({ ...formData, pessimistic })}
          title="Pessimistic Scenario"
          color="border-l-red-500"
          disabled={disabled}
        />
      </div>

      {/* Mitigation Tactics */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Mitigation Tactics
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMitigationTactic}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tactic
          </Button>
        </div>
        <div className="space-y-3">
          {formData.mitigation_tactics.map((tactic, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={tactic}
                onChange={(e) => updateMitigationTactic(index, e.target.value)}
                placeholder={`Mitigation tactic ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMitigationTactic(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.mitigation_tactics.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No mitigation tactics added yet</p>
          )}
        </div>
      </div>

      {/* Early Warning Signals */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Early Warning Signals
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addWarningSignal}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Signal
          </Button>
        </div>
        <div className="space-y-3">
          {formData.early_warning_signals.map((signal, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={signal}
                onChange={(e) => updateWarningSignal(index, e.target.value)}
                placeholder={`Warning signal ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeWarningSignal(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.early_warning_signals.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No early warning signals added yet</p>
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
          placeholder="Enter scenarios analysis summary..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
