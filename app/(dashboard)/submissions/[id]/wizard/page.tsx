/**
 * Wizard Page - Human-in-the-Loop Analysis Flow
 *
 * Step-by-step wizard for reviewing and confirming AI-generated analysis.
 * Rebuilt with new design system components.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { Textarea } from "@/components/atoms/Textarea";
import { Card, CardHeader, CardBody } from "@/components/organisms/Card";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { WizardStep } from "@/components/wizard/WizardStep";
import { WizardNavigation } from "@/components/wizard/WizardNavigation";
import { WizardSummary } from "@/components/wizard/WizardSummary";
import { FrameworkOutput } from "@/components/wizard/FrameworkOutput";
import { ClarifyingQuestions } from "@/components/wizard/ClarifyingQuestions";
import { useAuthContext } from "@/lib/providers/AuthProvider";

// ============================================
// TYPES
// ============================================

interface WizardState {
  analysis_id: string;
  current_step: number;
  total_steps: number;
  framework: {
    step: number;
    code: string;
    name: string;
    description: string;
    questions: Array<{ id: string; question: string }>;
  };
  step_status: string;
  output?: Record<string, unknown>;
  human_context?: string;
  human_answers?: Record<string, string>;
  previous_steps: Array<{
    step: number;
    framework_code: string;
    framework_name: string;
    status: "pending" | "completed" | "approved";
    approved_at?: string;
  }>;
  iteration_count: number;
  error_message?: string;
}

// ============================================
// COMPONENT
// ============================================

export default function WizardPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthContext();
  const submissionId = params.id as string;

  const [wizardState, setWizardState] = useState<WizardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [humanContext, setHumanContext] = useState("");
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  // Start or resume wizard
  useEffect(() => {
    const startWizard = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/submissions/${submissionId}/wizard/start`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to start wizard");
        }

        const data = await response.json();
        setWizardState(data.state);
        setHumanContext(data.state.human_context || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start wizard");
      } finally {
        setLoading(false);
      }
    };

    startWizard();
  }, [submissionId, token, apiUrl]);

  // Generate current step
  const handleGenerate = async () => {
    if (!wizardState || !token) return;

    try {
      setGenerating(true);
      setError(null);

      const response = await fetch(`${apiUrl}/analyses/${wizardState.analysis_id}/wizard/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          human_context: humanContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate step");
      }

      const data = await response.json();
      setWizardState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate step");
    } finally {
      setGenerating(false);
    }
  };

  // Approve current step
  const handleApprove = async () => {
    if (!wizardState || !token) return;

    try {
      setApproving(true);
      setError(null);

      const response = await fetch(`${apiUrl}/analyses/${wizardState.analysis_id}/wizard/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve step");
      }

      const data = await response.json();
      setWizardState(data.state);
      setHumanContext(""); // Reset for next step

      // Check if wizard is complete
      if (data.state.current_step >= data.state.total_steps) {
        router.push(`/submissions/${submissionId}?completed=true`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve step");
    } finally {
      setApproving(false);
    }
  };

  // Refine (regenerate with additional context)
  const handleRefine = async () => {
    if (!wizardState || !token || !humanContext.trim()) return;

    try {
      setGenerating(true);
      setError(null);

      const response = await fetch(`${apiUrl}/analyses/${wizardState.analysis_id}/wizard/refine`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          additional_context: humanContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refine step");
      }

      const data = await response.json();
      setWizardState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refine step");
    } finally {
      setGenerating(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-navy-900 mx-auto mb-4" />
          <p className="text-sm font-heading uppercase tracking-wider text-text-secondary">
            Carregando wizard...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (!wizardState) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center px-6">
        <Card className="max-w-lg">
          <CardBody className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-semantic-error mx-auto mb-4" />
            <h2 className="text-xl font-heading font-medium text-navy-900 uppercase tracking-wide mb-2">
              Erro ao carregar wizard
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              {error || "Não foi possível iniciar a análise"}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const isStepGenerated = wizardState.step_status === "generated";
  const isStepPending = wizardState.step_status === "pending";
  const isStepFailed = wizardState.step_status === "failed";

  return (
    <div className="min-h-screen bg-surface-paper pb-32">
      <div className="max-w-5xl mx-auto py-8 px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/submissions/${submissionId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Submission
          </Button>
        </div>

        {/* Progress Header */}
        <WizardProgress
          currentStep={wizardState.current_step}
          totalSteps={wizardState.total_steps}
          frameworkName={wizardState.framework.name}
          previousSteps={wizardState.previous_steps}
        />

        {/* Framework Description */}
        <WizardStep
          title={wizardState.framework.name}
          description={wizardState.framework.description}
        >
          {/* Error Message */}
          {(error || (isStepFailed && wizardState.error_message)) && (
            <div className="mb-6 p-4 bg-semantic-error bg-opacity-10 border border-semantic-error flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-semantic-error flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-heading font-medium text-semantic-error uppercase tracking-wider">
                  Erro
                </p>
                <p className="text-sm text-semantic-error mt-1">
                  {error || wizardState.error_message}
                </p>
              </div>
            </div>
          )}

          {/* Clarifying Questions */}
          {wizardState.framework.questions && wizardState.framework.questions.length > 0 && (
            <div className="mb-6">
              <ClarifyingQuestions questions={wizardState.framework.questions} />
            </div>
          )}

          {/* Framework Output (if generated) */}
          {isStepGenerated && wizardState.output && (
            <div className="mb-6">
              <FrameworkOutput
                frameworkCode={wizardState.framework.code}
                output={wizardState.output}
              />
            </div>
          )}

          {/* Human Context Input */}
          <div className="mb-6">
            <label className="block text-sm font-heading font-medium text-navy-900 uppercase tracking-wider mb-2">
              Contexto Adicional
            </label>
            <Textarea
              value={humanContext}
              onChange={(e) => setHumanContext(e.target.value)}
              placeholder="Adicione informações que a IA pode não ter capturado. Isso ajuda a refinar a análise..."
              fullWidth
              rows={5}
            />
            <p className="text-xs text-text-tertiary mt-2">
              {isStepGenerated
                ? "Adicione contexto para refinar a análise atual"
                : "Adicione contexto antes de gerar a análise"}
            </p>
          </div>
        </WizardStep>

        {/* Wizard Summary (Final Step) */}
        {wizardState.current_step === wizardState.total_steps && isStepGenerated && (
          <WizardSummary completedSteps={wizardState.previous_steps} />
        )}
      </div>

      {/* Sticky Navigation */}
      <WizardNavigation
        onGenerate={isStepPending || isStepFailed ? handleGenerate : undefined}
        onRefine={isStepGenerated ? handleRefine : undefined}
        onApprove={isStepGenerated ? handleApprove : undefined}
        onBack={() => router.push(`/submissions/${submissionId}`)}
        generating={generating}
        approving={approving}
        canGenerate={isStepPending || isStepFailed}
        canRefine={isStepGenerated && humanContext.trim().length > 0}
        canApprove={isStepGenerated}
        canBack={!generating && !approving}
        iterationCount={wizardState.iteration_count}
      />
    </div>
  );
}
