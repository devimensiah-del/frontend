"use client";

import { Logo } from "@/components/ui/Logo";
import { Label } from "@/components/ui/Typography";
import { siteConfig } from "@/lib/config/site";

/* ============================================
   PUBLIC FOOTER COMPONENT
   Configurable footer for public pages
   ============================================ */

interface PublicFooterProps {
  logoSize?: string;
  brandName?: string;
  year?: number;
  tagline?: string;
  links?: typeof siteConfig.footer.links;
}

export function PublicFooter({
  logoSize = siteConfig.footer.logoSize,
  brandName = siteConfig.brand.name,
  year = siteConfig.footer.year,
  tagline = siteConfig.brand.tagline,
  links = siteConfig.footer.links,
}: PublicFooterProps) {
  return (
    <footer className="border-t border-grid py-12 px-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
      <div className="flex items-center gap-3 opacity-80">
        <Logo className={logoSize} grayscale />
        <span className="text-xs font-bold tracking-widest text-navy-900">
          {brandName} © {year}
        </span>
      </div>

      <Label className="text-text-secondary">
        {tagline}
      </Label>

      {links && links.length > 0 && (
        <div className="flex gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-text-secondary hover:text-navy-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
