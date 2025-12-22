import api from '@/lib/api'
import type {
  Framework,
  FrameworkMeta,
  FrameworkV2,
  FrameworkResult,
  FrameworkResultWithDetails,
  ExecutionPlan
} from '@/lib/types'

// Legacy framework service (analysisbysteps)
export const frameworkService = {
  async list(): Promise<{ frameworks: Framework[] }> {
    const response = await api.get<{ frameworks: Framework[] }>('/frameworks')
    return response.data
  },

  async getByCode(code: string): Promise<Framework> {
    const response = await api.get<{ framework: Framework }>(`/frameworks/${code}`)
    return response.data.framework
  },

  async getOrder(): Promise<{ frameworks: FrameworkMeta[]; total_steps: number }> {
    const response = await api.get<{ frameworks: FrameworkMeta[]; total_steps: number }>(
      '/frameworks/order'
    )
    return response.data
  },
}

// Framework V2 service (database-driven frameworks)
export const frameworkV2Service = {
  // Admin: List all active frameworks
  async list(): Promise<{ frameworks: FrameworkV2[]; total: number }> {
    const response = await api.get<{ frameworks: FrameworkV2[]; total: number }>('/admin/frameworks')
    return response.data
  },

  // Admin: Get framework by code or ID
  async getByCode(code: string): Promise<FrameworkV2> {
    const response = await api.get<{ framework: FrameworkV2 }>(`/admin/frameworks/${code}`)
    return response.data.framework
  },

  // Admin: Update framework
  async update(id: string, data: Partial<FrameworkV2>): Promise<FrameworkV2> {
    const response = await api.put<{ framework: FrameworkV2 }>(`/admin/frameworks/${id}`, data)
    return response.data.framework
  },

  // Admin: Get execution plan
  async getExecutionPlan(): Promise<ExecutionPlan> {
    const response = await api.get<{ execution_plan: ExecutionPlan }>('/admin/frameworks/execution-plan')
    return response.data.execution_plan
  },

  // Company: Get framework results
  async getCompanyResults(companyId: string, challengeId?: string): Promise<{ results: FrameworkResultWithDetails[]; total: number }> {
    const params = challengeId ? { challenge_id: challengeId } : undefined
    const response = await api.get<{ results: FrameworkResultWithDetails[]; total: number }>(
      `/companies/${companyId}/framework-results`,
      { params }
    )
    return response.data
  },

  // Company: Get single result status (for polling)
  async getResultStatus(companyId: string, resultId: string): Promise<{ result: FrameworkResult; framework: FrameworkV2 }> {
    const response = await api.get<{ result: FrameworkResult; framework: FrameworkV2 }>(
      `/companies/${companyId}/framework-results/${resultId}`
    )
    return response.data
  },

  // Company: Run framework for company
  async runFramework(companyId: string, frameworkCode: string, challengeId?: string): Promise<{ message: string; result_id: string; status: string; framework: string }> {
    const response = await api.post<{ message: string; result_id: string; status: string; framework: string }>(
      `/companies/${companyId}/frameworks/${frameworkCode}/run`,
      challengeId ? { challenge_id: challengeId } : undefined
    )
    return response.data
  },

  // Company: Update framework result (user editing)
  async updateResult(companyId: string, resultId: string, result: Record<string, unknown>): Promise<{ message: string; result_id: string }> {
    const response = await api.put<{ message: string; result_id: string }>(
      `/companies/${companyId}/framework-results/${resultId}`,
      { result }
    )
    return response.data
  },
}
