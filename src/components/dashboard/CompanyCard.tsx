'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from './StatusBadge'
import { Building2, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Company } from '@/lib/types'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-navy-900/5 rounded-md flex-shrink-0">
              <Building2 className="h-5 w-5 text-navy-900" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">{company.name}</CardTitle>
              <div className="space-y-1 mt-2">
                {company.industry && (
                  <p className="text-sm text-text-secondary">{company.industry}</p>
                )}
                {company.location && (
                  <div className="flex items-center gap-1 text-sm text-text-secondary">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{company.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <StatusBadge status={company.enrichment_status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Criado em {format(new Date(company.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>
        <Link href={`/dashboard/companies/${company.id}`}>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            Ver detalhes
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
