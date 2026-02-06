/**
 * Debrief curriculum: main lessons and per-round best/worst decisions.
 * Used by the debrief UI (Main Lessons + Round Deep Dive).
 */

export interface MainLesson {
  title: string;
  principle: string;
  whyItMatters: string;
}

export interface CurriculumDecision {
  name: string;
  reason: string;
  category: 'grow' | 'optimize' | 'sustain';
}

export interface RoundCurriculum {
  round: number;
  title: string;
  scenario: string;
  best: CurriculumDecision[];
  worst: CurriculumDecision[];
}

/** Three main lessons from the PRD (Core Lessons Mapped to Principles) */
export const MAIN_LESSONS: MainLesson[] = [
  {
    title: 'Cash optionality matters',
    principle: 'Maintain Strong Balance Sheet',
    whyItMatters:
      'Sometimes holding cash beats investing, especially before downturns. Preserve liquidity and investment-grade leverage so you can act when others cannot.',
  },
  {
    title: 'Diversification pays off',
    principle: 'Portfolio Management',
    whyItMatters:
      'Spreading risk across customers, suppliers, and geographies protects against concentrated failures. Actively manage portfolio concentration.',
  },
  {
    title: 'Balance sheet flexibility enables opportunism',
    principle: 'Maintain Strong Balance Sheet',
    whyItMatters:
      'Dry powder allows opportunistic M&A when competitors struggle. Those who preserved cash could capitalize on Round 4’s distressed valuations.',
  },
];

/** Per-round best and worst decisions (curriculum-based). Match decision names to teamHistories for "teams that selected". */
export const BEST_WORST_BY_ROUND: RoundCurriculum[] = [
  {
    round: 1,
    title: 'FY2026 – Business as Usual',
    scenario: 'Stable market, EV transition underway. Balance growth & optimization; build foundation.',
    best: [
      {
        name: 'Battery Technology JV',
        category: 'grow',
        reason:
          'Secured supply chain positioning and technology access early, before competition intensified. Strategic value compounded over multiple rounds.',
      },
      {
        name: 'Southeast Asia Market Entry',
        category: 'grow',
        reason:
          'Execution slightly below plan but viable. Diversified geography and positioned for growth in attractive markets.',
      },
      {
        name: 'ERP System Upgrade',
        category: 'optimize',
        reason:
          'ROI-driven efficiency and margin improvement. Built foundation for later rounds without over-committing capital.',
      },
    ],
    worst: [
      {
        name: 'Autonomous Driving Systems Unit',
        category: 'grow',
        reason:
          'Technology pivot required; investment lost. High-risk bet that failed—teaching selective risk-taking.',
      },
      {
        name: 'Advanced Powertrain R&D Expansion',
        category: 'grow',
        reason:
          'Business-as-usual round rewarded balance. Large early commitments reduced flexibility for later rounds.',
      },
    ],
  },
  {
    round: 2,
    title: 'FY2027 – Business as Usual',
    scenario: 'Continued stability. Execute on strategy; diversify OEM exposure.',
    best: [
      {
        name: 'Diversified OEM Capacity Investment',
        category: 'grow',
        reason:
          'While offering slightly lower projected returns, this investment spread risk across multiple OEM customers. When the OEM Program Cancellation hit in Round 3, diversified teams were protected.',
      },
      {
        name: 'Software-Defined Vehicle Platform',
        category: 'grow',
        reason:
          'Industry adoption exceeded expectations. Positioned for next-gen technology without concentration risk.',
      },
      {
        name: 'Supplier Dual-Sourcing Initiative',
        category: 'optimize',
        reason:
          'Reduced single-supplier dependency. Protected against supply chain disruption in later rounds.',
      },
    ],
    worst: [
      {
        name: 'Concentrated OEM Capacity Investment',
        category: 'grow',
        reason:
          'Despite attractive projected returns, betting everything on one OEM’s flagship program was a trap. When that OEM cancelled the program in Round 3, the entire investment value evaporated.',
      },
      {
        name: 'European Advanced Assembly Facility',
        category: 'grow',
        reason:
          'Concentration in one region or customer left teams exposed to the Round 3 OEM program cancellation.',
      },
    ],
  },
  {
    round: 3,
    title: 'FY2028 – Cost Pressures',
    scenario: 'Raw materials ↑, labor ↑, OEM pushback. Pivot to Optimize; preserve cash.',
    best: [
      {
        name: 'Deep Cost Restructuring',
        category: 'optimize',
        reason:
          'Margin focus was rewarded (1.2x). Preserved cash and improved efficiency without doubling down on Grow.',
      },
      {
        name: 'Solid-State Battery Research',
        category: 'grow',
        reason:
          'Breakthrough accelerated timeline. Selective high-impact Grow bet that paid off in a cost-pressure environment.',
      },
      {
        name: 'Preserving cash / minimal discretionary spend',
        category: 'sustain',
        reason:
          'Sometimes holding cash beats investing. Teams that preserved cash had firepower for Round 4’s recession-driven opportunities.',
      },
    ],
    worst: [
      {
        name: 'Distressed Competitor Acquisition',
        category: 'grow',
        reason:
          'Spending heavily during the cost pressure round depleted cash right before the recession. Teams that made this acquisition couldn’t afford Round 4’s better opportunities.',
      },
      {
        name: 'Vehicle-to-Grid Services Business',
        category: 'grow',
        reason:
          'Speculative bet on an emerging market with uncertain payoff timing, launched during the worst possible round. Capital would have been better preserved for Round 4.',
      },
      {
        name: 'Minimum Viable Maintenance',
        category: 'sustain',
        reason:
          'Deferred maintenance caught up—equipment failure. Sustain means maintaining, not cutting corners.',
      },
    ],
  },
  {
    round: 4,
    title: 'FY2029 – Recession',
    scenario: 'Auto sales ↓↓; cash is king. Opportunistic M&A if cash available.',
    best: [
      {
        name: 'Opportunistic Acquisition - Premium Supplier',
        category: 'grow',
        reason:
          'Recession-driven valuations created a rare chance to acquire a premium supplier at a significant discount. Teams with cash reserves could make this counter-cyclical move.',
      },
      {
        name: 'Underutilized Capacity Purchase',
        category: 'grow',
        reason:
          'Assets at significant discounts. Balance sheet flexibility enabled opportunism when competitors were constrained.',
      },
      {
        name: 'Selective Sustain investments',
        category: 'sustain',
        reason:
          'Recession rewarded Sustain (1.5x). Protecting the base while avoiding aggressive expansion preserved value.',
      },
    ],
    worst: [
      {
        name: 'Aggressive expansion during recession',
        category: 'grow',
        reason:
          'Grow was penalized at 0.5x. Teams that doubled down on expansion during the recession destroyed value.',
      },
      {
        name: 'Over-leveraged or capacity-constrained',
        category: 'grow',
        reason:
          'Without dry powder from Round 3, teams couldn’t capture distressed M&A opportunities.',
      },
    ],
  },
  {
    round: 5,
    title: 'FY2030 – Recovery',
    scenario: 'Market rebounds; rising tide. Grow investments rewarded (1.3x).',
    best: [
      {
        name: 'Growth bets that rode the recovery',
        category: 'grow',
        reason:
          'Grow was rewarded at 1.3x. Teams that maintained investment capacity could ride the rising tide.',
      },
      {
        name: 'Positioning for recovery (from R4 investments)',
        category: 'grow',
        reason:
          'Counter-cyclical investments made in Round 4 paid off as the market normalized.',
      },
      {
        name: 'Balanced deployment of capital',
        category: 'optimize',
        reason:
          'Recovery rewarded growth without punishing Optimize. Those who had flexibility could deploy confidently.',
      },
    ],
    worst: [
      {
        name: 'Over-defensive play',
        category: 'sustain',
        reason:
          'Excessive Sustain was penalized at 0.8x. Recovery was the wrong time to stay in bunker mode.',
      },
      {
        name: 'Under-investing when growth was rewarded',
        category: 'sustain',
        reason:
          'Those who over-preserved cash in Round 5 missed the 1.3x Grow multiplier.',
      },
    ],
  },
];
