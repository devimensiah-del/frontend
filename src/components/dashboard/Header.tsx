'use client'

import { useMe } from '@/lib/hooks/use-auth'
import { User, Bell } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function Header() {
  const { data, isLoading } = useMe()

  return (
    <header className="h-16 bg-white border-b border-line px-6 flex items-center justify-between lg:justify-end">
      {/* Spacer for mobile menu button */}
      <div className="lg:hidden w-10" />

      <div className="flex items-center gap-4">
        {/* Notifications placeholder */}
        <button
          className="p-2 hover:bg-navy-900/5 rounded-md transition-colors relative"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 text-text-secondary" />
          {/* Notification badge placeholder */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" /> */}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-navy-900">
                  {data?.user?.fullName || 'Usuário'}
                </p>
                <p className="text-xs text-text-secondary">{data?.user?.email}</p>
              </>
            )}
          </div>

          <div className="w-10 h-10 bg-navy-900/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-navy-900" />
          </div>
        </div>
      </div>
    </header>
  )
}
