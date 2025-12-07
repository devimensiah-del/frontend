import api from '@/lib/api'
import type { PublicReportData, Analysis } from '@/lib/types'

export const reportService = {
  /**
   * Get public report by access code
   * Does not require authentication if is_public=true
   */
  async getPublicReport(code: string): Promise<PublicReportData> {
    const response = await api.get<PublicReportData>(`/public/report/${code}`)
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
