"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SubmissionForm } from "./_components/submission-form";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { ProcessStep, MetricCard, TestimonialCard, FounderCard } from "@/components/editorial/Cards";
import { MaintenanceOverlay } from "@/components/ui/MaintenanceOverlay";
import { useTranslations, useI18n } from "@/lib/i18n/context";
import { ArrowRight, CheckCircle2, Layers, Shield, Zap, Users, XCircle, AlertCircle } from "lucide-react";

function LandingPageContent() {
  const t = useTranslations();
  const { locale } = useI18n();
  const searchParams = useSearchParams();
  const isPortuguese = locale === "pt";
  const showMaintenanceOverlay = searchParams.get("maintenance") === "1";

  const processSteps = [
    {
      num: t("process.step1.num"),
      title: t("process.step1.title"),
      desc: t("process.step1.desc"),
    },
    {
      num: t("process.step2.num"),
      title: t("process.step2.title"),
      desc: t("process.step2.desc"),
    },
    {
      num: t("process.step3.num"),
      title: t("process.step3.title"),
      desc: t("process.step3.desc"),
    },
  ];

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
    { icon: <Layers className="w-8 h-8" />, title: t("landing.card1Title"), value: "11+", desc: t("landing.card1Desc") },
    { icon: <Shield className="w-8 h-8" />, title: t("landing.card2Title"), value: "", desc: t("landing.card2Desc") },
    { icon: <Zap className="w-8 h-8" />, title: t("landing.card3Title"), value: "", desc: t("landing.card3Desc") },
    { icon: <Users className="w-8 h-8" />, title: t("landing.card4Title"), value: "", desc: t("landing.card4Desc") },
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

  return (
    <>
      {/* Maintenance Overlay */}
      {showMaintenanceOverlay && <MaintenanceOverlay />}

      {/* --- HERO SECTION --- */}
      <Section variant="hero" className="grid lg:grid-cols-12">
        {/* Left: The Promise */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-r border-grid relative bg-white/50">
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </div>

          <Display variant="hero" className="mt-12 md:mt-0 mb-6">
            {t("hero.title")} <br />
            <span className="text-gold-500 italic serif-touch">{t("hero.titleHighlight")}</span> {t("hero.titleSuffix")}
          </Display>

          <Text variant="lead" className="max-w-lg mb-8">
            {t("hero.description")}
          </Text>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button asChild variant="architect" size="lg">
              <a href="#diagnostico">
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#metodologia">{t("landing.heroCtaSecondary")}</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
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

        {/* Right: The Metrics Visual */}
        <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
          {/* Decorative Background Grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Top Statistic */}
          <MetricCard value="11" label={t("hero.frameworks")} />

          {/* Bottom Statistic */}
          <MetricCard value="48h" label={t("hero.deliveryTime")} highlight />
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

      {/* --- HOW IT WORKS: The Blueprint --- */}
      <Section id="processo" variant="grid">
        {processSteps.map((step, i) => (
          <ProcessStep
            key={i}
            stepNumber={step.num}
            title={step.title}
            description={step.desc}
          />
        ))}
      </Section>

      {/* --- SOLUTION/METHODOLOGY SECTION --- */}
      <Section id="metodologia" className="bg-white">
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

            <div className="bg-navy-900/5 border border-line p-12 rounded-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy-900">{t("seguranca.feature1Title")}</h4>
                    <p className="text-sm text-gray-600">{t("seguranca.feature1Desc")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy-900">{t("seguranca.feature3Title")}</h4>
                    <p className="text-sm text-gray-600">{t("seguranca.feature3Desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutionCards.map((card, index) => (
              <div
                key={index}
                className="p-6 border border-line bg-white hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-gold-500 mb-4 flex justify-center">
                  {card.icon}
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

      {/* --- THE FORM SECTION --- */}
      <Section id="diagnostico" className="flex flex-col items-center justify-center bg-surface-paper">
        <Container className="w-full flex justify-center">
          <div className="max-w-3xl w-full">
            {isPortuguese ? (
              <Suspense fallback={<div className="bg-white p-8 md:p-12 border border-line shadow-sm animate-pulse h-96" />}>
                <SubmissionForm />
              </Suspense>
            ) : (
              <div className="bg-white p-8 md:p-12 border border-line shadow-sm relative text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
                <div className="py-12">
                  <h2 className="text-3xl font-medium mb-4">{t("formUnavailable.title")}</h2>
                  <p className="text-text-secondary text-lg max-w-md mx-auto">
                    {t("formUnavailable.message")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* --- COMING SOON/ROADMAP SECTION --- */}
      <Section id="roadmap" className="bg-white">
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

            {/* Roadmap Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-12">
              {[
                { phase: t("desafios.phase1"), title: t("desafios.phase1Title"), current: true },
                { phase: t("desafios.phase2"), title: t("desafios.phase2Title"), current: false },
                { phase: t("desafios.phase3"), title: t("desafios.phase3Title"), current: false },
                { phase: t("desafios.phase4"), title: t("desafios.phase4Title"), current: false },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border ${item.current ? "border-gold-500 bg-gold-500/5" : "border-line"}`}
                >
                  <Text className="text-xs font-medium uppercase tracking-[0.15em] text-gold-500 mb-2">
                    {item.phase}
                  </Text>
                  <h4 className="text-sm font-semibold text-navy-900 leading-snug [word-break:keep-all] [hyphens:none]">
                    {item.title}
                  </h4>
                  {item.current && (
                    <div className="mt-3 pt-3 border-t border-gold-500/30">
                      <span className="text-xs uppercase tracking-[0.15em] text-gold-500">Atual</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* --- TESTIMONIALS --- */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="text-center mb-16">
            <Eyebrow className="mb-4">{t("testimonials.eyebrow")}</Eyebrow>
            <Heading variant="section">
              {t("testimonials.title")}
            </Heading>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              quote={t("testimonials.testimonial1.quote")}
              author={t("testimonials.testimonial1.author")}
              role={t("testimonials.testimonial1.role")}
              company={t("testimonials.testimonial1.company")}
            />

            <TestimonialCard
              quote={t("testimonials.testimonial2.quote")}
              author={t("testimonials.testimonial2.author")}
              role={t("testimonials.testimonial2.role")}
              company={t("testimonials.testimonial2.company")}
            />
          </div>
        </Container>
      </Section>

      {/* --- ABOUT US --- */}
      <Section id="sobre" variant="dark">
        <Container>
          <div className="text-center mb-16">
            <Eyebrow className="mb-4">{t("about.eyebrow")}</Eyebrow>
            <Heading as="h2" className="text-3xl lg:text-5xl font-medium text-white">
              {t("about.title")}
            </Heading>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            <FounderCard
              name={t("about.founder1.name")}
              role={t("about.founder1.role")}
              bio={t("about.founder1.bio")}
            />

            <FounderCard
              name={t("about.founder2.name")}
              role={t("about.founder2.role")}
              bio={t("about.founder2.bio")}
            />

            <FounderCard
              name={t("about.founder3.name")}
              role={t("about.founder3.role")}
              bio={t("about.founder3.bio")}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

export default function UnifiedLandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingPageContent />
    </Suspense>
  );
}
