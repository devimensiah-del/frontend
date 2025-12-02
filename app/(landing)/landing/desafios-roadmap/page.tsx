"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle, ArrowDownRight } from "lucide-react";

export default function DesafiosRoadmapPage() {
  const t = useTranslations();

  const capabilities = [
    {
      title: t("desafios.cap1Title"),
      items: [
        t("desafios.cap1Item1"),
        t("desafios.cap1Item2"),
        t("desafios.cap1Item3"),
        t("desafios.cap1Item4"),
      ],
      validity: t("desafios.cap1Validity"),
    },
    {
      title: t("desafios.cap2Title"),
      items: [
        t("desafios.cap2Item1"),
        t("desafios.cap2Item2"),
        t("desafios.cap2Item3"),
      ],
      validity: t("desafios.cap2Validity"),
    },
    {
      title: t("desafios.cap3Title"),
      items: [
        t("desafios.cap3Item1"),
        t("desafios.cap3Item2"),
        t("desafios.cap3Item3"),
        t("desafios.cap3Item4"),
      ],
      validity: t("desafios.cap3Validity"),
    },
    {
      title: t("desafios.cap4Title"),
      items: [
        t("desafios.cap4Item1"),
        t("desafios.cap4Item2"),
        t("desafios.cap4Item3"),
      ],
      validity: t("desafios.cap4Validity"),
    },
  ];

  const limitations = [
    t("desafios.limit1"),
    t("desafios.limit2"),
    t("desafios.limit3"),
    t("desafios.limit4"),
  ];

  const dataCritical = [
    t("desafios.dataCritical1"),
    t("desafios.dataCritical2"),
    t("desafios.dataCritical3"),
    t("desafios.dataCritical4"),
    t("desafios.dataCritical5"),
  ];

  const dataUseful = [
    t("desafios.dataUseful1"),
    t("desafios.dataUseful2"),
    t("desafios.dataUseful3"),
    t("desafios.dataUseful4"),
  ];

  const dataNoise = [
    t("desafios.dataNoise1"),
    t("desafios.dataNoise2"),
    t("desafios.dataNoise3"),
    t("desafios.dataNoise4"),
  ];

  const roadmapPhases = [
    {
      phase: t("desafios.phase1"),
      title: t("desafios.phase1Title"),
      items: [t("desafios.phase1Item1"), t("desafios.phase1Item2"), t("desafios.phase1Item3")],
      current: true,
    },
    {
      phase: t("desafios.phase2"),
      title: t("desafios.phase2Title"),
      items: [t("desafios.phase2Item1"), t("desafios.phase2Item2"), t("desafios.phase2Item3")],
    },
    {
      phase: t("desafios.phase3"),
      title: t("desafios.phase3Title"),
      items: [t("desafios.phase3Item1"), t("desafios.phase3Item2"), t("desafios.phase3Item3")],
    },
    {
      phase: t("desafios.phase4"),
      title: t("desafios.phase4Title"),
      items: [t("desafios.phase4Item1"), t("desafios.phase4Item2"), t("desafios.phase4Item3")],
    },
  ];

  return (
    <div className="[word-break:keep-all]">
      {/* Hero - Split Layout */}
      <Section variant="hero" className="grid lg:grid-cols-12 min-h-[50vh]">
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-r border-grid bg-white/50">
          <div className="mb-8">
            <Eyebrow>{t("desafios.eyebrow")}</Eyebrow>
          </div>
          <Display variant="hero" className="mb-6">
            {t("desafios.title")}
          </Display>
          <Text variant="lead" className="max-w-xl">
            {t("desafios.subtitle")}
          </Text>
        </div>
        <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Metrics */}
          <div className="flex-1 p-12 flex flex-col justify-end border-b border-white/10 relative">
            <div className="text-6xl font-light mb-2 font-heading text-gold-500">4</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Capabilities</div>
          </div>
          <div className="flex-1 p-12 flex flex-col justify-end relative">
            <div className="text-6xl font-light mb-2 font-heading text-white">2025</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Roadmap</div>
          </div>
        </div>
      </Section>

      {/* What We Solve Today - Grid Style */}
      <Section variant="grid" className="divide-x divide-line">
        {capabilities.map((cap, index) => (
          <div key={index} className="p-12 hover:bg-surface-paper transition-colors group h-full">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold text-gold-500 border border-gold-500 px-2 py-1 rounded-full">
                0{index + 1}
              </span>
              <ArrowDownRight className="w-5 h-5 text-line group-hover:text-navy-900 transition-colors" />
            </div>
            <Heading as="h3" variant="subtitle" className="mb-4">
              {cap.title}
            </Heading>
            <ul className="space-y-2 mb-6">
              {cap.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-line">
              <Text className="text-xs uppercase tracking-[0.15em] text-gold-600 font-medium">
                {cap.validity}
              </Text>
            </div>
          </div>
        ))}
      </Section>

      {/* Limitations - Dark Section */}
      <Section variant="dark" className="relative overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <Container className="relative">
          <div className="max-w-4xl mx-auto">
            <Eyebrow className="text-gold-500 mb-4">{t("desafios.limitTitle")}</Eyebrow>
            <Heading as="h2" className="text-2xl lg:text-3xl text-white mb-4">
              {t("desafios.limitSubtitle")}
            </Heading>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {limitations.map((limit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <Text className="text-gray-300 text-sm">{limit}</Text>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Data Vision - Asymmetric Layout */}
      <Section className="bg-white border-b border-grid">
        <Container>
          <div className="text-center mb-12">
            <Eyebrow className="mb-4">Data Strategy</Eyebrow>
            <Heading variant="section">{t("desafios.dataTitle")}</Heading>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Critical - Larger */}
            <div className="lg:col-span-5 border-2 border-gold-500 p-8 bg-gold-500/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <Text className="font-bold text-navy-900 uppercase text-xs tracking-[0.15em]">
                  {t("desafios.dataCriticalLabel")}
                </Text>
              </div>
              <Text variant="small" className="text-text-secondary mb-6">
                {t("desafios.dataCriticalDesc")}
              </Text>
              <ul className="space-y-3">
                {dataCritical.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-navy-900">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful + Noise - Stacked */}
            <div className="lg:col-span-7 space-y-6">
              {/* Useful */}
              <div className="border border-line p-6 hover:bg-surface-paper transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </div>
                  <Text className="font-bold text-navy-900 uppercase text-xs tracking-[0.15em]">
                    {t("desafios.dataUsefulLabel")}
                  </Text>
                </div>
                <Text variant="small" className="text-text-secondary mb-4">
                  {t("desafios.dataUsefulDesc")}
                </Text>
                <div className="flex flex-wrap gap-2">
                  {dataUseful.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-green-500/10 text-green-700 text-xs rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Noise */}
              <div className="border border-line bg-gray-50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <XCircle className="w-3 h-3 text-gray-500" />
                  </div>
                  <Text className="font-bold text-navy-900 uppercase text-xs tracking-[0.15em]">
                    {t("desafios.dataNoiseLabel")}
                  </Text>
                </div>
                <Text variant="small" className="text-text-tertiary mb-4">
                  {t("desafios.dataNoiseDesc")}
                </Text>
                <div className="flex flex-wrap gap-2">
                  {dataNoise.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-200 text-gray-500 text-xs rounded-full line-through">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Roadmap - Timeline Style */}
      <Section variant="dark" className="relative overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <Container className="relative">
          <div className="text-center mb-12">
            <Eyebrow className="text-gold-500 mb-4">Evolution</Eyebrow>
            <Heading as="h2" className="text-3xl lg:text-4xl text-white">
              {t("desafios.roadmapTitle")}
            </Heading>
          </div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-0">
              {roadmapPhases.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {index < roadmapPhases.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-white/20" />
                  )}

                  <div
                    className={`p-6 border ${
                      phase.current
                        ? "border-gold-500 bg-gold-500/10"
                        : "border-white/10 bg-white/5"
                    } hover:bg-white/10 transition-colors relative`}
                  >
                    {/* Phase Number */}
                    <div className={`w-12 h-12 flex items-center justify-center text-2xl font-light mb-4 ${
                      phase.current ? "bg-gold-500 text-navy-900" : "bg-white/10 text-white"
                    }`}>
                      {index + 1}
                    </div>

                    <Text className="text-gold-500 text-xs font-medium uppercase tracking-[0.15em] mb-2">
                      {phase.phase}
                    </Text>
                    <Heading as="h3" className="text-white text-base font-semibold mb-4 break-normal hyphens-none">
                      {phase.title}
                    </Heading>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-gold-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {phase.current && (
                      <div className="mt-4 pt-4 border-t border-gold-500/30">
                        <span className="text-xs uppercase tracking-[0.15em] text-gold-500">Current Phase</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="text-center py-8">
            <Button asChild variant="architect" size="lg">
              <Link href="/landing#pilot">
                {t("landing.heroCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
