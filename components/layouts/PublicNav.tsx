"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslations } from "@/lib/i18n/context";

export function PublicNav() {
  const t = useTranslations();

  return (
    <nav className="w-full border-b border-grid bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="relative w-32 h-10 md:w-30 md:h-12">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t("nav.login")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
