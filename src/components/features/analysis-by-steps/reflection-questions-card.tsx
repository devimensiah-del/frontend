'use client'

import { Lightbulb } from 'lucide-react'

interface ReflectionQuestionsCardProps {
  guidanceText: string
  questions: string[]
}

export function ReflectionQuestionsCard({ guidanceText, questions }: ReflectionQuestionsCardProps) {
  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <div className="bg-white border-2 border-amber-300 p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-200">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-amber-900">
          Checkpoint Humano
        </h2>
      </div>

      <div className="space-y-4">
        {/* Guidance Text */}
        <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
          {guidanceText}
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <p className="text-sm text-navy-800 flex-1 pt-0.5">
                {question}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
