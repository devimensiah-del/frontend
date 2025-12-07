'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/lib/hooks'
import { AdminSidebar } from '@/components/shared/admin-sidebar'
import { AdminHeader } from '@/components/shared/admin-header'
import { Loader2 } from 'lucide-react'

const ADMIN_ROLES = ['admin', 'super_admin', 'service_role']

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data, isLoading, error } = useMe()

  useEffect(() => {
    if (!isLoading) {
      if (error || !data?.user) {
        router.push('/login')
      } else if (!ADMIN_ROLES.includes(data.user.role)) {
        router.push('/dashboard')
      }
    }
  }, [data, isLoading, error, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-paper">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    )
  }

  // Redirect in progress
  if (error || !data?.user || !ADMIN_ROLES.includes(data.user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-paper">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 bg-surface-paper">{children}</main>
      </div>
    </div>
  )
}
