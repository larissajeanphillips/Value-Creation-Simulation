/**
 * Quick test - no CSV output
 */

import { calculateConsolidatedProjection } from './consolidation-engine.js';

// Test decisions 11, 12, 13
const selectedDecisions = [11, 12, 13];

console.log("Testing decisions:", selectedDecisions.join(', '));

const result = calculateConsolidatedProjection(
  1,  // round
  selectedDecisions,
  0,  // cumulativeGrowthDecline
  52.27 // startingSharePrice
);

console.log("\nRESULTS:");
console.log(`Share Price: $${result.share_price.toFixed(2)}`);
console.log(`Forward Price: $${result.forward_price.toFixed(2)}`);
console.log(`TSR: ${(result.tsr * 100).toFixed(2)}%`);
console.log(`Enterprise Value: $${result.enterprise_value.toFixed(0)}M`);
