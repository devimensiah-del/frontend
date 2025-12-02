"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

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
      {/* Hero */}
      <Section className="bg-surface-paper py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Eyebrow className="mb-4">{t("desafios.eyebrow")}</Eyebrow>
            <Display variant="hero" className="mb-6">
              {t("desafios.title")}
            </Display>
            <Text variant="lead" className="max-w-2xl mx-auto">
              {t("desafios.subtitle")}
            </Text>
          </div>
        </Container>
      </Section>

      {/* What We Solve Today */}
      <Section className="bg-white py-16">
        <Container>
          <Heading variant="section" className="text-center mb-12">
            {t("desafios.solveTitle")}
          </Heading>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {capabilities.map((cap, index) => (
              <div key={index} className="border border-line p-6 hover:shadow-lg transition-shadow">
                <Heading as="h3" variant="subtitle" className="mb-4">
                  {cap.title}
                </Heading>
                <ul className="space-y-2 mb-4">
                  {cap.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Text variant="small" className="text-gold-600 font-medium">
                  {cap.validity}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Limitations */}
      <Section className="bg-surface-paper py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading variant="section" className="text-center mb-4">
              {t("desafios.limitTitle")}
            </Heading>
            <Text className="text-center text-gray-600 mb-8">
              {t("desafios.limitSubtitle")}
            </Text>
            <div className="grid sm:grid-cols-2 gap-4">
              {limitations.map((limit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white border border-line"
                >
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <Text variant="small" className="text-gray-600">
                    {limit}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Data Vision */}
      <Section className="bg-white py-16">
        <Container>
          <Heading variant="section" className="text-center mb-12">
            {t("desafios.dataTitle")}
          </Heading>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Critical */}
            <div className="border-2 border-gold-500 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-gold-500" />
                <Text className="font-bold text-navy-900 uppercase text-sm">
                  {t("desafios.dataCriticalLabel")}
                </Text>
              </div>
              <Text variant="small" className="text-gray-500 mb-4">
                {t("desafios.dataCriticalDesc")}
              </Text>
              <ul className="space-y-2">
                {dataCritical.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful */}
            <div className="border border-line p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <Text className="font-bold text-navy-900 uppercase text-sm">
                  {t("desafios.dataUsefulLabel")}
                </Text>
              </div>
              <Text variant="small" className="text-gray-500 mb-4">
                {t("desafios.dataUsefulDesc")}
              </Text>
              <ul className="space-y-2">
                {dataUseful.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Noise */}
            <div className="border border-line bg-gray-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-gray-400" />
                <Text className="font-bold text-navy-900 uppercase text-sm">
                  {t("desafios.dataNoiseLabel")}
                </Text>
              </div>
              <Text variant="small" className="text-gray-500 mb-4">
                {t("desafios.dataNoiseDesc")}
              </Text>
              <ul className="space-y-2">
                {dataNoise.map((item, i) => (
                  <li key={i} className="text-sm text-gray-400">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Roadmap */}
      <Section className="bg-navy-900 py-16">
        <Container>
          <Heading as="h2" className="text-3xl text-white text-center mb-12">
            {t("desafios.roadmapTitle")}
          </Heading>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roadmapPhases.map((phase, index) => (
              <div
                key={index}
                className={`p-6 border ${
                  phase.current
                    ? "border-gold-500 bg-gold-500/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <Text className="text-gold-500 text-sm font-medium mb-2">{phase.phase}</Text>
                <Heading as="h3" className="text-white text-base font-semibold mb-4 break-normal hyphens-none">
                  {phase.title}
                </Heading>
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-400">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-white py-16">
        <Container>
          <div className="text-center">
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
