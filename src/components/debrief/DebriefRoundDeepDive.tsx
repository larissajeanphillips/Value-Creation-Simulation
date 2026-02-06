/**
 * DebriefRoundDeepDive Component
 *
 * Page 2 of the debrief: round 1-5 selector and per-round best/worst decisions
 * with reasons and "teams that selected" derived from teamHistories.
 */

import React, { useMemo, useState } from 'react';
import { ThumbsUp, ThumbsDown, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BEST_WORST_BY_ROUND } from '@/data/debrief-curriculum';
import type { FinalResults } from '@/types/game';
import type { TeamRoundSnapshot } from '@/types/game';

/** Returns team IDs that selected the given decision in the given round. */
export function getTeamsForDecision(
  teamHistories: Record<number, TeamRoundSnapshot[]>,
  round: number,
  decisionName: string
): number[] {
  const teamIds: number[] = [];
  for (const [teamIdStr, history] of Object.entries(teamHistories)) {
    const teamId = parseInt(teamIdStr, 10);
    const snapshot = history.find((s) => s.round === round);
    if (!snapshot) continue;
    const selected = snapshot.decisions.some(
      (d) => d.name.trim().toLowerCase() === decisionName.trim().toLowerCase()
    );
    if (selected) teamIds.push(teamId);
  }
  return teamIds.sort((a, b) => a - b);
}

/** Get team name by ID from leaderboard, or fallback to "Team N". */
function getTeamLabel(leaderboard: FinalResults['leaderboard'], teamId: number): string {
  const entry = leaderboard.find((e) => e.teamId === teamId);
  return entry ? entry.teamName : `Team ${teamId}`;
}

export interface DebriefRoundDeepDiveProps {
  className?: string;
  finalResults: FinalResults | null;
  /** Display variant: fullscreen for big screen, card for admin embed */
  variant?: 'display' | 'admin';
}

export const DebriefRoundDeepDive: React.FC<DebriefRoundDeepDiveProps> = ({
  className,
  finalResults,
  variant = 'display',
}) => {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const isDisplay = variant === 'display';

  const roundCurriculum = useMemo(
    () => BEST_WORST_BY_ROUND.find((r) => r.round === selectedRound),
    [selectedRound]
  );

  const leaderboard = finalResults?.leaderboard ?? [];
  const teamHistories = finalResults?.teamHistories ?? {};

  if (!roundCurriculum) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        isDisplay ? 'min-h-screen bg-slate-900 text-white py-12 px-10' : 'bg-white rounded-xl border border-slate-200 p-6',
        className
      )}
    >
      {/* Round selector */}
      <div className={cn('mb-8', isDisplay ? 'text-center' : '')}>
        <h2
          className={cn(
            'font-bold mb-4',
            isDisplay ? 'text-3xl text-white' : 'text-xl text-slate-800'
          )}
        >
          Round Deep Dive
        </h2>
        <p className={cn('mb-6', isDisplay ? 'text-slate-400' : 'text-slate-600 text-sm')}>
          Select a round to see the best and worst decisions and which teams chose them
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRound(r)}
              className={cn(
                'rounded-lg px-5 py-2.5 font-semibold transition-colors',
                selectedRound === r
                  ? isDisplay
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-amber-500 text-white'
                  : isDisplay
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              Round {r}
            </button>
          ))}
        </div>
      </div>

      {/* Selected round content */}
      <div className={cn('flex-1', isDisplay ? 'max-w-5xl mx-auto w-full' : '')}>
        <div
          className={cn(
            'rounded-xl border p-6 mb-6',
            isDisplay ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <h3 className={cn('font-bold', isDisplay ? 'text-2xl text-white' : 'text-xl text-slate-800')}>
              {roundCurriculum.title}
            </h3>
          </div>
          <p className={cn('mb-6', isDisplay ? 'text-slate-400' : 'text-slate-600')}>
            {roundCurriculum.scenario}
          </p>

          {/* Best decisions */}
          <div className="mb-8">
            <h4 className={cn('font-semibold mb-3 flex items-center gap-2', isDisplay ? 'text-emerald-400' : 'text-emerald-700')}>
              <ThumbsUp className="w-5 h-5" />
              Best decisions this round
            </h4>
            <ul className="space-y-4">
              {roundCurriculum.best.map((d) => {
                const teamIds = getTeamsForDecision(teamHistories, selectedRound, d.name);
                return (
                  <li
                    key={d.name}
                    className={cn(
                      'rounded-lg border p-4',
                      isDisplay ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
                    )}
                  >
                    <div className={cn('font-medium', isDisplay ? 'text-white' : 'text-slate-800')}>{d.name}</div>
                    <p className={cn('text-sm mt-1', isDisplay ? 'text-slate-300' : 'text-slate-600')}>
                      {d.reason}
                    </p>
                    {teamIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 flex-shrink-0 text-slate-500" />
                        <span className={isDisplay ? 'text-slate-400' : 'text-slate-500'}>
                          Teams that selected: {teamIds.map((id) => getTeamLabel(leaderboard, id)).join(', ')}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Worst decisions */}
          <div>
            <h4 className={cn('font-semibold mb-3 flex items-center gap-2', isDisplay ? 'text-red-400' : 'text-red-700')}>
              <ThumbsDown className="w-5 h-5" />
              Worst decisions this round
            </h4>
            <ul className="space-y-4">
              {roundCurriculum.worst.map((d) => {
                const teamIds = getTeamsForDecision(teamHistories, selectedRound, d.name);
                return (
                  <li
                    key={d.name}
                    className={cn(
                      'rounded-lg border p-4',
                      isDisplay ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
                    )}
                  >
                    <div className={cn('font-medium', isDisplay ? 'text-white' : 'text-slate-800')}>{d.name}</div>
                    <p className={cn('text-sm mt-1', isDisplay ? 'text-slate-300' : 'text-slate-600')}>
                      {d.reason}
                    </p>
                    {teamIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 flex-shrink-0 text-slate-500" />
                        <span className={isDisplay ? 'text-slate-400' : 'text-slate-500'}>
                          Teams that selected: {teamIds.map((id) => getTeamLabel(leaderboard, id)).join(', ')}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

DebriefRoundDeepDive.displayName = 'DebriefRoundDeepDive';
