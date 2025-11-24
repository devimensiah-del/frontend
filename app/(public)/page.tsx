"use client";

import { SubmissionForm } from "./_components/submission-form";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { ProcessStep, MetricCard, TestimonialCard, FounderCard } from "@/components/editorial/Cards";

export default function EditorialPage() {
  return (
    <>
      {/* --- HERO: The Manifesto Grid --- */}
      <Section variant="hero" className="grid lg:grid-cols-12">
        {/* Left: The Promise */}
        <div className="lg:col-span-7 p-12 lg:p-24 flex flex-col justify-center border-r border-grid relative bg-white/50">
          <div className="absolute top-12 left-12">
            <Eyebrow>Inteligência Estratégica</Eyebrow>
          </div>

          <Display variant="hero" className="mb-10">
            Torne sua empresa <br />
            <span className="text-gold-500 italic serif-touch">imensa</span> com IA + IH.
          </Display>

          <Text variant="lead" className="max-w-lg mb-12">
            Unimos a velocidade da Inteligência Artificial com a sabedoria da Inteligência Humana. Transformamos dados em decisões estratégicas em 48 horas.
          </Text>

          <div className="flex flex-wrap gap-6">
            <Button asChild variant="architect">
              <a href="#diagnostico">Iniciar Análise</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>

        {/* Right: The "Metrics" Visual (Abstract) */}
        <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
          {/* Decorative Background Map/Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Top Statistic */}
          <MetricCard value="11" label="Frameworks de Análise" />

          {/* Bottom Statistic */}
          <MetricCard value="48h" label="Tempo de Entrega" highlight />
        </div>
      </Section>

      {/* --- HOW IT WORKS: The Blueprint --- */}
      <Section variant="grid">
        {[
          {
            num: "01",
            title: "Ingestão",
            desc: "Compartilhe links e documentos. Nossa IA enriquece e estrutura os dados automaticamente."
          },
          {
            num: "02",
            title: "Processamento Híbrido",
            desc: "Algoritmos aplicam Porter e PESTEL. Consultores seniores validam a intuição estratégica."
          },
          {
            num: "03",
            title: "Decisão",
            desc: "Receba um relatório executivo pragmático. Insights claros, prontos para o conselho."
          }
        ].map((step, i) => (
          <ProcessStep
            key={i}
            stepNumber={step.num}
            title={step.title}
            description={step.desc}
          />
        ))}
      </Section>

      {/* --- THE FORM SECTION --- */}
      <Section id="diagnostico" className="flex flex-col items-center justify-center bg-surface-paper">
        <Container className="w-full flex justify-center">
            <div className="max-w-3xl w-full">
            {/* Render the dedicated form component here */}
            <SubmissionForm />
            </div>
        </Container>
      </Section>

      {/* --- TESTIMONIALS: Quem confia na IMENSIAH --- */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <Eyebrow className="mb-4">Quem confia na IMENSIAH</Eyebrow>
            <Heading variant="section">
              Empresas que já transformaram suas decisões estratégicas
            </Heading>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              quote="Renato alia expertise em conselhos com IA estratégica — impulsionando o futuro da governança das empresas com clareza e impacto. Recomendo."
              author="Felipe Figueira"
              role="Coordenador Geral das Comissões Temáticas"
              company="Board Academy"
            />

            <TestimonialCard
              quote="Renato combina profunda experiência com IA aplicada à estratégia — transformando decisões da Associação Despertar. Clareza, ritmo e resultados. Recomendo com convicção."
              author="Rodolfo Villela Marino"
              role="Presidente"
              company="Associação Despertar"
            />
          </div>
        </Container>
      </Section>

      {/* --- ABOUT US: Sobre nós --- */}
      <Section variant="dark">
        <Container>
          <div className="text-center mb-16">
            <Eyebrow className="mb-4">Sobre nós</Eyebrow>
            <Heading as="h2" className="text-3xl lg:text-5xl font-medium text-white">
              Conheça os fundadores que unem décadas de experiência com visão de futuro
            </Heading>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            <FounderCard
              name="Renato de Faria e Almeida Prado"
              role="Cofundador da IMENSIAH"
              bio="Com quase 30 anos de trajetória em conselhos, inovação e liderança com propósito, Renato combina uma visão estratégica rara com a capacidade de traduzir complexidade em ação. Cofundador da 10xMentorAI e da IMENSIAH, atua na interseção entre governança e inteligência artificial, ajudando líderes a aplicarem tecnologia com sabedoria — e não apenas com velocidade. Sua missão é clara: tornar empresas e lideranças mais humanas, sustentáveis e exponenciais, unindo experiência, intuição e IA em um mesmo fluxo de decisão inteligente."
            />

            <FounderCard
              name="Daniela de Luca Brandão"
              role="Cofundadora da IMENSIAH"
              bio="Especialista em estratégia, gestão, arquitetura de processos e finanças, Daniela é a força analítica e criativa por trás da IMENSIAH. Sua trajetória une raciocínio estruturado e pensamento crítico com uma abordagem humana e inovadora para resolver problemas complexos. Na IMENSIAH, lidera a integração entre eficiência operacional e inteligência estratégica, garantindo que cada solução seja precisa, prática e orientada a resultados reais."
            />

            <FounderCard
              name="Renato DAP"
              role="Cofundador da IMENSIAH"
              bio="Engenheiro e desenvolvedor especializado em inteligência artificial e sistemas full-stack. Atualmente cursando Ciência da Computação com foco em Deep Learning e AI Research na Rose-Hulman Institute of Technology, combina expertise técnica em IA (GPT-4, RAG, PyTorch) com habilidades práticas de desenvolvimento (Next.js, React Native, Golang). Criador de soluções inovadoras que unem tecnologia e impacto real, desde assistentes culinários com comando de voz até plataformas de fitness adaptativas com IA. Na IMENSIAH, lidera a implementação técnica das soluções de inteligência artificial, garantindo que a tecnologia sirva à estratégia com excelência e inovação."
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
