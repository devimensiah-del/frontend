"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, ShieldOff, Server, Users, Lock, UserCheck, FileSearch, Key, ArrowDownRight, Shield } from "lucide-react";

export default function SegurancaPage() {
  const t = useTranslations();

  const securityFeatures = [
    {
      icon: <ShieldOff className="w-6 h-6" />,
      title: t("seguranca.feature1Title"),
      desc: t("seguranca.feature1Desc"),
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: t("seguranca.feature2Title"),
      desc: t("seguranca.feature2Desc"),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("seguranca.feature3Title"),
      desc: t("seguranca.feature3Desc"),
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: t("seguranca.feature4Title"),
      desc: t("seguranca.feature4Desc"),
    },
  ];

  const complianceFeatures = [
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: t("seguranca.compliance1Title"),
      desc: t("seguranca.compliance1Desc"),
    },
    {
      icon: <FileSearch className="w-5 h-5" />,
      title: t("seguranca.compliance2Title"),
      desc: t("seguranca.compliance2Desc"),
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: t("seguranca.compliance3Title"),
      desc: t("seguranca.compliance3Desc"),
    },
  ];

  return (
    <div className="[word-break:keep-all]">
      {/* Hero - Split Layout */}
      <Section variant="hero" className="grid lg:grid-cols-12 min-h-[50vh]">
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-r border-grid bg-white/50">
          <div className="mb-8">
            <Eyebrow>{t("seguranca.eyebrow")}</Eyebrow>
          </div>
          <Display variant="hero" className="mb-6">
            {t("seguranca.title")}
          </Display>
          <Text variant="lead" className="max-w-xl">
            {t("seguranca.subtitle")}
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
          {/* Shield Visual */}
          <div className="flex-1 p-12 flex flex-col items-center justify-center relative">
            <div className="w-24 h-24 rounded-full bg-gold-500/20 flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-gold-500" />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400 text-center">Enterprise Security</div>
          </div>
          {/* Metrics */}
          <div className="p-8 flex justify-between border-t border-white/10 relative">
            <div>
              <div className="text-3xl font-light mb-1 font-heading text-gold-500">100%</div>
              <div className="text-xs uppercase tracking-[0.15em] text-gray-400">Encrypted</div>
            </div>
            <div>
              <div className="text-3xl font-light mb-1 font-heading text-white">SOC 2</div>
              <div className="text-xs uppercase tracking-[0.15em] text-gray-400">In Progress</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Security Features - Grid Style */}
      <Section variant="grid" className="divide-x divide-line">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="p-12 hover:bg-surface-paper transition-colors group h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center text-gold-500">
                {feature.icon}
              </div>
              <ArrowDownRight className="w-5 h-5 text-line group-hover:text-navy-900 transition-colors" />
            </div>
            <Heading as="h3" variant="subtitle" className="mb-4">
              {feature.title}
            </Heading>
            <Text variant="small" className="text-text-secondary leading-relaxed">
              {feature.desc}
            </Text>
          </div>
        ))}
      </Section>

      {/* Compliance - Dark Section */}
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
            <div className="text-center mb-12">
              <Eyebrow className="text-gold-500 mb-4">Compliance</Eyebrow>
              <Heading as="h2" className="text-3xl lg:text-4xl text-white mb-4">
                {t("seguranca.complianceTitle")}
              </Heading>
              <Text className="text-gray-400 max-w-2xl mx-auto">
                {t("seguranca.complianceSubtitle")}
              </Text>
            </div>

            {/* Compliance Cards - Badge Style */}
            <div className="grid md:grid-cols-3 gap-0">
              {complianceFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 border border-white/10 hover:bg-white/5 transition-colors group relative"
                >
                  {/* Badge Icon */}
                  <div className="w-16 h-16 rounded-full border-2 border-gold-500 bg-gold-500/10 flex items-center justify-center mb-6 mx-auto">
                    <span className="text-gold-500">{feature.icon}</span>
                  </div>
                  <Heading as="h3" className="text-white text-center text-lg mb-3">
                    {feature.title}
                  </Heading>
                  <Text className="text-gray-400 text-sm text-center">{feature.desc}</Text>
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
            <Heading as="h2" className="text-2xl mb-6">
              {t("seguranca.ctaTitle")}
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
