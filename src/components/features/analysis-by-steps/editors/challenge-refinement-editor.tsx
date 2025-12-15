'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

export interface ChallengeRefinementData {
  refined_context: string
}

interface ChallengeRefinementEditorProps {
  data: ChallengeRefinementData | null
  onChange: (data: ChallengeRefinementData) => void
  disabled?: boolean
}

const DEFAULT_DATA: ChallengeRefinementData = {
  refined_context: '',
}

export function ChallengeRefinementEditor({ data, onChange, disabled = false }: ChallengeRefinementEditorProps) {
  const [formData, setFormData] = useState<ChallengeRefinementData>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: ChallengeRefinementData) => {
    setFormData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Refined Challenge Context
        </label>
        <Textarea
          value={formData.refined_context}
          onChange={(e) => handleChange({ ...formData, refined_context: e.target.value })}
          placeholder="Enter refined and clarified business challenge context..."
          disabled={disabled}
          className="min-h-[240px]"
        />
        <p className="text-sm text-text-tertiary mt-3">
          This refined context will be used by all subsequent frameworks to ensure consistent and focused analysis.
        </p>
      </div>
    </div>
  )
}
