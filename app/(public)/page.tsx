"use client";

import { SubmissionForm } from "./_components/submission-form";
import { Section, Container } from "@/components/editorial/Section";
import { Display, Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { ProcessStep, MetricCard, TestimonialCard, FounderCard } from "@/components/editorial/Cards";
import { useTranslations, useI18n } from "@/lib/i18n/context";

export default function EditorialPage() {
  const t = useTranslations();
  const { locale } = useI18n();
  const isPortuguese = locale === "pt";

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

  return (
    <>
      {/* --- HERO: The Manifesto Grid --- */}
      <Section variant="hero" className="grid lg:grid-cols-12">
        {/* Left: The Promise */}
        <div className="lg:col-span-7 p-12 lg:p-24 flex flex-col justify-center border-r border-grid relative bg-white/50">
          <div className="absolute top-12 left-12">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </div>

          <Display variant="hero" className="mt-4 md:mt-0 mb-10">
            {t("hero.title")} <br />
            <span className="text-gold-500 italic serif-touch">{t("hero.titleHighlight")}</span> {t("hero.titleSuffix")}
          </Display>

          <Text variant="lead" className="max-w-lg mb-12">
            {t("hero.description")}
          </Text>

          <div className="flex flex-wrap gap-6">
            <Button asChild variant="architect">
              <a href="#diagnostico">{t("hero.cta")}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/login">{t("hero.login")}</a>
            </Button>
          </div>
        </div>

        {/* Right: The "Metrics" Visual (Abstract) */}
        <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
          {/* Decorative Background Map/Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Top Statistic */}
          <MetricCard value="11" label={t("hero.frameworks")} />

          {/* Bottom Statistic */}
          <MetricCard value="48h" label={t("hero.deliveryTime")} highlight />
        </div>
      </Section>

      {/* --- HOW IT WORKS: The Blueprint --- */}
      <Section variant="grid">
        {processSteps.map((step, i) => (
          <ProcessStep
            key={i}
            stepNumber={step.num}
            title={step.title}
            description={step.desc}
          />
        ))}
      </Section>

      {/* --- THE FORM SECTION --- */}
      <Section id="diagnostico" className="flex flex-col items-center justify-center bg-surface-paper">
        <Container className="w-full flex justify-center">
          <div className="max-w-3xl w-full">
            {isPortuguese ? (
              <SubmissionForm />
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

      {/* --- TESTIMONIALS: Quem confia na IMENSIAH --- */}
      <Section>
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

      {/* --- ABOUT US: Sobre nós --- */}
      <Section variant="dark">
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
