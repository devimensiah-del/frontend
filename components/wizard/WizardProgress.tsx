/**
 * WizardProgress Component
 *
 * Step indicator showing progress through the wizard flow.
 * Displays completed, current, and upcoming steps.
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface WizardStep {
  step: number;
  framework_code: string;
  framework_name: string;
  status: "completed" | "approved" | "pending";
  approved_at?: string;
}

export interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  frameworkName: string;
  previousSteps: WizardStep[];
}

// ============================================
// COMPONENT
// ============================================

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  frameworkName,
  previousSteps,
}) => {
  // Build array of all steps for visualization
  const allSteps = Array.from({ length: totalSteps }, (_, i) => {
    const stepNumber = i + 1;
    const previousStep = previousSteps.find((s) => s.step === stepNumber);

    return {
      number: stepNumber,
      name: stepNumber === currentStep ? frameworkName : previousStep?.framework_name || `Framework ${stepNumber}`,
      status: stepNumber < currentStep ? "completed" : stepNumber === currentStep ? "current" : "upcoming",
      code: previousStep?.framework_code || "",
    };
  });

  return (
    <div className="mb-8">
      {/* Desktop: Horizontal Progress */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {allSteps.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center font-heading font-bold text-sm transition-all duration-300",
                    step.status === "completed" && "bg-navy-900 border-navy-900 text-white",
                    step.status === "current" && "bg-gold-500 border-gold-500 text-navy-900",
                    step.status === "upcoming" && "bg-white border-line text-text-tertiary"
                  )}
                >
                  {step.status === "completed" ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs font-heading uppercase tracking-wider text-center max-w-[120px]",
                    step.status === "current" && "text-navy-900 font-bold",
                    step.status === "completed" && "text-navy-600",
                    step.status === "upcoming" && "text-text-tertiary"
                  )}
                >
                  {step.name}
                </p>
              </div>

              {/* Connector Line */}
              {index < allSteps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-all duration-300",
                    step.status === "completed" ? "bg-navy-900" : "bg-line"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Progress */}
      <div className="md:hidden space-y-4">
        {allSteps.map((step, index) => (
          <div key={step.number} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center font-heading font-bold text-xs transition-all duration-300",
                  step.status === "completed" && "bg-navy-900 border-navy-900 text-white",
                  step.status === "current" && "bg-gold-500 border-gold-500 text-navy-900",
                  step.status === "upcoming" && "bg-white border-line text-text-tertiary"
                )}
              >
                {step.status === "completed" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              {index < allSteps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8 mt-1 transition-all duration-300",
                    step.status === "completed" ? "bg-navy-900" : "bg-line"
                  )}
                />
              )}
            </div>
            <div className="flex-1 pt-2">
              <p
                className={cn(
                  "text-sm font-heading uppercase tracking-wider",
                  step.status === "current" && "text-navy-900 font-bold",
                  step.status === "completed" && "text-navy-600",
                  step.status === "upcoming" && "text-text-tertiary"
                )}
              >
                {step.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-heading uppercase tracking-wider text-text-secondary">
            Progresso
          </span>
          <span className="text-xs font-heading font-bold text-navy-900">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-line overflow-hidden">
          <div
            className="h-full bg-navy-900 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
