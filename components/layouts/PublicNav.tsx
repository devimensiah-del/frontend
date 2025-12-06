"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { MAINTENANCE_MODE } from "@/lib/config/maintenance";

export function PublicNav() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#metodologia", label: t("nav.methodology") },
    { href: "#sobre", label: t("nav.about") },
  ];

  return (
    <nav className="w-full border-b border-grid bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Left */}
          <Link href="/" className="relative w-28 h-10 flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Nav Links - Center */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy-900 hover:text-gold-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {!MAINTENANCE_MODE && (
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
            )}
            <Button asChild variant="architect" size="sm" className="hidden md:inline-flex">
              <a href="#diagnostico">{t("nav.startAnalysis")}</a>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-navy-900 hover:text-gold-500 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-grid bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-navy-900 hover:text-gold-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-grid space-y-2">
              {!MAINTENANCE_MODE && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-navy-900 hover:text-gold-500 transition-colors"
                >
                  {t("nav.login")}
                </Link>
              )}
              <a
                href="#diagnostico"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 px-4 bg-navy-900 text-white hover:bg-navy-800 transition-colors rounded text-sm font-medium"
              >
                {t("nav.startAnalysis")}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
