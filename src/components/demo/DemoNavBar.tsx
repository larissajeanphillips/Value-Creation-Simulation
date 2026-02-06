/**
 * DemoNavBar - Floating Prev / Step X of N / Next bar for click-through demos.
 * Rendered via portal so it always stays on top and receives clicks (avoids stacking-context issues on Framework/Scoreboard steps).
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoNavBarProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  /** When set, Next/Prev render as links to this href so navigation works even if onClick is blocked. */
  stepHref?: (stepIndex: number) => string;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function DemoNavBar({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  stepHref,
  backHref = '/demo/admin',
  backLabel = 'Back to demo',
  className,
}: DemoNavBarProps) {
  const isFirst = currentStep <= 0;
  const isLast = currentStep >= totalSteps - 1;

  const prevHref = stepHref?.(currentStep - 1);
  const nextHref = stepHref?.(currentStep + 1);

  const prevClassName = cn(
    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
    isFirst
      ? 'text-slate-300 cursor-not-allowed pointer-events-none'
      : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
  );
  const nextClassName = cn(
    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
    isLast
      ? 'text-slate-300 cursor-not-allowed pointer-events-none'
      : 'text-white bg-magna-red hover:bg-magna-red-dark'
  );

  const navContent = (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg pointer-events-auto',
        className
      )}
      role="navigation"
      aria-label="Demo steps"
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <a
          href={backHref}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          {backLabel}
        </a>
        <div className="flex items-center gap-3">
          {stepHref && !isFirst ? (
            <a
              href={prevHref}
              className={prevClassName}
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </a>
          ) : stepHref && isFirst ? (
            <span className={prevClassName} aria-disabled="true">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              disabled={isFirst}
              className={prevClassName}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
          )}
          <span className="text-slate-600 text-sm font-medium min-w-[6rem] text-center">
            Step {currentStep + 1} of {totalSteps}
          </span>
          {stepHref && !isLast ? (
            <a
              href={nextHref}
              className={nextClassName}
              aria-label="Next step"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </a>
          ) : stepHref && isLast ? (
            <span className={nextClassName} aria-disabled="true">
              Next
              <ChevronRight className="w-4 h-4" />
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              disabled={isLast}
              className={nextClassName}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(navContent, document.body)
    : navContent;
}
