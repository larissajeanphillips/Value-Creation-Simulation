/**
 * Value Creation Simulation - Game Types
 * Core data models for the capital allocation simulation game
 */

// =============================================================================
// Enums & Constants
// =============================================================================

/** Decision categories - matches the 3 pillars of capital allocation */
export type DecisionCategory = 'grow' | 'optimize' | 'sustain';

/** Game status - tracks the lifecycle of a game session */
export type GameStatus = 'lobby' | 'active' | 'paused' | 'results' | 'finished';

/** Round numbers - 5 rounds representing fiscal years 2026-2030 */
export type RoundNumber = 1 | 2 | 3 | 4 | 5;

/** Decision type - organic growth vs acquisitions/divestitures */
export type DecisionType = 'organic' | 'inorganic';

/** Investment duration in years */
export type DurationYears = 1 | 2;

/** Ramp-up period until full impact */
export type RampUpYears = 1 | 2 | 3;

/** Impact magnitude scale (1-5) */
export type ImpactMagnitude = 1 | 2 | 3 | 4 | 5;

// =============================================================================
// Decision Card Interface
// =============================================================================

/**
 * Decision - A single investment decision card
 * 75 total cards: 25 Grow + 25 Optimize + 25 Sustain
 */
export interface Decision {
  /** Unique identifier for the decision */
  id: string;
  
  /** Decision number from Excel (1-75) for reference */
  decisionNumber: number;
  
  /** Category: grow, optimize, or sustain */
  category: DecisionCategory;
  
  /** Subcategory within the main category (e.g., "Acquire a Business", "SG&A Optimization") */
  subcategory: string;
  
  /** Short title for the decision */
  name: string;
  
  /** One-sentence brief for front of card (from Excel column G); if absent, first sentence of narrative is used */
  brief?: string;
  
  /** Detailed description/narrative of the decision (back of card, from Excel column H) */
  narrative: string;
  
  /** One-time cost in USD millions */
  cost: number;
  
  /** Impact magnitude on a 1-5 scale */
  impactMagnitude: ImpactMagnitude;
  
  /** Which round this card becomes available (1-5) */
  introducedYear: RoundNumber;
  
  /** Organic growth vs inorganic (M&A) */
  type: DecisionType;
  
  /** Which strategic principle this decision relates to */
  guidingPrinciple: string;
  
  // Duration & Timing
  /** How many years of cost commitment (1 or 2) */
  durationYears: DurationYears;
  
  /** Years until full impact realized (1, 2, or 3) */
  rampUpYears: RampUpYears;
  
  /** True for divestitures - provides one-time benefit instead of recurring */
  isOneTimeBenefit: boolean;
  
  // Impact specifics (for calculation engine)
  /** Percentage change to revenue (primarily for Grow decisions) */
  revenueImpact?: number;
  
  /** Percentage change to COGS (primarily for Optimize decisions) */
  cogsImpact?: number;
  
  /** Percentage change to SG&A (primarily for Optimize decisions) */
  sgaImpact?: number;
  
  /** Annual benefit in USD millions after ramp-up */
  recurringBenefit?: number;
  
  /** Which risk event this prevents (for Sustain decisions) */
  riskPrevention?: string;
  
  /** Which special event makes this decision's returns go to $0 (trap cards) */
  vulnerableTo?: string;
  
  /** Metrics displayed on card back - specific to decision category */
  /** Grow-specific metrics from Excel columns V–AA (Total Investment, period, Revenue 1yr, 5yr growth, EBIT margin) */
  growMetrics?: GrowMetrics;
  
  /** Optimize-specific metrics from Excel columns AB–AF (Total Investment, period, Impl cost, Annual cost savings) */
  optimizeMetrics?: OptimizeMetrics;
  
  /** Sustain-specific metrics from Excel columns AG–AK (Total Investment, period, Impl cost, Annual cost savings) */
  sustainMetrics?: SustainMetrics;
}

/**
 * GrowMetrics - Metrics displayed on the back of Grow decision cards
 * Data from Excel Decisions tab columns V–AA (Total Investment, Investment period, Revenue 1 year, 5-year growth %, EBIT margin %)
 */
export interface GrowMetrics {
  /** Revenue in year 1 (in USD millions) */
  revenue1Year: number;
  
  /** 5-year revenue growth rate (as percentage, e.g., 5.0 = 5%) */
  fiveYearGrowth: number;
  
  /** Total investments required (in USD millions) */
  investmentsTotal: number;
  
  /** Investment period in years */
  investmentPeriod: number;
  
  /** In-year investment (total / period) in USD millions – shown on card front */
  inYearInvestment?: number;
  
  /** EBIT margin (as percentage, e.g., 11.0 = 11%) */
  ebitMargin: number;
}

/**
 * OptimizeMetrics - Metrics displayed on the back of Optimize decision cards
 * Data from Excel Decisions tab columns AY-BB
 */
export interface OptimizeMetrics {
  /** Implementation cost (in USD millions) */
  implementationCost: number;
  
  /** Total investment (in USD millions) - same as cost on front of card */
  investment: number;
  
  /** Investment period in years */
  investmentPeriod: number;
  
  /** In-year investment (total / period) in USD millions – shown on card front */
  inYearInvestment?: number;
  
  /** Annual cost savings (in USD millions) */
  annualCost: number;
}

/**
 * SustainMetrics - Metrics displayed on the back of Sustain decision cards
 * Data from Excel Decisions tab columns AG–AK (Total Investment, Investment period, Implementation cost, Annual cost savings)
 */
export interface SustainMetrics {
  /** Implementation cost (in USD millions) */
  implementationCost: number;
  
  /** Total investment (in USD millions) - same as cost on front of card */
  investment: number;
  
  /** Investment period in years */
  investmentPeriod: number;
  
  /** In-year investment (total / period) in USD millions – shown on card front */
  inYearInvestment?: number;
  
  /** Annual cost (in USD millions) */
  annualCost: number;
}

// =============================================================================
// Team & Player State
// =============================================================================

/**
 * TeamDecision - A decision made by a team in a specific round
 */
export interface TeamDecision {
  /** Reference to the decision card ID */
  decisionId: string;
  
  /** Which round the decision was made */
  round: RoundNumber;
  
  /** Timestamp when the decision was submitted */
  submittedAt: string;
  
  /** The cost paid for this decision (may differ from card cost due to modifiers) */
  actualCost: number;
}

/**
 * TeamState - Current state of a single team
 */
export interface TeamState {
  /** Team number (1-20, based on configuration) */
  teamId: number;
  
  /** Team name entered by the player */
  teamName: string;
  
  /** Whether this team slot has been claimed */
  isClaimed: boolean;
  
  /** Socket ID for the team's connection (for reconnection handling) */
  socketId?: string;
  
  /** Current available cash balance in USD millions */
  cashBalance: number;
  
  /** Decisions made in the current round (not yet finalized) */
  currentRoundDecisions: TeamDecision[];
  
  /** All decisions across all rounds (finalized) */
  allDecisions: TeamDecision[];
  
  /** Current financial metrics */
  metrics: FinancialMetrics;
  
  /** Current stock price in USD */
  stockPrice: number;
  
  /** Cumulative TSR from game start */
  cumulativeTSR: number;
  
  /** TSR for just the current/last round */
  roundTSR: number;
  
  /** Whether the team has submitted decisions for the current round */
  hasSubmitted: boolean;
  
  /** Draft decision IDs (selected but not yet submitted) - used for auto-submit on timeout */
  draftDecisionIds: string[];
}

// =============================================================================
// Financial Metrics
// =============================================================================

/**
 * FinancialMetrics - Complete financial state for a team
 * Based on Magna's simplified financial model
 */
export interface FinancialMetrics {
  // Income Statement (all values in USD millions)
  /** Total revenue */
  revenue: number;
  
  /** Cost of goods sold (negative value) */
  cogs: number;
  
  /** Selling, general & administrative expenses (negative value) */
  sga: number;
  
  /** EBITDA = Revenue + COGS + SG&A (COGS and SG&A are negative) */
  ebitda: number;
  
  /** Depreciation expense (negative value) */
  depreciation: number;
  
  /** Amortization expense (negative value) */
  amortization: number;
  
  /** EBIT = EBITDA + Depreciation + Amortization */
  ebit: number;
  
  // Cash Flow (all values in USD millions)
  /** Cash taxes paid (negative value) */
  cashTaxes: number;
  
  /** Capital expenditures (negative value) */
  capex: number;
  
  /** Operating Free Cash Flow */
  operatingFCF: number;
  
  /** Cash at beginning of period */
  beginningCash: number;
  
  /** Cash at end of period */
  endingCash: number;
  
  // Valuation (all values in USD millions except per-share)
  /** Net Present Value / Enterprise Value */
  npv: number;
  
  /** Equity Value = NPV - Net Debt */
  equityValue: number;
  
  /** Number of shares outstanding (in millions) */
  sharesOutstanding: number;
  
  /** Share price = Equity Value / Shares Outstanding */
  sharePrice: number;
  
  // Derived Metrics
  /** EBIT Margin = EBIT / Revenue */
  ebitMargin: number;
  
  /** Return on Invested Capital */
  roic: number;
}

// =============================================================================
// Scenario & Game State
// =============================================================================

/** Scenario types that affect decision outcomes */
export type ScenarioType = 
  | 'business_as_usual'  // Rounds 1-2
  | 'cost_pressure'      // Round 3
  | 'recession'          // Round 4
  | 'recovery';          // Round 5

/**
 * ScenarioModifiers - Multipliers applied to decision outcomes
 * Based on current market conditions
 */
export interface ScenarioModifiers {
  /** Multiplier for Grow decisions */
  growMultiplier: number;
  
  /** Multiplier for Optimize decisions */
  optimizeMultiplier: number;
  
  /** Multiplier for Sustain decisions */
  sustainMultiplier: number;
}

/**
 * ScenarioState - Current scenario conditions
 */
export interface ScenarioState {
  /** Current scenario type */
  type: ScenarioType;
  
  /** Narrative description shown to teams */
  narrative: string;
  
  /** Active modifiers for this scenario */
  modifiers: ScenarioModifiers;
  
  /** Whether a special event has been triggered by facilitator */
  eventTriggered: boolean;
  
  /** Description of the triggered event (if any) */
  eventDescription?: string;
}

/**
 * GameState - Complete state of the game
 * This is the authoritative state held by the server
 */
export interface GameState {
  /** Current game status */
  status: GameStatus;
  
  /** Current round number (1-5) */
  currentRound: RoundNumber;
  
  /** Seconds remaining in the current round */
  roundTimeRemaining: number;
  
  /** Total round duration in seconds (for calculating progress) */
  roundDuration: number;
  
  /** All team states indexed by team ID */
  teams: Record<number, TeamState>;
  
  /** Current scenario state */
  scenario: ScenarioState;
  
  /** Configured number of teams (10-20) */
  teamCount: number;
  
  /** Game start timestamp */
  startedAt?: string;
  
  /** Round start timestamp */
  roundStartedAt?: string;
}

// =============================================================================
// Game Configuration
// =============================================================================

/**
 * GameConfig - Configurable game settings
 */
export interface GameConfig {
  /** Number of teams (10-20) */
  teamCount: number;
  
  /** Duration of each round in seconds (default: 600 = 10 minutes) */
  roundDurationSeconds: number;
  
  /** Admin PIN for facilitator access */
  adminPin: string;
}

/**
 * BaselineFinancials - Starting financial position (2024 EOY / 2025 Start)
 * Based on Magna International's 2024 Annual Report
 */
export interface BaselineFinancials {
  // Income Statement
  revenue: number;
  cogs: number;
  sga: number;
  ebitda: number;
  depreciation: number;
  amortization: number;
  ebit: number;
  
  // Cash Flow
  cashTaxes: number;
  capex: number;
  operatingFCF: number;
  beginningCash: number;
  dividends: number;
  shareBuybacks: number;
  
  // Balance Sheet
  netDebt: number;
  minorityInterest: number;
  investedCapital: number;
  
  // Valuation
  npv: number;
  equityValue: number;
  sharesOutstanding: number;
  sharePrice: number;
  
  // Rates
  costOfEquity: number;
}

// =============================================================================
// WebSocket Event Types
// =============================================================================

/** Events sent from client to server */
export interface ClientToServerEvents {
  /** Team joins with a team name */
  'join-game': (teamName: string, callback: (success: boolean, error?: string, teamId?: number) => void) => void;
  
  /** Team submits decisions for current round */
  'submit-decisions': (decisions: string[], callback: (success: boolean, error?: string) => void) => void;
  
  /** Team unsubmits to edit decisions before round ends */
  'unsubmit-decisions': (callback: (success: boolean, error?: string) => void) => void;
  
  /** Team selects/deselects a decision (for real-time tracking) */
  'toggle-decision': (decisionId: string, selected: boolean) => void;
  
  /** Sync all draft selections at once (for reconnection or bulk updates) */
  'sync-draft-selections': (decisionIds: string[]) => void;
}

/** Events sent from server to client */
export interface ServerToClientEvents {
  /** Full game state update */
  'game-state-update': (state: GameState) => void;
  
  /** Timer tick (every second during active round) */
  'timer-tick': (secondsRemaining: number) => void;
  
  /** Round has started */
  'round-start': (round: RoundNumber, availableDecisions: Decision[]) => void;
  
  /** Round has ended, showing results */
  'round-end': (results: RoundResults) => void;
  
  /** Game has finished, showing final results */
  'game-end': (finalResults: FinalResults) => void;
  
  /** A team has joined */
  'team-joined': (teamId: number) => void;
  
  /** A team has submitted decisions */
  'team-submitted': (teamId: number) => void;
  
  /** A team has unsubmitted to edit decisions */
  'team-unsubmitted': (teamId: number) => void;
  
  /** Scenario event triggered by facilitator */
  'scenario-event': (description: string) => void;
}

/** Events for admin/facilitator */
export interface AdminToServerEvents {
  /** Verify admin PIN */
  'admin-auth': (pin: string, callback: (success: boolean) => void) => void;
  
  /** Configure team count */
  'config-teams': (count: number) => void;
  
  /** Start the game (begin Round 1) */
  'start-game': () => void;
  
  /** Pause current round */
  'pause-round': () => void;
  
  /** Resume paused round */
  'resume-round': () => void;
  
  /** Force-end current round */
  'end-round': () => void;
  
  /** Advance to next round */
  'next-round': () => void;
  
  /** Trigger a scenario event */
  'trigger-event': (eventType: string) => void;
}

// =============================================================================
// Results Types
// =============================================================================

/**
 * TeamRoundResult - A team's results for a single round
 */
export interface TeamRoundResult {
  teamId: number;
  stockPrice: number;
  stockPriceChange: number;
  roundTSR: number;
  cumulativeTSR: number;
  rank: number;
  decisionsCount: number;
  totalSpent: number;
  /** Historical stock prices by round (for chart display) */
  stockPricesByRound: Record<number, number>;
}

/**
 * RoundResults - Results displayed after a round ends
 */
export interface RoundResults {
  round: RoundNumber;
  scenarioNarrative: string;
  teamResults: TeamRoundResult[];
  /** Dynamic market outlook with backward/forward looking statements */
  marketOutlook: MarketOutlook;
}

/**
 * FinalTeamResult - A team's final standing
 */
export interface FinalTeamResult {
  teamId: number;
  teamName: string;
  finalStockPrice: number;
  totalTSR: number;
  rank: number;
  startingStockPrice: number;
  totalDividends: number;
}

/**
 * DecisionSummary - Minimal decision info for display in Game Recap
 */
export interface DecisionSummary {
  id: string;
  name: string;
  cost: number;
  category: DecisionCategory;
}

/**
 * SnapshotMetrics - Key financial metrics captured at end of each round
 * Used for historical tracking and display in final results
 */
export interface SnapshotMetrics {
  /** Stock price at end of round */
  stockPrice: number;
  
  /** Return on Invested Capital */
  roic: number;
  
  /** Revenue growth vs previous round (or vs baseline for round 1) */
  revenueGrowth: number;
  
  /** EBITDA / Revenue */
  ebitdaMargin: number;
  
  /** EBIT / Revenue */
  ebitMargin: number;
  
  /** COGS / Revenue (absolute value) */
  cogsToRevenue: number;
  
  /** SG&A / Revenue (absolute value) */
  sgaToRevenue: number;
}

/**
 * MarketOutlook - Dynamic market outlook with backward and forward looking statements
 */
export interface MarketOutlook {
  /** Backward-looking statements about what happened this round */
  backwardStatements: string[];
  
  /** Forward-looking statements about what's coming next */
  forwardStatements: string[];
}

/**
 * TeamRoundSnapshot - Captures a team's state at the end of a round
 * Used for Game Recap feature to show how the game played out
 */
export interface TeamRoundSnapshot {
  /** Which round this snapshot is from */
  round: RoundNumber;
  
  /** Stock price at end of round */
  stockPrice: number;
  
  /** TSR for this round */
  roundTSR: number;
  
  /** Cumulative TSR through this round */
  cumulativeTSR: number;
  
  /** Total cash spent on decisions this round */
  cashSpent: number;
  
  /** Decisions selected this round with summary info */
  decisions: DecisionSummary[];
  
  /** Historical metrics captured at end of round */
  metrics: SnapshotMetrics;
}

/**
 * FinalResults - Final game results after Round 5 + simulation
 */
export interface FinalResults {
  /** All teams ranked by TSR */
  leaderboard: FinalTeamResult[];
  
  /** The winning team ID */
  winnerId: number;
  
  /** Summary of 2031-2035 simulation */
  simulationSummary: string;
  
  /** Round-by-round history for each team (for Game Recap) */
  teamHistories: Record<number, TeamRoundSnapshot[]>;
}
