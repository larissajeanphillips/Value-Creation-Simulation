/**
 * Export BAU Calculations to CSV
 */

import { calculateRound0, BASELINE_2025, CONSTANTS } from './bau-engine';
import * as fs from 'fs';

const result = calculateRound0();

// Create CSV content
let csv = '';

// Header
csv += 'Year,Revenue Base,Revenue Growth $,Total Revenue,COGS,SG&A,EBITDA,D&A,EBIT,';
csv += 'Implementation Cost,Taxes,Capex,New Investments,Acquisitions,Free Cash Flow,';
csv += 'Continuing Value,Discount Factor,Discounted FCF,ROIC,IC Beginning,IC Ending\n';

// Data rows
result.fcf_projections.forEach((year) => {
  csv += `${year.year},`;
  csv += `${year.revenue_base.toFixed(2)},`;
  csv += `${year.revenue_growth_dollars.toFixed(2)},`;
  csv += `${year.revenue_total.toFixed(2)},`;
  csv += `${year.cogs.toFixed(2)},`;
  csv += `${year.sga.toFixed(2)},`;
  csv += `${year.ebitda.toFixed(2)},`;
  csv += `${year.depreciation.toFixed(2)},`;
  csv += `${year.ebit.toFixed(2)},`;
  csv += `${year.implementation_cost.toFixed(2)},`;
  csv += `${year.taxes.toFixed(2)},`;
  csv += `${year.capex.toFixed(2)},`;
  csv += `${year.new_investments.toFixed(2)},`;
  csv += `${year.acquisitions.toFixed(2)},`;
  csv += `${year.fcf.toFixed(2)},`;
  csv += `${year.continuing_value.toFixed(2)},`;
  csv += `${year.discount_factor.toFixed(6)},`;
  csv += `${year.discounted_fcf.toFixed(2)},`;
  csv += `${(year.roic * 100).toFixed(2)},`;
  csv += `${year.ic_beginning.toFixed(2)},`;
  csv += `${year.ic_ending.toFixed(2)}\n`;
});

// Add summary section
csv += '\n';
csv += 'VALUATION SUMMARY\n';
csv += `Enterprise Value,${result.enterprise_value.toFixed(2)}\n`;
csv += `Net Debt,${result.net_debt.toFixed(2)}\n`;
csv += `Minority Interest,${result.minority_interest.toFixed(2)}\n`;
csv += `Equity Value,${result.equity_value.toFixed(2)}\n`;
csv += `Shares Outstanding,${result.shares_outstanding.toFixed(2)}\n`;
csv += `Share Price,${result.share_price.toFixed(2)}\n`;

csv += '\n';
csv += 'CONSTANTS\n';
csv += `WACC,${(CONSTANTS.WACC * 100).toFixed(1)}%\n`;
csv += `Terminal Growth,${(CONSTANTS.TERMINAL_GROWTH * 100).toFixed(1)}%\n`;
csv += `Tax Rate,${(CONSTANTS.TAX_RATE * 100).toFixed(1)}%\n`;
csv += `Capex/Revenue,${(CONSTANTS.CAPEX_REVENUE_RATIO * 100).toFixed(1)}%\n`;

csv += '\n';
csv += 'BASELINE (Year 0 / 2025)\n';
csv += `Revenue,${BASELINE_2025.revenue.toFixed(2)}\n`;
csv += `COGS/Revenue,${(BASELINE_2025.cogs_revenue_ratio * 100).toFixed(2)}%\n`;
csv += `SG&A,${BASELINE_2025.sga.toFixed(2)}\n`;
csv += `Invested Capital,${BASELINE_2025.invested_capital.toFixed(2)}\n`;
csv += `Revenue Growth Rate,${(BASELINE_2025.revenue_growth_rate * 100).toFixed(0)}%\n`;
csv += `SG&A Growth Rate,${(BASELINE_2025.sga_growth_rate * 100).toFixed(0)}%\n`;
csv += `EBITDA Margin,${(BASELINE_2025.ebitda_margin * 100).toFixed(2)}%\n`;

// Write to file
const outputPath = 'bau-calculations-round0.csv';
fs.writeFileSync(outputPath, csv);

console.log(`✓ CSV exported successfully to: ${outputPath}`);
console.log(`  Share Price: $${result.share_price.toFixed(2)}`);
console.log(`  Enterprise Value: $${result.enterprise_value.toFixed(2)}M`);
console.log(`\nYou can open this file in Excel to compare with your model!`);
