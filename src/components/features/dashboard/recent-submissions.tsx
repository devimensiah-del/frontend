import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import type { SubmissionListItem } from '@/lib/types'

interface RecentSubmissionsProps {
  submissions: SubmissionListItem[]
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white border border-line rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Nenhuma submissão encontrada.
        </p>
        <Link
          href="/#diagnostico"
          className="text-gold-500 hover:underline text-sm mt-2 inline-block"
        >
          Solicite sua primeira análise
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-line rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-navy-900/5">
            <tr>
              <th className="text-left text-sm font-medium text-navy-900 px-6 py-3">
                Empresa
              </th>
              <th className="text-left text-sm font-medium text-navy-900 px-6 py-3">
                Status
              </th>
              <th className="text-left text-sm font-medium text-navy-900 px-6 py-3">
                Data
              </th>
              <th className="text-right text-sm font-medium text-navy-900 px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-navy-900/5">
                <td className="px-6 py-4">
                  <span className="font-medium text-navy-900">
                    {submission.companyName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    status={submission.status}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(submission.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/analyses/${submission.id}`}
                    className="inline-flex items-center text-sm text-gold-500 hover:underline"
                  >
                    Ver detalhes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
