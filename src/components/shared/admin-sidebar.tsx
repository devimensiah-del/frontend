'use client'

import Link from 'next/link'
import { ShieldAlert, X } from 'lucide-react'

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-navy-900 text-white flex flex-col min-h-screen
          transform transition-transform duration-200 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-navy-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gold-500">IMENSIAH</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded">
              ADMIN
            </span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - empty for now, we'll build it */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Navigation items will be added as we build */}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-navy-800">
          <div className="flex items-center gap-2 px-4 py-2 text-red-400 text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Área Restrita</span>
          </div>
        </div>
      </aside>
    </>
  )
}
