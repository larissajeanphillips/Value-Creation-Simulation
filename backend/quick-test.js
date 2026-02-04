/**
 * Quick Test - Modify this file to test any decision combination
 * 
 * Usage:
 *   1. Edit the selectedDecisions array below
 *   2. Run: node quick-test.js
 */

import { calculateConsolidatedProjection } from './consolidation-engine.js';
import { ROUND1_DECISIONS } from './decision-data.js';

// ============================================================================
// EDIT THIS: Add/remove decision IDs to test
// ============================================================================
const selectedDecisions = [2]; // <-- MODIFY THIS ARRAY

// ============================================================================
// Test Configuration
// ============================================================================
const round = 1;
const cumulativeGrowthDecline = 0; // 0 for Round 1 (no prior rounds)
const startingSharePrice = 52.27; // Round 0 BAU share price

// ============================================================================
// Run Calculation
// ============================================================================
console.log("=" .repeat(80));
console.log("QUICK TEST - Round 1 Consolidated Calculation");
console.log("=" .repeat(80));

console.log(`\nSelected Decisions: ${selectedDecisions.length > 0 ? selectedDecisions.join(', ') : 'None (Pure BAU)'}`);

if (selectedDecisions.length > 0) {
  console.log("\nDecision Details:");
  for (const id of selectedDecisions) {
    const decision = ROUND1_DECISIONS.find(d => d.id === id);
    if (decision) {
      console.log(`  #${id}: ${decision.name} (${decision.type})`);
    } else {
      console.log(`  #${id}: ⚠️ NOT FOUND - Check decision ID`);
    }
  }
}

console.log("\n" + "=" .repeat(80));
console.log("CALCULATING...");
console.log("=" .repeat(80));

try {
  const result = calculateConsolidatedProjection(
    round,
    selectedDecisions,
    cumulativeGrowthDecline,
    startingSharePrice
  );
  
  console.log("\n✅ SUCCESS!\n");
  console.log("VALUATION RESULTS:");
  console.log("-" .repeat(80));
  console.log(`  Share Price (Spot):     $${result.share_price.toFixed(2)}`);
  console.log(`  Forward Price:          $${result.forward_price.toFixed(2)}`);
  console.log(`  TSR:                    ${(result.tsr * 100).toFixed(2)}%`);
  console.log(`  Enterprise Value:       $${result.enterprise_value.toFixed(0)}M`);
  console.log(`  NPV 10-Year:            $${result.npv_10year.toFixed(0)}M`);
  console.log(`  Terminal Value:         $${result.terminal_value.toFixed(0)}M`);
  
  console.log("\n" + "=" .repeat(80));
  console.log("YEAR-BY-YEAR SUMMARY (First 5 Years)");
  console.log("=" .repeat(80));
  console.log("\nYear | Revenue   | EBITDA  | EBIT    | FCF     | PV FCF");
  console.log("-" .repeat(65));
  
  for (let i = 0; i < 5; i++) {
    const y = result.years[i];
    console.log(
      `${y.year} | $${(y.revenue_total/1000).toFixed(1)}B | ` +
      `$${y.ebitda.toFixed(0)}M | ` +
      `$${y.ebit.toFixed(0)}M | ` +
      `$${y.fcf.toFixed(0)}M | ` +
      `$${y.pv_fcf.toFixed(0)}M`
    );
  }
  
  console.log("\n💡 To see full 10-year details, run: npx tsx export-round1-csv.ts");
  console.log("   (Edit line 15 in export-round1-csv.ts to change decisions)");
  
  // Compare with expected value (if known)
  const knownResults = {
    1: 53.73,  // Decision #1 only
  };
  
  const key = selectedDecisions.join(',');
  if (knownResults[key]) {
    const expected = knownResults[key];
    const diff = result.share_price - expected;
    const pctDiff = (diff / expected) * 100;
    
    console.log("\n" + "=" .repeat(80));
    console.log("VALIDATION");
    console.log("=" .repeat(80));
    console.log(`\nExpected Share Price:   $${expected.toFixed(2)}`);
    console.log(`Calculated:             $${result.share_price.toFixed(2)}`);
    console.log(`Difference:             $${diff.toFixed(2)} (${pctDiff.toFixed(2)}%)`);
    
    if (Math.abs(diff) < 0.01) {
      console.log("\n✅ EXACT MATCH!");
    } else if (Math.abs(pctDiff) < 1) {
      console.log("\n✅ Within 1% - Good!");
    } else {
      console.log("\n⚠️ Difference exceeds 1% - Check Excel model");
    }
  }
  
  console.log("\n" + "=" .repeat(80) + "\n");
  
} catch (error) {
  console.log("\n❌ ERROR:");
  console.log(error.message);
  console.log("\nStack trace:");
  console.log(error.stack);
  console.log("\n" + "=" .repeat(80) + "\n");
}
