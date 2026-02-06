/**
 * DemoAdminPage - Click-through demo of facilitator/admin screens (no backend, no PIN).
 * Steps: Dashboard → Framework → Scoreboard → Agenda.
 * Step is driven by URL hash (#0–#3) so Next/Prev work even when React onClick is blocked.
 */

import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { DemoProvider } from '@/components/demo/DemoContext';
import { DemoNavBar } from '@/components/demo/DemoNavBar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FrameworkOverview } from '@/components/admin/FrameworkOverview';
import { TeamScoreboard } from '@/components/admin/TeamScoreboard';
import { FacilitatorAgenda } from '@/components/admin/FacilitatorAgenda';
import { applyAdminDemoStep } from '@/data/demoState';

const ADMIN_DEMO_STEPS = 4;

/** Parse step index 0–3 from window.location.hash; default 0 for empty/invalid. */
function getStepFromHash(): number {
  const h = window.location.hash;
  if (!h || h === '#') return 0;
  const n = parseInt(h.slice(1), 10);
  if (Number.isNaN(n) || n < 0 || n > ADMIN_DEMO_STEPS - 1) return 0;
  return n;
}

/** Base path for admin demo (no trailing slash). */
function getAdminDemoBasePath(): string {
  const path = window.location.pathname.replace(/\/$/, '');
  return path || '/demo/admin';
}

export function DemoAdminPage() {
  const [step, setStep] = useState(getStepFromHash);

  useLayoutEffect(() => {
    applyAdminDemoStep(step);
  }, [step]);

  /** Navigate to step and update URL hash so link-based Next/Prev work. */
  const goToStep = useCallback((s: number) => {
    const clamped = Math.max(0, Math.min(ADMIN_DEMO_STEPS - 1, s));
    setStep(clamped);
    const base = getAdminDemoBasePath();
    window.history.pushState(null, '', `${base}#${clamped}`);
  }, []);

  useEffect(() => {
    const syncFromHash = () => setStep(getStepFromHash());
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  const handlePrev = useCallback(() => goToStep(step - 1), [step, goToStep]);
  const handleNext = useCallback(() => goToStep(step + 1), [step, goToStep]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'ArrowRight') {
        if (step < ADMIN_DEMO_STEPS - 1) {
          e.preventDefault();
          goToStep(step + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (step > 0) {
          e.preventDefault();
          goToStep(step - 1);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [step, goToStep]);

  /** Hash-only hrefs (#0–#3) so link navigation is same-document and reliable across hosts. */
  const stepHref = useCallback((stepIndex: number) => `#${stepIndex}`, []);

  return (
    <DemoProvider>
      <div className="relative z-0 min-h-screen bg-slate-100 pb-20">
        {step === 0 && (
          <AdminDashboard
            onOpenFramework={() => goToStep(1)}
            onOpenScoreboard={() => goToStep(2)}
            onOpenAgenda={() => goToStep(3)}
          />
        )}
        {step === 1 && <FrameworkOverview onBack={() => goToStep(0)} />}
        {step === 2 && <TeamScoreboard onBack={() => goToStep(0)} />}
        {step === 3 && <FacilitatorAgenda onBack={() => goToStep(0)} />}
      </div>
      <DemoNavBar
        currentStep={step}
        totalSteps={ADMIN_DEMO_STEPS}
        onPrev={handlePrev}
        onNext={handleNext}
        stepHref={stepHref}
        backHref="/demo/admin/links"
        backLabel="All demo links"
      />
    </DemoProvider>
  );
}
