"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/context";

export function LandingFooter() {
  const t = useTranslations();

  return (
    <footer className="bg-navy-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/images/landing/logo.png"
              alt="ImensIAH"
              width={100}
              height={30}
              className="h-6 w-auto brightness-0 invert"
            />
            <span className="text-gray-400 text-sm">{t("landingFooter.copyright")}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacidade"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {t("landingFooter.privacy")}
            </Link>
            <Link
              href="/termos"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {t("landingFooter.terms")}
            </Link>
            <a
              href="mailto:contato@imensiah.com"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {t("landingFooter.contact")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
