/**
 * Test Round 1 Consolidation
 * 
 * Validate: Round 1 with Decision #1 selected → Share Price = $53.73
 */

import { calculateConsolidatedProjection } from './consolidation-engine.js';

console.log("=" * 80);
console.log("ROUND 1 TEST: Decision #1 (Mexico Capacity Expansion) Selected");
console.log("=" * 80);

// Round 1: Select only Decision #1
const selectedDecisions = [1];

// No cumulative decline yet (this is Round 1)
const declinesByRound = [];  // Empty array for Round 1

// Starting share price (from Round 0 BAU)
const startingSharePrice = 52.27;

// Calculate consolidated projection
const result = calculateConsolidatedProjection(
  1,  // round
  selectedDecisions,
  declinesByRound,
  startingSharePrice
);

console.log("\n" + "=".repeat(80));
console.log("RESULTS");
console.log("=".repeat(80));

console.log(`\nShare Price (Spot):     $${result.share_price.toFixed(2)}`);
console.log(`Forward Price:          $${result.forward_price.toFixed(2)}`);
console.log(`TSR:                    ${(result.tsr * 100).toFixed(2)}%`);

console.log(`\nEnterprise Value:       $${result.enterprise_value.toFixed(0)}M`);
console.log(`NPV 10-Year:            $${result.npv_10year.toFixed(0)}M`);
console.log(`Terminal Value:         $${result.terminal_value.toFixed(0)}M`);

console.log("\n" + "=".repeat(80));
console.log("VALIDATION");
console.log("=".repeat(80));

const expected_share_price = 53.73;
const difference = result.share_price - expected_share_price;
const percent_diff = (difference / expected_share_price) * 100;

console.log(`\nExpected Share Price:   $${expected_share_price.toFixed(2)}`);
console.log(`Calculated Share Price: $${result.share_price.toFixed(2)}`);
console.log(`Difference:             $${difference.toFixed(2)} (${percent_diff.toFixed(2)}%)`);

if (Math.abs(percent_diff) < 1.0) {
  console.log(`\n✅ PASS: Within 1% tolerance!`);
} else {
  console.log(`\n❌ FAIL: Difference exceeds 1%`);
}

console.log("\n" + "=".repeat(80));
console.log("YEAR-BY-YEAR BREAKDOWN");
console.log("=".repeat(80));

console.log("\n Year | Revenue BAU | Rev Decisions | Rev Total  | EBITDA   | FCF      | PV FCF");
console.log("------+-------------+---------------+------------+----------+----------+---------");

for (const y of result.years) {
  console.log(
    ` ${y.year} | ${y.revenue_bau.toFixed(0).padStart(11)} | ` +
    `${y.revenue_decisions.toFixed(0).padStart(13)} | ` +
    `${y.revenue_total.toFixed(0).padStart(10)} | ` +
    `${y.ebitda.toFixed(0).padStart(8)} | ` +
    `${y.fcf.toFixed(0).padStart(8)} | ` +
    `${y.pv_fcf.toFixed(0).padStart(7)}`
  );
}

console.log("\n" + "=".repeat(80));
console.log("SUSTAIN TOPLINE ANALYSIS");
console.log("=".repeat(80));

console.log("\nSustain Topline Decisions in Round 1: #11, #13, #14");
console.log(`Selected: ${selectedDecisions.includes(11) ? '✓' : '✗'} #11, ${selectedDecisions.includes(13) ? '✓' : '✗'} #13, ${selectedDecisions.includes(14) ? '✓' : '✗'} #14`);
console.log(`Skipped: 3 decisions`);
console.log(`BAU Growth Decline: -0.3% (3 × 0.1%)`);
console.log(`Adjusted BAU Growth: 1.7% (applies to 2027-2035)`);
