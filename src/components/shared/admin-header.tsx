'use client'

import { useMe, useLogout } from '@/lib/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Menu, LogOut, Loader2 } from 'lucide-react'

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: userData } = useMe()
  const logout = useLogout()

  return (
    <header className="bg-white border-b border-line px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-navy-900 hover:bg-surface-paper rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-navy-900">
            Painel Admin
          </h1>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <span className="hidden sm:block text-sm text-muted-foreground truncate max-w-[200px]">
            {userData?.user?.email}
          </span>
          <Badge variant="outline" className="text-red-600 border-red-200 hidden sm:flex">
            {userData?.user?.role}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="text-muted-foreground hover:text-navy-900"
          >
            {logout.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4 lg:mr-2" />
                <span className="hidden lg:inline">Sair</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
