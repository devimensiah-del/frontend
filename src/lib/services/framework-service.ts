import api from '@/lib/api'
import type {
  Framework,
  FrameworkMeta,
  FrameworkV2,
  FrameworkResult,
  FrameworkResultWithDetails,
  ExecutionPlan,
  AnalysisState,
  StaleFrameworksResponse,
  AcknowledgeStaleRequest,
  AcknowledgeStaleResponse,
  FrameworkReadinessResponse,
  ExecuteFrameworkRequest,
  ExecuteFrameworkResponse,
  DependencyChainResponse,
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

  // ==========================================================================
  // 5-Step Analysis with Dependency Chain (V2 Endpoints)
  // ==========================================================================

  // Company: Get analysis state (5-step progress with stale tracking)
  async getAnalysisState(companyId: string, challengeId?: string): Promise<AnalysisState> {
    const params = challengeId ? { challenge_id: challengeId } : undefined
    const response = await api.get<{ analysis_state: AnalysisState }>(
      `/companies/${companyId}/analysis-state`,
      { params }
    )
    return response.data.analysis_state
  },

  // Company: Get stale frameworks
  async getStaleFrameworks(companyId: string, challengeId?: string): Promise<StaleFrameworksResponse> {
    const params = challengeId ? { challenge_id: challengeId } : undefined
    const response = await api.get<StaleFrameworksResponse>(
      `/companies/${companyId}/stale-frameworks`,
      { params }
    )
    return response.data
  },

  // Company: Acknowledge stale frameworks
  async acknowledgeStale(companyId: string, request: AcknowledgeStaleRequest): Promise<AcknowledgeStaleResponse> {
    const response = await api.post<AcknowledgeStaleResponse>(
      `/companies/${companyId}/acknowledge-stale`,
      request
    )
    return response.data
  },

  // Company: Check framework readiness (dependencies and mode)
  async getFrameworkReadiness(companyId: string, frameworkCode: string, challengeId?: string): Promise<FrameworkReadinessResponse> {
    const params = challengeId ? { challenge_id: challengeId } : undefined
    const response = await api.get<FrameworkReadinessResponse>(
      `/companies/${companyId}/frameworks/${frameworkCode}/readiness`,
      { params }
    )
    return response.data
  },

  // Company: Execute framework with dependency awareness
  async executeFramework(companyId: string, frameworkCode: string, request?: ExecuteFrameworkRequest, challengeId?: string): Promise<ExecuteFrameworkResponse> {
    const params = challengeId ? { challenge_id: challengeId } : undefined
    const response = await api.post<ExecuteFrameworkResponse>(
      `/companies/${companyId}/frameworks/${frameworkCode}/execute`,
      request || {},
      { params }
    )
    return response.data
  },

  // Get framework dependency chain (for visualization)
  async getDependencyChain(frameworkCode: string): Promise<DependencyChainResponse> {
    const response = await api.get<DependencyChainResponse>(
      `/frameworks/${frameworkCode}/dependencies`
    )
    return response.data
  },
}
