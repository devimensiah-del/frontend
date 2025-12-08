import api from '@/lib/api'
import type { PublicReportData, Analysis } from '@/lib/types'

export const reportService = {
  /**
   * Get public report by access code
   * Does not require authentication if is_public=true
   * Admin users can pass preview=admin to bypass visibility checks
   */
  async getPublicReport(code: string, preview?: string): Promise<PublicReportData> {
    const params = preview ? { preview } : undefined
    const response = await api.get<PublicReportData>(`/public/report/${code}`, { params })
    return response.data
  },

  /**
   * Get authenticated user's analysis report
   * Requires authentication and ownership/permission
   */
  async getAuthenticatedReport(submissionId: string): Promise<Analysis> {
    const response = await api.get<Analysis>(`/submissions/${submissionId}/analysis`)
    return response.data
  },
}
