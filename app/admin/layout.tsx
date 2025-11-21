"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";
import { Toaster } from "@/components/ui/toaster";
import { WorkflowProgress } from "@/components/admin/WorkflowProgress";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { siteConfig, adminNav } from "@/lib/config/site";

/* ============================================
   ADMIN LAYOUT - The Workspace
   ============================================ */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthContext();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-surface-paper">
      {/* --- MOBILE MENU BUTTON --- */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-navy-900 text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside
        className={cn(
          "w-64 bg-navy-900 text-white flex flex-col border-r border-navy-800 transition-transform duration-300",
          "lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Branding */}
        <div className="p-6 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 text-white" />
            <div>
              <div className="font-heading font-bold text-sm tracking-widest">
                {siteConfig.brand.name}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* WORKFLOW SECTION */}
          <div className="mb-8">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 px-3 font-heading font-bold">
              Workflow
            </div>
            <WorkflowProgress />
          </div>

          {/* NAVIGATION SECTIONS */}
          {adminNav.map((section) => (
            <div key={section.title} className="pt-6 border-t border-navy-800">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 px-3 font-heading font-bold">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon || "•"}
                    onClick={closeMobileMenu}
                  >
                    {item.title}
                  </NavItem>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-navy-800">
          <div className="flex items-center gap-3 p-3 rounded hover:bg-navy-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-xs font-bold text-navy-900">
              {user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.email || 'Usuário'}</div>
              <div className="text-xs text-gray-400">{user?.email || siteConfig.contact.supportEmail}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

/* ============================================
   NAV ITEM COMPONENT
   ============================================ */

interface NavItemProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavItem({ href, icon, children, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-sm font-medium",
        isActive
          ? "bg-navy-800 text-white"
          : "text-gray-300 hover:bg-navy-800 hover:text-white"
      )}
    >
      <span className="text-lg">{icon}</span>
      <span className="uppercase tracking-wider text-xs">{children}</span>
    </Link>
  );
}
