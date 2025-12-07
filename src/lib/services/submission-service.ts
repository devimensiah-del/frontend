import api from '@/lib/api'
import type {
  Submission,
  SubmissionListItem,
  Analysis,
  PaginatedResponse,
  CreateSubmissionRequest,
  CreateSubmissionResponse,
} from '@/lib/types'

export const submissionService = {
  async create(data: CreateSubmissionRequest): Promise<CreateSubmissionResponse> {
    const response = await api.post<CreateSubmissionResponse>('/submissions', data)
    return response.data
  },

  async list(page = 1, pageSize = 10): Promise<PaginatedResponse<SubmissionListItem>> {
    const response = await api.get<PaginatedResponse<SubmissionListItem>>('/submissions', {
      params: { page, pageSize },
    })
    return response.data
  },

  async getById(id: string): Promise<Submission> {
    const response = await api.get<{ submission: Submission }>(`/submissions/${id}`)
    return response.data.submission
  },

  async getAnalysis(id: string): Promise<Analysis> {
    const response = await api.get<{ analysis: Analysis }>(`/submissions/${id}/analysis`)
    return response.data.analysis
  },
}
