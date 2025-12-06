"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/context";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations();

  return (
    <footer className="w-full border-t border-grid py-12 mt-auto bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-heading font-semibold text-navy-900 mb-3">IMENSIAH</h3>
            <p className="text-sm text-gray-600 max-w-md">
              {t("hero.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#metodologia" className="text-sm text-gray-600 hover:text-gold-500 transition-colors">
                  {t("nav.methodology")}
                </a>
              </li>
              <li>
                <a href="#processo" className="text-sm text-gray-600 hover:text-gold-500 transition-colors">
                  {t("nav.process")}
                </a>
              </li>
              <li>
                <a href="#diagnostico" className="text-sm text-gray-600 hover:text-gold-500 transition-colors">
                  {t("nav.diagnostic")}
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gold-500 transition-colors">
                  {t("nav.login")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacidade" className="text-sm text-gray-600 hover:text-gold-500 transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-sm text-gray-600 hover:text-gold-500 transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-grid">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} IMENSIAH. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-400">
              Inteligência Estratégica Híbrida (IA + IH)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
