'use client'

import { Company } from '@/lib/types/domain'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical, Pencil, Trash2, RefreshCw,
  Building2, Globe, MapPin, Users, Loader2
} from 'lucide-react'
import { useState } from 'react'
import { EditCompanyModal } from './edit-company-modal'
import { DeleteCompanyDialog } from './delete-company-dialog'
import { useReEnrichCompany } from '@/lib/hooks/use-companies'

interface CompanyHeaderProps {
  company: Company
}

const enrichmentStatusLabels: Record<string, { label: string; variant: 'default' | 'warning' | 'error' | 'outline' }> = {
  pending: { label: 'Pendente', variant: 'outline' },
  processing: { label: 'Processando', variant: 'warning' },
  completed: { label: 'Enriquecido', variant: 'default' },
  failed: { label: 'Erro', variant: 'error' },
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const reEnrich = useReEnrichCompany()

  const enrichmentStatus = enrichmentStatusLabels[company.enrichment_status] || enrichmentStatusLabels.pending

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-navy-900/5 rounded-lg">
            <Building2 className="h-8 w-8 text-navy-700" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              {company.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={enrichmentStatus.variant}>
                {enrichmentStatus.label}
              </Badge>
              {company.industry && (
                <span className="text-sm text-text-secondary">{company.industry}</span>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar Empresa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => reEnrich.mutate(company.id)}
              disabled={reEnrich.isPending || company.enrichment_status === 'processing'}
            >
              {reEnrich.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Re-enriquecer Dados
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDelete(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Empresa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Company Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {company.website && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Globe className="h-4 w-4" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy-700 hover:underline truncate"
            >
              {company.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        {company.location && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="h-4 w-4" />
            <span>{company.location}</span>
          </div>
        )}
        {company.company_size && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Users className="h-4 w-4" />
            <span>{company.company_size}</span>
          </div>
        )}
        {company.funding_stage && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="font-medium">Stage:</span>
            <span>{company.funding_stage}</span>
          </div>
        )}
      </div>

      {/* Enriched Data Section (if completed) */}
      {company.enrichment_status === 'completed' && company.value_proposition && (
        <div className="bg-white border border-line rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
            Dados Enriquecidos
          </h3>
          <p className="text-sm text-text-primary">
            {company.value_proposition}
          </p>

          {company.competitors && company.competitors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">Concorrentes:</p>
              <div className="flex flex-wrap gap-1">
                {company.competitors.map((comp, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{comp}</Badge>
                ))}
              </div>
            </div>
          )}

          {company.strengths && company.strengths.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">Pontos Fortes:</p>
              <ul className="text-xs text-text-primary list-disc list-inside">
                {company.strengths.slice(0, 3).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <EditCompanyModal
        company={company}
        open={showEdit}
        onOpenChange={setShowEdit}
      />

      <DeleteCompanyDialog
        company={company}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </div>
  )
}
