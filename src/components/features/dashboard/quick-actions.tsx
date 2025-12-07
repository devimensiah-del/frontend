import Link from 'next/link'
import { Plus, Building2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button asChild>
        <Link href="/#diagnostico">
          <Plus className="w-4 h-4 mr-2" />
          Nova Submissão
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/companies">
          <Building2 className="w-4 h-4 mr-2" />
          Ver Empresas
        </Link>
      </Button>
    </div>
  )
}
