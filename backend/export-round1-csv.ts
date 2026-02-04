/**
 * Export Round 1 Consolidated Calculations to CSV
 * Shows: BAU + Decision #1 → Consolidated
 */

import { calculateConsolidatedProjection } from './consolidation-engine.js';
import { getDecision } from './decision-data.js';
import * as fs from 'fs';

console.log("=" * 80);
console.log("EXPORTING ROUND 1 CALCULATIONS (Decision #1) TO CSV");
console.log("=" * 80);

// Round 1: Select only Decision #1
const selectedDecisions = [1];
const cumulativeGrowthDecline = 0;
const startingSharePrice = 52.27;

// Get Decision #1 details
const decision1 = getDecision(1);

// Calculate consolidated projection
const result = calculateConsolidatedProjection(
  1,
  selectedDecisions,
  cumulativeGrowthDecline,
  startingSharePrice
);

console.log("\n--- DECISION #1 DETAILS ---");
console.log(`Name: ${decision1?.name}`);
console.log(`Type: ${decision1?.type}`);
console.log(`Investment Period: ${decision1?.investmentPeriod} years`);

// Prepare CSV data
const csvLines: string[] = [];

// Header
csvLines.push("ROUND 1 CONSOLIDATED CALCULATIONS - DECISION #1 (Mexico Capacity Expansion)");
csvLines.push("");

// Valuation Summary
csvLines.push("VALUATION SUMMARY");
csvLines.push("Metric,Value");
csvLines.push(`Share Price (Spot),$${result.share_price.toFixed(2)}`);
csvLines.push(`Forward Price,$${result.forward_price.toFixed(2)}`);
csvLines.push(`TSR,${(result.tsr * 100).toFixed(2)}%`);
csvLines.push(`Enterprise Value,$${result.enterprise_value.toFixed(0)}M`);
csvLines.push(`NPV 10-Year,$${result.npv_10year.toFixed(0)}M`);
csvLines.push(`Terminal Value,$${result.terminal_value.toFixed(0)}M`);
csvLines.push("");

// Decision #1 Cash Flows (Raw Data)
csvLines.push("DECISION #1 CASH FLOWS (RAW DATA FROM EXCEL)");
if (decision1) {
  const cf = decision1.cashFlows;
  csvLines.push("Line Item,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035");
  csvLines.push(`Investment,${cf.Investment.join(',')}`);
  csvLines.push(`Implementation Cost,${cf['Implementation Cost'].join(',')}`);
  csvLines.push(`Acquisition,${cf.Acquisition.join(',')}`);
  csvLines.push(`Premium,${cf.Premium.join(',')}`);
  csvLines.push(`Revenue,${cf.Revenue.join(',')}`);
  csvLines.push(`Growth,${cf['Growth '].join(',')}`);
  csvLines.push(`COGS,${cf.COGS.join(',')}`);
  csvLines.push(`SG&A,${cf['SG&A'].join(',')}`);
  csvLines.push(`COGS Savings,${cf['COGS savings'].join(',')}`);
  csvLines.push(`SG&A Savings,${cf['SG&A savings'].join(',')}`);
  csvLines.push(`Mfg OH Savings,${cf['Manufacturing OH savings'].join(',')}`);
  csvLines.push(`Synergies,${cf.Synergies.join(',')}`);
}
csvLines.push("");

// Year-by-Year Consolidated Statement
csvLines.push("CONSOLIDATED P&L AND CASH FLOW (BAU + DECISION #1)");
csvLines.push(
  "Year," +
  "Revenue BAU,Revenue Decisions,Growth Decisions,Revenue Total," +
  "COGS BAU,COGS Decisions,COGS Total," +
  "SG&A BAU,SG&A Decisions,SG&A Total," +
  "COGS Savings,SG&A Savings,Mfg OH Savings,Synergies," +
  "EBITDA,Depreciation,EBIT,Taxes,NOPAT," +
  "Investment BAU,Investment Decisions,Implementation Cost,Acquisition," +
  "IC Beginning,IC Ending,Change in IC," +
  "FCF,Discount Factor,PV FCF"
);

for (const y of result.years) {
  csvLines.push(
    `${y.year},` +
    `${y.revenue_bau.toFixed(2)},${y.revenue_decisions.toFixed(2)},${y.growth_decisions.toFixed(2)},${y.revenue_total.toFixed(2)},` +
    `${y.cogs_bau.toFixed(2)},${y.cogs_decisions.toFixed(2)},${y.cogs_total.toFixed(2)},` +
    `${y.sga_bau.toFixed(2)},${y.sga_decisions.toFixed(2)},${y.sga_total.toFixed(2)},` +
    `${y.cogs_savings.toFixed(2)},${y.sga_savings.toFixed(2)},${y.mfg_oh_savings.toFixed(2)},${y.synergies.toFixed(2)},` +
    `${y.ebitda.toFixed(2)},${y.depreciation.toFixed(2)},${y.ebit.toFixed(2)},${y.taxes.toFixed(2)},${y.nopat.toFixed(2)},` +
    `${y.investment_bau.toFixed(2)},${y.investment_decisions.toFixed(2)},${y.implementation_cost.toFixed(2)},${y.acquisition.toFixed(2)},` +
    `${y.ic_beginning.toFixed(2)},${y.ic_ending.toFixed(2)},${y.change_in_ic.toFixed(2)},` +
    `${y.fcf.toFixed(2)},${y.discount_factor.toFixed(6)},${y.pv_fcf.toFixed(2)}`
  );
}

csvLines.push("");

// Key Metrics Summary
csvLines.push("KEY METRICS BY YEAR");
csvLines.push("Year,Revenue Total,EBITDA,EBITDA Margin %,EBIT,EBIT Margin %,FCF,ROIC %");
for (const y of result.years) {
  const ebitda_margin = (y.ebitda / y.revenue_total) * 100;
  const ebit_margin = (y.ebit / y.revenue_total) * 100;
  const roic = (y.nopat / y.ic_beginning) * 100;
  
  csvLines.push(
    `${y.year},` +
    `${y.revenue_total.toFixed(0)},` +
    `${y.ebitda.toFixed(0)},` +
    `${ebitda_margin.toFixed(2)},` +
    `${y.ebit.toFixed(0)},` +
    `${ebit_margin.toFixed(2)},` +
    `${y.fcf.toFixed(0)},` +
    `${roic.toFixed(2)}`
  );
}

csvLines.push("");

// BAU Growth Analysis
csvLines.push("BAU GROWTH ANALYSIS");
csvLines.push("Metric,Value");
csvLines.push(`Base BAU Growth Rate,2.00%`);
csvLines.push(`Sustain Decisions Skipped,3`);
csvLines.push(`Growth Decline Penalty,-0.30%`);
csvLines.push(`Adjusted BAU Growth (2027+),1.70%`);
csvLines.push(`2026 BAU Growth (unchanged),2.00%`);

// Write to file with timestamp to avoid lock issues
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const outputFile = `round1-consolidated-decision1-${timestamp}.csv`;
fs.writeFileSync(outputFile, csvLines.join('\n'), 'utf-8');

console.log(`\n✅ SUCCESS! Exported to: ${outputFile}`);
console.log(`\nShare Price: $${result.share_price.toFixed(2)}`);
console.log(`Expected: $53.73`);
console.log(`Difference: $${(result.share_price - 53.73).toFixed(2)}`);
