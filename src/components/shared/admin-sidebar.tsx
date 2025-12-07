'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  Building2,
  ShieldAlert,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Submissões', href: '/admin/submissions', icon: Send },
  { name: 'Análises', href: '/admin/analyses', icon: FileText },
  { name: 'Empresas', href: '/admin/companies', icon: Building2 },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-navy-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-navy-800">
        <Link href="/admin/submissions" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gold-500">IMENSIAH</span>
          <span className="px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded">
            ADMIN
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-gold-500/10 text-gold-500'
                  : 'text-gray-400 hover:bg-navy-800 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Danger Zone Link */}
      <div className="p-4 border-t border-navy-800">
        <div className="flex items-center gap-2 px-4 py-2 text-red-400 text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Área Administrativa</span>
        </div>
        <Link
          href="/dashboard"
          className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          ← Voltar ao Portal
        </Link>
      </div>
    </aside>
  )
}
