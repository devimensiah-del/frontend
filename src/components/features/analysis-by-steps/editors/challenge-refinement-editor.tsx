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
          Contexto do Desafio Refinado
        </label>
        <Textarea
          value={formData.refined_context}
          onChange={(e) => handleChange({ ...formData, refined_context: e.target.value })}
          placeholder="Descreva o desafio de negócio de forma clara e específica. Qual é o problema real a ser resolvido?"
          disabled={disabled}
          className="min-h-[240px]"
        />
        <p className="text-sm text-text-tertiary mt-3">
          Este contexto refinado será usado por todos os frameworks subsequentes para garantir uma análise consistente e focada.
        </p>
      </div>
    </div>
  )
}
