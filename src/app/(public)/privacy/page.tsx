import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade da IMENSIAH',
}

export default function PrivacyPage() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-medium text-navy-900 mb-8">
          Política de Privacidade
        </h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-sm text-gold-500 mb-8">
            Última atualização: Janeiro de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              1. Introdução
            </h2>
            <p>
              A IMENSIAH (&ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;Empresa&rdquo;) está comprometida em proteger sua
              privacidade. Esta Política de Privacidade explica como coletamos, usamos,
              divulgamos e protegemos suas informações quando você utiliza nossa plataforma
              de inteligência estratégica.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              2. Informações que Coletamos
            </h2>
            <p className="mb-4">Coletamos os seguintes tipos de informações:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Dados de Cadastro:</strong> Nome, email, empresa e cargo quando você
                cria uma conta.
              </li>
              <li>
                <strong>Dados da Empresa:</strong> Informações sobre sua empresa necessárias
                para realizar a análise estratégica, incluindo CNPJ, setor de atuação,
                desafios de negócios e documentos compartilhados.
              </li>
              <li>
                <strong>Dados de Uso:</strong> Informações sobre como você interage com
                nossa plataforma.
              </li>
              <li>
                <strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador e dispositivo.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              3. Como Usamos suas Informações
            </h2>
            <p className="mb-4">Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer e melhorar nossos serviços de análise estratégica</li>
              <li>Gerar relatórios personalizados para sua empresa</li>
              <li>Comunicar-nos com você sobre sua conta e nossos serviços</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              4. Política Zero-Training
            </h2>
            <p>
              <strong>Seus dados nunca são usados para treinar modelos de IA públicos.</strong>
              Utilizamos modelos de inteligência artificial exclusivamente para processar
              suas análises, e todos os dados são tratados com estrita confidencialidade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              5. Compartilhamento de Dados
            </h2>
            <p className="mb-4">
              Não vendemos suas informações pessoais. Podemos compartilhar dados apenas:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Com provedores de serviços que nos auxiliam na operação da plataforma</li>
              <li>Quando exigido por lei ou processo legal</li>
              <li>Para proteger nossos direitos e segurança</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              6. Segurança dos Dados
            </h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais apropriadas
              para proteger suas informações contra acesso não autorizado, alteração,
              divulgação ou destruição. Isso inclui criptografia de dados em trânsito
              e em repouso, controles de acesso rigorosos e monitoramento contínuo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              7. Seus Direitos
            </h2>
            <p className="mb-4">De acordo com a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou inexatos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar seu consentimento</li>
              <li>Solicitar a portabilidade de seus dados</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              8. Retenção de Dados
            </h2>
            <p>
              Mantemos suas informações pelo tempo necessário para fornecer nossos
              serviços ou conforme exigido por lei. Após a exclusão da conta, seus
              dados serão removidos em até 90 dias, exceto quando a retenção for
              necessária para cumprir obrigações legais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              9. Contato
            </h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política,
              entre em contato conosco pelo email:{' '}
              <a href="mailto:privacidade@imensiah.com" className="text-gold-500 hover:text-gold-600">
                privacidade@imensiah.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">
              10. Alterações nesta Política
            </h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente.
              Notificaremos você sobre quaisquer alterações significativas
              publicando a nova política nesta página e atualizando a data
              de &ldquo;última atualização&rdquo;.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
