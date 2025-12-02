"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, CheckCircle2, ArrowDownRight } from "lucide-react";

export default function MetodologiaPage() {
  const t = useTranslations();

  const pipelineSteps = [
    {
      num: "0",
      title: t("metodologia.step0Title"),
      desc: t("metodologia.step0Desc"),
      outputs: [
        t("metodologia.step0Output1"),
        t("metodologia.step0Output2"),
        t("metodologia.step0Output3"),
        t("metodologia.step0Output4"),
      ],
      checkpoints: [
        t("metodologia.step0Check1"),
        t("metodologia.step0Check2"),
        t("metodologia.step0Check3"),
      ],
    },
    {
      num: "1",
      title: "PESTEL Analysis",
      desc: t("metodologia.step1Desc"),
      outputs: [
        t("metodologia.step1Output1"),
        t("metodologia.step1Output2"),
        t("metodologia.step1Output3"),
        t("metodologia.step1Output4"),
      ],
      checkpoints: [
        t("metodologia.step1Check1"),
        t("metodologia.step1Check2"),
        t("metodologia.step1Check3"),
      ],
    },
    {
      num: "2",
      title: "Porter's 5 Forces+",
      desc: t("metodologia.step2Desc"),
      outputs: [
        t("metodologia.step2Output1"),
        t("metodologia.step2Output2"),
        t("metodologia.step2Output3"),
      ],
      checkpoints: [
        t("metodologia.step2Check1"),
        t("metodologia.step2Check2"),
        t("metodologia.step2Check3"),
      ],
    },
    {
      num: "3",
      title: t("metodologia.step3Title"),
      desc: t("metodologia.step3Desc"),
      outputs: [
        t("metodologia.step3Output1"),
        t("metodologia.step3Output2"),
        t("metodologia.step3Output3"),
        t("metodologia.step3Output4"),
      ],
      checkpoints: [
        t("metodologia.step3Check1"),
        t("metodologia.step3Check2"),
        t("metodologia.step3Check3"),
      ],
    },
    {
      num: "4",
      title: t("metodologia.step4Title"),
      desc: t("metodologia.step4Desc"),
      outputs: [
        t("metodologia.step4Output1"),
        t("metodologia.step4Output2"),
        t("metodologia.step4Output3"),
        t("metodologia.step4Output4"),
      ],
      checkpoints: [
        t("metodologia.step4Check1"),
        t("metodologia.step4Check2"),
        t("metodologia.step4Check3"),
        t("metodologia.step4Check4"),
      ],
    },
    {
      num: "5",
      title: "TAM / SAM / SOM",
      desc: t("metodologia.step5Desc"),
      outputs: [
        t("metodologia.step5Output1"),
        t("metodologia.step5Output2"),
        t("metodologia.step5Output3"),
        t("metodologia.step5Output4"),
      ],
      checkpoints: [
        t("metodologia.step5Check1"),
        t("metodologia.step5Check2"),
        t("metodologia.step5Check3"),
      ],
    },
    {
      num: "6",
      title: "Blue Ocean Strategy",
      desc: t("metodologia.step6Desc"),
      outputs: [
        t("metodologia.step6Output1"),
        t("metodologia.step6Output2"),
        t("metodologia.step6Output3"),
      ],
      checkpoints: [
        t("metodologia.step6Check1"),
        t("metodologia.step6Check2"),
        t("metodologia.step6Check3"),
      ],
    },
    {
      num: "7",
      title: "Growth Hacking Loops",
      desc: t("metodologia.step7Desc"),
      outputs: [
        t("metodologia.step7Output1"),
        t("metodologia.step7Output2"),
        t("metodologia.step7Output3"),
        t("metodologia.step7Output4"),
      ],
      checkpoints: [
        t("metodologia.step7Check1"),
        t("metodologia.step7Check2"),
        t("metodologia.step7Check3"),
      ],
    },
    {
      num: "8",
      title: t("metodologia.step8Title"),
      desc: t("metodologia.step8Desc"),
      outputs: [
        t("metodologia.step8Output1"),
        t("metodologia.step8Output2"),
        t("metodologia.step8Output3"),
        t("metodologia.step8Output4"),
      ],
      checkpoints: [
        t("metodologia.step8Check1"),
        t("metodologia.step8Check2"),
        t("metodologia.step8Check3"),
      ],
    },
    {
      num: "9",
      title: t("metodologia.step9Title"),
      desc: t("metodologia.step9Desc"),
      outputs: [
        t("metodologia.step9Output1"),
        t("metodologia.step9Output2"),
        t("metodologia.step9Output3"),
      ],
      checkpoints: [
        t("metodologia.step9Check1"),
        t("metodologia.step9Check2"),
        t("metodologia.step9Check3"),
      ],
    },
    {
      num: "10",
      title: t("metodologia.step10Title"),
      desc: t("metodologia.step10Desc"),
      outputs: [
        t("metodologia.step10Output1"),
        t("metodologia.step10Output2"),
        t("metodologia.step10Output3"),
        t("metodologia.step10Output4"),
      ],
      checkpoints: [
        t("metodologia.step10Check1"),
        t("metodologia.step10Check2"),
        t("metodologia.step10Check3"),
      ],
    },
    {
      num: "11",
      title: "Balanced Scorecard",
      desc: t("metodologia.step11Desc"),
      outputs: [
        t("metodologia.step11Output1"),
        t("metodologia.step11Output2"),
        t("metodologia.step11Output3"),
        t("metodologia.step11Output4"),
      ],
      checkpoints: [
        t("metodologia.step11Check1"),
        t("metodologia.step11Check2"),
        t("metodologia.step11Check3"),
      ],
    },
  ];

  return (
    <div className="[word-break:keep-all]">
      {/* Hero - Split Layout */}
      <Section variant="hero" className="grid lg:grid-cols-12 min-h-[50vh]">
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-r border-grid bg-white/50">
          <div className="mb-8">
            <Eyebrow>{t("metodologia.eyebrow")}</Eyebrow>
          </div>
          <Display variant="hero" className="mb-6">
            {t("metodologia.title")}
          </Display>
          <Text variant="lead" className="max-w-xl">
            {t("metodologia.subtitle")}
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
            <div className="text-6xl font-light mb-2 font-heading text-gold-500">12</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Frameworks</div>
          </div>
          <div className="flex-1 p-12 flex flex-col justify-end relative">
            <div className="text-6xl font-light mb-2 font-heading text-white">48h</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Delivery</div>
          </div>
        </div>
      </Section>

      {/* Pipeline Steps - Editorial Style */}
      <Section className="bg-white border-b border-grid">
        <Container>
          <div className="max-w-5xl mx-auto">
            {pipelineSteps.map((step, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-12 gap-8 py-12 ${
                  index !== pipelineSteps.length - 1 ? "border-b border-line" : ""
                } hover:bg-surface-paper transition-colors group`}
              >
                {/* Step Number - Large */}
                <div className="lg:col-span-2 flex lg:justify-end">
                  <div className="w-16 h-16 bg-navy-900 text-white flex items-center justify-center text-2xl font-light">
                    {step.num}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Heading as="h3" className="text-xl font-medium mb-2">
                        {step.title}
                      </Heading>
                      <Text className="text-text-secondary max-w-2xl">{step.desc}</Text>
                    </div>
                    <ArrowDownRight className="w-5 h-5 text-line group-hover:text-gold-500 transition-colors hidden lg:block" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Outputs */}
                    <div className="border-l-2 border-gold-500 pl-4">
                      <Text className="font-medium text-navy-900 mb-3 text-xs uppercase tracking-[0.15em]">
                        {t("metodologia.outputsLabel")}
                      </Text>
                      <ul className="space-y-2">
                        {step.outputs.map((output, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                            {output}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Checkpoints */}
                    <div className="border-l-2 border-navy-900/20 pl-4">
                      <Text className="font-medium text-navy-900 mb-3 text-xs uppercase tracking-[0.15em]">
                        {t("metodologia.checkpointLabel")}
                      </Text>
                      <ul className="space-y-2">
                        {step.checkpoints.map((checkpoint, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="w-4 h-4 rounded-full border border-gold-500 flex items-center justify-center text-[10px] text-gold-500 mt-0.5 flex-shrink-0">
                              {i + 1}
                            </span>
                            {checkpoint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA - With Grid Pattern */}
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
          <div className="text-center py-12">
            <Heading as="h2" className="text-2xl md:text-3xl text-white mb-6">
              {t("metodologia.ctaTitle")}
            </Heading>
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
