"use client";

import Link from "next/link";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/context";
import { ArrowRight, ShieldOff, Server, Users, Lock, UserCheck, FileSearch, Key } from "lucide-react";

export default function SegurancaPage() {
  const t = useTranslations();

  const securityFeatures = [
    {
      icon: <ShieldOff className="w-8 h-8" />,
      title: t("seguranca.feature1Title"),
      desc: t("seguranca.feature1Desc"),
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: t("seguranca.feature2Title"),
      desc: t("seguranca.feature2Desc"),
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("seguranca.feature3Title"),
      desc: t("seguranca.feature3Desc"),
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: t("seguranca.feature4Title"),
      desc: t("seguranca.feature4Desc"),
    },
  ];

  const complianceFeatures = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: t("seguranca.compliance1Title"),
      desc: t("seguranca.compliance1Desc"),
    },
    {
      icon: <FileSearch className="w-6 h-6" />,
      title: t("seguranca.compliance2Title"),
      desc: t("seguranca.compliance2Desc"),
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: t("seguranca.compliance3Title"),
      desc: t("seguranca.compliance3Desc"),
    },
  ];

  return (
    <div className="[word-break:keep-all]">
      {/* Hero */}
      <Section className="bg-surface-paper py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Eyebrow className="mb-4">{t("seguranca.eyebrow")}</Eyebrow>
            <Display variant="hero" className="mb-6">
              {t("seguranca.title")}
            </Display>
            <Text variant="lead" className="max-w-2xl mx-auto">
              {t("seguranca.subtitle")}
            </Text>
          </div>
        </Container>
      </Section>

      {/* Security Features */}
      <Section className="bg-white py-16">
        <Container>
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="border border-line p-6 md:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-gold-500 mb-4">{feature.icon}</div>
                <Heading as="h3" variant="subtitle" className="mb-3">
                  {feature.title}
                </Heading>
                <Text variant="small" className="text-gray-600">
                  {feature.desc}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Compliance */}
      <Section className="bg-navy-900 py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading as="h2" className="text-3xl text-white text-center mb-4">
              {t("seguranca.complianceTitle")}
            </Heading>
            <Text className="text-gray-400 text-center mb-12">
              {t("seguranca.complianceSubtitle")}
            </Text>

            <div className="grid md:grid-cols-3 gap-6">
              {complianceFeatures.map((feature, index) => (
                <div key={index} className="border border-white/10 p-6 bg-white/5">
                  <div className="text-gold-500 mb-4">{feature.icon}</div>
                  <Heading as="h3" className="text-white text-lg mb-3">
                    {feature.title}
                  </Heading>
                  <Text className="text-gray-400 text-sm">{feature.desc}</Text>
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
