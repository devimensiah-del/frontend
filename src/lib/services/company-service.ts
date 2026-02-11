import api from '@/lib/api'
import type { Company, Challenge, CreateCompanyRequest, CompanyEnrichmentStatus, TriggerEnrichmentResponse, ChallengeData } from '@/lib/types'

export const companyService = {
  async create(data: CreateCompanyRequest): Promise<Company> {
    const response = await api.post<{ company: Company }>('/companies', data)
    return response.data.company
  },

  async list(): Promise<{ companies: Company[] }> {
    const response = await api.get<{ companies: Company[] }>('/companies')
    return response.data
  },

  async getById(id: string): Promise<Company> {
    const response = await api.get<{ company: Company }>(`/companies/${id}`)
    return response.data.company
  },

  async update(id: string, data: Partial<Company>): Promise<Company> {
    const response = await api.put<{ company: Company }>(`/companies/${id}`, { fields: data })
    return response.data.company
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/companies/${id}`)
  },

  async reEnrich(id: string): Promise<TriggerEnrichmentResponse> {
    // Now uses non-admin endpoint with rate limiting (10/day per company)
    const response = await api.post<TriggerEnrichmentResponse>(`/companies/${id}/enrich/step1/retry`)
    return response.data
  },

  async retryStep1(id: string): Promise<TriggerEnrichmentResponse> {
    const response = await api.post<TriggerEnrichmentResponse>(`/companies/${id}/enrich/step1/retry`)
    return response.data
  },

  async getWithChallenges(id: string): Promise<Company & { challenges: Challenge[] }> {
    const response = await api.get<{ company: Company & { challenges: Challenge[] } }>(`/companies/${id}?include=challenges`)
    return response.data.company
  },

  async getChallenges(companyId: string): Promise<Challenge[]> {
    const response = await api.get<{ challenges: Challenge[] }>(`/companies/${companyId}/challenges`)
    return response.data.challenges
  },

  // 3-Step Enrichment
  async getEnrichmentStatus(id: string): Promise<CompanyEnrichmentStatus> {
    const response = await api.get<CompanyEnrichmentStatus>(`/companies/${id}/enrichment-status`)
    return response.data
  },

  async triggerStep2(id: string): Promise<TriggerEnrichmentResponse> {
    const response = await api.post<TriggerEnrichmentResponse>(`/companies/${id}/enrich/step2`)
    return response.data
  },

  async triggerStep3(id: string): Promise<TriggerEnrichmentResponse> {
    const response = await api.post<TriggerEnrichmentResponse>(`/companies/${id}/enrich/step3`)
    return response.data
  },

  async retryStep2(id: string): Promise<TriggerEnrichmentResponse> {
    const response = await api.post<TriggerEnrichmentResponse>(`/companies/${id}/enrich/step2/retry`)
    return response.data
  },

  async retryStep3(id: string): Promise<TriggerEnrichmentResponse> {
    const response = await api.post<TriggerEnrichmentResponse>(`/companies/${id}/enrich/step3/retry`)
    return response.data
  },

  async reAnalyze(companyId: string, challenge: ChallengeData): Promise<{ message: string; data: { submission_id: string; challenge_id: string } }> {
    const response = await api.post<{ message: string; data: { submission_id: string; challenge_id: string } }>(
      `/companies/${companyId}/re-analyze`,
      challenge
    )
    return response.data
  },

  async analyzeChallenge(challengeId: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/challenges/${challengeId}/analyze`)
    return response.data
  },

  async generateAccessCode(analysisId: string): Promise<{ access_code: string; shareable_url: string }> {
    const response = await api.post<{ access_code: string; shareable_url: string }>(
      `/analyses/${analysisId}/access-code`
    )
    return response.data
  },
}
