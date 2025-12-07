import Link from 'next/link'
import { Building2, ChevronRight } from 'lucide-react'
import { EnrichmentStatusIndicator } from './enrichment-status'
import type { Company } from '@/lib/types'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`}>
      <div className="bg-white border border-line rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-navy-900/5 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-900">{company.name}</h3>
              {company.industry && (
                <p className="text-sm text-muted-foreground">{company.industry}</p>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex items-center justify-between">
          <EnrichmentStatusIndicator status={company.enrichment_status} />
          <p className="text-xs text-muted-foreground">
            {new Date(company.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </Link>
  )
}
