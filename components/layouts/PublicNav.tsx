"use client";

import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { siteConfig } from "@/lib/config/site";

/* ============================================
   PUBLIC NAVIGATION COMPONENT
   Configurable navigation bar for public pages
   ============================================ */

interface PublicNavProps {
  navItems?: typeof siteConfig.navigation.items;
  logoSize?: string;
  brandName?: string;
  cta?: typeof siteConfig.navigation.cta;
}

export function PublicNav({
  navItems = siteConfig.navigation.items,
  logoSize = siteConfig.navigation.logoSize,
  brandName = siteConfig.brand.name,
  cta = siteConfig.navigation.cta,
}: PublicNavProps) {
  return (
    <nav
      className={`${siteConfig.layout.navHeight} flex items-center justify-between px-6 md:px-12 border-b border-grid bg-white`}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex items-center gap-4">
        <Logo className={logoSize} />
        <span className="font-heading font-bold text-lg tracking-widest text-navy-900">
          {brandName}
        </span>
      </div>

      {navItems.length > 0 && (
        <div className="hidden md:flex items-center divide-x divide-line border-x border-grid h-full">
          {navItems.map((item) => (
            <NavLink key={item.label} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      <a
        href={cta.href}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-navy-900 border-b border-navy-900 pb-1 hover:text-gold-500 hover:border-gold-500 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-500)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
        aria-label={cta.text}
      >
        {cta.text} <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </a>
    </nav>
  );
}
