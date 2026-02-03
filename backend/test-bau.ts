/**
 * Test BAU Engine - Round 0 Calculation
 * 
 * Goal: Verify we get share price of $52.27 matching Excel
 */

import { calculateRound0, runBAUProjection, BASELINE_2025, CONSTANTS } from './bau-engine';

console.log('================================================================================');
console.log('ROUND 0 (t=0) - BAU VALUATION TEST');
console.log('================================================================================\n');

// Run Round 0 calculation
const round0 = calculateRound0();

console.log('VALUATION RESULTS:');
console.log('--------------------------------------------------');
console.log(`Enterprise Value:     $${round0.enterprise_value.toFixed(2)}M`);
console.log(`Less: Net Debt:       $${round0.net_debt.toFixed(2)}M`);
console.log(`Less: Minority Int:   $${round0.minority_interest.toFixed(2)}M`);
console.log(`Equals: Equity Value: $${round0.equity_value.toFixed(2)}M`);
console.log(`Divided by Shares:    ${round0.shares_outstanding}M`);
console.log(`= SHARE PRICE:        $${round0.share_price.toFixed(2)}`);
console.log('--------------------------------------------------\n');

// Target from Excel
const target_share_price = 52.265643069393064;
const target_ev = 23201.009879559402;

console.log('COMPARISON TO EXCEL:');
console.log('--------------------------------------------------');
console.log(`Excel Share Price:    $${target_share_price.toFixed(2)}`);
console.log(`Our Share Price:      $${round0.share_price.toFixed(2)}`);
console.log(`Difference:           $${(round0.share_price - target_share_price).toFixed(4)}`);
console.log(`Match:                ${Math.abs(round0.share_price - target_share_price) < 0.01 ? '✓ YES' : '✗ NO'}`);
console.log('--------------------------------------------------\n');

console.log(`Excel EV:             $${target_ev.toFixed(2)}M`);
console.log(`Our EV:               $${round0.enterprise_value.toFixed(2)}M`);
console.log(`Difference:           $${(round0.enterprise_value - target_ev).toFixed(2)}M`);
console.log(`Match:                ${Math.abs(round0.enterprise_value - target_ev) < 1 ? '✓ YES' : '✗ NO'}`);
console.log('--------------------------------------------------\n');

// Show year-by-year breakdown
console.log('================================================================================');
console.log('10-YEAR PROJECTION BREAKDOWN');
console.log('================================================================================\n');

const projections = round0.fcf_projections;

console.log('Year | Revenue  | EBITDA   | EBIT     | FCF      | Cont Val | Disc FCF');
console.log('-----|----------|----------|----------|----------|----------|----------');

projections.forEach((year) => {
  console.log(
    `${year.year} | ` +
    `${year.revenue_total.toFixed(0).padStart(8)} | ` +
    `${year.ebitda.toFixed(0).padStart(8)} | ` +
    `${year.ebit.toFixed(0).padStart(8)} | ` +
    `${year.fcf.toFixed(0).padStart(8)} | ` +
    `${year.continuing_value.toFixed(0).padStart(8)} | ` +
    `${year.discounted_fcf.toFixed(0).padStart(8)}`
  );
});

console.log('\n');

// Show key metrics
console.log('KEY METRICS:');
console.log('--------------------------------------------------');
console.log(`Starting Revenue (2025):  $${BASELINE_2025.revenue}M`);
console.log(`Revenue Growth Rate:      ${(BASELINE_2025.revenue_growth_rate * 100).toFixed(0)}%`);
console.log(`COGS/Revenue:             ${(BASELINE_2025.cogs_revenue_ratio * 100).toFixed(2)}%`);
console.log(`EBITDA Margin:            ${(BASELINE_2025.ebitda_margin * 100).toFixed(2)}%`);
console.log(`WACC:                     ${(CONSTANTS.WACC * 100).toFixed(0)}%`);
console.log(`Terminal Growth:          ${(CONSTANTS.TERMINAL_GROWTH * 100).toFixed(0)}%`);
console.log(`Tax Rate:                 ${(CONSTANTS.TAX_RATE * 100).toFixed(0)}%`);
console.log(`Capex/Revenue:            ${(CONSTANTS.CAPEX_REVENUE_RATIO * 100).toFixed(0)}%`);
console.log('--------------------------------------------------\n');

// Summary
if (Math.abs(round0.share_price - target_share_price) < 0.01) {
  console.log('✓ SUCCESS! Share price matches Excel model.');
} else {
  console.log('✗ MISMATCH! Investigating differences...\n');
  
  // Debug: Compare year-by-year
  console.log('DETAILED COMPARISON (First 3 years):');
  console.log('--------------------------------------------------');
  
  const expected_revenues = [43692.72, 44566.5744, 45457.905888];
  const expected_fcf = [1610.7399360000024, 1642.9547347200012, 1675.8138294143992];
  const expected_discounted = [1491.4258666666688, 1408.5688740740748, 1330.3150477366244];
  
  for (let i = 0; i < 3; i++) {
    console.log(`\nYear ${2026 + i}:`);
    console.log(`  Revenue - Expected: ${expected_revenues[i].toFixed(2)}, Got: ${projections[i].revenue_total.toFixed(2)}`);
    console.log(`  FCF     - Expected: ${expected_fcf[i].toFixed(2)}, Got: ${projections[i].fcf.toFixed(2)}`);
    console.log(`  Disc    - Expected: ${expected_discounted[i].toFixed(2)}, Got: ${projections[i].discounted_fcf.toFixed(2)}`);
  }
}
