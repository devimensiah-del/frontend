import Link from "next/link";
import { Button } from "@/components/atoms/Button";

/**
 * 404 Not Found Page
 *
 * Displayed when a user navigates to a route that doesn't exist
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-paper p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-heading font-bold text-gold-500 tracking-tight">
            404
          </h1>
          <div className="w-24 h-px bg-gold-500 mx-auto" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-heading font-bold text-navy-900 tracking-wide uppercase">
            Página não encontrada
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            A página que você está procurando não existe ou foi movida.
            Verifique o endereço e tente novamente.
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center py-8">
          <svg
            className="w-32 h-32 text-gold-500/20"
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
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="20"
              y1="20"
              x2="80"
              y2="80"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="80"
              y1="20"
              x2="20"
              y2="80"
              stroke="currentColor"
              strokeWidth="2"
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
          <p className="text-xs text-text-tertiary">
            Precisa de ajuda?
          </p>
          <div className="flex gap-4 justify-center text-xs">
            <Link
              href="/"
              className="text-gold-500 hover:text-navy-900 transition-colors"
            >
              Página Inicial
            </Link>
            <span className="text-text-tertiary">•</span>
            <Link
              href="/dashboard"
              className="text-gold-500 hover:text-navy-900 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
