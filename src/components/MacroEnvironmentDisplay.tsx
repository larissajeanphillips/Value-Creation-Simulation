/**
 * MacroEnvironmentDisplay Component
 * 
 * Full-screen display for showing the macro environment on a big screen.
 * Designed for presentation during live game sessions.
 * 
 * Access via:
 * - /display - Shows current round (auto-updates with game)
 * - /display/1 through /display/5 - Shows specific round
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { MagnaLogo } from './MagnaLogo';

interface MacroEnvironmentDisplayProps {
  round: number;
  showNavigation?: boolean;
  onRoundChange?: (round: number) => void;
}

interface RoundData {
  year: string;
  scenario: string;
  narrative: string;
  details: string[];
  color: 'emerald' | 'amber' | 'red' | 'blue';
  bgGradient: string;
}

const ROUND_DATA: Record<number, RoundData> = {
  1: {
    year: 'FY26',
    scenario: 'Business as Usual',
    narrative: 'The automotive market remains stable with moderate growth expectations. OEMs are investing in next-generation platforms while maintaining current production volumes. Supply chains have stabilized post-pandemic.',
    details: [
      'Steady demand across all vehicle segments',
      'Normal competitive dynamics',
      'Supply chains operating smoothly',
    ],
    color: 'emerald',
    bgGradient: 'from-emerald-900 via-emerald-800 to-slate-900',
  },
  2: {
    year: 'FY27',
    scenario: 'Business as Usual',
    narrative: 'Market conditions remain favorable with continued investment in electrification and advanced technologies.',
    details: [
      'Technology investments progressing as planned',
      'Healthy OEM order books',
      'Consumer demand steady across segments',
    ],
    color: 'emerald',
    bgGradient: 'from-emerald-900 via-emerald-800 to-slate-900',
  },
  3: {
    year: 'FY28',
    scenario: 'Cost Pressures',
    narrative: 'Rising input costs and supply chain volatility are putting pressure on margins. Raw material prices have increased significantly, and labor costs are rising across key manufacturing regions.',
    details: [
      'Commodity prices up 15-20%',
      'OEMs demanding price reductions',
      'Wage inflation in key markets',
      'Energy costs impacting operations',
      'Focus on operational excellence',
    ],
    color: 'amber',
    bgGradient: 'from-amber-900 via-orange-800 to-slate-900',
  },
  4: {
    year: 'FY29',
    scenario: 'Recession',
    narrative: 'A global economic recession has significantly reduced vehicle demand. OEMs are cutting production volumes and delaying new program launches. Consumer confidence is at multi-year lows.',
    details: [
      'Vehicle sales down 20-25%',
      'OEM program cancellations',
      'Customers in-sourcing to fill capacity',
      'Smaller suppliers at risk of bankruptcy',
      'Credit markets tightening',
      'Restructuring announcements across the industry',
    ],
    color: 'red',
    bgGradient: 'from-red-900 via-red-800 to-slate-900',
  },
  5: {
    year: 'FY30',
    scenario: 'Recovery',
    narrative: 'The economy is recovering and automotive demand is rebounding. OEMs are ramping up production and launching delayed programs. Companies with strong balance sheets are well-positioned to capture growth.',
    details: [
      'Pent-up demand driving sales recovery',
      'New program launches resuming',
      'M&A opportunities emerging',
      'Technology investments paying off',
      'Strong performers gaining market share',
    ],
    color: 'blue',
    bgGradient: 'from-blue-900 via-blue-800 to-slate-900',
  },
};

const colorClasses = {
  emerald: {
    accent: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    bullet: 'bg-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  amber: {
    accent: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    bullet: 'bg-amber-400',
    glow: 'shadow-amber-500/20',
  },
  red: {
    accent: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    bullet: 'bg-red-400',
    glow: 'shadow-red-500/20',
  },
  blue: {
    accent: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    bullet: 'bg-blue-400',
    glow: 'shadow-blue-500/20',
  },
};

export const MacroEnvironmentDisplay: React.FC<MacroEnvironmentDisplayProps> = ({
  round,
  showNavigation = false,
  onRoundChange,
}) => {
  const data = ROUND_DATA[round] || ROUND_DATA[1];
  const colors = colorClasses[data.color];

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br",
      data.bgGradient,
      "flex flex-col"
    )}>
      {/* Header */}
      <header className="px-12 py-8 flex items-center justify-between">
        <MagnaLogo variant="white" size="lg" />
        <div className="flex items-center gap-4">
          <div className="text-white/60 text-xl font-medium">
            Value Creation Simulation
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className={cn(
            "px-4 py-2 rounded-full border text-lg font-semibold",
            colors.badge
          )}>
            Round {round} of 5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-12 pb-12">
        <div className="max-w-6xl w-full">
          {/* Year and Scenario */}
          <div className="text-center mb-12">
            <div className={cn("text-8xl font-black mb-4", colors.accent)}>
              {data.year}
            </div>
            <div className="text-5xl font-bold text-white">
              {data.scenario}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-12">
            {/* Narrative */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-white/60 text-lg font-semibold uppercase tracking-wider mb-4">
                Market Narrative
              </h3>
              <p className="text-white text-2xl leading-relaxed">
                {data.narrative}
              </p>
            </div>

            {/* Details */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-white/60 text-lg font-semibold uppercase tracking-wider mb-6">
                Key Details
              </h3>
              <ul className="space-y-4">
                {data.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className={cn(
                      "w-3 h-3 rounded-full mt-2 flex-shrink-0",
                      colors.bullet
                    )} />
                    <span className="text-white text-xl leading-relaxed">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation (optional, for manual control) */}
      {showNavigation && (
        <footer className="px-12 py-6 flex items-center justify-center gap-4">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => onRoundChange?.(r)}
              className={cn(
                "w-12 h-12 rounded-full font-bold text-lg transition-all",
                r === round
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              )}
            >
              {r}
            </button>
          ))}
        </footer>
      )}

      {/* Bottom Branding Bar */}
      <div className="px-12 py-4 border-t border-white/10 flex items-center justify-between">
        <div className="text-white/40 text-sm">
          Macro Environment Overview
        </div>
        <div className="flex items-center gap-6">
          {[1, 2, 3, 4, 5].map((r) => (
            <div
              key={r}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                r === round ? "bg-white w-8" : "bg-white/30"
              )}
            />
          ))}
        </div>
        <div className="text-white/40 text-sm">
          {data.year} • {data.scenario}
        </div>
      </div>
    </div>
  );
};

MacroEnvironmentDisplay.displayName = 'MacroEnvironmentDisplay';
