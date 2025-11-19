import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | IMENSIAH',
  description: 'Política de privacidade e proteção de dados da IMENSIAH em conformidade com a LGPD',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-sm text-gray-600">
              Última atualização: 16 de novembro de 2025
            </p>
            <p className="text-sm text-gray-700 mt-4">
              Esta Política de Privacidade está em conformidade com a Lei Geral de
              Proteção de Dados (LGPD - Lei nº 13.709/2018) e regulamenta o tratamento
              de dados pessoais pela IMENSIAH.
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
                  1. Introdução
                </a>
              </li>
              <li>
                <a href="#dados-coletados" className="text-blue-600 hover:text-blue-800">
                  2. Dados que Coletamos
                </a>
              </li>
              <li>
                <a href="#uso-dados" className="text-blue-600 hover:text-blue-800">
                  3. Como Usamos Seus Dados
                </a>
              </li>
              <li>
                <a href="#compartilhamento" className="text-blue-600 hover:text-blue-800">
                  4. Compartilhamento de Dados
                </a>
              </li>
              <li>
                <a href="#retencao" className="text-blue-600 hover:text-blue-800">
                  5. Retenção e Segurança de Dados
                </a>
              </li>
              <li>
                <a href="#direitos" className="text-blue-600 hover:text-blue-800">
                  6. Seus Direitos sob a LGPD
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-blue-600 hover:text-blue-800">
                  7. Cookies e Tecnologias de Rastreamento
                </a>
              </li>
              <li>
                <a href="#terceiros" className="text-blue-600 hover:text-blue-800">
                  8. Serviços de Terceiros
                </a>
              </li>
              <li>
                <a href="#menores" className="text-blue-600 hover:text-blue-800">
                  9. Privacidade de Menores
                </a>
              </li>
              <li>
                <a href="#alteracoes" className="text-blue-600 hover:text-blue-800">
                  10. Alterações nesta Política
                </a>
              </li>
              <li>
                <a href="#contato" className="text-blue-600 hover:text-blue-800">
                  11. Contato e Encarregado de Dados
                </a>
              </li>
            </ol>
          </nav>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section id="introducao">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introdução
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  A IMENSIAH (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) respeita sua privacidade
                  e está comprometida em proteger seus dados pessoais. Esta Política de
                  Privacidade explica como coletamos, usamos, armazenamos e
                  compartilhamos suas informações quando você utiliza nossa plataforma
                  de análise estratégica de negócios com inteligência artificial.
                </p>
                <p>
                  Ao utilizar o serviço IMENSIAH disponível em{' '}
                  <span className="font-medium">https://imensiah.com</span>, você
                  concorda com as práticas descritas nesta Política de Privacidade.
                </p>
                <p className="font-medium">Controlador de Dados</p>
                <p>
                  A IMENSIAH atua como controladora dos dados pessoais coletados
                  através do serviço, sendo responsável pelas decisões referentes ao
                  tratamento desses dados.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="dados-coletados">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Dados que Coletamos
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">2.1 Dados Fornecidos Diretamente por Você</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Informações de Conta:</span> Endereço
                    de e-mail, nome (opcional)
                  </li>
                  <li>
                    <span className="font-medium">Informações da Empresa:</span> Nome
                    da empresa, segmento de mercado, descrição do negócio, objetivos
                    estratégicos
                  </li>
                  <li>
                    <span className="font-medium">Informações de Pagamento:</span>{' '}
                    Dados de transação processados pelo Stripe (não armazenamos
                    informações completas de cartão de crédito)
                  </li>
                  <li>
                    <span className="font-medium">Comunicações:</span> Conteúdo de
                    mensagens enviadas para nosso suporte ou equipe
                  </li>
                </ul>

                <p className="font-medium mt-6">2.2 Dados Coletados Automaticamente</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Dados de Uso:</span> Páginas
                    visitadas, relatórios gerados, tempo de sessão, interações com a
                    plataforma
                  </li>
                  <li>
                    <span className="font-medium">Dados Técnicos:</span> Endereço IP,
                    tipo de navegador, sistema operacional, dispositivo utilizado
                  </li>
                  <li>
                    <span className="font-medium">Cookies:</span> Identificadores
                    únicos para análise de uso e funcionalidade (veja seção 7)
                  </li>
                  <li>
                    <span className="font-medium">Logs do Sistema:</span> Registros de
                    acesso, erros e atividades para manutenção e segurança
                  </li>
                </ul>

                <p className="font-medium mt-6">2.3 Dados de Terceiros</p>
                <p>
                  Podemos receber informações adicionais de provedores de serviços de
                  autenticação e pagamento, conforme descrito na seção 8.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="uso-dados">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Como Usamos Seus Dados
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  Utilizamos seus dados pessoais com base nas seguintes bases legais
                  previstas na LGPD:
                </p>

                <p className="font-medium">3.1 Execução de Contrato</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer e operar o serviço de análise estratégica</li>
                  <li>Gerar relatórios personalizados usando inteligência artificial</li>
                  <li>Processar pagamentos e gerenciar sua conta</li>
                  <li>Enviar relatórios e comunicações essenciais do serviço</li>
                  <li>Fornecer suporte ao cliente</li>
                </ul>

                <p className="font-medium mt-6">3.2 Legítimo Interesse</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Melhorar e otimizar nosso serviço</li>
                  <li>Realizar análises estatísticas e de uso</li>
                  <li>Detectar e prevenir fraudes e atividades maliciosas</li>
                  <li>Garantir a segurança da plataforma</li>
                  <li>Desenvolver novos recursos e funcionalidades</li>
                </ul>

                <p className="font-medium mt-6">3.3 Consentimento</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enviar comunicações de marketing (quando autorizado)</li>
                  <li>Usar cookies não essenciais</li>
                  <li>Compartilhar dados para finalidades não previstas nesta política</li>
                </ul>

                <p className="font-medium mt-6">3.4 Cumprimento de Obrigações Legais</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cumprir requisitos fiscais e contábeis</li>
                  <li>Atender solicitações de autoridades competentes</li>
                  <li>Exercer direitos em processos judiciais</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="compartilhamento">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Compartilhamento de Dados
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  A IMENSIAH não vende seus dados pessoais. Compartilhamos seus dados
                  apenas nas seguintes circunstâncias:
                </p>

                <p className="font-medium">4.1 Provedores de Serviços</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-medium">Supabase (Banco de Dados e Autenticação)</p>
                    <p className="text-sm">
                      Armazena dados de usuários, empresas e relatórios. Localização:
                      EUA/Europa (servidores com conformidade GDPR/LGPD).
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Stripe (Processamento de Pagamentos)</p>
                    <p className="text-sm">
                      Processa transações financeiras. Não armazenamos dados completos
                      de cartão de crédito.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">OpenRouter (Inteligência Artificial)</p>
                    <p className="text-sm">
                      Processa informações da empresa para gerar análises estratégicas.
                      Os dados são processados de forma anônima sempre que possível.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Serviços de E-mail</p>
                    <p className="text-sm">
                      Envio de relatórios, notificações e comunicações autorizadas.
                    </p>
                  </div>
                </div>

                <p className="font-medium mt-6">4.2 Transferências Internacionais</p>
                <p>
                  Alguns provedores de serviços podem estar localizados fora do Brasil.
                  Garantimos que tais transferências atendam aos requisitos da LGPD,
                  incluindo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cláusulas contratuais padrão de proteção de dados</li>
                  <li>
                    Provedores com certificações de segurança reconhecidas (SOC 2, ISO
                    27001)
                  </li>
                  <li>Conformidade com GDPR quando aplicável</li>
                </ul>

                <p className="font-medium mt-6">4.3 Requisitos Legais</p>
                <p>
                  Podemos divulgar dados pessoais quando exigido por lei, ordem
                  judicial ou para proteger direitos, segurança e propriedade da
                  IMENSIAH e de terceiros.
                </p>

                <p className="font-medium mt-6">4.4 Fusões e Aquisições</p>
                <p>
                  Em caso de fusão, aquisição ou venda de ativos, seus dados pessoais
                  podem ser transferidos. Você será notificado de qualquer mudança de
                  propriedade.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="retencao">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Retenção e Segurança de Dados
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">5.1 Período de Retenção</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Dados de Conta:</span> Mantidos
                    enquanto a conta estiver ativa, mais 5 anos após cancelamento para
                    fins legais e contábeis
                  </li>
                  <li>
                    <span className="font-medium">Relatórios:</span> Mantidos por 2
                    anos após geração, salvo solicitação de exclusão
                  </li>
                  <li>
                    <span className="font-medium">Dados de Pagamento:</span> Logs de
                    transação mantidos por 5 anos conforme legislação fiscal
                  </li>
                  <li>
                    <span className="font-medium">Logs Técnicos:</span> Mantidos por 6
                    meses para segurança e análise
                  </li>
                  <li>
                    <span className="font-medium">Comunicações de Suporte:</span>{' '}
                    Mantidas por 3 anos
                  </li>
                </ul>

                <p className="font-medium mt-6">5.2 Medidas de Segurança</p>
                <p>
                  Implementamos medidas técnicas e organizacionais para proteger seus
                  dados:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Criptografia de dados em trânsito (TLS/SSL) e em repouso</li>
                  <li>Controles de acesso baseados em função (RBAC)</li>
                  <li>Autenticação multifator para sistemas internos</li>
                  <li>Monitoramento contínuo de segurança e logs de auditoria</li>
                  <li>Backups regulares e plano de recuperação de desastres</li>
                  <li>Testes de segurança e avaliações de vulnerabilidade</li>
                  <li>Treinamento de equipe em segurança e privacidade</li>
                </ul>

                <p className="font-medium mt-6">5.3 Incidentes de Segurança</p>
                <p>
                  Em caso de violação de dados que possa acarretar risco aos seus
                  direitos e liberdades, você será notificado em até 72 horas, conforme
                  exigido pela LGPD, juntamente com a Autoridade Nacional de Proteção
                  de Dados (ANPD).
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="direitos">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Seus Direitos sob a LGPD
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  Conforme a LGPD (Lei nº 13.709/2018), você possui os seguintes
                  direitos em relação aos seus dados pessoais:
                </p>

                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">
                      1. Confirmação e Acesso
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Confirmar a existência de tratamento e acessar seus dados
                      pessoais.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">2. Correção</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Solicitar a correção de dados incompletos, inexatos ou
                      desatualizados.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">
                      3. Anonimização, Bloqueio ou Eliminação
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Solicitar anonimização, bloqueio ou eliminação de dados
                      desnecessários, excessivos ou tratados em desconformidade.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">4. Portabilidade</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Solicitar a portabilidade de seus dados a outro fornecedor de
                      serviço, mediante requisição expressa.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">5. Eliminação</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Solicitar a eliminação de dados tratados com base em
                      consentimento, salvo hipóteses legais de retenção.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">
                      6. Informação sobre Compartilhamento
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Obter informações sobre entidades públicas e privadas com as
                      quais compartilhamos dados.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">
                      7. Informação sobre Não Consentimento
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Ser informado sobre a possibilidade e consequências de não
                      fornecer consentimento.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium text-blue-900">
                      8. Revogação de Consentimento
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Revogar o consentimento a qualquer momento, quando aplicável.
                    </p>
                  </div>
                </div>

                <p className="font-medium mt-6">Como Exercer Seus Direitos</p>
                <p>
                  Para exercer qualquer um desses direitos, entre em contato conosco
                  através de:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    E-mail:{' '}
                    <a
                      href="mailto:admin@imensiah.com"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      admin@imensiah.com
                    </a>
                  </li>
                  <li>Através das configurações da conta na plataforma</li>
                </ul>
                <p>
                  Responderemos às solicitações em até 15 (quinze) dias, podendo ser
                  prorrogado por mais 15 dias mediante justificativa. Podemos solicitar
                  informações adicionais para verificar sua identidade antes de
                  processar a solicitação.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="cookies">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Cookies e Tecnologias de Rastreamento
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p className="font-medium">7.1 O Que São Cookies</p>
                <p>
                  Cookies são pequenos arquivos de texto armazenados no seu navegador
                  que nos ajudam a fornecer e melhorar o serviço.
                </p>

                <p className="font-medium">7.2 Tipos de Cookies Utilizados</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Cookies Essenciais</p>
                    <p className="text-sm">
                      Necessários para o funcionamento básico da plataforma
                      (autenticação, segurança). Não podem ser desativados.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Cookies de Funcionalidade</p>
                    <p className="text-sm">
                      Lembram preferências do usuário e melhoram a experiência
                      (idioma, configurações).
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Cookies de Análise</p>
                    <p className="text-sm">
                      Coletam informações sobre como você usa o serviço para
                      melhorias (Google Analytics ou similar).
                    </p>
                  </div>
                </div>

                <p className="font-medium mt-6">7.3 Gerenciamento de Cookies</p>
                <p>
                  Você pode controlar e/ou excluir cookies conforme desejar através
                  das configurações do seu navegador. Note que desativar cookies
                  essenciais pode afetar o funcionamento do serviço.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="terceiros">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Serviços de Terceiros
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  Utilizamos os seguintes serviços de terceiros que podem coletar e
                  processar seus dados:
                </p>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-900">Supabase</p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Finalidade:</span> Banco de dados,
                      autenticação e armazenamento
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Dados Compartilhados:</span>{' '}
                      E-mail, senha (hash), dados da empresa, relatórios
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Política:</span>{' '}
                      <a
                        href="https://supabase.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        supabase.com/privacy
                      </a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-900">Stripe</p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Finalidade:</span> Processamento
                      de pagamentos
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Dados Compartilhados:</span>{' '}
                      E-mail, dados de transação
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Política:</span>{' '}
                      <a
                        href="https://stripe.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        stripe.com/privacy
                      </a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-900">OpenRouter</p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Finalidade:</span> Processamento
                      de IA para geração de análises
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Dados Compartilhados:</span>{' '}
                      Informações da empresa (anonimizadas quando possível)
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Política:</span>{' '}
                      <a
                        href="https://openrouter.ai/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        openrouter.ai/privacy
                      </a>
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  Não somos responsáveis pelas práticas de privacidade desses
                  terceiros. Recomendamos que você revise suas políticas de
                  privacidade.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="menores">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Privacidade de Menores
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  O serviço IMENSIAH destina-se a empresas e profissionais. Não
                  coletamos intencionalmente dados de menores de 18 anos. Se
                  identificarmos que coletamos dados de um menor sem consentimento
                  parental adequado, tomaremos medidas para excluir essas informações.
                </p>
                <p>
                  Se você acredita que um menor forneceu dados pessoais, entre em
                  contato conosco imediatamente em{' '}
                  <a
                    href="mailto:admin@imensiah.com"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    admin@imensiah.com
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="alteracoes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Alterações nesta Política
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente para
                  refletir mudanças em nossas práticas, tecnologia ou requisitos
                  legais.
                </p>
                <p>Você será notificado sobre alterações significativas através de:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>E-mail enviado ao endereço cadastrado</li>
                  <li>Notificação destacada na plataforma</li>
                  <li>
                    Atualização da data de &quot;Última atualização&quot; no topo desta
                    página
                  </li>
                </ul>
                <p>
                  Recomendamos que você revise esta Política periodicamente. O uso
                  continuado do serviço após alterações constitui aceitação da nova
                  Política de Privacidade.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="contato">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Contato e Encarregado de Dados
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                <p>
                  Para questões sobre esta Política de Privacidade, exercício de
                  direitos sob a LGPD ou tratamento de dados pessoais, entre em contato
                  com nosso Encarregado de Proteção de Dados (DPO):
                </p>

                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                  <p className="font-medium text-gray-900">IMENSIAH</p>
                  <p className="text-gray-700">
                    <span className="font-medium">Encarregado de Dados (DPO):</span>{' '}
                    Equipe de Privacidade IMENSIAH
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">E-mail:</span>{' '}
                    <a
                      href="mailto:admin@imensiah.com"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      admin@imensiah.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Website:</span>{' '}
                    https://imensiah.com
                  </p>
                </div>

                <p className="font-medium mt-6">Autoridade de Proteção de Dados</p>
                <p>
                  Você também tem o direito de apresentar uma reclamação à Autoridade
                  Nacional de Proteção de Dados (ANPD):
                </p>
                <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">ANPD:</span> Autoridade Nacional de
                    Proteção de Dados
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Website:</span>{' '}
                    <a
                      href="https://www.gov.br/anpd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      www.gov.br/anpd
                    </a>
                  </p>
                </div>

                <p className="text-sm text-gray-600 mt-8">
                  Esta Política de Privacidade foi elaborada em conformidade com a Lei
                  Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e reflete
                  nosso compromisso com a proteção de seus dados pessoais.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              © 2025 IMENSIAH. Todos os direitos reservados.
            </p>
            <p className="text-sm text-gray-600 text-center mt-2">
              Esta política está em conformidade com a LGPD (Lei nº 13.709/2018)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
