"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
      {/* Hero */}
      <Section className="bg-surface-paper py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Eyebrow className="mb-4">{t("metodologia.eyebrow")}</Eyebrow>
            <Display variant="hero" className="mb-6">
              {t("metodologia.title")}
            </Display>
            <Text variant="lead" className="max-w-2xl mx-auto">
              {t("metodologia.subtitle")}
            </Text>
          </div>
        </Container>
      </Section>

      {/* Pipeline Steps */}
      <Section className="bg-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {pipelineSteps.map((step, index) => (
              <div
                key={index}
                className="border border-line p-6 md:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-navy-900 text-white flex items-center justify-center text-xl font-bold">
                    {step.num}
                  </div>
                  <div>
                    <Heading as="h3" variant="subtitle" className="text-xl mb-2">
                      {step.title}
                    </Heading>
                    <Text className="text-gray-600">{step.desc}</Text>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Outputs */}
                  <div className="bg-surface-paper p-4 rounded">
                    <Text className="font-medium text-navy-900 mb-3 text-sm uppercase tracking-wide">
                      {t("metodologia.outputsLabel")}
                    </Text>
                    <ul className="space-y-2">
                      {step.outputs.map((output, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Checkpoints */}
                  <div className="bg-navy-900/5 p-4 rounded">
                    <Text className="font-medium text-navy-900 mb-3 text-sm uppercase tracking-wide">
                      {t("metodologia.checkpointLabel")}
                    </Text>
                    <ul className="space-y-2">
                      {step.checkpoints.map((checkpoint, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-gold-500">●</span>
                          {checkpoint}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-navy-900 py-16">
        <Container>
          <div className="text-center">
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
