/**
 * Decision Data - Round 1 Decisions (1-15)
 *
 * Extracted from Excel model: 260127 TSR decisions_v2.8 (1).xlsx
 * Tab: Decisions, Columns U-AF (metadata) and A120:P1545 (cash flows)
 */
// Load decision data from JSON
import decisionsDataRaw from '../round1_decisions_full.json' assert { type: 'json' };
export const ROUND1_DECISIONS = decisionsDataRaw;
// Sustain Topline decisions for Round 1
export const SUSTAIN_TOPLINE_DECISION_IDS = [11, 13, 14];
// Decline per skipped Sustain decision (0.1%)
export const DECLINE_PER_SKIPPED_DECISION = 0.001;
/**
 * Get a decision by ID
 */
export function getDecision(id) {
    return ROUND1_DECISIONS.find(d => d.id === id);
}
/**
 * Get all Sustain Topline decisions for a round
 */
export function getSustainToplineDecisions(round) {
    if (round === 1) {
        return SUSTAIN_TOPLINE_DECISION_IDS;
    }
    // TODO: Add other rounds when we extract them
    return [];
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
