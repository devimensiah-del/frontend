'use client'

import { useCompanies } from '@/lib/hooks/use-companies'
import { CompanyCard } from '@/components/dashboard/CompanyCard'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const { data, isLoading } = useCompanies()

  if (isLoading) return <LoadingSpinner />

  const companies = data?.companies || []

  if (!companies.length) {
    return (
      <div className="max-w-7xl mx-auto py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-6 bg-navy-900/5 rounded-full">
            <Building2 className="h-16 w-16 text-navy-900" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-navy-900">
              Nenhuma empresa ainda
            </h2>
            <p className="text-text-secondary max-w-md">
              Suas empresas aparecerão aqui após você enviar um diagnóstico.
            </p>
          </div>
          <Link href="/submit">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Iniciar Diagnóstico
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-900">
            Minhas Empresas
          </h1>
          <p className="text-text-secondary mt-1">
            Gerencie suas empresas e crie novos desafios estratégicos
          </p>
        </div>
        <Link href="/submit">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  )
}
