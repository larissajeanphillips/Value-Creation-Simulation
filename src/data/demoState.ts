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

/**
 * Load decisions for demo from public/decisions.json (same source as backend).
 * Fetches /decisions.json and filters by round. Run scripts/import-decisions-from-csv.mjs to generate the file.
 */
export function loadDecisionsForDemoRound(round: RoundNumber): Promise<Decision[]> {
  return fetch('/decisions.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load decisions'))))
    .then((all: unknown) => {
      if (!Array.isArray(all)) return [];
      return (all as Decision[]).filter((d) => d.introducedYear === round);
    })
    .catch(() => []);
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
    store.setRoundResults(null);
    store.setFinalResults(null);
    store.setTimeRemaining(480);
    loadDecisionsForDemoRound(1).then((decisions) => store.setAvailableDecisions(decisions));
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
