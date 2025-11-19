import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="py-12 px-4 bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo e descrição */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/imensiah-logo.png"
                alt="IMENSIAH"
                width={48}
                height={48}
                className="w-12 h-12 object-contain drop-shadow-lg"
              />
              <div>
                <div className="font-bold text-xl text-primary-foreground">ImensIAH</div>
                <div className="text-sm text-primary-foreground/60">
                  Inteligência Estratégica
                </div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Onde a inteligência artificial encontra a inteligência humana para impulsionar a estratégia do futuro.
            </p>
          </div>

          {/* Informações da empresa */}
          <div>
            <h3 className="font-bold mb-4 text-accent">Informações</h3>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p><strong className="text-primary-foreground">Empresa:</strong> ImensIAH Inteligência Estratégica</p>
              <p><strong className="text-primary-foreground">CNPJ:</strong> 00.000.000/0000-00</p>
              <p><strong className="text-primary-foreground">Contato:</strong> contato@imensiah.com.br</p>
              <p className="text-xs leading-relaxed">
                <strong className="text-primary-foreground">Endereço:</strong><br />
                Alameda Lorena, 1304 – Cj 907<br />
                Jardim Paulista, São Paulo – SP
              </p>
            </div>
          </div>

          {/* Links legais */}
          <div>
            <h3 className="font-bold mb-4 text-accent">Políticas</h3>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="block text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="block text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Política de Devolução (7 dias)
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} ImensIAH. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
