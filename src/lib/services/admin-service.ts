import api from '@/lib/api'
import type {
  Submission,
  SubmissionListItem,
  Analysis,
  Company,
  Framework,
  PaginatedResponse,
  CreateFrameworkRequest,
  UpdateFrameworkRequest,
  ChallengeData,
  MacroIndicators,
  IndicatorHistory,
  SystemMetrics,
  FrameworkResults,
} from '@/lib/types'

export const adminService = {
  // ===== Analysis Management =====
  async listAnalyses(params?: {
    page?: number
    pageSize?: number
    email?: string
    status?: string
  }): Promise<PaginatedResponse<SubmissionListItem>> {
    const response = await api.get<PaginatedResponse<SubmissionListItem>>('/admin/submissions', {
      params,
    })
    return response.data
  },

  async getAnalysis(id: string): Promise<Analysis> {
    const response = await api.get<{ analysis: Analysis }>(`/admin/analysis/${id}`)
    return response.data.analysis
  },

  async updateAnalysis(id: string, data: Partial<FrameworkResults>): Promise<Analysis> {
    const response = await api.put<{ analysis: Analysis }>(`/admin/analysis/${id}`, data)
    return response.data.analysis
  },

  async toggleVisibility(id: string): Promise<{ id: string; is_visible_to_user: boolean }> {
    const response = await api.post<{ id: string; is_visible_to_user: boolean }>(
      `/admin/analysis/${id}/visibility`
    )
    return response.data
  },

  async toggleBlur(id: string): Promise<{ id: string; is_blurred: boolean }> {
    const response = await api.post<{ id: string; is_blurred: boolean }>(
      `/admin/analysis/${id}/blur`
    )
    return response.data
  },

  async togglePublic(id: string): Promise<{ id: string; is_public: boolean }> {
    const response = await api.post<{ id: string; is_public: boolean }>(
      `/admin/analysis/${id}/public`
    )
    return response.data
  },

  async generateAccessCode(id: string): Promise<{ id: string; access_code: string }> {
    const response = await api.post<{ id: string; access_code: string }>(
      `/admin/analysis/${id}/access-code`
    )
    return response.data
  },

  async retryAnalysis(submissionId: string): Promise<{ analysisId: string; status: string }> {
    const response = await api.post<{ analysisId: string; status: string }>(
      `/admin/submissions/${submissionId}/retry-analysis`
    )
    return response.data
  },

  async generateAllSteps(analysisId: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/admin/analysis/${analysisId}/wizard/generate-all`
    )
    return response.data
  },

  async updateVisibility(
    analysisId: string,
    data: { is_public?: boolean; is_visible_to_user?: boolean }
  ): Promise<{ id: string; is_public: boolean; is_visible_to_user: boolean }> {
    const response = await api.patch<{ id: string; is_public: boolean; is_visible_to_user: boolean }>(
      `/admin/analysis/${analysisId}/visibility`,
      data
    )
    return response.data
  },

  // ===== Company Management =====
  async listCompanies(limit?: number, offset?: number): Promise<{ companies: Company[] }> {
    const response = await api.get<{ companies: Company[] }>('/admin/companies', {
      params: { limit, offset },
    })
    return response.data
  },

  async getCompany(id: string): Promise<Company> {
    const response = await api.get<{ company: Company }>(`/admin/companies/${id}`)
    return response.data.company
  },

  async retryEnrichment(companyId: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/admin/companies/${companyId}/retry-enrichment`
    )
    return response.data
  },

  async reEnrichCompany(companyId: string): Promise<{ message: string; data?: { company_id: string; status: string; fields_updated: number; remaining_today: number } }> {
    const response = await api.post<{ message: string; data?: { company_id: string; status: string; fields_updated: number; remaining_today: number } }>(
      `/admin/companies/${companyId}/re-enrich`
    )
    return response.data
  },

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    const response = await api.put<{ company: Company }>(`/admin/companies/${id}`, { fields: data })
    return response.data.company
  },

  async reAnalyze(
    companyId: string,
    challenge: ChallengeData
  ): Promise<{ submissionId: string; analysisId: string }> {
    const response = await api.post<{ submissionId: string; analysisId: string }>(
      `/admin/companies/${companyId}/re-analyze`,
      challenge
    )
    return response.data
  },

  async analyzeChallenge(challengeId: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/admin/challenges/${challengeId}/analyze`
    )
    return response.data
  },
  // ===== Framework Management =====
  async listFrameworks(): Promise<{ frameworks: Framework[] }> {
    const response = await api.get<{ frameworks: Framework[] }>('/admin/frameworks')
    return response.data
  },

  async createFramework(data: CreateFrameworkRequest): Promise<Framework> {
    const response = await api.post<{ framework: Framework }>('/admin/frameworks', data)
    return response.data.framework
  },

  async updateFramework(id: string, data: UpdateFrameworkRequest): Promise<Framework> {
    const response = await api.put<{ framework: Framework }>(`/admin/frameworks/${id}`, data)
    return response.data.framework
  },

  async deleteFramework(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/frameworks/${id}`)
    return response.data
  },

  // ===== Macro Indicators =====
  async getLatestIndicators(): Promise<MacroIndicators> {
    const response = await api.get<MacroIndicators>('/admin/macro/latest')
    return response.data
  },

  async refreshIndicators(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/admin/macro/refresh')
    return response.data
  },

  async refreshIndicator(code: string): Promise<{ indicator: string; status: string }> {
    const response = await api.post<{ indicator: string; status: string }>(
      `/admin/macro/refresh/${code}`
    )
    return response.data
  },

  async getIndicatorHistory(
    code: string,
    from?: string,
    to?: string,
    limit?: number
  ): Promise<IndicatorHistory> {
    const response = await api.get<IndicatorHistory>(`/admin/macro/history/${code}`, {
      params: { from, to, limit },
    })
    return response.data
  },

  // ===== System Metrics =====
  async getMetrics(): Promise<SystemMetrics> {
    const response = await api.get<SystemMetrics>('/admin/metrics')
    return response.data
  },
}
