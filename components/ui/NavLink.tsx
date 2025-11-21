import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   NAV LINK COMPONENT - Architectural Navigation
   ============================================ */

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <a className={cn("nav-link", className)} {...props}>
      {children}
    </a>
  );
};
