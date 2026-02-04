/**
 * Quick Test Script for Round 1 Calculations
 * Test different decision combinations before committing to main code
 */

import { calculateConsolidatedProjection } from './consolidation-engine.js';

console.log("=" .repeat(80));
console.log("ROUND 1 DECISION TESTING");
console.log("=" .repeat(80));

// Test cases
const testCases = [
  {
    name: "No Decisions (Pure BAU)",
    decisions: [],
    expectedPrice: null // To be determined
  },
  {
    name: "Decision #1 Only (Mexico Capacity)",
    decisions: [1],
    expectedPrice: 53.73
  },
  {
    name: "Decision #2 Only (US Capacity)",
    decisions: [2],
    expectedPrice: null // To be determined
  },
  {
    name: "Decisions #1 + #2 (Both Capacity Expansions)",
    decisions: [1, 2],
    expectedPrice: null // To be determined
  },
  {
    name: "All Sustain Topline (#11, #13, #14)",
    decisions: [11, 13, 14],
    expectedPrice: null // To be determined
  },
  {
    name: "Mix: #1 (Capacity) + #11 (Sustain)",
    decisions: [1, 11],
    expectedPrice: null // To be determined
  },
  {
    name: "Decision #5 (Acquisition)",
    decisions: [5],
    expectedPrice: null // To be determined
  }
];

// Run all test cases
const results = [];

for (const testCase of testCases) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`TEST: ${testCase.name}`);
  console.log(`Decisions: ${testCase.decisions.length > 0 ? testCase.decisions.join(', ') : 'None'}`);
  console.log("=".repeat(80));
  
  try {
    const result = calculateConsolidatedProjection(
      1, // round
      testCase.decisions,
      0, // cumulativeGrowthDecline
      52.27 // startingSharePrice (Round 0)
    );
    
    const passed = testCase.expectedPrice 
      ? Math.abs(result.share_price - testCase.expectedPrice) < 0.01
      : null;
    
    console.log(`\n✓ Share Price: $${result.share_price.toFixed(2)}`);
    console.log(`  Forward Price: $${result.forward_price.toFixed(2)}`);
    console.log(`  TSR: ${(result.tsr * 100).toFixed(2)}%`);
    console.log(`  Enterprise Value: $${result.enterprise_value.toFixed(0)}M`);
    
    if (testCase.expectedPrice) {
      console.log(`\n  Expected: $${testCase.expectedPrice.toFixed(2)}`);
      console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    }
    
    results.push({
      name: testCase.name,
      decisions: testCase.decisions,
      sharePrice: result.share_price,
      tsr: result.tsr,
      passed: passed
    });
    
  } catch (error) {
    console.log(`\n❌ ERROR: ${error.message}`);
    results.push({
      name: testCase.name,
      decisions: testCase.decisions,
      error: error.message,
      passed: false
    });
  }
}

// Summary table
console.log("\n" + "=".repeat(80));
console.log("SUMMARY");
console.log("=".repeat(80));
console.log("\nTest Case                                      | Decisions    | Share Price | TSR      | Status");
console.log("-".repeat(100));

for (const result of results) {
  const name = result.name.padEnd(45);
  const decisions = result.decisions.length > 0 
    ? result.decisions.join(',').padEnd(12)
    : 'None'.padEnd(12);
  const price = result.sharePrice 
    ? `$${result.sharePrice.toFixed(2)}`.padStart(11)
    : 'ERROR'.padStart(11);
  const tsr = result.tsr 
    ? `${(result.tsr * 100).toFixed(2)}%`.padStart(8)
    : '-'.padStart(8);
  const status = result.passed === true 
    ? '✅ PASS' 
    : result.passed === false 
      ? '❌ FAIL' 
      : '⏳ TBD';
  
  console.log(`${name} | ${decisions} | ${price} | ${tsr} | ${status}`);
}

console.log("\n" + "=".repeat(80));
console.log(`Total Tests: ${results.length}`);
console.log(`Passed: ${results.filter(r => r.passed === true).length}`);
console.log(`Failed: ${results.filter(r => r.passed === false).length}`);
console.log(`To Be Determined: ${results.filter(r => r.passed === null).length}`);
console.log("=".repeat(80));

console.log("\n💡 TIP: Compare these results with your Excel model to validate!");
console.log("💡 Once validated, update expectedPrice values in this script.\n");
