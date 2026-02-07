/**
 * Decision Data - All Rounds (1-5)
 *
 * Extracted from Excel model: 260127 TSR decisions_v2.8 (1).xlsx
 * Tab: Decisions, Columns U-AB (metadata) and A121:P1546 (cash flows)
 *
 * All 75 decisions stored in single file, filtered by round as needed
 */
// Load ALL decisions from unified JSON file
import decisionsDataRaw from '../decisions_full.json' assert { type: 'json' };
export const ALL_DECISIONS = decisionsDataRaw;
// Filter decisions by round for backward compatibility
export const ROUND1_DECISIONS = ALL_DECISIONS.filter(d => d.round === 1);
export const ROUND2_DECISIONS = ALL_DECISIONS.filter(d => d.round === 2);
export const ROUND3_DECISIONS = ALL_DECISIONS.filter(d => d.round === 3);
export const ROUND4_DECISIONS = ALL_DECISIONS.filter(d => d.round === 4);
export const ROUND5_DECISIONS = ALL_DECISIONS.filter(d => d.round === 5);
// Sustain Topline decision IDs by round
export const SUSTAIN_TOPLINE_IDS_BY_ROUND = {
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
export function getDecision(id) {
    return ALL_DECISIONS.find(d => d.id === id);
}
/**
 * Get all decisions for a specific round
 */
export function getDecisionsForRound(round) {
    return ALL_DECISIONS.filter(d => d.round === round);
}
/**
 * Get all Sustain Topline decisions for a round
 */
export function getSustainToplineDecisions(round) {
    return SUSTAIN_TOPLINE_IDS_BY_ROUND[round] || [];
}
/**
 * Calculate BAU revenue growth adjustment based on skipped Sustain decisions
 */
export function calculateBAUGrowthAdjustment(selectedDecisions, round) {
    const sustainDecisions = getSustainToplineDecisions(round);
    // Count how many were NOT selected
    const skippedCount = sustainDecisions.filter(id => !selectedDecisions.includes(id)).length;
    // Calculate decline
    const decline = skippedCount * DECLINE_PER_SKIPPED_DECISION;
    return decline;
}
//# sourceMappingURL=decision-data.js.map