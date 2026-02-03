/**
 * Decision Data - Round 1 Decisions (1-15)
 * 
 * Extracted from Excel model: 260127 TSR decisions_v2.8 (1).xlsx
 * Tab: Decisions, Columns U-AF (metadata) and A120:P1545 (cash flows)
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

// Load decision data from JSON
import decisionsDataRaw from '../round1_decisions_full.json' assert { type: 'json' };

export const ROUND1_DECISIONS: Decision[] = decisionsDataRaw as Decision[];

// Sustain Topline decisions for Round 1
export const SUSTAIN_TOPLINE_DECISION_IDS = [11, 13, 14];

// Decline per skipped Sustain decision (0.1%)
export const DECLINE_PER_SKIPPED_DECISION = 0.001;

/**
 * Get a decision by ID
 */
export function getDecision(id: number): Decision | undefined {
  return ROUND1_DECISIONS.find(d => d.id === id);
}

/**
 * Get all Sustain Topline decisions for a round
 */
export function getSustainToplineDecisions(round: number): number[] {
  if (round === 1) {
    return SUSTAIN_TOPLINE_DECISION_IDS;
  }
  // TODO: Add other rounds when we extract them
  return [];
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
