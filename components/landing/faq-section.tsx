'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Quanto tempo leva para receber o relatório?',
    answer: 'Garantimos a entrega em até 24 horas após o pagamento ser confirmado. Na maioria dos casos, conseguimos entregar em menos de 18 horas.',
  },
  {
    question: 'Quais dados vocês coletam?',
    answer: 'Coletamos apenas dados públicos disponíveis legalmente: análise de website, redes sociais, LinkedIn, Google Meu Negócio, dados públicos do governo brasileiro (CNPJ, etc). Nunca acessamos informações privadas ou hackeamos sistemas.',
  },
  {
    question: 'O que está incluído no relatório?',
    answer: 'O relatório inclui: análise completa de presença digital, benchmarking com concorrentes, oportunidades de mercado, análise SWOT, recomendações estratégicas e plano de ação prático. Tudo em formato PDF profissional e acesso ao dashboard online.',
  },
  {
    question: 'Como funciona a garantia de 7 dias?',
    answer: 'Se você não ficar satisfeito com a qualidade do relatório, basta nos contatar em até 7 dias após a entrega. Analisaremos seu feedback e, se pertinente, faremos melhorias ou devolvemos 100% do seu investimento.',
  },
  {
    question: 'Posso solicitar relatórios para múltiplas empresas?',
    answer: 'Sim! Cada relatório custa R$ 890. Para volumes maiores (5+ relatórios), oferecemos descontos especiais. Entre em contato para negociar condições customizadas.',
  },
  {
    question: 'O relatório é confidencial?',
    answer: 'Absolutamente. Todos os dados e insights gerados são confidenciais e pertencem exclusivamente a você. Não compartilhamos nem utilizamos seus dados para outros fins. Você pode compartilhar o relatório com membros da sua equipe através do nosso sistema seguro.',
  },
  {
    question: 'Preciso fornecer acesso às minhas contas?',
    answer: 'Não! Trabalhamos apenas com dados públicos. Você não precisa fornecer senhas, acessos ou informações privadas. O formulário solicita apenas URLs públicas e informações básicas da empresa.',
  },
  {
    question: 'Qual a diferença entre a análise da IA e a revisão humana?',
    answer: 'A IA coleta e processa grandes volumes de dados em minutos, identificando padrões e tendências. O analista humano então revisa tudo, adiciona contexto estratégico, valida as informações e cria recomendações práticas baseadas em experiência real de mercado.',
  },
];

export function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Tudo o que você precisa saber sobre nosso serviço
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 hover:border-primary/30 transition-colors bg-card"
              >
                <AccordionTrigger className="hover:no-underline text-left">
                  <span className="font-semibold text-lg pr-4 text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-primary/10 rounded-lg p-8">
            <h3 className="text-xl font-bold text-foreground mb-2">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-4">
              Nossa equipe está pronta para ajudar
            </p>
            <a
              href="mailto:contato@imensiah.com"
              className="text-primary hover:text-primary/80 font-semibold hover:underline"
            >
              contato@imensiah.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
