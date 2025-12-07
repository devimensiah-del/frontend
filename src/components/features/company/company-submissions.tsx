import Link from 'next/link'
import { ChevronRight, FileText } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import type { SubmissionListItem } from '@/lib/types'

interface CompanySubmissionsProps {
  submissions: SubmissionListItem[]
}

export function CompanySubmissions({ submissions }: CompanySubmissionsProps) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white border border-line rounded-lg p-6 text-center">
        <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-muted-foreground">
          Nenhuma análise encontrada para esta empresa.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-line rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-line">
        <h2 className="font-semibold text-navy-900">Análises Relacionadas</h2>
      </div>
      <ul className="divide-y divide-line">
        {submissions.map((submission) => (
          <li key={submission.id}>
            <Link
              href={`/analyses/${submission.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-navy-900/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-900">
                    {submission.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(submission.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={submission.status} />
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
