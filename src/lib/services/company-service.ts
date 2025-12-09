import api from '@/lib/api'
import type { Company, Challenge, CreateCompanyRequest } from '@/lib/types'

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
    const response = await api.put<{ company: Company }>(`/companies/${id}`, data)
    return response.data.company
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/companies/${id}`)
  },

  async reEnrich(id: string): Promise<{ message: string; data?: { company_id: string; status: string; fields_updated: number; remaining_today: number } }> {
    const response = await api.post<{ message: string; data?: { company_id: string; status: string; fields_updated: number; remaining_today: number } }>(`/admin/companies/${id}/re-enrich`)
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
}
