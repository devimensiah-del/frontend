import api from '@/lib/api'
import type { Challenge, ChallengeCategory, ChallengeType } from '@/lib/types'

interface CreateChallengeRequest {
  company_id: string
  challenge_category: ChallengeCategory
  challenge_type: ChallengeType
  business_challenge: string
}

interface ChallengeTypesResponse {
  categories: string[]
  types: Array<{
    code: string
    name: string
    description: string
    category: string
    emoji: string
  }>
}

export const challengeService = {
  async create(data: CreateChallengeRequest): Promise<Challenge> {
    const response = await api.post<{ challenge: Challenge }>('/challenges', data)
    return response.data.challenge
  },

  async update(id: string, data: Partial<Challenge>): Promise<Challenge> {
    const response = await api.put<{ challenge: Challenge }>(`/challenges/${id}`, data)
    return response.data.challenge
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/challenges/${id}`)
  },

  async getTypes(): Promise<ChallengeTypesResponse> {
    const response = await api.get<ChallengeTypesResponse>('/challenges/types')
    return response.data
  },
}
