/**
 * Detailed BAU Calculation Report
 * Shows every single calculation step
 */

import { calculateRound0, BASELINE_2025, CONSTANTS } from './bau-engine';

console.log('================================================================================');
console.log('DETAILED BAU CALCULATION REPORT - ROUND 0');
console.log('================================================================================\n');

const result = calculateRound0();

console.log('📊 CONSTANTS (Never Change)');
console.log('─'.repeat(80));
console.log(`WACC:                   ${(CONSTANTS.WACC * 100).toFixed(1)}%`);
console.log(`Terminal Growth:        ${(CONSTANTS.TERMINAL_GROWTH * 100).toFixed(1)}%`);
console.log(`Tax Rate:               ${(CONSTANTS.TAX_RATE * 100).toFixed(1)}%`);
console.log(`Capex/Revenue:          ${(CONSTANTS.CAPEX_REVENUE_RATIO * 100).toFixed(1)}%`);
console.log(`Net Debt:               $${CONSTANTS.NET_DEBT.toLocaleString()}M`);
console.log(`Minority Interest:      $${CONSTANTS.MINORITY_INTEREST.toLocaleString()}M`);
console.log(`Shares Outstanding:     ${CONSTANTS.SHARES_OUTSTANDING.toLocaleString()}M`);
console.log('');

console.log('📈 BASELINE STATE (Year 0 / 2025)');
console.log('─'.repeat(80));
console.log(`Revenue:                $${BASELINE_2025.revenue.toLocaleString()}M`);
console.log(`COGS/Revenue:           ${(BASELINE_2025.cogs_revenue_ratio * 100).toFixed(2)}%`);
console.log(`SG&A:                   $${BASELINE_2025.sga.toLocaleString()}M`);
console.log(`Invested Capital:       $${BASELINE_2025.invested_capital.toLocaleString()}M`);
console.log(`Revenue Growth Rate:    ${(BASELINE_2025.revenue_growth_rate * 100).toFixed(0)}%`);
console.log(`SG&A Growth Rate:       ${(BASELINE_2025.sga_growth_rate * 100).toFixed(0)}%`);
console.log(`EBITDA Margin:          ${(BASELINE_2025.ebitda_margin * 100).toFixed(2)}%`);
console.log('');

console.log('═'.repeat(80));
console.log('10-YEAR PROJECTION - DETAILED YEAR-BY-YEAR');
console.log('═'.repeat(80));
console.log('');

result.fcf_projections.forEach((year, index) => {
  console.log(`┌${'─'.repeat(78)}┐`);
  console.log(`│ YEAR ${year.year} (Index ${index})`.padEnd(79) + '│');
  console.log(`├${'─'.repeat(78)}┤`);
  
  console.log(`│ 💰 REVENUE CALCULATION`.padEnd(79) + '│');
  console.log(`│   Revenue Base:              $${year.revenue_base.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   × Growth Rate (2%):        $${year.revenue_growth_dollars.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   = Total Revenue:           $${year.revenue_total.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│`.padEnd(79) + '│');
  
  console.log(`│ 📊 INCOME STATEMENT`.padEnd(79) + '│');
  console.log(`│   COGS (${(BASELINE_2025.cogs_revenue_ratio * 100).toFixed(2)}%):           $${year.cogs.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   SG&A:                      $${year.sga.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   = EBITDA:                  $${year.ebitda.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   - D&A:                     $${year.depreciation.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   = EBIT:                    $${year.ebit.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│`.padEnd(79) + '│');
  
  console.log(`│ 💵 CASH FLOW`.padEnd(79) + '│');
  console.log(`│   Implementation Cost:       $${year.implementation_cost.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   Taxes (22%):               $${year.taxes.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   Capex (4%):                $${year.capex.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   New Investments:           $${year.new_investments.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   Acquisitions:              $${year.acquisitions.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   = FREE CASH FLOW:          $${year.fcf.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│`.padEnd(79) + '│');
  
  if (year.continuing_value > 0) {
    console.log(`│ 🎯 TERMINAL VALUE (Year 10)`.padEnd(79) + '│');
    console.log(`│   Continuing Value:          $${year.continuing_value.toFixed(2).padStart(12)}M │`.padEnd(80));
    console.log(`│`.padEnd(79) + '│');
  }
  
  console.log(`│ 📉 DISCOUNTING`.padEnd(79) + '│');
  console.log(`│   Discount Factor:           ${year.discount_factor.toFixed(6).padStart(15)} │`.padEnd(80));
  console.log(`│   Discounted FCF:            $${year.discounted_fcf.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│`.padEnd(79) + '│');
  
  console.log(`│ 🏭 INVESTED CAPITAL`.padEnd(79) + '│');
  console.log(`│   IC Beginning:              $${year.ic_beginning.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   IC Ending:                 $${year.ic_ending.toFixed(2).padStart(12)}M │`.padEnd(80));
  console.log(`│   ROIC:                      ${(year.roic * 100).toFixed(2).padStart(15)}% │`.padEnd(80));
  
  console.log(`└${'─'.repeat(78)}┘`);
  console.log('');
});

console.log('═'.repeat(80));
console.log('FINAL VALUATION');
console.log('═'.repeat(80));
console.log('');

console.log('💰 ENTERPRISE VALUE CALCULATION');
console.log('─'.repeat(80));
console.log('Sum of all Discounted FCF (Years 2026-2035):');
result.fcf_projections.forEach((year) => {
  console.log(`  ${year.year}: $${year.discounted_fcf.toFixed(2).padStart(12)}M`);
});
console.log('─'.repeat(80));
console.log(`  TOTAL ENTERPRISE VALUE: $${result.enterprise_value.toFixed(2)}M`);
console.log('');

console.log('🏦 BRIDGE TO EQUITY VALUE');
console.log('─'.repeat(80));
console.log(`  Enterprise Value:           $${result.enterprise_value.toFixed(2)}M`);
console.log(`  Less: Net Debt:             $${result.net_debt.toFixed(2)}M`);
console.log(`  Less: Minority Interest:    $${result.minority_interest.toFixed(2)}M`);
console.log('─'.repeat(80));
console.log(`  = EQUITY VALUE:             $${result.equity_value.toFixed(2)}M`);
console.log('');

console.log('📈 SHARE PRICE');
console.log('─'.repeat(80));
console.log(`  Equity Value:               $${result.equity_value.toFixed(2)}M`);
console.log(`  Divided by Shares:          ${result.shares_outstanding}M shares`);
console.log('─'.repeat(80));
console.log(`  = SHARE PRICE:              $${result.share_price.toFixed(2)}`);
console.log('');

console.log('✓ Round 0 Share Price: $' + result.share_price.toFixed(2));
console.log('');
