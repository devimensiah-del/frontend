"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useI18n } from "@/lib/i18n/context";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Shield,
  Zap,
  Users,
  Activity,
} from "lucide-react";

// Type definitions for the landing page messages
interface LandingMessages {
  nav: {
    methodology: string;
    challenges: string;
    model: string;
    security: string;
    login: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    poweredBy: string;
    poweredByHighlight: string;
    description: string;
    cta: string;
    ctaSecondary: string;
    badge1: string;
    badge2: string;
    badge3: string;
  };
  systemStatus: {
    title: string;
    processing: string;
    velocityLabel: string;
    velocityValue: string;
    typeLabel: string;
    typeValue: string;
  };
  problems: {
    eyebrow: string;
    subtitle: string;
    cards: Array<{ title: string; description: string }>;
  };
  solution: {
    eyebrow: string;
    title: string;
    subtitle: string;
    features: string[];
    cards: Array<{ icon: string; title: string; value: string; description: string }>;
  };
  pipeline: {
    title: string;
    subtitle: string;
    steps: string[];
    stats: Array<{ value: string; label: string; description: string }>;
  };
  future: {
    eyebrow: string;
    integrations: string[];
    title: string;
    description: string;
    tagline: string;
    cta: string;
  };
  pilot: {
    title: string;
    subtitle: string;
    benefits: string[];
    trustedBy: string;
    form: {
      name: string;
      email: string;
      company: string;
      challenge: string;
      submit: string;
      disclaimer: string;
    };
  };
  footer: {
    copyright: string;
    privacy: string;
    terms: string;
    contact: string;
  };
}

export default function LandingPage() {
  const { messages } = useI18n();
  const landing = (messages.landing || {}) as LandingMessages;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    challenge: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to main form with data
    window.location.href = `/#diagnostico`;
  };

  return (
    <div className="[word-break:keep-all]">
      {/* Custom Landing Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <Container>
          <div className="flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center">
              <Image
                src="/images/landing/logo.png"
                alt="ImensIAH"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#methodology" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">
                {landing.nav?.methodology}
              </a>
              <a href="#challenges" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">
                {landing.nav?.challenges}
              </a>
              <a href="#model" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">
                {landing.nav?.model}
              </a>
              <a href="#security" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">
                {landing.nav?.security}
              </a>
              <Link href="/login" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">
                {landing.nav?.login}
              </Link>
              <Button asChild size="sm" variant="architect">
                <Link href="#pilot">{landing.nav?.cta}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* --- HERO SECTION --- */}
      <Section variant="hero" className="grid lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
        {/* Left: The Promise */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center border-r border-grid relative bg-white">
          <div className="mb-6">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-500">
              {landing.hero?.eyebrow}
            </span>
          </div>

          <Display variant="hero" className="mb-4">
            <span className="text-navy-900">{landing.hero?.titleLine1}</span>
            <br />
            <span className="text-gold-500 italic">{landing.hero?.titleLine2}</span>
          </Display>

          <Text className="text-sm text-gray-500 mb-6">
            {landing.hero?.poweredBy}{" "}
            <span className="text-gold-500 font-medium">{landing.hero?.poweredByHighlight}</span>
          </Text>

          <Text variant="lead" className="max-w-xl mb-8">
            {landing.hero?.description}
          </Text>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button asChild variant="architect" size="lg">
              <Link href="#pilot">
                {landing.hero?.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#methodology">{landing.hero?.ctaSecondary}</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900/5 text-navy-900 text-xs font-medium rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {landing.hero?.badge1}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900/5 text-navy-900 text-xs font-medium rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {landing.hero?.badge2}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900/5 text-navy-900 text-xs font-medium rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {landing.hero?.badge3}
            </span>
          </div>
        </div>

        {/* Right: Hero Image + System Status */}
        <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url(/images/landing/bg-mesh-pattern.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Hero Image */}
          <div className="flex-1 relative min-h-[300px] lg:min-h-0">
            <Image
              src="/images/landing/hero-strategic-intelligence.png"
              alt="Strategic Intelligence"
              fill
              className="object-cover opacity-80"
              priority
            />
          </div>

          {/* System Status Card */}
          <div className="relative bg-navy-900/90 backdrop-blur-sm border-t border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-xs font-medium tracking-wider text-gray-400">
                {landing.systemStatus?.title}
              </span>
            </div>
            <div className="text-sm text-gray-300 mb-4">{landing.systemStatus?.processing}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">{landing.systemStatus?.velocityLabel}</div>
                <div className="text-2xl font-bold text-gold-500">{landing.systemStatus?.velocityValue}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{landing.systemStatus?.typeLabel}</div>
                <div className="text-sm text-white">{landing.systemStatus?.typeValue}</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --- PROBLEMS SECTION --- */}
      <Section id="challenges" className="bg-surface-paper py-20">
        <Container>
          <div className="text-center mb-12">
            <Heading variant="section" className="mb-4">
              {landing.problems?.eyebrow}
            </Heading>
            <Text variant="lead" className="max-w-3xl mx-auto">
              {landing.problems?.subtitle}
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {landing.problems?.cards?.map((card, index) => (
              <div
                key={index}
                className="p-6 md:p-8 border border-line bg-white hover:shadow-lg transition-shadow"
              >
                <Heading as="h3" variant="subtitle" className="mb-3 text-navy-900">
                  {card.title}
                </Heading>
                <Text variant="small" className="text-gray-600">
                  {card.description}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- SOLUTION SECTION --- */}
      <Section id="methodology" className="bg-white py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-500 mb-4 block">
                {landing.solution?.eyebrow}
              </span>
              <Heading variant="section" className="mb-4">
                {landing.solution?.title}
              </Heading>
              <Text variant="lead" className="mb-8">
                {landing.solution?.subtitle}
              </Text>

              <ul className="space-y-3">
                {landing.solution?.features?.map((feature, index) => (
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

          {/* Solution Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {landing.solution?.cards?.map((card, index) => {
              const icons = {
                frameworks: <Layers className="w-8 h-8" />,
                enterprise: <Shield className="w-8 h-8" />,
                speed: <Zap className="w-8 h-8" />,
                hybrid: <Users className="w-8 h-8" />,
              };
              return (
                <div
                  key={index}
                  className="p-6 border border-line bg-white hover:shadow-lg transition-shadow text-center"
                >
                  <div className="text-gold-500 mb-4 flex justify-center">
                    {icons[card.icon as keyof typeof icons]}
                  </div>
                  {card.value && (
                    <div className="text-3xl font-bold text-navy-900 mb-2">{card.value}</div>
                  )}
                  <Heading as="h4" variant="subtitle" className="mb-2">
                    {card.title}
                  </Heading>
                  <Text variant="small" className="text-gray-600">
                    {card.description}
                  </Text>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* --- PIPELINE SECTION --- */}
      <Section className="bg-navy-900 py-20">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-3xl lg:text-4xl font-medium text-white mb-4">
              {landing.pipeline?.title}
            </Heading>
            <Text className="text-gray-400 max-w-2xl mx-auto">
              {landing.pipeline?.subtitle}
            </Text>
          </div>

          {/* Pipeline Steps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-16">
            {landing.pipeline?.steps?.map((step, index) => (
              <div
                key={index}
                className="p-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-center"
              >
                <span className="text-white text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {landing.pipeline?.stats?.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-gold-500 mb-2">{stat.value}</div>
                <div className="text-white font-medium mb-2">{stat.label}</div>
                <Text className="text-gray-400 text-sm">{stat.description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- COMING SOON / FUTURE SECTION --- */}
      <Section id="model" className="bg-surface-paper py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold-500">
                {landing.future?.eyebrow}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {landing.future?.integrations?.map((integration, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-navy-900/5 text-navy-900 text-sm font-medium rounded-full"
                >
                  {integration}
                </span>
              ))}
            </div>

            <Heading variant="section" className="mb-4">
              {landing.future?.title}
            </Heading>
            <Text variant="lead" className="mb-6">
              {landing.future?.description}
            </Text>
            <Text className="text-gold-500 font-medium text-lg mb-8">
              {landing.future?.tagline}
            </Text>

            <Button asChild variant="outline" size="lg">
              <a href="#pilot">
                {landing.future?.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* --- PILOT ACCESS FORM SECTION --- */}
      <Section id="pilot" className="bg-white py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <Heading variant="section" className="mb-4">
                {landing.pilot?.title}
              </Heading>
              <Text variant="lead" className="mb-8">
                {landing.pilot?.subtitle}
              </Text>

              <ul className="space-y-4 mb-8">
                {landing.pilot?.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-gray-500">{landing.pilot?.trustedBy}</div>
            </div>

            <div className="bg-surface-paper p-8 rounded-lg border border-line">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder={landing.pilot?.form?.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder={landing.pilot?.form?.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  placeholder={landing.pilot?.form?.company}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
                <Textarea
                  placeholder={landing.pilot?.form?.challenge}
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  rows={4}
                />
                <Button type="submit" variant="architect" size="lg" className="w-full">
                  {landing.pilot?.form?.submit}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Text variant="small" className="text-center text-gray-500">
                  {landing.pilot?.form?.disclaimer}
                </Text>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- FOOTER --- */}
      <footer id="security" className="bg-navy-900 py-8">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/landing/logo.png"
                alt="ImensIAH"
                width={100}
                height={30}
                className="h-6 w-auto brightness-0 invert"
              />
              <span className="text-gray-400 text-sm">{landing.footer?.copyright}</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                {landing.footer?.privacy}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                {landing.footer?.terms}
              </Link>
              <a href="mailto:contato@imensiah.com" className="text-gray-400 hover:text-white text-sm transition-colors">
                {landing.footer?.contact}
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
