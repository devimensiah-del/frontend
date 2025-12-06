'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/client';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useRouter } from 'next/navigation';
import { SkipToContent } from '@/components/a11y/SkipToContent';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to login, even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        router.push('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-paper">
      <SkipToContent />

      {/* Desktop: Sidebar + Content */}
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <DashboardNav.Desktop
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
            userName={user?.fullName || 'Usuário'}
            userEmail={user?.email}
            onLogout={handleLogout}
          />

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto pb-20 md:pb-0"
            role="main"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <DashboardNav.Mobile />
    </div>
  );
}
