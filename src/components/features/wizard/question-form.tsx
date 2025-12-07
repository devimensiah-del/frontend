'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ClarifyingQuestion } from '@/lib/types'

interface QuestionFormProps {
  questions: ClarifyingQuestion[]
  answers: Record<string, string>
  context: string
  onAnswerChange: (questionId: string, answer: string) => void
  onContextChange: (context: string) => void
}

export function QuestionForm({
  questions,
  answers,
  context,
  onAnswerChange,
  onContextChange,
}: QuestionFormProps) {
  return (
    <div className="space-y-6">
      {/* Clarifying Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Perguntas de Clarificação
          </h4>
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label htmlFor={question.id}>{question.question}</Label>
              <Input
                id={question.id}
                value={answers[question.id] || ''}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                placeholder="Sua resposta..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Context Input */}
      <div className="space-y-2">
        <Label htmlFor="context">Contexto Adicional (opcional)</Label>
        <Textarea
          id="context"
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          placeholder="Forneça contexto adicional que possa ajudar na análise..."
          className="min-h-[100px]"
        />
        <p className="text-xs text-text-tertiary">
          Informações específicas sobre sua empresa, mercado ou situação que podem
          enriquecer a análise.
        </p>
      </div>
    </div>
  )
}
