/**
 * NavLink Molecule
 *
 * Navigation link with active state indicator.
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  active?: boolean; // Manual override
  exact?: boolean; // Exact path match
}

// ============================================
// COMPONENT
// ============================================

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, href, children, active, exact = false, ...props }, ref) => {
    const pathname = usePathname();

    // Determine if link is active
    const isActive = active !== undefined
      ? active
      : exact
        ? pathname === href
        : pathname.startsWith(href);

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          "h-full flex items-center px-8 text-xs font-medium uppercase tracking-widest transition-colors",
          "hover:bg-white hover:text-gold-500",
          isActive ? "text-gold-500 bg-white" : "text-text-secondary",
          className
        )}
        aria-current={isActive ? "page" : undefined}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";
