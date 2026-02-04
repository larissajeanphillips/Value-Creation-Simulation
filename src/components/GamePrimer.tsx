/**
 * GamePrimer Component
 * 
 * Displayed after team joins but before entering the lobby.
 * Shows game rules, objectives, setup, and helpful tips.
 */

import React from 'react';
import { 
  Target, 
  Users, 
  Clock, 
  TrendingUp, 
  DollarSign,
  ChevronRight,
  Shield,
  Lightbulb,
  BarChart3,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MagnaLogo } from './MagnaLogo';

interface GamePrimerProps {
  teamName: string;
  onContinue: () => void;
  className?: string;
}

export const GamePrimer: React.FC<GamePrimerProps> = ({ teamName, onContinue, className }) => {
  return (
    <div className={cn(
      "min-h-screen bg-slate-100",
      "flex flex-col p-6",
      className
    )}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <MagnaLogo variant="color" size="lg" />
        </div>
        <div className="inline-block bg-magna-red text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg shadow-magna-red/30">
          {teamName}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
            Welcome to the Value Creation Simulation
          </h1>
          <p className="text-slate-600 text-lg text-center mb-8">
            Here's everything you need to know before we begin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Objective */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-emerald-800">Your Objective</h2>
              </div>
              <p className="text-emerald-900 leading-relaxed">
                Maximize your company's <strong>share price</strong> over 5 rounds (fiscal years) 
                by making smart capital allocation decisions. The team with the highest share 
                price at the end wins!
              </p>
            </div>

            {/* Roles */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-800">Your Role</h2>
              </div>
              <p className="text-blue-900 leading-relaxed">
                Your team represents Magna's executive leadership. Each round, you'll 
                decide where to invest your capital to drive growth, improve operations, 
                and protect against risks.
              </p>
            </div>

            {/* How It Works */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-purple-800">How It Works</h2>
              </div>
              <ul className="text-purple-900 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>5 Rounds</strong> – Each round = 1 fiscal year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>10 minutes</strong> per round to make decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>Fixed budget</strong> each round – spend wisely!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>Market conditions change</strong> – adapt your strategy</span>
                </li>
              </ul>
            </div>

            {/* Decision Categories */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Layers className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-amber-800">Decision Categories</h2>
              </div>
              <div className="space-y-2 text-amber-900">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                  <span><strong>Grow:</strong> Investments to drive revenue growth</span>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span><strong>Optimize:</strong> Improve margins and efficiency</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <span><strong>Sustain:</strong> Protect against risks and maintain operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll See */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-200 rounded-lg">
                <BarChart3 className="w-6 h-6 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">What You'll See Each Round</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800 mb-1">Decision Cards</div>
                <p className="text-slate-600 text-sm">
                  Each card shows an investment option with costs, returns, and risks.
                  Click to select, click again to deselect.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800 mb-1">Budget Tracker</div>
                <p className="text-slate-600 text-sm">
                  Shows remaining capital. You cannot spend more than your budget allows.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800 mb-1">Timer</div>
                <p className="text-slate-600 text-sm">
                  Countdown shows time remaining. Decisions auto-submit when time runs out!
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-magna-red/5 to-magna-red/10 border border-magna-red/20 rounded-xl p-5 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-magna-red/10 rounded-lg">
                <Lightbulb className="w-6 h-6 text-magna-red" />
              </div>
              <h2 className="text-xl font-bold text-magna-red">Pro Tips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-magna-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <p className="text-slate-700">
                  <strong>Read the scenario</strong> – Each round has different market conditions that affect which decisions are best.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-magna-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <p className="text-slate-700">
                  <strong>Balance your portfolio</strong> – Don't put all your eggs in one basket. Diversify across Grow, Optimize, and Sustain.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-magna-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <p className="text-slate-700">
                  <strong>Think long-term</strong> – Some investments pay off over multiple rounds. Don't just optimize for now.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-magna-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <p className="text-slate-700">
                  <strong>Watch your competitors</strong> – Check the scoreboard between rounds to see how you stack up.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-10 py-4 bg-magna-red text-white rounded-xl font-bold text-xl hover:bg-magna-red-dark transition-colors shadow-lg shadow-magna-red/30"
            >
              I'm Ready to Play!
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

GamePrimer.displayName = 'GamePrimer';
