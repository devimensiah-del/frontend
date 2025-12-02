"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { I18nProvider } from "@/lib/i18n/context";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <LandingNav />
        <main className="flex-1">{children}</main>
        <LandingFooter />
      </div>
    </I18nProvider>
  );
}
