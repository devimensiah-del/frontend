"use client";

import { Heading, Text } from "@/components/ui/Typography";
import { Container } from "@/components/ui/Grid";

export default function PrivacidadePage() {
  return (
    <Container className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Heading as="h1" className="mb-8">
          Política de Privacidade
        </Heading>

        <section className="space-y-4">
          <Heading as="h2">1. Informações que Coletamos</Heading>
          <Text>
            Coletamos informações que você nos fornece diretamente ao solicitar nossos serviços de diagnóstico estratégico, incluindo nome, e-mail, telefone, informações da empresa e detalhes de negócio.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">2. Como Usamos Suas Informações</Heading>
          <Text>
            Utilizamos suas informações para fornecer análises estratégicas personalizadas, comunicar resultados, melhorar nossos serviços e atender requisitos legais.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">3. Compartilhamento de Dados</Heading>
          <Text>
            Não vendemos suas informações pessoais. Podemos compartilhar dados com prestadores de serviços confiáveis que nos auxiliam em nossas operações, sempre sob acordos de confidencialidade.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">4. Segurança</Heading>
          <Text>
            Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">5. Seus Direitos</Heading>
          <Text>
            Você tem o direito de acessar, corrigir, excluir ou transferir suas informações pessoais. Entre em contato conosco para exercer esses direitos.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">6. Cookies e Tecnologias Similares</Heading>
          <Text>
            Utilizamos cookies e tecnologias semelhantes para melhorar a experiência do usuário, analisar o tráfego e personalizar conteúdo.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">7. Retenção de Dados</Heading>
          <Text>
            Mantemos suas informações pelo tempo necessário para cumprir os propósitos descritos nesta política, salvo quando um período de retenção mais longo for exigido por lei.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">8. Alterações a Esta Política</Heading>
          <Text>
            Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou através de um aviso em nosso site.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading as="h2">9. Contato</Heading>
          <Text>
            Para questões sobre esta política de privacidade, entre em contato conosco através do e-mail disponível em nosso site.
          </Text>
        </section>

        <div className="pt-8 border-t border-grid">
          <Text className="text-sm text-text-secondary">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </div>
      </div>
    </Container>
  );
}
