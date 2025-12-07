'use client'

import { useState } from 'react'
import { Loader2, Search, Building2, RotateCcw } from 'lucide-react'
import { useAdminCompanies } from '@/lib/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ReAnalyzeDialog } from '@/components/features/admin'
import type { Company } from '@/lib/types'

const enrichmentColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const { data, isLoading } = useAdminCompanies(100, 0)

  const companies = (data as any)?.companies || []
  const filteredCompanies = search
    ? companies.filter((c: Company) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.cnpj?.includes(search)
      )
    : companies

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">
          Gerenciamento de Empresas
        </h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as empresas cadastradas
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-line overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Enriquecimento</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Nenhuma empresa encontrada
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company: Company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        {company.legal_name && (
                          <Badge variant="outline" className="text-xs">
                            Verificada
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {company.cnpj || '-'}
                    </TableCell>
                    <TableCell>{company.industry || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          enrichmentColors[company.enrichment_status || 'pending']
                        }
                      >
                        {company.enrichment_status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(company.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCompany(company)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Re-analisar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Re-analyze Dialog */}
      {selectedCompany && (
        <ReAnalyzeDialog
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
          open={!!selectedCompany}
          onOpenChange={(open) => !open && setSelectedCompany(null)}
        />
      )}
    </div>
  )
}
