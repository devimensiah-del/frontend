import { HeroSection } from '@/components/landing/hero-section';
import { SubmissionForm } from '@/components/landing/submission-form';
import { HowItWorks } from '@/components/landing/how-it-works';
import { BenefitsSection } from '@/components/landing/benefits-section';
import { UseCases } from '@/components/landing/use-cases';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { AboutSection } from '@/components/landing/about-section';
import { GuaranteeSection } from '@/components/landing/guarantee-section';
import { FaqSection } from '@/components/landing/faq-section';
import { Footer } from '@/components/layouts/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      <UseCases />
      <SubmissionForm />
      <TestimonialsSection />
      <AboutSection />
      <GuaranteeSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
