"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations, useI18n } from "@/lib/i18n/context";
import {
  Eye,
  Target,
  Brain,
  Shield,
  Lock,
  FileSearch,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  const t = useTranslations();
  const { messages } = useI18n();

  // Access the pipeline steps array from messages
  const pipelineSteps = messages.landing?.pipelineSteps || [];
  const modelIncludes = messages.landing?.modelIncludes || [];

  return (
    <div className="[word-break:keep-all]">
      {/* --- HERO SECTION --- */}
      <Section variant="hero" className="grid lg:grid-cols-12">
        {/* Left: The Promise */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-r border-grid relative bg-white/50">
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
            <Eyebrow>{t("landing.eyebrow")}</Eyebrow>
          </div>

          <Display variant="hero" className="mt-12 md:mt-0 mb-6 md:mb-10">
            {t("landing.heroTitle")} <br />
            <span className="text-gold-500 italic serif-touch">{t("landing.heroHighlight")}</span>{" "}
            {t("landing.heroSuffix")}
          </Display>

          <Text variant="lead" className="max-w-lg mb-8 md:mb-12">
            {t("landing.heroDescription")}
          </Text>

          <div className="flex flex-wrap gap-4 md:gap-6">
            <Button asChild variant="architect">
              <Link href="/#diagnostico">
                {t("landing.heroCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right: Hero Image + Metrics */}
        <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url(/images/landing/bg-mesh-pattern.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Hero Image */}
          <div className="flex-1 relative min-h-[200px] lg:min-h-0">
            <Image
              src="/images/landing/hero-strategic-intelligence.png"
              alt="Strategic Intelligence"
              fill
              className="object-cover opacity-80"
              priority
            />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 divide-x divide-white/10">
            <div className="p-6 md:p-8">
              <div className="text-4xl md:text-5xl font-light mb-2 text-gold-500 font-heading">
                {t("landing.heroMetric1")}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">
                {t("landing.heroMetric1Label")}
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="text-4xl md:text-5xl font-light mb-2 text-white font-heading">
                {t("landing.heroMetric2")}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">
                {t("landing.heroMetric2Label")}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --- PROBLEMS SECTION --- */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <Eyebrow className="mb-4">{t("landing.problemsEyebrow")}</Eyebrow>
            <Heading variant="section" className="mb-4">
              {t("landing.problemsTitle")}
            </Heading>
            <Text variant="lead" className="max-w-3xl mx-auto">
              {t("landing.problemsSubtitle")}
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <ProblemCard
              icon={<Eye className="w-8 h-8" />}
              title={t("landing.problem1Title")}
              description={t("landing.problem1Desc")}
            />
            <ProblemCard
              icon={<Target className="w-8 h-8" />}
              title={t("landing.problem2Title")}
              description={t("landing.problem2Desc")}
            />
            <ProblemCard
              icon={<Brain className="w-8 h-8" />}
              title={t("landing.problem3Title")}
              description={t("landing.problem3Desc")}
            />
          </div>
        </Container>
      </Section>

      {/* --- FEATURES SECTION --- */}
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Eyebrow className="mb-4">{t("landing.featuresEyebrow")}</Eyebrow>
              <Heading variant="section" className="mb-4">
                {t("landing.featuresTitle")}
              </Heading>
              <Text variant="lead" className="mb-8">
                {t("landing.featuresSubtitle")}
              </Text>

              <div className="space-y-6">
                <FeatureItem
                  title={t("landing.feature1Title")}
                  description={t("landing.feature1Desc")}
                />
                <FeatureItem
                  title={t("landing.feature2Title")}
                  description={t("landing.feature2Desc")}
                />
                <FeatureItem
                  title={t("landing.feature3Title")}
                  description={t("landing.feature3Desc")}
                />
              </div>
            </div>

            <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden border border-line shadow-lg">
              <Image
                src="/images/landing/feature-frameworks.png"
                alt="Strategic Frameworks"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- PIPELINE SECTION --- */}
      <Section variant="dark">
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <Eyebrow className="mb-4 text-gold-500">{t("landing.pipelineEyebrow")}</Eyebrow>
            <Heading as="h2" className="text-3xl lg:text-5xl font-medium text-white mb-4">
              {t("landing.pipelineTitle")}
            </Heading>
            <Text variant="light" className="max-w-2xl mx-auto">
              {t("landing.pipelineSubtitle")}
            </Text>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto mb-12">
            {pipelineSteps.map((step: { title: string; desc: string }, index: number) => (
              <PipelineStep
                key={index}
                number={index + 1}
                title={step.title}
                description={step.desc}
              />
            ))}
          </div>

          <div className="text-center">
            <Text variant="light" className="mb-6 text-lg">
              {t("landing.pipelineCta")}
            </Text>
            <Button asChild variant="architect">
              <Link href="/#diagnostico">
                {t("landing.heroCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* --- MODEL SECTION --- */}
      <Section className="bg-surface-paper">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-line shadow-lg order-2 lg:order-1">
              <Image
                src="/images/landing/feature-speed.png"
                alt="Speed and Delivery"
                fill
                className="object-cover"
              />
            </div>

            <div className="order-1 lg:order-2">
              <Eyebrow className="mb-4">{t("landing.modelEyebrow")}</Eyebrow>
              <Heading variant="section" className="mb-4">
                {t("landing.modelTitle")}
              </Heading>
              <Text variant="lead" className="mb-8">
                {t("landing.modelSubtitle")}
              </Text>

              <ul className="space-y-4 mb-8">
                {modelIncludes.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 bg-navy-900/5 rounded-lg border border-line">
                <Text variant="small" className="text-navy-900 font-medium">
                  {t("landing.modelFocus")}
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- SECURITY SECTION --- */}
      <Section className="bg-navy-900">
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <Eyebrow className="mb-4 text-gold-500">{t("landing.securityEyebrow")}</Eyebrow>
            <Heading as="h2" className="text-3xl lg:text-5xl font-medium text-white mb-4">
              {t("landing.securityTitle")}
            </Heading>
            <Text variant="light" className="max-w-3xl mx-auto">
              {t("landing.securitySubtitle")}
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <SecurityCard
              icon={<Lock className="w-8 h-8" />}
              title={t("landing.security1Title")}
              description={t("landing.security1Desc")}
            />
            <SecurityCard
              icon={<FileSearch className="w-8 h-8" />}
              title={t("landing.security2Title")}
              description={t("landing.security2Desc")}
            />
            <SecurityCard
              icon={<Shield className="w-8 h-8" />}
              title={t("landing.security3Title")}
              description={t("landing.security3Desc")}
            />
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="architect">
              <Link href="/#diagnostico">
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

/* ============================================
   INTERNAL COMPONENTS
   ============================================ */

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ProblemCard({ icon, title, description }: ProblemCardProps) {
  return (
    <div className="p-6 md:p-8 border border-line bg-white hover:shadow-lg transition-shadow group">
      <div className="text-gold-500 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <Heading as="h3" variant="subtitle" className="mb-3">
        {title}
      </Heading>
      <Text variant="small">
        {description}
      </Text>
    </div>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <CheckCircle2 className="w-6 h-6 text-gold-500" />
      </div>
      <div>
        <Heading as="h4" variant="subtitle" className="mb-1 text-lg">
          {title}
        </Heading>
        <Text variant="small">{description}</Text>
      </div>
    </div>
  );
}

interface PipelineStepProps {
  number: number;
  title: string;
  description: string;
}

function PipelineStep({ number, title, description }: PipelineStepProps) {
  return (
    <div className="p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-bold text-gold-500 border border-gold-500 px-2 py-0.5 rounded-full">
          {number.toString().padStart(2, '0')}
        </span>
        <span className="text-white font-medium text-sm">{title}</span>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}

interface SecurityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SecurityCard({ icon, title, description }: SecurityCardProps) {
  return (
    <div className="p-6 md:p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
      <div className="text-gold-500 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <Heading as="h3" className="text-lg font-medium text-white mb-3">
        {title}
      </Heading>
      <Text variant="light" className="text-sm">
        {description}
      </Text>
    </div>
  );
}
