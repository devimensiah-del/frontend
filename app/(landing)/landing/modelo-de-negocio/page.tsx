"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, Calendar, RefreshCw, Users, Layers, ArrowDownRight } from "lucide-react";

export default function ModeloDeNegocioPage() {
  const t = useTranslations();

  const businessModels = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: t("modelo.model1Title"),
      type: t("modelo.model1Type"),
      desc: t("modelo.model1Desc"),
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: t("modelo.model2Title"),
      type: t("modelo.model2Type"),
      desc: t("modelo.model2Desc"),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("modelo.model3Title"),
      type: t("modelo.model3Type"),
      desc: t("modelo.model3Desc"),
    },
    {
      icon: <Layers className="w-6 h-6" />,
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
      {/* Hero - Split Layout */}
      <Section variant="hero" className="grid lg:grid-cols-12 min-h-[50vh]">
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-r border-grid bg-white/50">
          <div className="mb-8">
            <Eyebrow>{t("modelo.eyebrow")}</Eyebrow>
          </div>
          <Display variant="hero" className="mb-6">
            {t("modelo.title")}
          </Display>
          <Text variant="lead" className="max-w-xl">
            {t("modelo.subtitle")}
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
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Revenue Streams</div>
          </div>
          <div className="flex-1 p-12 flex flex-col justify-end relative">
            <div className="text-6xl font-light mb-2 font-heading text-white">B2B</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Enterprise Focus</div>
          </div>
        </div>
      </Section>

      {/* Business Models - Grid Style */}
      <Section variant="grid" className="divide-x divide-line">
        {businessModels.map((model, index) => (
          <div key={index} className="p-12 hover:bg-surface-paper transition-colors group h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center text-gold-500">
                {model.icon}
              </div>
              <ArrowDownRight className="w-5 h-5 text-line group-hover:text-navy-900 transition-colors" />
            </div>
            <Heading as="h3" variant="subtitle" className="mb-2">
              {model.title}
            </Heading>
            <Text className="text-xs uppercase tracking-[0.15em] text-gold-500 font-medium mb-4">
              {model.type}
            </Text>
            <Text variant="small" className="text-text-secondary leading-relaxed">
              {model.desc}
            </Text>
          </div>
        ))}
      </Section>

      {/* Market Timing - Split Layout */}
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
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left - Title & Promise */}
            <div className="lg:col-span-5">
              <Eyebrow className="text-gold-500 mb-4">Market Timing</Eyebrow>
              <Heading as="h2" className="text-3xl lg:text-4xl text-white mb-6">
                {t("modelo.timingTitle")}
              </Heading>
              <Text className="text-gray-400 mb-8">
                {t("modelo.timingSubtitle")}
              </Text>

              {/* Promise Box - Hero Style */}
              <div className="border-2 border-gold-500 bg-gold-500/10 p-6">
                <Text className="text-gold-500 font-medium text-xs uppercase tracking-[0.15em] mb-2">
                  {t("modelo.promiseLabel")}
                </Text>
                <Text className="text-white text-xl font-light leading-relaxed">
                  {t("modelo.promiseText")}
                </Text>
              </div>
            </div>

            {/* Right - Forces */}
            <div className="lg:col-span-7">
              <div className="space-y-0">
                {marketForces.map((force, index) => (
                  <div
                    key={index}
                    className="p-8 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gold-500 border border-gold-500 px-2 py-1 rounded-full">
                          0{index + 1}
                        </span>
                        <Heading as="h3" className="text-white text-lg font-medium">
                          {force.title}
                        </Heading>
                      </div>
                      <ArrowDownRight className="w-5 h-5 text-white/20 group-hover:text-gold-500 transition-colors" />
                    </div>
                    <Text className="text-gray-400 text-sm pl-12">{force.desc}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="text-center py-8">
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
