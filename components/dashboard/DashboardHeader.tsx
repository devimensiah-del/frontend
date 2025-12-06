/**
 * DashboardHeader Component
 *
 * Top header with logo, user menu, notifications, and logout
 */

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils/cn";
import { Bell, LogOut, User, ChevronDown } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "Usuário",
  userEmail,
  onLogout,
  className,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white border-b border-line",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <Logo className="w-40 h-12 md:w-52 md:h-14" />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications (placeholder) */}
          <button
            className="relative p-2 rounded-sm hover:bg-surface-paper transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {/* Notification badge (hidden for now) */}
            {/* <span className="absolute top-1 right-1 w-2 h-2 bg-semantic-error rounded-full" /> */}
          </button>

          {/* User Menu */}
          <div className="relative" data-user-menu>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 p-1 md:p-2 rounded-sm hover:bg-surface-paper transition-colors"
              aria-label="Menu do usuário"
              aria-expanded={showUserMenu}
            >
              <Avatar size="sm" alt={userName}>
                {userInitials}
              </Avatar>
              <div className="hidden md:flex flex-col items-start min-w-0">
                <span className="text-sm font-medium text-text-primary truncate max-w-32">
                  {userName}
                </span>
                {userEmail && (
                  <span className="text-xs text-text-tertiary truncate max-w-32">
                    {userEmail}
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "hidden md:block w-4 h-4 text-text-tertiary transition-transform",
                  showUserMenu && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-line rounded-sm shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info (mobile only) */}
                <div className="md:hidden px-4 py-3 border-b border-line">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-text-tertiary truncate">
                      {userEmail}
                    </p>
                  )}
                </div>

                {/* Menu Items */}
                <Link
                  href="/dashboard/configuracoes"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-paper transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Configurações
                </Link>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-semantic-error hover:bg-semantic-error-light transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
