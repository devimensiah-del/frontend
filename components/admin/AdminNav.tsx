"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Building2,
  FileText,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const navItems = [
  {
    label: "Visão Geral",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Empresas",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    label: "Submissões",
    href: "/admin/submissions",
    icon: FileText,
  },
  {
    label: "Análises",
    href: "/admin/analysis",
    icon: BarChart3,
  },
  {
    label: "Macroeconomia",
    href: "/admin/macroeconomia",
    icon: TrendingUp,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-gold-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
