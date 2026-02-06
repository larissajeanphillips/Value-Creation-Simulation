/**
 * FrameworkOverview Component
 * 
 * Executive-ready visualization of the learning framework:
 * - Guiding Principles & Lessons
 * - KPI Scorecard
 * - Macro Dynamics (Scenarios)
 * - Special Events & Decision Mapping
 */

import React, { useState } from 'react';
import { 
  ArrowLeft,
  Target,
  TrendingUp,
  Shield,
  Wallet,
  Gauge,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BarChart3,
  Calendar,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MagnaLogo } from '../MagnaLogo';

interface FrameworkOverviewProps {
  onBack: () => void;
  className?: string;
}

type DetailView = 'landing' | 'principles' | 'kpis' | 'scenarios' | 'events';

// =============================================================================
// DATA
// =============================================================================

const GUIDING_PRINCIPLES = [
  {
    id: 'long-term',
    name: 'Long-Term Ownership Mentality',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    description: 'Incentives aligned to execution and long-term value; partnership-driven approach with OEMs',
    behaviors: [
      'Avoid short-term cuts that destroy long-term value',
      'Maintain investment capacity through cycles',
      'Position for recovery before it happens',
    ],
    lessons: ['Position for recovery'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio Management',
    icon: BarChart3,
    color: 'from-emerald-500 to-emerald-600',
    description: 'Target attractive markets; back leaders with path to profitable growth; exit non-core assets',
    behaviors: [
      'Diversify across customers, suppliers, geographies',
      'Actively manage portfolio composition',
      'Exit underperforming or non-strategic assets',
    ],
    lessons: ['Diversification pays off'],
  },
  {
    id: 'balance-sheet',
    name: 'Maintain Strong Balance Sheet',
    icon: Shield,
    color: 'from-amber-500 to-amber-600',
    description: 'Protect liquidity and investment-grade leverage (Debt/EBITDA: 1.0-1.5x)',
    behaviors: [
      'Preserve cash optionality',
      'Maintain flexibility through cycles',
      'Enable opportunistic moves during downturns',
    ],
    lessons: ['Cash optionality matters', 'Balance sheet flexibility enables opportunism'],
  },
  {
    id: 'capital-allocation',
    name: 'Capital Allocation Strategy',
    icon: Wallet,
    color: 'from-magna-red to-red-600',
    description: 'Maximize long-term FCF per share; prioritize profitable growth',
    behaviors: [
      'Margin improvement over volume growth',
      'Return excess capital appropriately',
      'Invest behind defensible advantages',
    ],
    lessons: ['Margin expansion > Growth'],
  },
];

const KPI_SCORECARD = [
  { name: 'Growth over Market', target: '2-4%', green: '2-4%', yellow: '<2%', red: 'Chasing volume' },
  { name: 'EBIT Margin', target: '≥10%', green: '≥10%', yellow: '8-10%', red: '<8%' },
  { name: 'CapEx to Sales', target: '4-4.5%', green: '4-4.5%', yellow: 'Under-investing', red: 'Over-investing' },
  { name: 'FCF Conversion', target: '>70%', green: '≥70%', yellow: '50-70%', red: '<50%' },
  { name: 'ROIC', target: '≥15%', green: '≥15%', yellow: '12-15%', red: '<12%' },
  { name: 'Debt / EBITDA', target: '1.0-1.5x', green: '1.0-1.5x', yellow: '-', red: 'Overleveraged' },
];

const SCENARIOS = [
  {
    round: 1,
    year: 'FY26',
    name: 'Business as Usual',
    narrative: 'The automotive market remains stable with moderate growth expectations. OEMs are investing in next-generation platforms while maintaining current production volumes. Supply chains have stabilized post-pandemic.',
    keyDetails: [
      'Steady demand across all vehicle segments',
      'Normal competitive dynamics',
      'Standard capital allocation decisions',
    ],
    smartResponse: 'Balance growth & optimization; build foundation',
    trap: 'Over-investing in risky growth bets too early',
    multipliers: { grow: 1.0, optimize: 1.0, sustain: 1.0 },
    color: 'emerald',
  },
  {
    round: 2,
    year: 'FY27',
    name: 'Business as Usual',
    narrative: 'Market conditions remain favorable with continued investment in electrification and advanced technologies.',
    keyDetails: [
      'Technology investments progressing as planned',
      'Healthy OEM order books',
    ],
    smartResponse: 'Execute on strategy; diversify OEM exposure',
    trap: 'Concentrating on single OEM relationships (BAIT CARD!)',
    multipliers: { grow: 1.0, optimize: 1.0, sustain: 1.0 },
    color: 'emerald',
  },
  {
    round: 3,
    year: 'FY28',
    name: 'Cost Pressures',
    narrative: 'Rising input costs and supply chain volatility are putting pressure on margins. Raw material prices have increased significantly, and labor costs are rising across key manufacturing regions.',
    keyDetails: [
      'Commodity prices up 15-20%',
      'OEMs demanding price reductions',
      'Wage inflation in key markets',
      'Energy costs impacting operations',
      'Focus on operational excellence',
    ],
    smartResponse: 'Pivot to Optimize decisions; preserve cash',
    trap: 'Doubling down on Grow (penalized at 0.7x!)',
    multipliers: { grow: 0.7, optimize: 1.2, sustain: 1.0 },
    color: 'amber',
  },
  {
    round: 4,
    year: 'FY29',
    name: 'Recession',
    narrative: 'A global economic recession has significantly reduced vehicle demand. OEMs are cutting production volumes and delaying new program launches. Consumer confidence is at multi-year lows.',
    keyDetails: [
      'Vehicle sales down 20-25%',
      'OEM program cancellations',
      'Customers in-sourcing to fill capacity',
      'Smaller suppliers at risk of bankruptcy',
      'Credit markets tightening',
      'Restructuring announcements across the industry',
    ],
    smartResponse: 'Sustain investments; opportunistic M&A if cash available',
    trap: 'Aggressive expansion (penalized at 0.5x!)',
    multipliers: { grow: 0.5, optimize: 1.0, sustain: 1.5 },
    color: 'red',
  },
  {
    round: 5,
    year: 'FY30',
    name: 'Recovery',
    narrative: 'The economy is recovering and automotive demand is rebounding. OEMs are ramping up production and launching delayed programs. Companies with strong balance sheets are well-positioned to capture growth.',
    keyDetails: [
      'Pent-up demand driving sales recovery',
      'New program launches resuming',
      'M&A opportunities emerging',
      'Technology investments paying off',
      'Strong performers gaining market share',
    ],
    smartResponse: 'Grow investments rewarded (1.3x); ride the wave',
    trap: 'Over-defensive play; excessive Sustain (0.8x)',
    multipliers: { grow: 1.3, optimize: 1.0, sustain: 0.8 },
    color: 'blue',
  },
];

const SPECIAL_EVENTS = [
  {
    name: 'OEM Program Cancellation',
    round: 3,
    description: 'Major OEM cancels flagship vehicle program',
    protected: 'Diversified OEM investments',
    punished: 'Concentrated single-OEM investment (R2 bait card)',
    isCritical: true,
  },
  {
    name: 'Supply Chain Disruption',
    round: 3,
    description: 'Major supplier failure disrupts production',
    protected: 'Dual-sourcing, supplier relationships',
    punished: 'Single-source dependencies',
    isCritical: false,
  },
  {
    name: 'Key Customer Loss',
    round: 4,
    description: 'OEM in-sources a key component',
    protected: 'Diversified customer base',
    punished: 'Over-reliance on single customer',
    isCritical: false,
  },
  {
    name: 'Technology Shift',
    round: 2,
    description: 'Technology transition accelerates faster than expected',
    protected: 'Early next-gen portfolio investment',
    punished: 'Underinvestment in technology transition',
    isCritical: false,
  },
  {
    name: 'Regulatory Change',
    round: 3,
    description: 'New environmental regulations announced',
    protected: 'Proactive compliance investments',
    punished: 'Deferred compliance spending',
    isCritical: false,
  },
  {
    name: 'Competitor Acquisition',
    round: 5,
    description: 'Competitor acquired, creating market opportunities',
    protected: 'Have capacity and cash to capture share',
    punished: 'Overleveraged or capacity-constrained',
    isCritical: false,
  },
];

const RISKY_DECISIONS = [
  { name: 'Southeast Asia Market Entry', round: 1, outcome: 'success', actual: '+$100M/yr (slightly below plan)' },
  { name: 'Autonomous Driving Systems Unit', round: 1, outcome: 'fail', actual: '-$50M/yr (technology pivot required)' },
  { name: 'Software-Defined Vehicle Platform', round: 2, outcome: 'success', actual: '+$220M/yr (exceeds expectations)' },
  { name: 'Distressed Competitor Acquisition', round: 3, outcome: 'success', actual: '+$200M/yr (integration challenges)' },
  { name: 'Chinese OEM Partnership', round: 3, outcome: 'fail', actual: '-$80M/yr (geopolitical tensions)' },
  { name: 'Vehicle-to-Grid Services Business', round: 3, outcome: 'success', actual: '+$40M/yr (slower market)' },
  { name: 'Solid-State Battery Research', round: 3, outcome: 'success', actual: '+$150M/yr (breakthrough!)' },
  { name: 'Hydrogen Fuel Cell Alliance', round: 4, outcome: 'success', actual: '+$30M/yr (modest)' },
  { name: 'Deep Cost Restructuring', round: 4, outcome: 'success', actual: '+$130M/yr (some capability damage)' },
  { name: 'Minimum Viable Maintenance', round: 4, outcome: 'fail', actual: '-$100M (equipment failure)' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const FrameworkOverview: React.FC<FrameworkOverviewProps> = ({ onBack, className }) => {
  const [view, setView] = useState<DetailView>('landing');

  return (
    <div className={cn("min-h-screen bg-slate-100", className)}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={view === 'landing' ? onBack : () => setView('landing')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {view === 'landing' ? 'Back to Dashboard' : 'Back to Overview'}
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <MagnaLogo variant="color" size="xs" />
              <span className="text-slate-800 font-semibold">Principles, Lessons & Dynamics</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'landing' && <LandingView onNavigate={setView} />}
        {view === 'principles' && <PrinciplesView />}
        {view === 'kpis' && <KPIsView />}
        {view === 'scenarios' && <ScenariosView />}
        {view === 'events' && <EventsView />}
      </main>
    </div>
  );
};

// =============================================================================
// LANDING VIEW
// =============================================================================

const LandingView: React.FC<{ onNavigate: (view: DetailView) => void }> = ({ onNavigate }) => {
  const cards = [
    {
      id: 'principles' as DetailView,
      title: 'Guiding Principles & Lessons',
      description: "Magna's 4 strategic principles and the 5 core lessons the game teaches",
      icon: Lightbulb,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'kpis' as DetailView,
      title: 'KPI Scorecard',
      description: 'Financial framework targets teams are assessed against',
      icon: Gauge,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'scenarios' as DetailView,
      title: 'Macro Dynamics',
      description: 'Round-by-round scenarios, multipliers, and expected responses',
      icon: Calendar,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      id: 'events' as DetailView,
      title: 'Events & Risk Outcomes',
      description: 'Special events and bait cards test diversification and risk management',
      icon: Zap,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-magna-red',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Learning Framework
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          The strategic principles and game dynamics designed to create memorable, 
          actionable learning for Magna's leadership team.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={cn(
              "group relative p-8 rounded-2xl border transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-xl",
              card.bgColor,
              card.borderColor
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                card.iconBg,
                card.iconColor
              )}>
                <card.icon className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-slate-600">{card.description}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-4 gap-4">
        {[
          { label: '4', sublabel: 'Guiding Principles' },
          { label: '5', sublabel: 'Core Lessons' },
          { label: '5', sublabel: 'Rounds/Scenarios' },
          { label: '6', sublabel: 'Special Events' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-magna-red mb-1">{stat.label}</div>
            <div className="text-sm text-slate-600">{stat.sublabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// PRINCIPLES VIEW
// =============================================================================

const PrinciplesView: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Guiding Principles & Lessons</h2>
      <p className="text-slate-600 mb-8">The game reinforces Magna's strategic framework through experiential learning.</p>

      <div className="space-y-6">
        {GUIDING_PRINCIPLES.map((principle) => (
          <div
            key={principle.id}
            className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden"
          >
            <div className={cn("bg-gradient-to-r p-6", principle.color)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <principle.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{principle.name}</h3>
                  <p className="text-white/80 text-sm">{principle.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Key Behaviors
                  </h4>
                  <ul className="space-y-2">
                    {principle.behaviors.map((behavior, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {behavior}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Related Lessons
                  </h4>
                  <div className="space-y-2">
                    {principle.lessons.map((lesson, i) => (
                      <div key={i} className="bg-magna-red/10 border border-magna-red/20 rounded-xl px-4 py-3 text-magna-red font-medium">
                        {lesson}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Core Lesson Summary */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-magna-red mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Key Insight for MGA
        </h3>
        <p className="text-slate-700 text-lg">
          <strong>Margin improvement is worth much more than growth</strong> based on Magna's position on the growth spread matrix 
          (ROIC slightly above WACC). Teams who prioritize Optimize decisions over Grow decisions will tend to outperform.
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// KPIs VIEW
// =============================================================================

const KPIsView: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">KPI Scorecard</h2>
      <p className="text-slate-600 mb-8">Teams are assessed against Magna's Financial Framework targets.</p>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-4 text-slate-600 font-semibold">KPI</th>
              <th className="text-center p-4 text-slate-600 font-semibold">Target</th>
              <th className="text-center p-4 text-emerald-600 font-semibold">🟢 On Track</th>
              <th className="text-center p-4 text-amber-600 font-semibold">🟡 Warning</th>
              <th className="text-center p-4 text-red-600 font-semibold">🔴 Off Track</th>
            </tr>
          </thead>
          <tbody>
            {KPI_SCORECARD.map((kpi, i) => (
              <tr key={i} className="border-t border-slate-200">
                <td className="p-4 text-slate-800 font-medium">{kpi.name}</td>
                <td className="p-4 text-center text-magna-red font-bold">{kpi.target}</td>
                <td className="p-4 text-center text-emerald-600">{kpi.green}</td>
                <td className="p-4 text-center text-amber-600">{kpi.yellow}</td>
                <td className="p-4 text-center text-red-600">{kpi.red}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Framework */}
      <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Financial Framework to Drive Value</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center w-48">
            <TrendingUp className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-slate-800 font-semibold">Sales Growth</div>
            <div className="text-slate-500 text-sm">Over Market</div>
          </div>
          <div className="text-4xl text-magna-red font-bold">+</div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center w-48">
            <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-slate-800 font-semibold">Profitability</div>
            <div className="text-slate-500 text-sm">Top 25% of Peers</div>
          </div>
          <div className="text-4xl text-magna-red font-bold">=</div>
          <div className="bg-magna-red rounded-2xl p-6 text-center w-48">
            <Target className="w-8 h-8 text-white mx-auto mb-2" />
            <div className="text-white font-bold">Profitable</div>
            <div className="text-white/80 text-sm">Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SCENARIOS VIEW
// =============================================================================

const scenarioColorClasses: Record<string, { bg: string; border: string; badge: string; cardBg: string }> = {
  emerald: { 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200',
    badge: 'bg-emerald-500',
    cardBg: 'bg-white',
  },
  amber: { 
    bg: 'bg-amber-50', 
    border: 'border-amber-200',
    badge: 'bg-amber-500',
    cardBg: 'bg-white',
  },
  red: { 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    badge: 'bg-red-500',
    cardBg: 'bg-white',
  },
  blue: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    badge: 'bg-blue-500',
    cardBg: 'bg-white',
  },
};

const ScenariosView: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Macro Dynamics & Round Details</h2>
      <p className="text-slate-600 mb-8">Round-by-round scenarios, market conditions, and the strategic responses they reward or punish.</p>

      {/* Timeline */}
      <div className="space-y-6">
        {SCENARIOS.map((scenario) => {
          const colors = scenarioColorClasses[scenario.color] || scenarioColorClasses.emerald;
          return (
            <div
              key={scenario.round}
              className={cn("bg-white border shadow-sm rounded-2xl overflow-hidden", colors.border)}
            >
              {/* Header */}
              <div className={cn("px-6 py-4 flex items-center justify-between", colors.bg)}>
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex flex-col items-center justify-center", colors.badge)}>
                    <span className="text-lg font-bold text-white">{scenario.round}</span>
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm">{scenario.year}</div>
                    <h3 className="text-xl font-bold text-slate-800">{scenario.name}</h3>
                  </div>
                </div>
                {scenario.round === 3 && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full font-medium border border-amber-200">
                    OEM CANCELLATION EVENT
                  </span>
                )}
                {/* Multipliers in header */}
                <div className="flex gap-2">
                  <MultiplierBadge label="Grow" value={scenario.multipliers.grow} />
                  <MultiplierBadge label="Optimize" value={scenario.multipliers.optimize} />
                  <MultiplierBadge label="Sustain" value={scenario.multipliers.sustain} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Narrative & Key Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Market Narrative
                    </h4>
                    <p className="text-slate-700 leading-relaxed">{scenario.narrative}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Key Details
                    </h4>
                    <ul className="space-y-2">
                      {scenario.keyDetails.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <span className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0", colors.badge)} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Strategic Guidance */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-2">
                      <CheckCircle2 className="w-4 h-4" /> Smart Response
                    </div>
                    <p className="text-slate-700">{scenario.smartResponse}</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold mb-2">
                      <XCircle className="w-4 h-4" /> Trap to Avoid
                    </div>
                    <p className="text-slate-700">{scenario.trap}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multiplier Legend */}
      <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Multiplier Impact on Returns
        </h4>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-slate-700">&gt;1.0x = Strategy outperforms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-400 rounded-full" />
            <span className="text-slate-700">1.0x = Normal returns</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-slate-700">&lt;1.0x = Strategy underperforms</span>
          </div>
        </div>
      </div>

      {/* Quick Reference Link */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-slate-800 font-medium">Big Screen Display Available</div>
              <div className="text-purple-600 text-sm">Show round details on the conference room screen</div>
            </div>
          </div>
          <a
            href="/display"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            Open Display Hub →
          </a>
        </div>
      </div>
    </div>
  );
};

const MultiplierBadge: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const color = value > 1 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
    : value < 1 ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-slate-100 text-slate-600 border-slate-200';
  
  return (
    <div className={cn("px-3 py-1.5 rounded-lg border text-sm font-medium", color)}>
      {label}: {value}x
    </div>
  );
};

// =============================================================================
// EVENTS VIEW
// =============================================================================

const EventsView: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Events & Risk Outcomes</h2>
      <p className="text-slate-600 mb-8">Special events and bait cards test whether teams have built resilience through diversification.</p>

      {/* Special Events */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600" />
          Special Events
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {SPECIAL_EVENTS.map((event, i) => (
            <div
              key={i}
              className={cn(
                "bg-white border shadow-sm rounded-xl p-5",
                event.isCritical ? "border-amber-300" : "border-slate-200"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-slate-800">{event.name}</h4>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                  Round {event.round}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-3">{event.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-700">{event.protected}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700">{event.punished}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bait Card Callout */}
      <div className="mb-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Round 2 Bait Cards
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-emerald-200 rounded-xl p-4">
            <div className="text-emerald-700 font-semibold mb-2">Diversified OEM Capacity Investment</div>
            <div className="text-slate-600 text-sm mb-2">Cost: $200M | Return: +$80M/yr</div>
            <div className="text-slate-700 text-sm">✓ Spreads risk across multiple OEMs - PROTECTED from cancellation</div>
          </div>
          <div className="bg-white border border-red-200 rounded-xl p-4">
            <div className="text-red-700 font-semibold mb-2">Concentrated OEM Capacity Investment</div>
            <div className="text-slate-600 text-sm mb-2">Cost: $180M | Projected: +$120M/yr</div>
            <div className="text-slate-700 text-sm">✗ Looks better but → <strong className="text-red-600">$0 return</strong> when OEM cancels in R3</div>
          </div>
        </div>
      </div>

      {/* Risky Decision Outcomes */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Risky Decision Outcomes (Pre-Determined)
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Scenario multipliers and diversification teach capital allocation trade-offs.
        </p>
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-4 text-slate-600 font-semibold">Decision</th>
                <th className="text-center p-4 text-slate-600 font-semibold">Round</th>
                <th className="text-center p-4 text-slate-600 font-semibold">Outcome</th>
                <th className="text-left p-4 text-slate-600 font-semibold">Actual Result</th>
              </tr>
            </thead>
            <tbody>
              {RISKY_DECISIONS.map((decision, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="p-4 text-slate-800">{decision.name}</td>
                  <td className="p-4 text-center text-slate-600">{decision.round}</td>
                  <td className="p-4 text-center">
                    {decision.outcome === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <XCircle className="w-4 h-4" /> Fails
                      </span>
                    )}
                  </td>
                  <td className={cn(
                    "p-4",
                    decision.outcome === 'success' ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {decision.actual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

FrameworkOverview.displayName = 'FrameworkOverview';
