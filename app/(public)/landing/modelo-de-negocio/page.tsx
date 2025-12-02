"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, Calendar, RefreshCw, Users, Layers } from "lucide-react";

export default function ModeloDeNegocioPage() {
  const t = useTranslations();

  const businessModels = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: t("modelo.model1Title"),
      type: t("modelo.model1Type"),
      desc: t("modelo.model1Desc"),
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: t("modelo.model2Title"),
      type: t("modelo.model2Type"),
      desc: t("modelo.model2Desc"),
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("modelo.model3Title"),
      type: t("modelo.model3Type"),
      desc: t("modelo.model3Desc"),
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: t("modelo.model4Title"),
      type: t("modelo.model4Type"),
      desc: t("modelo.model4Desc"),
    },
  ];

  const marketForces = [
    {
      title: t("modelo.force1Title"),
      desc: t("modelo.force1Desc"),
    },
    {
      title: t("modelo.force2Title"),
      desc: t("modelo.force2Desc"),
    },
    {
      title: t("modelo.force3Title"),
      desc: t("modelo.force3Desc"),
    },
  ];

  return (
    <div className="[word-break:keep-all]">
      {/* Hero */}
      <Section className="bg-surface-paper py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Eyebrow className="mb-4">{t("modelo.eyebrow")}</Eyebrow>
            <Display variant="hero" className="mb-6">
              {t("modelo.title")}
            </Display>
            <Text variant="lead" className="max-w-2xl mx-auto">
              {t("modelo.subtitle")}
            </Text>
          </div>
        </Container>
      </Section>

      {/* Business Models */}
      <Section className="bg-white py-16">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {businessModels.map((model, index) => (
              <div
                key={index}
                className="border border-line p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-gold-500 mb-4 flex justify-center">{model.icon}</div>
                <Heading as="h3" variant="subtitle" className="mb-2">
                  {model.title}
                </Heading>
                <Text className="text-gold-500 text-sm font-medium mb-3">{model.type}</Text>
                <Text variant="small" className="text-gray-600">
                  {model.desc}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Market Timing */}
      <Section className="bg-navy-900 py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Eyebrow className="text-gold-500 text-center mb-4">Market Timing</Eyebrow>
            <Heading as="h2" className="text-3xl text-white text-center mb-4">
              {t("modelo.timingTitle")}
            </Heading>
            <Text className="text-gray-400 text-center mb-12">
              {t("modelo.timingSubtitle")}
            </Text>

            {/* Promise Box */}
            <div className="bg-gold-500/10 border border-gold-500 p-6 mb-12 text-center">
              <Text className="text-gold-500 font-medium text-sm uppercase mb-2">
                {t("modelo.promiseLabel")}
              </Text>
              <Text className="text-white text-lg">{t("modelo.promiseText")}</Text>
            </div>

            {/* Forces */}
            <div className="grid md:grid-cols-3 gap-6">
              {marketForces.map((force, index) => (
                <div key={index} className="border border-white/10 p-6 bg-white/5">
                  <Heading as="h3" className="text-white text-lg mb-3">
                    {force.title}
                  </Heading>
                  <Text className="text-gray-400 text-sm">{force.desc}</Text>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-surface-paper py-16">
        <Container>
          <div className="text-center">
            <Heading as="h2" className="text-2xl mb-6">
              {t("modelo.ctaTitle")}
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
