import api from '@/lib/api'
import type { WizardState, WizardSummary } from '@/lib/types'

interface WizardResponse {
  state: WizardState
  message?: string
}

interface StartWizardResponse {
  analysis_id: string
  state: WizardState
  message?: string
}

export const wizardService = {
  // Start wizard with company_id and challenge_id
  async start(companyId: string, challengeId: string): Promise<StartWizardResponse> {
    const response = await api.post<WizardResponse>('/wizard/start', {
      company_id: companyId,
      challenge_id: challengeId,
    })
    // Extract analysis_id from state for convenience
    return {
      analysis_id: response.data.state.analysis_id,
      state: response.data.state,
      message: response.data.message,
    }
  },

  async getState(analysisId: string): Promise<WizardState> {
    const response = await api.get<{ state: WizardState }>(`/analyses/${analysisId}/wizard`)
    return response.data.state
  },

  async generate(
    analysisId: string,
    humanContext?: string,
    answers?: Record<string, string>
  ): Promise<WizardState> {
    const response = await api.post<WizardResponse>(
      `/analyses/${analysisId}/wizard/generate`,
      {
        human_context: humanContext,
        answers,
      }
    )
    return response.data.state
  },

  async approve(analysisId: string): Promise<WizardState> {
    const response = await api.post<WizardResponse>(
      `/analyses/${analysisId}/wizard/approve`
    )
    return response.data.state
  },

  async refine(
    analysisId: string,
    additionalContext: string,
    notes?: string
  ): Promise<WizardState> {
    const response = await api.post<WizardResponse>(
      `/analyses/${analysisId}/wizard/refine`,
      {
        additional_context: additionalContext,
        notes,
      }
    )
    return response.data.state
  },

  async getSummary(analysisId: string): Promise<WizardSummary> {
    const response = await api.get<WizardSummary>(`/analyses/${analysisId}/wizard/summary`)
    return response.data
  },
}
