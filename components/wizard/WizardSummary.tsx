/**
 * WizardSummary Component
 *
 * Final review of all completed wizard steps before submission.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader, CardBody } from "../organisms/Card";
import { CheckCircle } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface CompletedStep {
  step: number;
  framework_code: string;
  framework_name: string;
  status: string;
  approved_at?: string;
}

export interface WizardSummaryProps {
  completedSteps: CompletedStep[];
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const WizardSummary: React.FC<WizardSummaryProps> = ({
  completedSteps,
  className,
}) => {
  return (
    <Card className={cn("mb-6", className)}>
      <CardHeader>
        <h2 className="text-xl font-heading font-medium text-navy-900 uppercase tracking-wide">
          Revisão Final
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Você completou todos os frameworks de análise. Revise abaixo antes de finalizar.
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {completedSteps.map((step) => (
            <div
              key={step.step}
              className="flex items-start gap-4 p-4 bg-surface-paper border border-line"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-medium text-navy-900 uppercase tracking-wide text-sm">
                  {step.framework_name}
                </h3>
                <p className="text-xs text-text-tertiary mt-1">
                  Código: {step.framework_code}
                </p>
                {step.approved_at && (
                  <p className="text-xs text-semantic-success mt-1">
                    Aprovado em: {new Date(step.approved_at).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-semantic-success text-white">
                  Completo
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-6 bg-gold-50 border border-gold-200">
          <p className="text-sm text-navy-900 leading-relaxed">
            <strong className="font-heading uppercase tracking-wider">Próximo passo:</strong>{" "}
            Ao confirmar, sua análise será marcada como aprovada e estará pronta para geração do relatório PDF.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
