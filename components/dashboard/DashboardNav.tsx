/**
 * DashboardNav Component
 *
 * Responsive navigation for dashboard:
 * - Desktop: Collapsible sidebar
 * - Mobile: Bottom tab bar
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Building2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface DashboardNavProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

// ============================================
// NAV ITEMS
// ============================================

const NAV_ITEMS: NavItem[] = [
  {
    label: "Início",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Empresas",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    label: "Submissões",
    href: "/dashboard/submissions",
    icon: FileText,
  },
  {
    label: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
];

// ============================================
// DESKTOP SIDEBAR
// ============================================

export const DesktopSidebar: React.FC<DashboardNavProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-white border-r border-line transition-all duration-300 h-screen sticky top-0",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-line flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="font-bold text-sm uppercase tracking-wider text-text-secondary">
            Menu
          </h2>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-sm hover:bg-surface-paper transition-colors"
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors group",
                isActive
                  ? "bg-gold-50 text-gold-700 font-medium"
                  : "text-text-secondary hover:bg-surface-paper hover:text-text-primary"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-gold-600" : "text-text-tertiary group-hover:text-text-secondary"
                )}
              />
              {!isCollapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

// ============================================
// MOBILE BOTTOM NAV
// ============================================

export const MobileBottomNav: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line z-50",
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-sm transition-colors min-w-0 flex-1",
                isActive
                  ? "text-gold-600"
                  : "text-text-tertiary"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// ============================================
// EXPORT
// ============================================

export const DashboardNav = {
  Desktop: DesktopSidebar,
  Mobile: MobileBottomNav,
};
