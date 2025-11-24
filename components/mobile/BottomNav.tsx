'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  FileText,
  User,
  Menu,
  ShieldCheck,
  ClipboardList,
  PackageSearch,
  Settings
} from 'lucide-react';
import { useAuthContext } from '@/lib/providers/AuthProvider';

/**
 * BottomNav - Mobile Navigation Component
 * Sticky bottom navigation bar for mobile devices
 */

interface NavButtonProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

function NavButton({ href, icon, label, active, onClick, badge }: NavButtonProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-2 px-3 min-h-[56px] transition-colors",
        active
          ? "text-navy-900"
          : "text-text-secondary hover:text-navy-900"
      )}
    >
      <div className="relative">
        {icon}
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className={cn(
        "text-[10px] font-medium mt-1 uppercase tracking-wider",
        active && "font-bold"
      )}>
        {label}
      </span>
      {active && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-500" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="relative flex-1">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="relative flex-1">
      {content}
    </button>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';

  // Don't show on public pages
  if (!user || pathname === '/' || pathname.startsWith('/auth')) {
    return null;
  }

  // User navigation
  if (!isAdmin) {
    return (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line z-50 safe-area-pb">
        <div className="grid grid-cols-3 gap-1">
          <NavButton
            href="/painel"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Painel"
            active={pathname === '/painel'}
          />
          <NavButton
            href="/envios"
            icon={<FileText className="w-5 h-5" />}
            label="Envios"
            active={pathname.startsWith('/envios')}
          />
          <NavButton
            href="/perfil"
            icon={<User className="w-5 h-5" />}
            label="Perfil"
            active={pathname.startsWith('/perfil')}
          />
        </div>
      </nav>
    );
  }

  // Admin navigation
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line z-50 safe-area-pb">
      <div className="grid grid-cols-4 gap-1">
        <NavButton
          href="/admin/dashboard"
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Inbox"
          active={pathname === '/admin/dashboard'}
        />
        <NavButton
          href="/admin/enriquecimento"
          icon={<PackageSearch className="w-5 h-5" />}
          label="Enriquecer"
          active={pathname.startsWith('/admin/enriquecimento')}
        />
        <NavButton
          href="/admin/analise"
          icon={<ClipboardList className="w-5 h-5" />}
          label="Análise"
          active={pathname.startsWith('/admin/analise')}
        />
        <NavButton
          href="/admin/configuracoes"
          icon={<Settings className="w-5 h-5" />}
          label="Config"
          active={pathname.startsWith('/admin/configuracoes')}
        />
      </div>
    </nav>
  );
}
