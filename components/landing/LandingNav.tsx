"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { Menu, X } from "lucide-react";

export function LandingNav() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/landing/metodologia", label: t("landingNav.methodology") },
    { href: "/landing/desafios-roadmap", label: t("landingNav.challenges") },
    { href: "/landing/modelo-de-negocio", label: t("landingNav.model") },
    { href: "/landing/seguranca", label: t("landingNav.security") },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/landing" className="flex items-center">
            <Image
              src="/images/landing/logo.png"
              alt="ImensIAH"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-navy-900 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-navy-900 transition-colors"
            >
              {t("landingNav.login")}
            </Link>
            <Button asChild size="sm" variant="architect">
              <Link href="/landing#pilot">{t("landingNav.cta")}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-navy-900 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-navy-900 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("landingNav.login")}
              </Link>
              <Button asChild size="sm" variant="architect" className="mt-2">
                <Link href="/landing#pilot" onClick={() => setMobileMenuOpen(false)}>
                  {t("landingNav.cta")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
