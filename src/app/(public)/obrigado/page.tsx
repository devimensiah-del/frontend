import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThankYouPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-medium text-navy-900 mb-4">
          Diagnóstico Solicitado!
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Recebemos seus dados com sucesso. Nossa equipe já está trabalhando na
          sua análise estratégica.
        </p>

        <div className="bg-surface-paper border border-line p-6 mb-8 text-left">
          <h2 className="font-semibold text-navy-900 mb-4">Próximos Passos:</h2>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/10 text-gold-500 text-sm font-medium flex items-center justify-center">
                1
              </span>
              <span>
                Você receberá um email de confirmação com os detalhes do seu pedido.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/10 text-gold-500 text-sm font-medium flex items-center justify-center">
                2
              </span>
              <span>
                Nossa IA irá processar os dados e gerar a análise inicial.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/10 text-gold-500 text-sm font-medium flex items-center justify-center">
                3
              </span>
              <span>
                Especialistas humanos validarão os insights estratégicos.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/10 text-gold-500 text-sm font-medium flex items-center justify-center">
                4
              </span>
              <span>
                Em até 48h, você receberá o relatório completo no seu email.
              </span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              Voltar ao Início
            </Link>
          </Button>
          <Button asChild>
            <Link href="/login">
              Acessar Plataforma
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Dúvidas?{' '}
          <a
            href="mailto:contato@imensiah.com"
            className="text-gold-500 hover:underline"
          >
            Entre em contato
          </a>
        </p>
      </div>
    </div>
  )
}
