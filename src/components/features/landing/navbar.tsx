'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useMe, useLogout } from '@/lib/hooks'
import { LogOut, Loader2 } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { data: userData, isLoading } = useMe()
  const logout = useLogout()

  const isLoggedIn = !!userData?.user
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-line">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isLoggedIn ? '/dashboard' : '/'} className="flex items-center">
            <img
              src="/images/landing/logo.png"
              alt="IMENSIAH"
              className="h-8 w-auto"
            />
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : isLoggedIn ? (
              <>
                <span className="hidden sm:block text-sm text-muted-foreground truncate max-w-[200px]">
                  {userData.user.email}
                </span>
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
                      <LogOut className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Sair</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm">
                  <a href="#diagnostico">Diagnostico Gratis</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
