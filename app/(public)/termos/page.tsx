"use client";

import { Heading, Text } from "@/components/ui/Typography";
import { Container } from "@/components/ui/Grid";

export default function TermosPage() {
  return (
    <Container className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Heading level={1} className="mb-8">
          Termos de Serviço
        </Heading>

        <section className="space-y-4">
          <Heading level={2}>1. Aceitação dos Termos</Heading>
          <Text>
            Ao acessar e utilizar nossos serviços de diagnóstico estratégico, você concorda com estes termos de serviço. Se não concordar, não utilize nossos serviços.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>2. Descrição dos Serviços</Heading>
          <Text>
            Fornecemos serviços de consultoria estratégica híbrida (IA + IH), incluindo análise de negócios, diagnósticos empresariais e relatórios executivos personalizados.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>3. Uso dos Serviços</Heading>
          <Text>
            Você concorda em fornecer informações precisas e completas ao solicitar nossos serviços. É responsável por manter a confidencialidade de suas credenciais de acesso.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>4. Propriedade Intelectual</Heading>
          <Text>
            Todo conteúdo, análises, metodologias e relatórios fornecidos são de propriedade exclusiva da IMENSIAH. Você recebe uma licença limitada para uso interno dos relatórios entregues.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>5. Confidencialidade</Heading>
          <Text>
            Tratamos todas as informações fornecidas com estrita confidencialidade. Não compartilhamos seus dados comerciais com terceiros sem seu consentimento expresso.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>6. Limitação de Responsabilidade</Heading>
          <Text>
            Nossos serviços são fornecidos "como estão". Não garantimos resultados específicos de negócio. Nossa responsabilidade é limitada ao valor pago pelos serviços contratados.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>7. Pagamento e Reembolso</Heading>
          <Text>
            Os pagamentos devem ser efetuados conforme acordado no momento da contratação. Políticas de reembolso são aplicadas caso a caso, considerando o trabalho já realizado.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>8. Prazo de Entrega</Heading>
          <Text>
            Nos esforçamos para entregar relatórios em até 24 horas úteis. Prazos específicos serão acordados com cada cliente conforme a complexidade do projeto.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>9. Rescisão</Heading>
          <Text>
            Qualquer parte pode rescindir o acordo mediante notificação prévia. Trabalhos em andamento serão cobrados proporcionalmente ao esforço realizado.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>10. Modificações dos Termos</Heading>
          <Text>
            Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas com antecedência razoável.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>11. Lei Aplicável</Heading>
          <Text>
            Estes termos são regidos pelas leis brasileiras. Disputas serão resolvidas no foro da comarca do domicílio do contratante.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2}>12. Contato</Heading>
          <Text>
            Para questões sobre estes termos de serviço, entre em contato conosco através dos canais disponíveis em nosso site.
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
