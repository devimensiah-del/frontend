'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from './StatusBadge'
import { Building2, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SubmissionListItem } from '@/lib/types'

interface SubmissionCardProps {
  submission: SubmissionListItem
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-navy-900/5 rounded-md flex-shrink-0">
              <Building2 className="h-5 w-5 text-navy-900" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">{submission.companyName}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {format(new Date(submission.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={submission.status} />
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/submissions/${submission.id}`}>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            Ver detalhes
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
