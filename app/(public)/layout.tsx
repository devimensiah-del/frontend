"use client";

import { PublicNav } from "@/components/layouts/PublicNav";
import { PublicFooter } from "@/components/layouts/PublicFooter";
import { siteConfig } from "@/lib/config/site";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen flex flex-col border-x border-grid ${siteConfig.layout.maxWidth} mx-auto bg-[var(--surface-paper)]`}>
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
