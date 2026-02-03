/**
 * DisplayHub Component
 * 
 * Landing page for AV teams to select which display to show on big screens.
 * Provides easy access to all display options with previews.
 * 
 * Access via: /display
 */

import React from 'react';
import { Monitor, BarChart3, Calendar, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MagnaLogo } from './MagnaLogo';

interface DisplayOption {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const DISPLAY_OPTIONS: DisplayOption[] = [
  {
    id: 'scoreboard',
    title: 'Live Scoreboard',
    description: 'Real-time team rankings, stock prices, and performance chart. Auto-updates every 3 seconds.',
    url: '/display/scoreboard',
    icon: <BarChart3 className="w-8 h-8" />,
    color: 'text-blue-400',
    bgGradient: 'from-blue-600 to-blue-800',
  },
  {
    id: 'round-1',
    title: 'FY26 - Business as Usual',
    description: 'Stable market conditions. OEMs investing in next-gen platforms.',
    url: '/display/1',
    icon: <Calendar className="w-8 h-8" />,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'round-2',
    title: 'FY27 - Business as Usual',
    description: 'Continued stability. Market conditions remain favorable.',
    url: '/display/2',
    icon: <Calendar className="w-8 h-8" />,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'round-3',
    title: 'FY28 - Cost Pressures',
    description: 'Rising input costs and margin squeeze across the industry.',
    url: '/display/3',
    icon: <Calendar className="w-8 h-8" />,
    color: 'text-amber-400',
    bgGradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'round-4',
    title: 'FY29 - Recession',
    description: 'Economic downturn. Vehicle sales down 20-25%.',
    url: '/display/4',
    icon: <Calendar className="w-8 h-8" />,
    color: 'text-red-400',
    bgGradient: 'from-red-600 to-red-800',
  },
  {
    id: 'round-5',
    title: 'FY30 - Recovery',
    description: 'Market rebound. Pent-up demand driving growth.',
    url: '/display/5',
    icon: <Calendar className="w-8 h-8" />,
    color: 'text-blue-400',
    bgGradient: 'from-blue-600 to-blue-800',
  },
];

export const DisplayHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MagnaLogo variant="white" size="md" />
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <h1 className="text-2xl font-bold">Display Hub</h1>
              <p className="text-slate-400 text-sm">Big Screen Presentation Displays</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
            <Monitor className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300">Select a display for your big screen</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Instructions */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">For AV Teams</h2>
          <p className="text-slate-400">
            Click any display below to open it. Each display is designed for full-screen presentation 
            on conference room screens. The <strong>Scoreboard</strong> auto-updates in real-time. 
            The <strong>Round displays</strong> show the current market environment and should be 
            changed manually when the facilitator advances rounds.
          </p>
        </div>

        {/* Scoreboard - Featured */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Live Display (Auto-Updates)
          </h3>
          <a
            href="/display/scoreboard"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className={cn(
              "bg-gradient-to-br from-blue-600 to-blue-800",
              "rounded-xl p-8 border border-blue-500/30",
              "hover:scale-[1.02] transition-all duration-200",
              "shadow-lg hover:shadow-blue-500/20"
            )}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1">Live Scoreboard</h4>
                    <p className="text-blue-200">
                      Real-time team rankings, stock prices, and performance chart
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-blue-200 group-hover:bg-white/20 transition-colors">
                  <span className="text-sm font-medium">Open Display</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-blue-300">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Auto-updates every 3 seconds
                </span>
                <span>•</span>
                <span>Shows all team rankings</span>
                <span>•</span>
                <span>Stock price history chart</span>
              </div>
            </div>
          </a>
        </div>

        {/* Round Displays */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Round Environment Displays (Update Manually)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISPLAY_OPTIONS.filter(opt => opt.id.startsWith('round')).map((option) => (
              <a
                key={option.id}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className={cn(
                  "bg-gradient-to-br",
                  option.bgGradient,
                  "rounded-xl p-6 border border-white/10",
                  "hover:scale-[1.02] transition-all duration-200",
                  "shadow-lg"
                )}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center",
                      option.color
                    )}>
                      {option.icon}
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{option.title}</h4>
                  <p className="text-white/70 text-sm">{option.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Quick Access URLs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Scoreboard</div>
              <code className="text-emerald-400 font-mono text-sm">/display/scoreboard</code>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Round 1 (FY26)</div>
              <code className="text-emerald-400 font-mono text-sm">/display/1</code>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Round 2 (FY27)</div>
              <code className="text-emerald-400 font-mono text-sm">/display/2</code>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Round 3 (FY28)</div>
              <code className="text-emerald-400 font-mono text-sm">/display/3</code>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Round 4 (FY29)</div>
              <code className="text-emerald-400 font-mono text-sm">/display/4</code>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Round 5 (FY30)</div>
              <code className="text-emerald-400 font-mono text-sm">/display/5</code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-500">
          <span>Value Creation Challenge - Display Hub</span>
          <span>All displays optimized for large screens</span>
        </div>
      </footer>
    </div>
  );
};

DisplayHub.displayName = 'DisplayHub';
