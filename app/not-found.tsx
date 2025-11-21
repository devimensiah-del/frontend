import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 404 Not Found Page
 *
 * Displayed when a user navigates to a route that doesn't exist
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-architect-cream p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-heading font-light text-architect-gold tracking-tight">
            404
          </h1>
          <div className="w-24 h-px bg-architect-gold mx-auto" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-heading font-light text-architect-black tracking-tight">
            Página não encontrada
          </h2>
          <p className="text-architect-gray-dark font-body text-sm leading-relaxed max-w-sm mx-auto">
            A página que você está procurando não existe ou foi movida.
            Verifique o endereço e tente novamente.
          </p>
        </div>

        {/* Illustration - Minimalist geometric shape */}
        <div className="flex justify-center py-8">
          <svg
            className="w-32 h-32 text-architect-gold/20"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <line
              x1="20"
              y1="20"
              x2="80"
              y2="80"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="80"
              y1="20"
              x2="20"
              y2="80"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Action Button */}
        <div>
          <Link href="/">
            <Button variant="architect" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-8 space-y-2">
          <p className="text-xs text-architect-gray font-body">
            Precisa de ajuda?
          </p>
          <div className="flex gap-4 justify-center text-xs">
            <Link
              href="/"
              className="text-architect-gold hover:text-architect-black transition-colors"
            >
              Página Inicial
            </Link>
            <span className="text-architect-gray">•</span>
            <Link
              href="/dashboard"
              className="text-architect-gold hover:text-architect-black transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
