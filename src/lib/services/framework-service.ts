import api from '@/lib/api'
import type { Framework, FrameworkMeta } from '@/lib/types'

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
