/**
 * RoundScriptModal Component
 * 
 * Modal that displays the round description and exact facilitator script
 * for introducing each round's scenario and market context.
 */

import React from 'react';
import { 
  X, 
  Megaphone, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoundScriptModalProps {
  round: number;
  isOpen: boolean;
  onClose: () => void;
  onChangeRound?: (round: number) => void;
}

interface RoundScript {
  year: string;
  scenario: string;
  theme: string;
  icon: React.ReactNode;
  color: 'emerald' | 'amber' | 'red' | 'blue';
  duration: string;
  overview: string;
  keyPoints: string[];
  script: string;
  transitionNote?: string;
}

const ROUND_SCRIPTS: Record<number, RoundScript> = {
  1: {
    year: 'FY26',
    scenario: 'Business as Usual',
    theme: 'Foundation Setting',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'emerald',
    duration: '2 minutes',
    overview: 'This is the baseline round where teams learn the mechanics of the game. The market is stable, and teams should focus on understanding how their decisions impact share price.',
    keyPoints: [
      'Automotive market remains stable with moderate growth',
      'Supply chains have normalized post-pandemic',
      'Steady demand across ICE and EV segments',
      'Standard capital allocation decisions apply',
    ],
    script: `Good morning everyone, and welcome to Round 1 of the Value Creation Challenge.

The year is FY26. You are now the leadership team of Magna International, and your mission is simple but challenging: maximize shareholder value over the next five years.

Let me set the scene for you.

The automotive market has stabilized. After years of supply chain disruptions and semiconductor shortages, we're finally operating in a more predictable environment. Vehicle demand is steady—nothing extraordinary, but solid. OEMs are maintaining their production schedules and investing in next-generation platforms.

This is what we call "business as usual." But don't be fooled by the calm waters.

Your decisions today will set the foundation for everything that follows. You have a fixed capital pool to allocate across growth initiatives, operational improvements, and shareholder returns. Every dollar you spend—or don't spend—will have consequences.

Some things to consider as you deliberate:
• Where should Magna invest to capture future growth?
• How do you balance short-term returns with long-term positioning?
• Which opportunities align with your strategic priorities?

You have 10 minutes to make your capital allocation decisions. The clock starts now.

Remember: there are no right or wrong answers, only trade-offs. Choose wisely.`,
    transitionNote: 'After teams submit, proceed to results review.',
  },
  2: {
    year: 'FY27',
    scenario: 'Business as Usual',
    theme: 'Building Momentum',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'emerald',
    duration: '2 minutes',
    overview: 'Market conditions remain favorable. Teams should see the results of their Round 1 decisions and adjust their strategy accordingly.',
    keyPoints: [
      'EV transition accelerating as planned',
      'Healthy OEM order books',
      'Technology investments beginning to pay off',
      'Competitors making strategic moves',
    ],
    script: `Welcome to Round 2. The year is now FY27.

Let me give you the market update.

The good news: conditions remain favorable. The EV transition is progressing as the industry expected—not faster, not slower. OEM order books are healthy, and those of you who invested in electrification capabilities last round may be starting to see early returns.

But here's what's interesting.

Look around the room. Some teams made very different decisions in Round 1. Some invested heavily in growth. Others prioritized operational efficiency. A few focused on returning capital to shareholders. 

The market hasn't differentiated between these strategies yet—but it will.

This round, you need to consider:
• Are your Round 1 investments on track? Do you double down or diversify?
• What are your competitors doing, and does it change your approach?
• How do you balance continued investment with showing results?

This industry rewards patience and punishes short-term thinking. But it also punishes those who wait too long to act.

You have 10 minutes. Your decisions are due when the timer ends.

Make them count.`,
    transitionNote: 'After teams submit, highlight any early differentiators in share price.',
  },
  3: {
    year: 'FY28',
    scenario: 'Cost Pressures',
    theme: 'Testing Resilience',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'amber',
    duration: '2 minutes',
    overview: 'The first external shock. Rising costs test operational discipline. Teams must balance maintaining investments with protecting margins.',
    keyPoints: [
      'Commodity prices up 15-20%',
      'OEMs demanding price reductions',
      'Wage inflation in key manufacturing regions',
      'Energy costs impacting operations',
    ],
    script: `Round 3. The year is FY28. And the environment has changed.

I have some challenging news to share.

Costs are rising—significantly. Steel, aluminum, and other key commodities are up 15 to 20 percent. Energy costs have spiked. Labor markets are tight, and wages are increasing across all our major manufacturing regions.

But here's the real pressure point.

Your OEM customers aren't absorbing these costs. They're coming to you demanding price reductions. They're pointing to their own margin pressures and expecting their supply base to help.

This is the squeeze that separates good companies from great ones. We've all seen it before.

You now face difficult trade-offs:
• Do you protect margins by cutting costs aggressively? Where?
• Do you maintain investments in future growth, even if it hurts near-term performance?
• How do you respond to OEM pricing pressure without damaging relationships?
• Which operations need attention? Which can weather the storm?

The decisions you made in Rounds 1 and 2 matter now. Teams that invested in operational excellence may have an advantage. Teams that stretched for growth may feel the pinch.

You have 10 minutes to navigate this challenge.

The market is watching how you respond to adversity.`,
    transitionNote: 'Emphasize that cost pressures will continue to be a factor.',
  },
  4: {
    year: 'FY29',
    scenario: 'Recession',
    theme: 'Crisis Management',
    icon: <TrendingDown className="w-6 h-6" />,
    color: 'red',
    duration: '2 minutes',
    overview: 'The most challenging round. A global recession tests all aspects of strategy. Special mechanic: recession announcement comes mid-round, forcing teams to recalibrate.',
    keyPoints: [
      'Vehicle sales down 20-25%',
      'OEM program cancellations',
      'Smaller suppliers at risk of bankruptcy',
      'Credit markets tightening',
    ],
    script: `Round 4. FY29.

I'm going to start you off with what looks like a normal year, but stay alert. Things may change.

[INITIAL BRIEFING - Before recession announcement]

The market shows signs of cooling, but nothing dramatic. Consumer confidence has softened. Some OEMs are adjusting production forecasts downward. It feels like a typical cyclical adjustment.

Begin your deliberations...

[WAIT 2 MINUTES, THEN DELIVER RECESSION ANNOUNCEMENT]

Stop. I need your attention.

We've just received word. The global economy has entered a recession.

Vehicle sales are collapsing—down 20 to 25 percent from peak. OEMs are canceling programs and cutting production across the board. Several of our smaller competitors are facing bankruptcy. Credit markets are tightening, making financing difficult.

This is the stress test.

You now have a choice to make:
• Do you hunker down and protect cash?
• Do you see this as an opportunity to gain market share while competitors struggle?
• Which programs do you save? Which do you cut?
• How do you maintain your workforce and capabilities for the recovery?

The decisions you make in a downturn define the company you become in the upturn.

You have 10 more minutes to adjust your strategy. The clock is running.

Good luck.`,
    transitionNote: 'This round has a mid-round twist. Start teams with the normal briefing, then interrupt with the recession announcement after 2 minutes.',
  },
  5: {
    year: 'FY30',
    scenario: 'Recovery',
    theme: 'Capturing the Upswing',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'blue',
    duration: '2 minutes',
    overview: 'The final round. Economy rebounds and winners emerge. Teams that maintained capabilities and balance sheet strength can capture outsized growth.',
    keyPoints: [
      'Pent-up demand driving sales recovery',
      'New program launches resuming',
      'M&A opportunities emerging',
      'Strong performers gaining market share',
    ],
    script: `Final round. Round 5. The year is FY30.

The storm has passed.

The economy is recovering. Consumer confidence is rebounding. OEMs are ramping production back up, and the programs that were delayed are finally launching. Pent-up demand is creating opportunities across every segment.

But not everyone is positioned to capture it.

Look at the scoreboard. The teams that maintained their capabilities through the downturn—the ones that kept investing in their people, their technology, their customer relationships—they're now positioned to win.

Some of your competitors are still recovering. Some didn't make it. The supply base has consolidated, and there are M&A opportunities for those with strong balance sheets.

This is your final allocation.

Think carefully about:
• How do you capitalize on the recovery? Where is the growth?
• Are there acquisition targets that could accelerate your strategy?
• What's your final message to investors about Magna's future?
• How do you translate your decisions into lasting shareholder value?

This is it. Your final chance to shape Magna's trajectory.

You have 10 minutes to make your last capital allocation decisions.

After this, we calculate final share prices and announce the winner.

Make it count.`,
    transitionNote: 'Build energy—this is the final round. After results, proceed to overall simulation takeaways.',
  },
};

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    accent: 'bg-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    accent: 'bg-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    accent: 'bg-red-100',
    badge: 'bg-red-100 text-red-700',
    iconBg: 'bg-red-100',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    accent: 'bg-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    iconBg: 'bg-blue-100',
  },
};

export const RoundScriptModal: React.FC<RoundScriptModalProps> = ({
  round,
  isOpen,
  onClose,
  onChangeRound,
}) => {
  if (!isOpen) return null;

  const data = ROUND_SCRIPTS[round];
  if (!data) return null;

  const colors = colorClasses[data.color];

  const handlePrevRound = () => {
    if (round > 1 && onChangeRound) {
      onChangeRound(round - 1);
    }
  };

  const handleNextRound = () => {
    if (round < 5 && onChangeRound) {
      onChangeRound(round + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={cn("px-6 py-4 border-b flex items-center justify-between", colors.bg, colors.border)}>
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.iconBg, colors.text)}>
              {data.icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">
                  Round {round}: {data.scenario}
                </h2>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", colors.badge)}>
                  {data.year}
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-0.5">
                {data.theme} • {data.duration} introduction
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Round Navigation */}
            <div className="flex items-center gap-1 mr-4">
              <button
                onClick={handlePrevRound}
                disabled={round <= 1}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  round <= 1 
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => onChangeRound?.(r)}
                    className={cn(
                      "w-8 h-8 rounded-full text-sm font-medium transition-all",
                      r === round
                        ? cn(colors.badge, "ring-2 ring-offset-2", `ring-${data.color}-300`)
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextRound}
                disabled={round >= 5}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  round >= 5 
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Round Overview
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {data.overview}
            </p>
          </div>
          
          {/* Key Points */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Key Market Conditions
            </h3>
            <div className={cn("rounded-xl p-4", colors.bg)}>
              <ul className="space-y-2">
                {data.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0", colors.text.replace('text-', 'bg-'))} />
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Transition Note */}
          {data.transitionNote && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                <AlertTriangle className="w-4 h-4" />
                Facilitator Note
              </div>
              <p className="text-amber-800 text-sm">
                {data.transitionNote}
              </p>
            </div>
          )}
          
          {/* Script */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Facilitator Script
              </h3>
              <span className="text-xs text-slate-400 ml-2">
                (Read aloud to participants)
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="prose prose-slate max-w-none">
                {data.script.split('\n\n').map((paragraph, index) => {
                  // Check if it's a stage direction (in brackets)
                  if (paragraph.startsWith('[') && paragraph.endsWith(']')) {
                    return (
                      <div key={index} className="my-4 py-2 px-4 bg-amber-100 border-l-4 border-amber-400 text-amber-800 text-sm font-medium italic">
                        {paragraph}
                      </div>
                    );
                  }
                  // Check if it's a bullet list
                  if (paragraph.includes('•')) {
                    const items = paragraph.split('•').filter(Boolean);
                    return (
                      <ul key={index} className="my-3 space-y-1">
                        {items.map((item, i) => (
                          <li key={i} className="text-slate-700 ml-4">
                            • {item.trim()}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  // Regular paragraph
                  return (
                    <p key={index} className="text-slate-700 leading-relaxed mb-4 text-lg">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Deliver in approximately {data.duration}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

RoundScriptModal.displayName = 'RoundScriptModal';
