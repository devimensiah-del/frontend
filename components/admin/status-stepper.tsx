'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/design';

interface StatusStepperProps {
  steps: string[];
  currentStep: string;
  labels?: Record<string, string>;
}

const defaultLabels: Record<string, string> = {
  queued: 'Na Fila',
  collecting_data: 'Coletando Dados',
  analyzing: 'Analisando',
  analysis_complete: 'Análise Completa',
  in_review: 'Em Revisão',
  approved: 'Aprovado',
  delivered: 'Entregue',
  complete: 'Concluído',
  failed: 'Falhou',
};

export function StatusStepper({ steps, currentStep, labels = defaultLabels }: StatusStepperProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step} className="relative">
            <div className="flex items-center gap-4">
              {/* Step circle */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-600 border-green-600'
                    : isCurrent
                    ? 'bg-[hsl(195_100%_8%)] border-[hsl(195_100%_8%)] animate-pulse'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1">
                <div
                  className={`font-semibold ${
                    isCompleted
                      ? 'text-green-900'
                      : isCurrent
                      ? 'text-[hsl(195_100%_8%)]'
                      : 'text-gray-400'
                  }`}
                >
                  {labels[step] || step}
                </div>
                {isCurrent && (
                  <div className="text-sm text-[hsl(195_100%_8%)] mt-1">
                    Em andamento...
                  </div>
                )}
                {isCompleted && (
                  <div className="text-sm text-green-600 mt-1">
                    <Check className="w-4 h-4 inline mr-1" />
                    Concluído
                  </div>
                )}
              </div>

              {/* Status badge */}
              {isCurrent && (
                <div className="px-3 py-1 bg-[hsl(195_100%_8%)]/10 text-[hsl(195_100%_8%)] text-xs font-semibold rounded-full">
                  Atual
                </div>
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="ml-5 h-8 w-0.5 bg-gray-300 my-1">
                {isCompleted && (
                  <div className="w-full h-full bg-green-600 transition-all duration-500" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
