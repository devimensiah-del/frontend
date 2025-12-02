"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "@/lib/i18n/context";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Shield,
  Zap,
  Users,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    challenge: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/#diagnostico";
  };

  const problemCards = [
    { title: t("landing.problem1Title"), desc: t("landing.problem1Desc") },
    { title: t("landing.problem2Title"), desc: t("landing.problem2Desc") },
    { title: t("landing.problem3Title"), desc: t("landing.problem3Desc") },
  ];

  const solutionFeatures = [
    t("landing.solutionFeature1"),
    t("landing.solutionFeature2"),
    t("landing.solutionFeature3"),
    t("landing.solutionFeature4"),
  ];

  const solutionCards = [
    { icon: "frameworks", title: t("landing.card1Title"), value: "11+", desc: t("landing.card1Desc") },
    { icon: "enterprise", title: t("landing.card2Title"), value: "", desc: t("landing.card2Desc") },
    { icon: "speed", title: t("landing.card3Title"), value: "", desc: t("landing.card3Desc") },
    { icon: "hybrid", title: t("landing.card4Title"), value: "", desc: t("landing.card4Desc") },
  ];

  const pipelineSteps = [
    "PESTEL Analysis",
    "Porter's 5 Forces",
    "Benchmarking",
    t("landing.pipelineStep4"),
    "TAM / SAM / SOM",
    "Blue Ocean",
    "Growth Loops",
    t("landing.pipelineStep8"),
    t("landing.pipelineStep9"),
    t("landing.pipelineStep10"),
    "Balanced Scorecard",
    "Risk Assessment",
  ];

  const stats = [
    { value: "48h", label: t("landing.stat1Label"), desc: t("landing.stat1Desc") },
    { value: "10x", label: t("landing.stat2Label"), desc: t("landing.stat2Desc") },
    { value: "100%", label: t("landing.stat3Label"), desc: t("landing.stat3Desc") },
  ];

  const futureIntegrations = [
    t("landing.integration1"),
    t("landing.integration2"),
    t("landing.integration3"),
    t("landing.integration4"),
  ];

  const pilotBenefits = [
    t("landing.benefit1"),
    t("landing.benefit2"),
    t("landing.benefit3"),
  ];

  const icons: Record<string, React.ReactNode> = {
    frameworks: <Layers className="w-8 h-8" />,
    enterprise: <Shield className="w-8 h-8" />,
    speed: <Zap className="w-8 h-8" />,
    hybrid: <Users className="w-8 h-8" />,
  };

  return (
    <div className="[word-break:keep-all]">
      {/* --- HERO SECTION --- */}
      <Section variant="hero" className="grid lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-r border-grid relative bg-white/50">
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
            <Eyebrow>{t("landing.heroEyebrow")}</Eyebrow>
          </div>

          <Display variant="hero" className="mt-12 md:mt-0 mb-4">
            <span className="text-navy-900">{t("landing.heroTitle1")}</span>
            <br />
            <span className="text-gold-500 italic">{t("landing.heroTitle2")}</span>
          </Display>

          <Text className="text-sm text-gray-500 mb-6">
            {t("landing.heroPoweredBy")}{" "}
            <span className="text-gold-500 font-medium">{t("landing.heroPoweredByHighlight")}</span>
          </Text>

          <Text variant="lead" className="max-w-xl mb-8">
            {t("landing.heroDescription")}
          </Text>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button asChild variant="architect" size="lg">
              <a href="#pilot">
                {t("landing.heroCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#methodology">{t("landing.heroCtaSecondary")}</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900/5 text-navy-900 text-xs font-medium rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {t("landing.heroBadge1")}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900/5 text-navy-900 text-xs font-medium rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {t("landing.heroBadge2")}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900/5 text-navy-900 text-xs font-medium rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {t("landing.heroBadge3")}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url(/images/landing/bg-mesh-pattern.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="flex-1 relative min-h-[300px] lg:min-h-0">
            <Image
              src="/images/landing/hero-strategic-intelligence.png"
              alt="Strategic Intelligence"
              fill
              className="object-cover opacity-80"
              priority
            />
          </div>

          <div className="relative bg-navy-900/90 backdrop-blur-sm border-t border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-xs font-medium tracking-wider text-gray-400">
                {t("landing.systemStatus")}
              </span>
            </div>
            <div className="text-sm text-gray-300 mb-4">{t("landing.systemProcessing")}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">{t("landing.systemVelocity")}</div>
                <div className="text-2xl font-bold text-gold-500">48h</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{t("landing.systemType")}</div>
                <div className="text-sm text-white">{t("landing.systemTypeValue")}</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --- PROBLEMS SECTION --- */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="text-center mb-12">
            <Heading variant="section" className="mb-4">
              {t("landing.problemsTitle")}
            </Heading>
            <Text variant="lead" className="max-w-3xl mx-auto">
              {t("landing.problemsSubtitle")}
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {problemCards.map((card, index) => (
              <div
                key={index}
                className="p-6 md:p-8 border border-line bg-white hover:shadow-lg transition-shadow"
              >
                <Heading as="h3" variant="subtitle" className="mb-3 text-navy-900">
                  {card.title}
                </Heading>
                <Text variant="small" className="text-gray-600">
                  {card.desc}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- SOLUTION SECTION --- */}
      <Section id="methodology" className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Eyebrow className="mb-4">{t("landing.solutionEyebrow")}</Eyebrow>
              <Heading variant="section" className="mb-4">
                {t("landing.solutionTitle")}
              </Heading>
              <Text variant="lead" className="mb-8">
                {t("landing.solutionSubtitle")}
              </Text>

              <ul className="space-y-3">
                {solutionFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-line shadow-lg">
              <Image
                src="/images/landing/feature-frameworks.png"
                alt="Strategic Frameworks"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutionCards.map((card, index) => (
              <div
                key={index}
                className="p-6 border border-line bg-white hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-gold-500 mb-4 flex justify-center">
                  {icons[card.icon]}
                </div>
                {card.value && (
                  <div className="text-3xl font-bold text-navy-900 mb-2">{card.value}</div>
                )}
                <Heading as="h4" variant="subtitle" className="mb-2">
                  {card.title}
                </Heading>
                <Text variant="small" className="text-gray-600">
                  {card.desc}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- PIPELINE SECTION --- */}
      <Section variant="dark">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-3xl lg:text-4xl font-medium text-white mb-4">
              {t("landing.pipelineTitle")}
            </Heading>
            <Text className="text-gray-400 max-w-2xl mx-auto">
              {t("landing.pipelineSubtitle")}
            </Text>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-16">
            {pipelineSteps.map((step, index) => (
              <div
                key={index}
                className="p-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-center"
              >
                <span className="text-white text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-gold-500 mb-2">{stat.value}</div>
                <div className="text-white font-medium mb-2">{stat.label}</div>
                <Text className="text-gray-400 text-sm">{stat.desc}</Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- COMING SOON SECTION --- */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Eyebrow className="mb-6">{t("landing.futureEyebrow")}</Eyebrow>

            <div className="flex flex-wrap gap-3 mb-8">
              {futureIntegrations.map((integration, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-navy-900/5 text-navy-900 text-sm font-medium rounded-full"
                >
                  {integration}
                </span>
              ))}
            </div>

            <Heading variant="section" className="mb-4">
              {t("landing.futureTitle")}
            </Heading>
            <Text variant="lead" className="mb-6">
              {t("landing.futureDescription")}
            </Text>
            <Text className="text-gold-500 font-medium text-lg mb-8">
              {t("landing.futureTagline")}
            </Text>

            <Button asChild variant="outline" size="lg">
              <a href="#pilot">
                {t("landing.futureCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* --- PILOT ACCESS FORM SECTION --- */}
      <Section id="pilot" className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <Heading variant="section" className="mb-4">
                {t("landing.pilotTitle")}
              </Heading>
              <Text variant="lead" className="mb-8">
                {t("landing.pilotSubtitle")}
              </Text>

              <ul className="space-y-4 mb-8">
                {pilotBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-gray-500">{t("landing.trustedBy")}</div>
            </div>

            <div className="bg-surface-paper p-8 rounded-lg border border-line">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder={t("landing.formName")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder={t("landing.formEmail")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  placeholder={t("landing.formCompany")}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
                <Textarea
                  placeholder={t("landing.formChallenge")}
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  rows={4}
                />
                <Button type="submit" variant="architect" size="lg" className="w-full">
                  {t("landing.formSubmit")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Text variant="small" className="text-center text-gray-500">
                  {t("landing.formDisclaimer")}
                </Text>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
