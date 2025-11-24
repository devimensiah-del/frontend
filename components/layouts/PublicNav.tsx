import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";

export function PublicNav() {
  return (
    <nav className="w-full border-b border-grid bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="relative w-32 h-10">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/login" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
}
