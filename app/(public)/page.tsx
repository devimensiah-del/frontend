"use client";

import { ArrowRight, Play, ArrowDownRight } from "lucide-react";
import { SubmissionForm } from "./_components/submission-form";

export default function EditorialPage() {
  return (
    <>
      {/* --- HERO: The Manifesto Grid --- */}
      <section className="grid lg:grid-cols-12 min-h-[80vh] border-b border-grid">

        {/* Left: The Promise */}
        <div className="lg:col-span-7 p-12 lg:p-24 flex flex-col justify-center border-r border-grid relative bg-white/50">
          <div className="absolute top-12 left-12 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-500)]">
            Inteligência Estratégica
          </div>

          <h1 className="text-5xl lg:text-7xl font-medium leading-[1.1] mb-10">
            Torne sua empresa <br />
            <span className="text-[var(--gold-500)] italic serif-touch">imensa</span> com IA + IH.
          </h1>

          <p className="text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed mb-12 font-light">
            Unimos a velocidade da Inteligência Artificial com a sabedoria da Inteligência Humana. Transformamos dados em decisões estratégicas em 48 horas.
          </p>

          <div className="flex flex-wrap gap-6">
            <a href="#diagnostico" className="btn-architect">
              Iniciar Análise
            </a>
            <a href="/login" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest px-6 py-4 border border-[var(--line-color)] hover:bg-white transition-colors">
              Login
            </a>
          </div>
        </div>

        {/* Right: The "Metrics" Visual (Abstract) */}
        <div className="lg:col-span-5 bg-[var(--navy-900)] text-white flex flex-col relative overflow-hidden">
          {/* Decorative Background Map/Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Top Statistic */}
          <div className="flex-1 p-12 flex flex-col justify-end border-b border-white/10">
            <div className="text-6xl font-light mb-2 font-heading">11</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Frameworks de Análise</div>
          </div>

          {/* Bottom Statistic */}
          <div className="flex-1 p-12 flex flex-col justify-end">
            <div className="text-6xl font-light mb-2 font-heading text-[var(--gold-500)]">48h</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Tempo de Entrega</div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS: The Blueprint --- */}
      <section className="grid md:grid-cols-3 divide-x divide-[var(--line-color)] border-b border-grid bg-white">
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
          <div key={i} className="p-12 hover:bg-[var(--surface-paper)] transition-colors group">
            <div className="flex justify-between items-start mb-8">
              <span className="text-xs font-bold text-[var(--gold-500)] border border-[var(--gold-500)] px-2 py-1 rounded-full">
                PASSO {step.num}
              </span>
              <ArrowDownRight className="w-5 h-5 text-[var(--line-color)] group-hover:text-[var(--navy-900)] transition-colors" />
            </div>
            <h3 className="text-xl font-medium mb-4">{step.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </section>

      {/* --- THE FORM SECTION --- */}
      <section id="diagnostico" className="p-12 lg:p-24 flex flex-col items-center justify-center bg-[var(--surface-paper)]">
        <div className="max-w-3xl w-full">
          {/* Render the dedicated form component here */}
          <SubmissionForm />
        </div>
      </section>

      {/* --- TESTIMONIALS: Quem confia na IMENSIAH --- */}
      <section className="border-b border-grid bg-white">
        <div className="p-12 lg:p-24">
          <div className="text-center mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-500)] mb-4">
              Quem confia na IMENSIAH
            </div>
            <h2 className="text-3xl lg:text-5xl font-medium">
              Empresas que já transformaram suas decisões estratégicas
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 - Felipe Figueira */}
            <div className="p-8 border border-[var(--line-color)] hover:bg-[var(--surface-paper)] transition-colors group">
              <div className="mb-6">
                <p className="text-lg leading-relaxed text-[var(--text-primary)] italic">
                  "Renato alia expertise em conselhos com IA estratégica — impulsionando o futuro da governança das empresas com clareza e impacto. Recomendo."
                </p>
              </div>
              <div className="border-t border-[var(--line-color)] pt-6">
                <div className="font-medium text-[var(--navy-900)] mb-1">Felipe Figueira</div>
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-1">
                  Coordenador Geral das Comissões Temáticas
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--gold-500)]">
                  Board Academy
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Rodolfo Villela Marino */}
            <div className="p-8 border border-[var(--line-color)] hover:bg-[var(--surface-paper)] transition-colors group">
              <div className="mb-6">
                <p className="text-lg leading-relaxed text-[var(--text-primary)] italic">
                  "Renato combina profunda experiência com IA aplicada à estratégia — transformando decisões da Associação Despertar. Clareza, ritmo e resultados. Recomendo com convicção."
                </p>
              </div>
              <div className="border-t border-[var(--line-color)] pt-6">
                <div className="font-medium text-[var(--navy-900)] mb-1">Rodolfo Villela Marino</div>
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-1">
                  Presidente
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--gold-500)]">
                  Associação Despertar
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT US: Sobre nós --- */}
      <section className="border-b border-grid bg-[var(--navy-900)] text-white">
        <div className="p-12 lg:p-24">
          <div className="text-center mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-500)] mb-4">
              Sobre nós
            </div>
            <h2 className="text-3xl lg:text-5xl font-medium text-white">
              Conheça os fundadores que unem décadas de experiência com visão de futuro
            </h2>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {/* Founder 1 - Renato de Faria e Almeida Prado */}
            <div className="grid lg:grid-cols-12 gap-8 border border-white/10 p-8 hover:bg-white/5 transition-colors">
              <div className="lg:col-span-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-medium text-white mb-2">Renato de Faria e Almeida Prado</h3>
                  <div className="text-xs uppercase tracking-[0.15em] text-[var(--gold-500)]">
                    Cofundador da IMENSIAH
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-relaxed text-gray-300">
                  Com quase 30 anos de trajetória em conselhos, inovação e liderança com propósito, Renato combina uma visão estratégica rara com a capacidade de traduzir complexidade em ação. Cofundador da 10xMentorAI e da IMENSIAH, atua na interseção entre governança e inteligência artificial, ajudando líderes a aplicarem tecnologia com sabedoria — e não apenas com velocidade. Sua missão é clara: tornar empresas e lideranças mais humanas, sustentáveis e exponenciais, unindo experiência, intuição e IA em um mesmo fluxo de decisão inteligente.
                </p>
              </div>
            </div>

            {/* Founder 2 - Daniela de Luca Brandão */}
            <div className="grid lg:grid-cols-12 gap-8 border border-white/10 p-8 hover:bg-white/5 transition-colors">
              <div className="lg:col-span-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-medium text-white mb-2">Daniela de Luca Brandão</h3>
                  <div className="text-xs uppercase tracking-[0.15em] text-[var(--gold-500)]">
                    Cofundadora da IMENSIAH
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-relaxed text-gray-300">
                  Especialista em estratégia, gestão, arquitetura de processos e finanças, Daniela é a força analítica e criativa por trás da IMENSIAH. Sua trajetória une raciocínio estruturado e pensamento crítico com uma abordagem humana e inovadora para resolver problemas complexos. Na IMENSIAH, lidera a integração entre eficiência operacional e inteligência estratégica, garantindo que cada solução seja precisa, prática e orientada a resultados reais.
                </p>
              </div>
            </div>

            {/* Founder 3 - Renato DAP */}
            <div className="grid lg:grid-cols-12 gap-8 border border-white/10 p-8 hover:bg-white/5 transition-colors">
              <div className="lg:col-span-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-medium text-white mb-2">Renato DAP</h3>
                  <div className="text-xs uppercase tracking-[0.15em] text-[var(--gold-500)]">
                    Cofundador da IMENSIAH
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-relaxed text-gray-300">
                  Engenheiro e desenvolvedor especializado em inteligência artificial e sistemas full-stack. Atualmente cursando Ciência da Computação com foco em Deep Learning e AI Research na Rose-Hulman Institute of Technology, combina expertise técnica em IA (GPT-4, RAG, PyTorch) com habilidades práticas de desenvolvimento (Next.js, React Native, Golang). Criador de soluções inovadoras que unem tecnologia e impacto real, desde assistentes culinários com comando de voz até plataformas de fitness adaptativas com IA. Na IMENSIAH, lidera a implementação técnica das soluções de inteligência artificial, garantindo que a tecnologia sirva à estratégia com excelência e inovação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}