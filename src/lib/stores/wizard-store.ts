import { create } from 'zustand'
import type { WizardState, WizardStepSummary, FrameworkStep } from '@/lib/types'

interface WizardStore {
  // State
  analysisId: string | null
  currentStep: number
  totalSteps: number
  stepStatus: 'pending' | 'generating' | 'generated' | 'approved' | 'failed'
  framework: FrameworkStep | null
  output: Record<string, unknown> | null
  humanContext: string
  humanAnswers: Record<string, string>
  previousSteps: WizardStepSummary[]
  iterationCount: number
  errorMessage?: string

  // Actions
  setAnalysisId: (id: string) => void
  setWizardState: (state: WizardState) => void
  setContext: (context: string) => void
  setAnswer: (questionId: string, answer: string) => void
  clearInputs: () => void
  reset: () => void
}

export const useWizardStore = create<WizardStore>((set) => ({
  // Initial state
  analysisId: null,
  currentStep: 0,
  totalSteps: 12,
  stepStatus: 'pending',
  framework: null,
  output: null,
  humanContext: '',
  humanAnswers: {},
  previousSteps: [],
  iterationCount: 0,
  errorMessage: undefined,

  // Actions
  setAnalysisId: (id) => set({ analysisId: id }),

  setWizardState: (state) =>
    set({
      analysisId: state.analysis_id,
      currentStep: state.current_step,
      totalSteps: state.total_steps,
      stepStatus: state.step_status,
      framework: state.framework,
      output: state.output,
      humanContext: state.human_context || '',
      humanAnswers: state.human_answers || {},
      previousSteps: state.previous_steps || [],
      iterationCount: state.iteration_count,
      errorMessage: state.error_message,
    }),

  setContext: (context) => set({ humanContext: context }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      humanAnswers: { ...state.humanAnswers, [questionId]: answer },
    })),

  clearInputs: () =>
    set({
      humanContext: '',
      humanAnswers: {},
    }),

  reset: () =>
    set({
      analysisId: null,
      currentStep: 0,
      totalSteps: 12,
      stepStatus: 'pending',
      framework: null,
      output: null,
      humanContext: '',
      humanAnswers: {},
      previousSteps: [],
      iterationCount: 0,
      errorMessage: undefined,
    }),
}))
