import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Serviço | IMENSIAH',
  description: 'Termos e condições de uso da plataforma IMENSIAH de análise estratégica de negócios com inteligência artificial',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Termos de Serviço
            </h1>
            <p className="text-sm text-gray-600">
              Última atualização: 16 de novembro de 2025
            </p>
          </div>

          {/* Table of Contents */}
          <nav className="mb-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Índice
            </h2>
            <ol className="space-y-2 text-sm">
              <li>
                <a href="#introducao" className="text-blue-600 hover:text-blue-800">
                  1. Introdução e Aceitação
                </a>
              </li>
              <li>
                <a href="#servico" className="text-blue-600 hover:text-blue-800">
                  2. Descrição do Serviço
                </a>
              </li>
              <li>
                <a href="#contas" className="text-blue-600 hover:text-blue-800">
                  3. Contas de Usuário e Responsabilidades
                </a>
              </li>
              <li>
                <a href="#pagamento" className="text-blue-600 hover:text-blue-800">
                  4. Termos de Pagamento
                </a>
              </li>
              <li>
                <a href="#propriedade" className="text-blue-600 hover:text-blue-800">
                  5. Propriedade Intelectual
                </a>
              </li>
              <li>
                <a href="#limitacao" className="text-blue-600 hover:text-blue-800">
                  6. Limitação de Responsabilidade
                </a>
              </li>
              <li>
                <a href="#terminacao" className="text-blue-600 hover:text-blue-800">
                  7. Rescisão e Cancelamento
                </a>
              </li>
              <li>
                <a href="#disputas" className="text-blue-600 hover:text-blue-800">
                  8. Resolução de Disputas
                </a>
              </li>
              <li>
                <a href="#alteracoes" className="text-blue-600 hover:text-blue-800">
                  9. Alterações nos Termos
                </a>
              </li>
              <li>
                <a href="#contato" className="text-blue-600 hover:text-blue-800">
                  10. Informações de Contato
                </a>
              </li>
            </ol>
          </nav>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section id="introducao">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introdução e Aceitação
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  Bem-vindo à IMENSIAH. Estes Termos de Serviço (&quot;Termos&quot;) regem o uso
                  da nossa plataforma de análise estratégica de negócios com inteligência
                  artificial, disponível em <span className="font-medium">https://imensiah.com</span> (o &quot;Serviço&quot;).
                </p>
                <p>
                  Ao acessar ou utilizar o Serviço, você (&quot;Usuário&quot; ou &quot;você&quot;) concorda
                  em cumprir e estar vinculado a estes Termos. Se você não concorda com
                  estes Termos, não utilize o Serviço.
                </p>
                <p>
                  Estes Termos constituem um acordo legal vinculante entre você e a
                  IMENSIAH. O uso continuado do Serviço após quaisquer alterações nestes
                  Termos constitui aceitação de tais alterações.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="servico">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Descrição do Serviço
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  A IMENSIAH oferece uma plataforma SaaS (Software as a Service) que
                  utiliza inteligência artificial para fornecer análises estratégicas
                  personalizadas de negócios. O Serviço inclui:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Geração de relatórios estratégicos baseados em IA para análise de
                    negócios
                  </li>
                  <li>
                    Análise de mercado, concorrência, oportunidades e riscos
                  </li>
                  <li>
                    Recomendações personalizadas com base nas informações fornecidas
                  </li>
                  <li>
                    Acesso a relatórios gerados através de links exclusivos
                  </li>
                  <li>
                    Histórico de relatórios solicitados (para usuários registrados)
                  </li>
                </ul>
                <p>
                  O Serviço é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;. A IMENSIAH
                  reserva-se o direito de modificar, suspender ou descontinuar qualquer
                  aspecto do Serviço a qualquer momento, com ou sem aviso prévio.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="contas">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Contas de Usuário e Responsabilidades
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">3.1 Criação de Conta</p>
                <p>
                  Para utilizar determinadas funcionalidades do Serviço, você pode
                  precisar criar uma conta fornecendo um endereço de e-mail válido e
                  informações sobre sua empresa.
                </p>
                <p className="font-medium">3.2 Responsabilidades do Usuário</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Manter a confidencialidade das credenciais de acesso
                  </li>
                  <li>
                    Fornecer informações precisas, atuais e completas
                  </li>
                  <li>
                    Notificar imediatamente sobre qualquer uso não autorizado da conta
                  </li>
                  <li>
                    Utilizar o Serviço apenas para fins legítimos e legais
                  </li>
                  <li>
                    Não compartilhar acesso a relatórios pagos com terceiros não
                    autorizados
                  </li>
                </ul>
                <p className="font-medium">3.3 Condutas Proibidas</p>
                <p>Você concorda em NÃO:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Violar leis ou regulamentos aplicáveis
                  </li>
                  <li>
                    Fazer engenharia reversa, descompilar ou tentar extrair o código
                    do Serviço
                  </li>
                  <li>
                    Utilizar o Serviço para fins fraudulentos ou maliciosos
                  </li>
                  <li>
                    Interferir ou interromper o funcionamento do Serviço
                  </li>
                  <li>
                    Transmitir vírus, malware ou código malicioso
                  </li>
                  <li>
                    Coletar informações de outros usuários sem consentimento
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="pagamento">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Termos de Pagamento
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">4.1 Preços e Cobrança</p>
                <p>
                  Os preços dos relatórios são exibidos em Reais (BRL) e estão sujeitos
                  a alterações sem aviso prévio. Todas as cobranças são processadas
                  através da plataforma Stripe.
                </p>
                <p className="font-medium">4.2 Processamento de Pagamentos</p>
                <p>
                  Ao efetuar um pagamento, você autoriza a IMENSIAH a cobrar o valor
                  total do relatório solicitado. Os pagamentos são processados de forma
                  segura através do Stripe, e a IMENSIAH não armazena informações
                  completas de cartão de crédito.
                </p>
                <p className="font-medium">4.3 Política de Reembolso</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Reembolsos são disponibilizados em caso de falha técnica na geração
                    do relatório
                  </li>
                  <li>
                    Solicitações de reembolso devem ser feitas em até 7 (sete) dias após
                    a compra
                  </li>
                  <li>
                    Reembolsos não são garantidos após o relatório ter sido
                    completamente gerado e acessado
                  </li>
                  <li>
                    A IMENSIAH reserva-se o direito de avaliar cada solicitação
                    individualmente
                  </li>
                  <li>
                    O prazo para processamento de reembolsos é de até 10 (dez) dias úteis
                  </li>
                </ul>
                <p className="font-medium">4.4 Impostos</p>
                <p>
                  Você é responsável por quaisquer impostos aplicáveis relacionados ao
                  uso do Serviço, conforme a legislação brasileira vigente.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="propriedade">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Propriedade Intelectual
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">5.1 Propriedade da IMENSIAH</p>
                <p>
                  O Serviço, incluindo mas não limitado a código, design, logotipos,
                  marcas, textos e gráficos, é de propriedade exclusiva da IMENSIAH e
                  está protegido por leis de propriedade intelectual brasileiras e
                  internacionais.
                </p>
                <p className="font-medium">5.2 Propriedade dos Relatórios</p>
                <p>
                  Os relatórios gerados pela IA são fornecidos exclusivamente ao Usuário
                  que os solicitou. Você recebe uma licença limitada, não exclusiva e
                  intransferível para uso dos relatórios para seus próprios fins
                  comerciais internos.
                </p>
                <p className="font-medium">5.3 Dados do Usuário</p>
                <p>
                  Você mantém todos os direitos sobre os dados e informações que fornece
                  ao Serviço. Ao usar o Serviço, você concede à IMENSIAH uma licença
                  limitada para processar esses dados com o único propósito de fornecer
                  o Serviço.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="limitacao">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitação de Responsabilidade
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">6.1 Isenção de Garantias</p>
                <p>
                  O Serviço é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;. A IMENSIAH
                  não garante que o Serviço será ininterrupto, livre de erros ou
                  completamente seguro. As análises fornecidas são baseadas em
                  inteligência artificial e devem ser utilizadas como referência, não
                  como aconselhamento profissional definitivo.
                </p>
                <p className="font-medium">6.2 Limitação de Responsabilidade</p>
                <p>
                  Na máxima extensão permitida pela lei brasileira, a IMENSIAH não será
                  responsável por:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Danos indiretos, incidentais, especiais ou consequenciais
                  </li>
                  <li>
                    Perda de lucros, receitas, dados ou uso
                  </li>
                  <li>
                    Decisões de negócios baseadas nos relatórios gerados
                  </li>
                  <li>
                    Interrupções ou erros no Serviço
                  </li>
                  <li>
                    Ações de terceiros, incluindo provedores de IA
                  </li>
                </ul>
                <p>
                  A responsabilidade total da IMENSIAH não excederá o valor pago pelo
                  Usuário nos 12 (doze) meses anteriores ao evento que deu origem à
                  reclamação.
                </p>
                <p className="font-medium">6.3 Aconselhamento Profissional</p>
                <p>
                  Os relatórios gerados não constituem aconselhamento jurídico,
                  financeiro, contábil ou profissional. Você deve consultar profissionais
                  qualificados antes de tomar decisões baseadas nas análises fornecidas.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="terminacao">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Rescisão e Cancelamento
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">7.1 Rescisão pelo Usuário</p>
                <p>
                  Você pode encerrar sua conta a qualquer momento através das
                  configurações da conta ou entrando em contato conosco em{' '}
                  <a href="mailto:admin@imensiah.com" className="text-blue-600 hover:text-blue-800">
                    admin@imensiah.com
                  </a>
                  . O encerramento não gera direito a reembolso de pagamentos já
                  efetuados.
                </p>
                <p className="font-medium">7.2 Rescisão pela IMENSIAH</p>
                <p>
                  A IMENSIAH reserva-se o direito de suspender ou encerrar sua conta e
                  acesso ao Serviço, a qualquer momento e sem aviso prévio, se:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Você violar estes Termos</li>
                  <li>Houver suspeita de atividade fraudulenta ou ilegal</li>
                  <li>Seja necessário por motivos legais ou regulatórios</li>
                  <li>O Serviço for descontinuado</li>
                </ul>
                <p className="font-medium">7.3 Efeitos da Rescisão</p>
                <p>
                  Após a rescisão, você perderá acesso à sua conta e aos relatórios
                  associados. A IMENSIAH pode reter certos dados conforme exigido por
                  lei ou para fins legítimos de negócio.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="disputas">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Resolução de Disputas
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">8.1 Lei Aplicável</p>
                <p>
                  Estes Termos são regidos pelas leis da República Federativa do Brasil,
                  sem considerar conflitos de disposições legais.
                </p>
                <p className="font-medium">8.2 Jurisdição</p>
                <p>
                  Qualquer disputa decorrente destes Termos será submetida à jurisdição
                  exclusiva dos tribunais brasileiros competentes, conforme o Código de
                  Defesa do Consumidor (Lei nº 8.078/90) e demais legislação aplicável.
                </p>
                <p className="font-medium">8.3 Resolução Amigável</p>
                <p>
                  Antes de iniciar qualquer procedimento legal, as partes concordam em
                  tentar resolver disputas de forma amigável através de negociação
                  direta por um período de 30 (trinta) dias.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="alteracoes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Alterações nos Termos
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  A IMENSIAH reserva-se o direito de modificar estes Termos a qualquer
                  momento. Alterações significativas serão comunicadas através de:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>E-mail para o endereço cadastrado</li>
                  <li>Notificação na plataforma</li>
                  <li>Atualização da data de &quot;Última atualização&quot; nesta página</li>
                </ul>
                <p>
                  O uso continuado do Serviço após a publicação das alterações constitui
                  aceitação dos novos Termos. Se você não concordar com as alterações,
                  deve descontinuar o uso do Serviço.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="contato">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Informações de Contato
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  Para questões relacionadas a estes Termos de Serviço, entre em contato
                  conosco:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                  <p className="font-medium">IMENSIAH</p>
                  <p>
                    E-mail:{' '}
                    <a
                      href="mailto:admin@imensiah.com"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      admin@imensiah.com
                    </a>
                  </p>
                  <p>Website: https://imensiah.com</p>
                </div>
                <p className="text-sm text-gray-600 mt-8">
                  Recomendamos que você salve uma cópia destes Termos para seus
                  registros. Estes Termos foram atualizados pela última vez em 16 de
                  novembro de 2025.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              © 2025 IMENSIAH. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
