/**
 * WizardNavigation Component
 *
 * Navigation controls for wizard flow (Previous/Next/Skip buttons).
 */

import React from "react";
import { Button } from "../atoms/Button";
import { ArrowLeft, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface WizardNavigationProps {
  onGenerate?: () => void;
  onRefine?: () => void;
  onApprove?: () => void;
  onBack?: () => void;
  generating?: boolean;
  approving?: boolean;
  canGenerate?: boolean;
  canRefine?: boolean;
  canApprove?: boolean;
  canBack?: boolean;
  iterationCount?: number;
}

// ============================================
// COMPONENT
// ============================================

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onGenerate,
  onRefine,
  onApprove,
  onBack,
  generating = false,
  approving = false,
  canGenerate = false,
  canRefine = false,
  canApprove = false,
  canBack = true,
  iterationCount = 0,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-line p-6 shadow-lg z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Iteration Counter */}
        <div>
          {iterationCount > 0 && (
            <span className="text-xs font-heading uppercase tracking-wider text-text-tertiary">
              Iteração: {iterationCount + 1}
            </span>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Back Button */}
          {canBack && onBack && (
            <Button
              variant="ghost"
              size="md"
              onClick={onBack}
              disabled={generating || approving}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}

          {/* Generate Button */}
          {canGenerate && onGenerate && (
            <Button
              variant="outline"
              size="md"
              onClick={onGenerate}
              loading={generating}
              disabled={generating || approving}
            >
              {!generating && <RefreshCw className="w-4 h-4 mr-2" />}
              {generating ? "Gerando..." : "Gerar Análise"}
            </Button>
          )}

          {/* Refine Button */}
          {canRefine && onRefine && (
            <Button
              variant="outline"
              size="md"
              onClick={onRefine}
              loading={generating}
              disabled={generating || approving}
            >
              {!generating && <RefreshCw className="w-4 h-4 mr-2" />}
              {generating ? "Refinando..." : "Refinar"}
            </Button>
          )}

          {/* Approve Button */}
          {canApprove && onApprove && (
            <Button
              variant="architect"
              size="md"
              onClick={onApprove}
              loading={approving}
              disabled={generating || approving}
              className="bg-semantic-success hover:bg-semantic-success-dark"
            >
              {!approving && <CheckCircle className="w-4 h-4 mr-2" />}
              {approving ? "Aprovando..." : "Aprovar e Continuar"}
              {!approving && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
