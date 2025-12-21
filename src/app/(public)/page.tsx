import { HeroSection } from '@/components/features/landing/hero-section'
import { TestimonialsSection } from '@/components/features/landing/testimonials-section'
import { AboutSection } from '@/components/features/landing/about-section'
import { SubmitSection } from '@/components/features/submission/submit-section'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SubmitSection />
      <TestimonialsSection />
      <AboutSection />
    </>
  )
}
