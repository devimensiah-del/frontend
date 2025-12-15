'use client'

import { useState, useEffect } from 'react'
import { DecisionMatrixAnalysis, PriorityRecommendation } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface DecisionMatrixEditorProps {
  data: DecisionMatrixAnalysis | null
  onChange: (data: DecisionMatrixAnalysis) => void
  disabled?: boolean
}

const DEFAULT_PRIORITY: PriorityRecommendation = {
  priority: 1,
  title: '',
  description: '',
  timeline: '',
  budget: '',
}

const DEFAULT_DATA: DecisionMatrixAnalysis = {
  alternatives: [],
  criteria: [],
  final_recommendation: '',
  recommended_option: '',
  score: '',
  score_comparison: '',
  priority_recommendations: [],
  review_cycle: {
    frequency: '',
    extraordinary_triggers: [],
  },
  monitoring_metrics: [],
  summary: '',
}

export function DecisionMatrixEditor({ data, onChange, disabled = false }: DecisionMatrixEditorProps) {
  const [formData, setFormData] = useState<DecisionMatrixAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: DecisionMatrixAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  // Alternatives
  const addAlternative = () => {
    handleChange({ ...formData, alternatives: [...formData.alternatives, ''] })
  }

  const removeAlternative = (index: number) => {
    handleChange({ ...formData, alternatives: formData.alternatives.filter((_, i) => i !== index) })
  }

  const updateAlternative = (index: number, value: string) => {
    handleChange({
      ...formData,
      alternatives: formData.alternatives.map((alt, i) => (i === index ? value : alt)),
    })
  }

  // Criteria
  const addCriterion = () => {
    handleChange({ ...formData, criteria: [...formData.criteria, ''] })
  }

  const removeCriterion = (index: number) => {
    handleChange({ ...formData, criteria: formData.criteria.filter((_, i) => i !== index) })
  }

  const updateCriterion = (index: number, value: string) => {
    handleChange({
      ...formData,
      criteria: formData.criteria.map((crit, i) => (i === index ? value : crit)),
    })
  }

  // Priority Recommendations
  const addPriority = () => {
    const newPriority = {
      ...DEFAULT_PRIORITY,
      priority: formData.priority_recommendations.length + 1,
    }
    handleChange({
      ...formData,
      priority_recommendations: [...formData.priority_recommendations, newPriority],
    })
  }

  const removePriority = (index: number) => {
    handleChange({
      ...formData,
      priority_recommendations: formData.priority_recommendations.filter((_, i) => i !== index),
    })
  }

  const updatePriority = (index: number, field: keyof PriorityRecommendation, value: string | number) => {
    handleChange({
      ...formData,
      priority_recommendations: formData.priority_recommendations.map((rec, i) =>
        i === index ? { ...rec, [field]: value } : rec
      ),
    })
  }

  // Monitoring Metrics
  const addMetric = () => {
    handleChange({ ...formData, monitoring_metrics: [...formData.monitoring_metrics, ''] })
  }

  const removeMetric = (index: number) => {
    handleChange({
      ...formData,
      monitoring_metrics: formData.monitoring_metrics.filter((_, i) => i !== index),
    })
  }

  const updateMetric = (index: number, value: string) => {
    handleChange({
      ...formData,
      monitoring_metrics: formData.monitoring_metrics.map((metric, i) => (i === index ? value : metric)),
    })
  }

  return (
    <div className="space-y-6">
      {/* Alternatives */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Alternatives
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAlternative}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Alternative
          </Button>
        </div>
        <div className="space-y-3">
          {formData.alternatives.map((alt, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={alt}
                onChange={(e) => updateAlternative(index, e.target.value)}
                placeholder={`Alternative ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAlternative(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.alternatives.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No alternatives added yet</p>
          )}
        </div>
      </div>

      {/* Criteria */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Decision Criteria
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCriterion}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Criterion
          </Button>
        </div>
        <div className="space-y-3">
          {formData.criteria.map((crit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={crit}
                onChange={(e) => updateCriterion(index, e.target.value)}
                placeholder={`Criterion ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCriterion(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.criteria.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No criteria added yet</p>
          )}
        </div>
      </div>

      {/* Recommended Option */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Recommended Option
        </label>
        <Input
          value={formData.recommended_option}
          onChange={(e) => handleChange({ ...formData, recommended_option: e.target.value })}
          placeholder="Enter the recommended option..."
          disabled={disabled}
        />
      </div>

      {/* Final Recommendation */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Final Recommendation
        </label>
        <Textarea
          value={formData.final_recommendation}
          onChange={(e) => handleChange({ ...formData, final_recommendation: e.target.value })}
          placeholder="Enter the final recommendation..."
          disabled={disabled}
          className="min-h-[120px]"
        />
      </div>

      {/* Priority Recommendations */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Priority Recommendations
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPriority}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Priority
          </Button>
        </div>
        <div className="space-y-6">
          {formData.priority_recommendations.map((rec, index) => (
            <div key={index} className="border border-line p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Priority {rec.priority}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePriority(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority #</label>
                  <Input
                    type="number"
                    value={rec.priority}
                    onChange={(e) => updatePriority(index, 'priority', parseInt(e.target.value) || 1)}
                    disabled={disabled}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={rec.title}
                    onChange={(e) => updatePriority(index, 'title', e.target.value)}
                    placeholder="Recommendation title..."
                    disabled={disabled}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={rec.description}
                  onChange={(e) => updatePriority(index, 'description', e.target.value)}
                  placeholder="Description..."
                  disabled={disabled}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Timeline</label>
                  <Input
                    value={rec.timeline}
                    onChange={(e) => updatePriority(index, 'timeline', e.target.value)}
                    placeholder="e.g., Q1 2024"
                    disabled={disabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget</label>
                  <Input
                    value={rec.budget}
                    onChange={(e) => updatePriority(index, 'budget', e.target.value)}
                    placeholder="e.g., R$ 100k"
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          ))}
          {formData.priority_recommendations.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No priority recommendations added yet</p>
          )}
        </div>
      </div>

      {/* Monitoring Metrics */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Monitoring Metrics
          </label>
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
          {formData.monitoring_metrics.map((metric, index) => (
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
          {formData.monitoring_metrics.length === 0 && (
            <p className="text-sm text-text-tertiary italic">No monitoring metrics added yet</p>
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
          placeholder="Enter decision matrix summary..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
