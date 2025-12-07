import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-paper">
      <div className="max-w-md w-full px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-gold-500" />
        </div>

        <h1 className="text-4xl font-bold text-navy-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-navy-900 mb-4">
          Pagina nao encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          A pagina que voce esta procurando nao existe ou foi movida para outro endereco.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ir para Home
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-line">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{' '}
            <a
              href="mailto:suporte@imensiah.com"
              className="text-gold-500 hover:text-gold-600 underline"
            >
              Fale conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
