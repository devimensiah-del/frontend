/**
 * Wizard Layout Component
 * Main layout with sidebar and content area
 */

import { WizardProgress } from './WizardProgress'
import { WizardSidebar } from './WizardSidebar'
import type { WizardState } from '@/lib/types'

interface WizardLayoutProps {
  wizardState: WizardState
  children: React.ReactNode
}

export function WizardLayout({ wizardState, children }: WizardLayoutProps) {
  const { current_step, total_steps, framework, previous_steps } = wizardState

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <WizardProgress
            currentStep={current_step}
            totalSteps={total_steps}
            frameworkName={framework?.name || 'Carregando...'}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <WizardSidebar
                previousSteps={previous_steps}
                currentFramework={framework}
                totalSteps={total_steps}
              />
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
