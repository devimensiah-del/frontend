import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-7xl md:text-8xl font-bold text-[hsl(195_100%_8%)] mb-4">
            404
          </h1>
          <div className="w-20 h-1 bg-[hsl(45_100%_55%)] mx-auto rounded-full"></div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Página não encontrada
        </h2>

        <p className="text-gray-600 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full bg-[hsl(45_100%_55%)] text-[hsl(195_100%_8%)] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition duration-200"
          >
            Voltar ao Início
          </Link>

          <Link
            href="/dashboard"
            className="block text-[hsl(195_100%_8%)] hover:underline text-sm"
          >
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
