'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMe, useLogout } from '@/lib/hooks'

export function AppHeader() {
  const router = useRouter()
  const { data } = useMe()
  const logout = useLogout()
  const user = data?.user

  const handleLogout = () => {
    logout.mutate()
  }

  return (
    <header className="h-16 border-b border-line bg-white flex items-center justify-between px-6">
      <div>
        {/* Breadcrumb or page title can go here */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center">
              <span className="text-sm font-medium text-gold-500">
                {user?.fullName?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-navy-900">
              {user?.fullName || user?.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-navy-900">
              {user?.fullName || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
