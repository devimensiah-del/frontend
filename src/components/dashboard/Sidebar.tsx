'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  FileText,
  Settings,
  LogOut,
  X,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/lib/hooks/use-auth'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/companies', label: 'Minhas Empresas', icon: Building2 },
  { href: '/dashboard/submissions', label: 'Análises', icon: FileText },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { mutate: logout, isPending } = useLogout()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const closeMobile = () => {
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-line rounded-md"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-line transition-transform',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-line">
            <Link href="/dashboard" onClick={closeMobile}>
              <h1 className="text-2xl font-heading font-bold text-navy-900">
                IMENSIAH
              </h1>
              <p className="text-xs text-text-secondary mt-1">Strategic Intelligence</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                    'hover:bg-navy-900/5',
                    isActive && 'bg-navy-900 text-white hover:bg-navy-900'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-line">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
