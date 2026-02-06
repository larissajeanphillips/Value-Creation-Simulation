/**
 * DemoAdminPage - Click-through demo of facilitator/admin screens (no backend, no PIN).
 * Steps: Dashboard → Framework → Scoreboard → Agenda.
 */

import React, { useState, useLayoutEffect } from 'react';
import { DemoProvider } from '@/components/demo/DemoContext';
import { DemoNavBar } from '@/components/demo/DemoNavBar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FrameworkOverview } from '@/components/admin/FrameworkOverview';
import { TeamScoreboard } from '@/components/admin/TeamScoreboard';
import { FacilitatorAgenda } from '@/components/admin/FacilitatorAgenda';
import { applyAdminDemoStep } from '@/data/demoState';

const ADMIN_DEMO_STEPS = 4;

export function DemoAdminPage() {
  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    applyAdminDemoStep(step);
  }, [step]);

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setStep((s) => Math.min(ADMIN_DEMO_STEPS - 1, s + 1));
  };

  return (
    <DemoProvider>
      <div className="min-h-screen bg-slate-100 pb-20">
        {step === 0 && (
          <AdminDashboard
            onOpenFramework={() => setStep(1)}
            onOpenScoreboard={() => setStep(2)}
            onOpenAgenda={() => setStep(3)}
          />
        )}
        {step === 1 && <FrameworkOverview onBack={() => setStep(0)} />}
        {step === 2 && <TeamScoreboard onBack={() => setStep(0)} />}
        {step === 3 && <FacilitatorAgenda onBack={() => setStep(0)} />}
      </div>
      <DemoNavBar
        currentStep={step}
        totalSteps={ADMIN_DEMO_STEPS}
        onPrev={handlePrev}
        onNext={handleNext}
        backHref="/demo/admin/links"
        backLabel="All demo links"
      />
    </DemoProvider>
  );
}
