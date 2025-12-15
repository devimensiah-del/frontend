import api from '@/lib/api'
import type {
  AnalysisStep,
  StartAnalysisResponse,
  ApproveResponse,
  StepStateResponse,
} from '@/lib/types'

export const analysisByStepsService = {
  // Start new step-by-step analysis
  start: (challengeId: string) =>
    api.post<StartAnalysisResponse>('/analyses/steps/start', { challenge_id: challengeId })
      .then(r => r.data),

  // Generate AI output for a step
  generateStep: (analysisId: string, stepNumber: number) =>
    api.post<{ step: AnalysisStep }>(`/analyses/${analysisId}/steps/${stepNumber}/generate`)
      .then(r => r.data.step),

  // Save human edit
  saveEdit: (analysisId: string, stepNumber: number, editedContent: string) =>
    api.put<{ step: AnalysisStep }>(`/analyses/${analysisId}/steps/${stepNumber}/edit`, { edited_content: editedContent })
      .then(r => r.data.step),

  // Approve step and advance
  approveStep: (analysisId: string, stepNumber: number) =>
    api.post<ApproveResponse>(`/analyses/${analysisId}/steps/${stepNumber}/approve`)
      .then(r => r.data),

  // Get current state for UI
  getState: (analysisId: string) =>
    api.get<StepStateResponse>(`/analyses/${analysisId}/steps/state`)
      .then(r => r.data),

  // Get all steps
  getSteps: (analysisId: string) =>
    api.get<{ steps: AnalysisStep[] }>(`/analyses/${analysisId}/steps`)
      .then(r => r.data.steps),

  // Toggle visibility in report
  toggleVisibility: (analysisId: string, stepNumber: number, visible: boolean) =>
    api.patch<{ step: AnalysisStep }>(`/analyses/${analysisId}/steps/${stepNumber}/visibility`, { visible })
      .then(r => r.data.step),
}
