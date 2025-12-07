'use client'

import { useMe } from '@/lib/hooks'
import { Badge } from '@/components/ui/badge'

export function AdminHeader() {
  const { data: userData } = useMe()

  return (
    <header className="bg-white border-b border-line px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-navy-900">
          Painel Administrativo
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {userData?.user?.email}
          </span>
          <Badge variant="outline" className="text-red-600 border-red-200">
            {userData?.user?.role}
          </Badge>
        </div>
      </div>
    </header>
  )
}
