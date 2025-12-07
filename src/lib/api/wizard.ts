/**
 * Wizard API Client Functions
 * Handles all wizard-related HTTP requests
 */

import type {
  WizardState,
  WizardSummary,
} from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

interface StartWizardRequest {
  company_id: string
  challenge_id: string
}

interface GenerateStepRequest {
  human_context?: string
  human_answers?: Record<string, string>
}

interface RefineStepRequest {
  human_context?: string
  human_answers?: Record<string, string>
}

/**
 * Start or resume wizard for a company + challenge
 */
export async function startWizard(
  request: StartWizardRequest,
  token: string
): Promise<WizardState> {
  const response = await fetch(`${API_BASE}/wizard/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to start wizard' }))
    throw new Error(error.message || 'Failed to start wizard')
  }

  return response.json()
}

/**
 * Get current wizard state
 */
export async function getWizardState(
  analysisId: string,
  token: string
): Promise<WizardState> {
  const response = await fetch(`${API_BASE}/analyses/${analysisId}/wizard`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch wizard state' }))
    throw new Error(error.message || 'Failed to fetch wizard state')
  }

  return response.json()
}

/**
 * Generate output for current step
 */
export async function generateStep(
  analysisId: string,
  request: GenerateStepRequest,
  token: string
): Promise<WizardState> {
  const response = await fetch(`${API_BASE}/analyses/${analysisId}/wizard/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to generate step' }))
    throw new Error(error.message || 'Failed to generate step')
  }

  return response.json()
}

/**
 * Approve current step and advance to next
 */
export async function approveStep(
  analysisId: string,
  token: string
): Promise<WizardState> {
  const response = await fetch(`${API_BASE}/analyses/${analysisId}/wizard/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to approve step' }))
    throw new Error(error.message || 'Failed to approve step')
  }

  return response.json()
}

/**
 * Refine current step with additional context
 */
export async function refineStep(
  analysisId: string,
  request: RefineStepRequest,
  token: string
): Promise<WizardState> {
  const response = await fetch(`${API_BASE}/analyses/${analysisId}/wizard/refine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to refine step' }))
    throw new Error(error.message || 'Failed to refine step')
  }

  return response.json()
}

/**
 * Get summary of all completed steps
 */
export async function getWizardSummary(
  analysisId: string,
  token: string
): Promise<WizardSummary> {
  const response = await fetch(`${API_BASE}/analyses/${analysisId}/wizard/summary`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch wizard summary' }))
    throw new Error(error.message || 'Failed to fetch wizard summary')
  }

  return response.json()
}
