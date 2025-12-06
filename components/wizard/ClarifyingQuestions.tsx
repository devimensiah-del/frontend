"use client";

import { HelpCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
}

interface ClarifyingQuestionsProps {
  questions: Question[];
}

export function ClarifyingQuestions({ questions }: ClarifyingQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 mb-6 rounded">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-blue-900">Perguntas para Validação Humana</h3>
      </div>
      <p className="text-sm text-blue-800 mb-4">
        Considere estas perguntas ao revisar a análise gerada. Seu input ajuda a refinar o resultado.
      </p>
      <ol className="space-y-3">
        {questions.map((q, i) => (
          <li key={q.id} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-sm flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="text-sm text-blue-900">{q.question}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
