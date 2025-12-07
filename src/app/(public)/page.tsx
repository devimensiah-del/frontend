import { HeroSection } from '@/components/features/landing/hero-section'
import { ProblemsSection } from '@/components/features/landing/problems-section'
import { ProcessSection } from '@/components/features/landing/process-section'
import { SolutionSection } from '@/components/features/landing/solution-section'
import { PipelineSection } from '@/components/features/landing/pipeline-section'
import { RoadmapSection } from '@/components/features/landing/roadmap-section'
import { TestimonialsSection } from '@/components/features/landing/testimonials-section'
import { AboutSection } from '@/components/features/landing/about-section'
import { SubmitSection } from '@/components/features/submission/submit-section'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemsSection />
      <ProcessSection />
      <SolutionSection />
      <PipelineSection />
      <SubmitSection />
      <RoadmapSection />
      <TestimonialsSection />
      <AboutSection />
    </>
  )
}
