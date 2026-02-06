/**
 * DemoNavBar - Floating Prev / Step X of N / Next bar for click-through demos.
 */

import React from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoNavBarProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function DemoNavBar({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  backHref = '/demo/admin',
  backLabel = 'Back to demo',
  className,
}: DemoNavBarProps) {
  const isFirst = currentStep <= 0;
  const isLast = currentStep >= totalSteps - 1;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg',
        className
      )}
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
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              isFirst
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-slate-600 text-sm font-medium min-w-[6rem] text-center">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={isLast}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              isLast
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-white bg-magna-red hover:bg-magna-red-dark'
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
