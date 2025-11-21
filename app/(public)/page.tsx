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
    </>
  );
}