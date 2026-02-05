/**
 * Decision Data - All Rounds (1-5)
 * 
 * Extracted from Excel model: 260127 TSR decisions_v2.8 (1).xlsx
 * Tab: Decisions, Columns U-AB (metadata) and A121:P1546 (cash flows)
 * 
 * All 75 decisions stored in single file, filtered by round as needed
 */

export interface DecisionCashFlows {
  Investment: number[];              // Capex (negative)
  'Implementation Cost': number[];   // One-time costs (negative)
  Acquisition: number[];             // M&A cost (negative)
  Premium: number[];                 // Acquisition premium (negative)
  Revenue: number[];                 // Incremental revenue (positive)
  'Growth ': number[];               // Incremental growth $ (positive) - Note the space!
  COGS: number[];                    // Incremental COGS (negative)
  'SG&A': number[];                  // Incremental SG&A (negative)
  'SG&A savings': number[];          // SG&A cost reductions (positive)
  'COGS savings': number[];          // COGS cost reductions (positive)
  'Manufacturing OH savings': number[]; // Manufacturing OH savings (positive)
  Synergies: number[];               // M&A synergies (positive)
}

export interface Decision {
  id: number;                        // Decision number (1-75)
  lever: string;                     // Grow / Optimize / Sustain
  type: string;                      // Type of Value Driver (Organic, COGS savings, SGA savings, Manufacturing OH savings, Sustain Topline)
  category: string;                  // Category
  name: string;                      // Decision name
  description: string;               // Detailed description
  round: number;                     // Round number (1-5)
  size: number;                      // Size (1-5)
  investmentPeriod: number;          // Investment period (years)
  cashFlows: DecisionCashFlows;      // 12 line items × 10 years
}

// Load ALL decisions from unified JSON file
import decisionsDataRaw from '../decisions_full.json' assert { type: 'json' };

export const ALL_DECISIONS: Decision[] = decisionsDataRaw as Decision[];

// Filter decisions by round for backward compatibility
export const ROUND1_DECISIONS: Decision[] = ALL_DECISIONS.filter(d => d.round === 1);
export const ROUND2_DECISIONS: Decision[] = ALL_DECISIONS.filter(d => d.round === 2);
export const ROUND3_DECISIONS: Decision[] = ALL_DECISIONS.filter(d => d.round === 3);
export const ROUND4_DECISIONS: Decision[] = ALL_DECISIONS.filter(d => d.round === 4);
export const ROUND5_DECISIONS: Decision[] = ALL_DECISIONS.filter(d => d.round === 5);

// Sustain Topline decision IDs by round
export const SUSTAIN_TOPLINE_IDS_BY_ROUND: Record<number, number[]> = {
  1: [11, 13, 14],
  2: [27, 29],
  3: [41, 43, 44, 45],
  4: [58, 59],
  5: [72, 73, 74, 75],
};

// Legacy: Sustain Topline decisions for Round 1 (for backward compatibility)
export const SUSTAIN_TOPLINE_DECISION_IDS = SUSTAIN_TOPLINE_IDS_BY_ROUND[1];

// Decline per skipped Sustain decision (0.1%)
export const DECLINE_PER_SKIPPED_DECISION = 0.001;

/**
 * Get a decision by ID (searches all decisions)
 */
export function getDecision(id: number): Decision | undefined {
  return ALL_DECISIONS.find(d => d.id === id);
}

/**
 * Get all decisions for a specific round
 */
export function getDecisionsForRound(round: number): Decision[] {
  return ALL_DECISIONS.filter(d => d.round === round);
}

/**
 * Get all Sustain Topline decisions for a round
 */
export function getSustainToplineDecisions(round: number): number[] {
  return SUSTAIN_TOPLINE_IDS_BY_ROUND[round] || [];
}

/**
 * Calculate BAU revenue growth adjustment based on skipped Sustain decisions
 */
export function calculateBAUGrowthAdjustment(
  selectedDecisions: number[],
  round: number
): number {
  const sustainDecisions = getSustainToplineDecisions(round);
  
  // Count how many were NOT selected
  const skippedCount = sustainDecisions.filter(
    id => !selectedDecisions.includes(id)
  ).length;
  
  // Calculate decline
  const decline = skippedCount * DECLINE_PER_SKIPPED_DECISION;
  
  return decline;
}
