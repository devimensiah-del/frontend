/**
 * Clarifying Questions Component
 * Displays framework questions and collects answers
 */

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ClarifyingQuestion } from '@/lib/types'

interface ClarifyingQuestionsProps {
  questions: ClarifyingQuestion[]
  answers: Record<string, string>
  onChange: (questionId: string, answer: string) => void
  disabled?: boolean
}

export function ClarifyingQuestions({
  questions,
  answers,
  onChange,
  disabled = false,
}: ClarifyingQuestionsProps) {
  if (questions.length === 0) return null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Perguntas Norteadoras</h3>
        <p className="text-sm text-muted-foreground">
          Responda as perguntas abaixo para orientar a análise da IA.
        </p>
      </div>

      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <Label htmlFor={question.id} className="text-base">
            {question.question}
          </Label>
          <Textarea
            id={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            disabled={disabled}
            placeholder="Digite sua resposta..."
            rows={3}
            className="resize-none"
          />
        </div>
      ))}
    </div>
  )
}
