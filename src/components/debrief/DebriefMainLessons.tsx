/**
 * DebriefMainLessons Component
 *
 * Page 1 of the debrief: displays the three main lessons from the PRD
 * (cash optionality, diversification, balance sheet flexibility).
 */

import React from 'react';
import { Lightbulb, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAIN_LESSONS } from '@/data/debrief-curriculum';

export interface DebriefMainLessonsProps {
  className?: string;
  /** Display variant: fullscreen for big screen, card for admin embed */
  variant?: 'display' | 'admin';
}

export const DebriefMainLessons: React.FC<DebriefMainLessonsProps> = ({
  className,
  variant = 'display',
}) => {
  const isDisplay = variant === 'display';

  return (
    <div
      className={cn(
        'flex flex-col',
        isDisplay ? 'min-h-screen bg-slate-900 text-white py-16 px-12' : 'bg-white rounded-xl border border-slate-200 p-8',
        className
      )}
    >
      <div className={cn('mb-10', isDisplay ? 'text-center' : '')}>
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 mb-4',
            isDisplay ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-800'
          )}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">Main Lessons</span>
        </div>
        <h2
          className={cn(
            'font-bold',
            isDisplay ? 'text-4xl text-white mb-2' : 'text-2xl text-slate-800 mb-1'
          )}
        >
          Key Takeaways from the Simulation
        </h2>
        <p className={isDisplay ? 'text-slate-400 text-lg' : 'text-slate-600'}>
          Three principles that drove performance across the five rounds
        </p>
      </div>

      <div
        className={cn(
          'grid gap-6',
          isDisplay ? 'grid-cols-1 max-w-4xl mx-auto w-full' : 'grid-cols-1'
        )}
      >
        {MAIN_LESSONS.map((lesson, index) => (
          <div
            key={lesson.title}
            className={cn(
              'rounded-xl border p-6 flex gap-4',
              isDisplay
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-slate-50 border-slate-200'
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
                isDisplay ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
              )}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-semibold mb-1 flex items-center gap-2',
                  isDisplay ? 'text-xl text-white' : 'text-lg text-slate-800'
                )}
              >
                <Lightbulb className="w-5 h-5 flex-shrink-0" />
                {lesson.title}
              </h3>
              <p
                className={cn(
                  'text-sm mb-2',
                  isDisplay ? 'text-slate-400' : 'text-slate-500'
                )}
              >
                {lesson.principle}
              </p>
              <p className={isDisplay ? 'text-slate-300' : 'text-slate-700'}>
                {lesson.whyItMatters}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DebriefMainLessons.displayName = 'DebriefMainLessons';
