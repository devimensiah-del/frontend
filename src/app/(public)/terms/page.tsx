import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Serviço',
  description: 'Termos de Serviço da IMENSIAH',
}

export default function TermsPage() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-medium text-navy-900 mb-8">
          Termos de Serviço
        </h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-sm text-gold-500 mb-8">
            Última atualização: Janeiro de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar ou usar a plataforma IMENSIAH, você concorda em cumprir
              estes Termos de Serviço. Se você não concordar com qualquer parte
              destes termos, não deverá usar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              2. Descrição do Serviço
            </h2>
            <p>
              A IMENSIAH é uma plataforma de inteligência estratégica que combina
              Inteligência Artificial com validação humana especializada para
              gerar análises estratégicas empresariais. Nossos serviços incluem:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Análise de 11 frameworks estratégicos (PESTEL, Porter, SWOT, etc.)</li>
              <li>Enriquecimento de dados empresariais</li>
              <li>Geração de relatórios executivos</li>
              <li>Validação humana por especialistas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              3. Cadastro e Conta
            </h2>
            <p className="mb-4">
              Para utilizar nossos serviços, você deve:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer informações verdadeiras e completas</li>
              <li>Manter a segurança de suas credenciais de acesso</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              4. Uso Aceitável
            </h2>
            <p className="mb-4">Você concorda em não:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usar o serviço para fins ilegais ou não autorizados</li>
              <li>Tentar acessar sistemas ou dados sem autorização</li>
              <li>Interferir ou interromper a integridade do serviço</li>
              <li>Reproduzir, duplicar ou revender o serviço sem permissão</li>
              <li>Fornecer informações falsas ou enganosas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              5. Propriedade Intelectual
            </h2>
            <p className="mb-4">
              <strong>Nosso Conteúdo:</strong> A plataforma IMENSIAH, incluindo
              software, design, metodologias e frameworks, são propriedade da
              IMENSIAH e protegidos por leis de propriedade intelectual.
            </p>
            <p>
              <strong>Seu Conteúdo:</strong> Você mantém a propriedade dos dados
              e documentos que compartilha conosco. Ao usar nossos serviços, você
              nos concede uma licença limitada para processar esses dados
              exclusivamente para fornecer as análises solicitadas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              6. Confidencialidade
            </h2>
            <p>
              Tratamos todas as informações compartilhadas por você como
              confidenciais. Implementamos medidas de segurança rigorosas e
              não compartilhamos seus dados com terceiros, exceto conforme
              necessário para fornecer o serviço ou quando exigido por lei.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="mb-4">
              Os serviços da IMENSIAH são fornecidos &ldquo;como estão&rdquo;. Embora nos
              esforcemos para fornecer análises precisas e úteis:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Não garantimos que as análises resultarão em resultados
                empresariais específicos
              </li>
              <li>
                As decisões de negócios baseadas em nossas análises são de
                sua exclusiva responsabilidade
              </li>
              <li>
                Não nos responsabilizamos por danos indiretos, incidentais
                ou consequentes
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              8. Pagamentos e Reembolsos
            </h2>
            <p>
              Os termos de pagamento e políticas de reembolso serão especificados
              no momento da contratação do serviço. Em caso de insatisfação,
              oferecemos garantia de satisfação conforme as condições acordadas
              no momento da compra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              9. Prazo de Entrega
            </h2>
            <p>
              Nos comprometemos a entregar as análises estratégicas em até 48
              horas úteis após o recebimento de todas as informações necessárias.
              Prazos específicos podem variar de acordo com a complexidade da
              análise e serão comunicados previamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              10. Rescisão
            </h2>
            <p>
              Podemos suspender ou encerrar seu acesso ao serviço a qualquer
              momento, com ou sem aviso prévio, por violação destes termos ou
              por qualquer outro motivo. Você pode encerrar sua conta a qualquer
              momento entrando em contato conosco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              11. Lei Aplicável
            </h2>
            <p>
              Estes Termos de Serviço são regidos pelas leis da República
              Federativa do Brasil. Quaisquer disputas serão resolvidas nos
              tribunais competentes da cidade de São Paulo, SP.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              12. Alterações nos Termos
            </h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer
              momento. Alterações significativas serão comunicadas por email
              ou notificação na plataforma. O uso continuado do serviço após
              as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              13. Contato
            </h2>
            <p>
              Para dúvidas sobre estes Termos de Serviço, entre em contato:{' '}
              <a href="mailto:legal@imensiah.com" className="text-gold-500 hover:text-gold-600">
                legal@imensiah.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
