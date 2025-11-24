import React from "react";
import { cn } from "@/lib/utils/cn";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-grid py-6 mt-auto bg-white">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} IMENSIAH. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
