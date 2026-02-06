/**
 * DebriefContent Component
 *
 * Shared debrief UI: Page 1 = Main Lessons, Page 2 = Round Deep Dive.
 * Accepts finalResults (null when game not finished). Used by display route and admin.
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DebriefMainLessons } from './DebriefMainLessons';
import { DebriefRoundDeepDive } from './DebriefRoundDeepDive';
import type { FinalResults } from '@/types/game';

export type DebriefPage = 'lessons' | 'rounds';

export interface DebriefContentProps {
  className?: string;
  /** Final results; null when game not finished (display shows empty/loading message) */
  finalResults: FinalResults | null;
  /** display = fullscreen for big screen, admin = card for admin embed */
  variant?: 'display' | 'admin';
}

export const DebriefContent: React.FC<DebriefContentProps> = ({
  className,
  finalResults,
  variant = 'display',
}) => {
  const [page, setPage] = useState<DebriefPage>('lessons');
  const isDisplay = variant === 'display';

  return (
    <div className={cn('flex flex-col', isDisplay ? 'min-h-screen bg-slate-900' : '', className)}>
      {/* Tab navigation */}
      <div
        className={cn(
          'flex items-center justify-center gap-2 border-b px-4 py-3',
          isDisplay ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50 rounded-t-xl'
        )}
      >
        <button
          type="button"
          onClick={() => setPage('lessons')}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
            page === 'lessons'
              ? isDisplay
                ? 'bg-amber-500 text-slate-900'
                : 'bg-amber-100 text-amber-900'
              : isDisplay
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-200'
          )}
        >
          <BookOpen className="w-4 h-4" />
          Main Lessons
        </button>
        <button
          type="button"
          onClick={() => setPage('rounds')}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
            page === 'rounds'
              ? isDisplay
                ? 'bg-amber-500 text-slate-900'
                : 'bg-amber-100 text-amber-900'
              : isDisplay
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                : 'text-slate-600 hover:bg-slate-200'
          )}
        >
          <Layers className="w-4 h-4" />
          Round Deep Dive
        </button>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto">
        {page === 'lessons' && (
          <DebriefMainLessons variant={variant} />
        )}
        {page === 'rounds' && (
          <DebriefRoundDeepDive
            finalResults={finalResults}
            variant={variant}
          />
        )}
      </div>

      {/* Optional: Next/Back for display mode */}
      {isDisplay && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-700">
          <button
            type="button"
            onClick={() => setPage(page === 'rounds' ? 'lessons' : 'lessons')}
            disabled={page === 'lessons'}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-4 py-2 font-medium transition-colors',
              page === 'lessons'
                ? 'text-slate-500 cursor-not-allowed'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="button"
            onClick={() => setPage(page === 'lessons' ? 'rounds' : 'rounds')}
            disabled={page === 'rounds'}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-4 py-2 font-medium transition-colors',
              page === 'rounds'
                ? 'text-slate-500 cursor-not-allowed'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

DebriefContent.displayName = 'DebriefContent';
