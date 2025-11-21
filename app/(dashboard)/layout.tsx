import { ImensiahLogo } from '@/components/ImensiahLogo';
import { Button } from '@/components/ui/button';
import { SkipToContent } from '@/components/a11y/SkipToContent';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    // Mock logout - clear auth and redirect
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipToContent />

      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/painel" className="flex items-center">
              <ImensiahLogo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegação do painel">
              <Link
                href="/painel"
                className="text-sm font-medium text-gray-700 hover:text-[#00a859] transition-colors"
              >
                Painel
              </Link>
              <Link
                href="/envios"
                className="text-sm font-medium text-gray-700 hover:text-[#00a859] transition-colors"
              >
                Envios
              </Link>
              <Link
                href="/nova-analise"
                className="text-sm font-medium text-gray-700 hover:text-[#00a859] transition-colors"
              >
                Nova Análise
              </Link>
              <Link
                href="/perfil"
                className="text-sm font-medium text-gray-700 hover:text-[#00a859] transition-colors"
              >
                Perfil
              </Link>
              <Link
                href="/configuracoes"
                className="text-sm font-medium text-gray-700 hover:text-[#00a859] transition-colors"
              >
                Configurações
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-sm"
              >
                Sair
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-500)]"
              aria-label="Abrir menu de navegação"
              aria-expanded="false"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/painel"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Painel
            </Link>
            <Link
              href="/envios"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Envios
            </Link>
            <Link
              href="/nova-analise"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Nova Análise
            </Link>
            <Link
              href="/perfil"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Perfil
            </Link>
            <Link
              href="/configuracoes"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Configurações
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
      >
        {children}
      </main>
    </div>
  );
}
