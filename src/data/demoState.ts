/**
 * Demo state - Mock game and admin state for click-through demos (no backend).
 * applyPlayerDemoStep(step) and applyAdminDemoStep(step) seed the stores so
 * the real components render the correct screen.
 */

import { useGameStore } from '@/stores/gameStore';
import { useAdminStore } from '@/stores/adminStore';
import type {
  GameState,
  GameStatus,
  RoundNumber,
  TeamState,
  FinancialMetrics,
  ScenarioState,
  Decision,
  RoundResults,
  FinalResults,
  TeamRoundResult,
  MarketOutlook,
  FinalTeamResult,
  TeamRoundSnapshot,
  DecisionSummary,
  SnapshotMetrics,
} from '@/types/game';

// =============================================================================
// Shared mock building blocks
// =============================================================================

const BASELINE_METRICS: FinancialMetrics = {
  revenue: 42000,
  cogs: -37800,
  sga: -2520,
  ebitda: 1680,
  depreciation: -420,
  amortization: -210,
  ebit: 1050,
  cashTaxes: -200,
  capex: -500,
  operatingFCF: 350,
  beginningCash: 2000,
  endingCash: 2350,
  npv: 25000,
  equityValue: 24000,
  sharesOutstanding: 287,
  sharePrice: 83.6,
  ebitMargin: 2.5,
  roic: 4.2,
};

function makeTeamState(
  teamId: number,
  teamName: string,
  isClaimed: boolean,
  cashBalance: number,
  stockPrice: number,
  hasSubmitted: boolean
): TeamState {
  return {
    teamId,
    teamName,
    isClaimed,
    cashBalance,
    currentRoundDecisions: [],
    allDecisions: [],
    metrics: { ...BASELINE_METRICS, sharePrice: stockPrice },
    stockPrice,
    cumulativeTSR: 0,
    roundTSR: 0,
    hasSubmitted,
    draftDecisionIds: [],
  };
}

const MOCK_SCENARIO: ScenarioState = {
  type: 'business_as_usual',
  narrative: 'Business as usual – stable growth.',
  modifiers: { growMultiplier: 1, optimizeMultiplier: 1, sustainMultiplier: 1 },
  eventTriggered: false,
};

function makeGameState(
  status: GameStatus,
  currentRound: RoundNumber,
  teams: Record<number, TeamState>,
  teamCount: number
): GameState {
  return {
    status,
    currentRound,
    roundTimeRemaining: 600,
    roundDuration: 600,
    teams,
    scenario: MOCK_SCENARIO,
    teamCount,
  };
}

/** Demo decisions: 5 Grow + 5 Optimize + 5 Sustain (matches live game round 1). */
function makeMockDecisions(): Decision[] {
  return [
    // ===== GROW (5 options) =====
    {
      id: 'demo-grow-1',
      decisionNumber: 1,
      category: 'grow',
      subcategory: 'Expand Manufacturing Footprint',
      name: 'Expand capacity in key region',
      narrative: 'Invest in capacity to capture growth.',
      cost: 150,
      impactMagnitude: 3,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 2,
      rampUpYears: 2,
      isOneTimeBenefit: false,
      growMetrics: {
        revenue1Year: 80,
        fiveYearGrowth: 5,
        investmentsTotal: 300,
        investmentPeriod: 2,
        inYearInvestment: 150,
        ebitMargin: 10,
      },
    },
    {
      id: 'demo-grow-2',
      decisionNumber: 2,
      category: 'grow',
      subcategory: 'Scale R&D for Next-Gen Portfolio',
      name: 'Advanced Powertrain R&D Expansion',
      narrative: 'Invest in expanding R&D capabilities for next-generation vehicle powertrains and propulsion systems. Positions for advanced mobility with returns over 2–3 years.',
      cost: 200,
      impactMagnitude: 4,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 2,
      rampUpYears: 3,
      isOneTimeBenefit: false,
      growMetrics: {
        revenue1Year: 120,
        fiveYearGrowth: 5,
        investmentsTotal: 400,
        investmentPeriod: 2,
        inYearInvestment: 200,
        ebitMargin: 11,
      },
    },
    {
      id: 'demo-grow-3',
      decisionNumber: 3,
      category: 'grow',
      subcategory: 'Enter New Geography / Market',
      name: 'Southeast Asia Market Entry',
      narrative: 'Establish manufacturing presence in Thailand/Vietnam to serve growing ASEAN automotive market. Lower labor costs; execution risk in new geography.',
      cost: 180,
      impactMagnitude: 3,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 2,
      rampUpYears: 3,
      isOneTimeBenefit: false,
      growMetrics: {
        revenue1Year: 100,
        fiveYearGrowth: 3,
        investmentsTotal: 360,
        investmentPeriod: 2,
        inYearInvestment: 180,
        ebitMargin: 5,
      },
    },
    {
      id: 'demo-grow-4',
      decisionNumber: 4,
      category: 'grow',
      subcategory: 'JV / Strategic Partnership',
      name: 'Battery Technology JV',
      narrative: 'Form joint venture with battery cell manufacturer to secure supply and develop integrated battery systems. Strategic hedge against OEM vertical integration.',
      cost: 250,
      impactMagnitude: 4,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '3. Stay flexible',
      durationYears: 2,
      rampUpYears: 2,
      isOneTimeBenefit: false,
      growMetrics: {
        revenue1Year: 60,
        fiveYearGrowth: 0,
        investmentsTotal: 500,
        investmentPeriod: 2,
        inYearInvestment: 250,
        ebitMargin: 10,
      },
    },
    {
      id: 'demo-grow-5',
      decisionNumber: 5,
      category: 'grow',
      subcategory: 'Expand Manufacturing Footprint',
      name: 'Concentrated OEM Capacity Investment',
      narrative: 'Major capacity investment for an OEM flagship vehicle program. Higher projected returns with dedicated production lines and simpler logistics.',
      cost: 120,
      impactMagnitude: 4,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 1,
      rampUpYears: 1,
      isOneTimeBenefit: false,
      growMetrics: {
        revenue1Year: 70,
        fiveYearGrowth: 3,
        investmentsTotal: 240,
        investmentPeriod: 2,
        inYearInvestment: 120,
        ebitMargin: 5,
      },
    },
    // ===== OPTIMIZE (5 options) =====
    {
      id: 'demo-opt-1',
      decisionNumber: 6,
      category: 'optimize',
      subcategory: 'Factory of the Future',
      name: 'Smart Factory Pilot Program',
      narrative: 'Implement Industry 4.0 technologies in flagship facility. IoT sensors, AI-driven quality control, and predictive maintenance.',
      cost: 60,
      impactMagnitude: 3,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 1,
      rampUpYears: 2,
      isOneTimeBenefit: false,
      optimizeMetrics: {
        implementationCost: 0,
        investment: 60,
        investmentPeriod: 2,
        inYearInvestment: 30,
        annualCost: 25,
      },
    },
    {
      id: 'demo-opt-2',
      decisionNumber: 7,
      category: 'optimize',
      subcategory: 'SG&A Optimization',
      name: 'Shared Services Consolidation',
      narrative: 'Consolidate back-office functions (finance, HR, IT) into regional shared services centers. Upfront investment yields ongoing cost savings.',
      cost: 0,
      impactMagnitude: 2,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 1,
      rampUpYears: 1,
      isOneTimeBenefit: false,
      optimizeMetrics: {
        implementationCost: 25,
        investment: 0,
        investmentPeriod: 1,
        inYearInvestment: 0,
        annualCost: 25,
      },
    },
    {
      id: 'demo-opt-3',
      decisionNumber: 8,
      category: 'optimize',
      subcategory: 'Global Supply Chain Redesign',
      name: 'Supplier Dual-Sourcing Initiative',
      narrative: 'Establish secondary suppliers for critical components. Increases supply chain resilience and negotiating leverage.',
      cost: 0,
      impactMagnitude: 3,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 1,
      rampUpYears: 1,
      isOneTimeBenefit: false,
      optimizeMetrics: {
        implementationCost: 20,
        investment: 0,
        investmentPeriod: 1,
        inYearInvestment: 0,
        annualCost: 40,
      },
    },
    {
      id: 'demo-opt-4',
      decisionNumber: 9,
      category: 'optimize',
      subcategory: 'Enterprise Digital Transformation',
      name: 'ERP System Upgrade',
      narrative: 'Launch enterprise-wide Data & ERP Transformation. Enables advanced analytics, AI-driven automation, and improved decision-making.',
      cost: 60,
      impactMagnitude: 2,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '2. Cash is king',
      durationYears: 1,
      rampUpYears: 2,
      isOneTimeBenefit: false,
      optimizeMetrics: {
        implementationCost: 0,
        investment: 60,
        investmentPeriod: 2,
        inYearInvestment: 30,
        annualCost: 25,
      },
    },
    {
      id: 'demo-opt-5',
      decisionNumber: 10,
      category: 'optimize',
      subcategory: 'Organizational Restructure',
      name: 'Management Delayering',
      narrative: 'Execute a management reorganization to de-layer the organization, accelerating decision-making and sustainably reducing overhead.',
      cost: 0,
      impactMagnitude: 2,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '3. Stay flexible',
      durationYears: 1,
      rampUpYears: 1,
      isOneTimeBenefit: false,
      optimizeMetrics: {
        implementationCost: 10,
        investment: 0,
        investmentPeriod: 1,
        inYearInvestment: 0,
        annualCost: 25,
      },
    },
    // ===== SUSTAIN (5 options) =====
    {
      id: 'demo-sustain-1',
      decisionNumber: 11,
      category: 'sustain',
      subcategory: 'Portfolio management (maintenance)',
      name: 'Customer Diversification Initiative',
      narrative: 'Allocate incremental investment to expand sales coverage and key-account capabilities beyond top customers, mitigating concentration risk.',
      cost: 40,
      impactMagnitude: 2,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 1,
      rampUpYears: 2,
      isOneTimeBenefit: false,
      sustainMetrics: {
        implementationCost: 0,
        investment: 40,
        investmentPeriod: 1,
        inYearInvestment: 40,
        annualCost: 0,
      },
    },
    {
      id: 'demo-sustain-2',
      decisionNumber: 12,
      category: 'sustain',
      subcategory: 'Talent & Leadership Upskilling',
      name: 'Technical Talent Development',
      narrative: 'Investment in training and development for engineering workforce. Essential to maintain competitive capabilities.',
      cost: 0,
      impactMagnitude: 2,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 1,
      rampUpYears: 2,
      isOneTimeBenefit: false,
      sustainMetrics: {
        implementationCost: 15,
        investment: 0,
        investmentPeriod: 1,
        inYearInvestment: 0,
        annualCost: 20,
      },
    },
    {
      id: 'demo-sustain-3',
      decisionNumber: 13,
      category: 'sustain',
      subcategory: 'Risk & Compliance Upgrade',
      name: 'Cybersecurity Enhancement',
      narrative: 'Comprehensive cybersecurity upgrade across IT infrastructure. Essential protection against growing cyber threats.',
      cost: 40,
      impactMagnitude: 2,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '3. Stay flexible',
      durationYears: 1,
      rampUpYears: 1,
      isOneTimeBenefit: false,
      sustainMetrics: {
        implementationCost: 0,
        investment: 40,
        investmentPeriod: 1,
        inYearInvestment: 40,
        annualCost: 0,
      },
    },
    {
      id: 'demo-sustain-4',
      decisionNumber: 14,
      category: 'sustain',
      subcategory: 'Capital allocation strategy (maintenance)',
      name: 'Equipment Refresh Program',
      narrative: 'Scheduled replacement of aging manufacturing equipment. Maintains reliability and quality.',
      cost: 40,
      impactMagnitude: 3,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '1. Grow profitably',
      durationYears: 1,
      rampUpYears: 1,
      isOneTimeBenefit: false,
      sustainMetrics: {
        implementationCost: 0,
        investment: 40,
        investmentPeriod: 1,
        inYearInvestment: 40,
        annualCost: 0,
      },
    },
    {
      id: 'demo-sustain-5',
      decisionNumber: 15,
      category: 'sustain',
      subcategory: 'Risk & Compliance Upgrade',
      name: 'Environmental Compliance Investment',
      narrative: 'Proactive investment to meet upcoming environmental regulations. Mandatory compliance; early investment avoids rushed future spending.',
      cost: 0,
      impactMagnitude: 2,
      introducedYear: 1,
      type: 'organic',
      guidingPrinciple: '3. Stay flexible',
      durationYears: 1,
      rampUpYears: 1,
      isOneTimeBenefit: false,
      sustainMetrics: {
        implementationCost: 15,
        investment: 0,
        investmentPeriod: 1,
        inYearInvestment: 0,
        annualCost: 25,
      },
    },
  ];
}

const MOCK_MARKET_OUTLOOK: MarketOutlook = {
  backwardStatements: ['Markets remained stable in FY26.'],
  forwardStatements: ['Continued focus on capital allocation in FY27.'],
};

// =============================================================================
// Player demo steps (0..5): Team Selection → Lobby → Primer → Decision → Results → Final
// =============================================================================

export function applyPlayerDemoStep(step: number): void {
  const store = useGameStore.getState();
  store.setConnected(true);
  store.setConnecting(false);
  store.setConnectionError(null);

  if (step === 0) {
    store.reset();
    store.setConnected(true);
    store.setConnecting(false);
    store.setConnectionError(null);
    return;
  }

  const demoTeamId = 1;
  const demoTeamName = 'Demo Team';
  const teams: Record<number, TeamState> = {};
  for (let i = 1; i <= 8; i++) {
    teams[i] = makeTeamState(
      i,
      `Team ${i}`,
      i <= 5,
      500,
      100,
      false
    );
  }
  teams[demoTeamId] = makeTeamState(demoTeamId, demoTeamName, true, 500, 100, false);

  store.setTeamId(demoTeamId);
  store.setTeamName(demoTeamName);
  store.setJoinedGame(true);

  if (step === 1) {
    store.setPrimerShown(true);
    store.updateGameState(makeGameState('lobby', 1, teams, 8));
    store.setAvailableDecisions([]);
    store.setRoundResults(null);
    store.setFinalResults(null);
    return;
  }

  if (step === 2) {
    store.setPrimerShown(false);
    store.updateGameState(makeGameState('lobby', 1, teams, 8));
    store.setAvailableDecisions([]);
    store.setRoundResults(null);
    store.setFinalResults(null);
    return;
  }

  if (step === 3) {
    store.setPrimerShown(true);
    store.updateGameState(makeGameState('active', 1, teams, 8));
    store.setAvailableDecisions(makeMockDecisions());
    store.setRoundResults(null);
    store.setFinalResults(null);
    store.setTimeRemaining(480);
    return;
  }

  if (step === 4) {
    store.setPrimerShown(true);
    store.updateGameState(makeGameState('results', 1, teams, 8));
    store.setAvailableDecisions([]);
    const teamResults: TeamRoundResult[] = [1, 2, 3, 4, 5, 6, 7, 8].map((id, idx) => ({
      teamId: id,
      stockPrice: 100 - idx * 2,
      stockPriceChange: -idx * 2,
      roundTSR: -idx * 0.02,
      cumulativeTSR: -idx * 0.02,
      rank: idx + 1,
      decisionsCount: 2,
      totalSpent: 200,
      stockPricesByRound: { 1: 100 - idx * 2 },
    }));
    const roundResults: RoundResults = {
      round: 1,
      scenarioNarrative: MOCK_SCENARIO.narrative,
      teamResults,
      marketOutlook: MOCK_MARKET_OUTLOOK,
    };
    store.setRoundResults(roundResults);
    store.setFinalResults(null);
    return;
  }

  if (step === 5) {
    store.setPrimerShown(true);
    store.updateGameState(makeGameState('finished', 5, teams, 8));
    store.setAvailableDecisions([]);
    store.setRoundResults(null);
    const leaderboard: FinalTeamResult[] = [1, 2, 3, 4, 5, 6, 7, 8].map((id, idx) => ({
      teamId: id,
      teamName: `Team ${id}`,
      finalStockPrice: 100 - idx * 3,
      totalTSR: -idx * 0.03,
      rank: idx + 1,
      startingStockPrice: 100,
      totalDividends: 0,
    }));
    const snapMetrics: SnapshotMetrics = {
      stockPrice: 100,
      roic: 4,
      revenueGrowth: 2,
      ebitdaMargin: 4,
      ebitMargin: 2.5,
      cogsToRevenue: 90,
      sgaToRevenue: 6,
    };
    const summary: DecisionSummary = {
      id: 'demo-1',
      name: 'Demo decision',
      cost: 100,
      category: 'grow',
    };
    const snapshot: TeamRoundSnapshot = {
      round: 1,
      stockPrice: 100,
      roundTSR: 0,
      cumulativeTSR: 0,
      cashSpent: 100,
      decisions: [summary],
      metrics: snapMetrics,
    };
    const finalResults: FinalResults = {
      leaderboard,
      winnerId: 1,
      simulationSummary: 'Five-year simulation complete. Top performers maintained discipline.',
      teamHistories: { 1: [snapshot], 2: [snapshot], 3: [snapshot], 4: [snapshot], 5: [snapshot], 6: [snapshot], 7: [snapshot], 8: [snapshot] },
    };
    store.setFinalResults(finalResults);
    return;
  }
}

// =============================================================================
// Admin demo steps (0..3): Dashboard → Framework → Scoreboard → Agenda
// =============================================================================

export function applyAdminDemoStep(step: number): void {
  useAdminStore.getState().setAuthenticated(true);
  useAdminStore.getState().setAuthenticating(false);
  useAdminStore.getState().setAuthError(null);

  const teams: Record<number, TeamState> = {};
  for (let i = 1; i <= 8; i++) {
    teams[i] = makeTeamState(
      i,
      `Team ${i}`,
      i <= 5,
      500,
      100 + (5 - i) * 2,
      i <= 3
    );
  }
  const status: GameStatus = step === 0 ? 'lobby' : 'active';
  const round: RoundNumber = step >= 2 ? 2 : 1;
  const gameState = makeGameState(status, round, teams, 8);
  useGameStore.getState().updateGameState(gameState);
  useGameStore.getState().setConnected(true);
  useGameStore.getState().setConnecting(false);
  useGameStore.getState().setConnectionError(null);
}
