// Debug terminal value calculation

const TAX_RATE = 0.22;
const WACC = 0.093;
const DEPRECIATION_RATE = 0.04;
const terminal_growth_rate = 0.02;

// Round 1 with Decision #1 - Year 2035 values
const year_2035 = {
  ebit: 2562.26,
  ebitda: 4677.98,
  revenue_total: 52892.84,
  ic_ending: 18019.60
};

console.log("=== TERMINAL VALUE DEBUG ===\n");
console.log("Year 2035 values:");
console.log(`  EBIT: $${year_2035.ebit.toFixed(2)}M`);
console.log(`  EBITDA: $${year_2035.ebitda.toFixed(2)}M`);
console.log(`  Revenue: $${year_2035.revenue_total.toFixed(2)}M`);
console.log(`  IC Ending: $${year_2035.ic_ending.toFixed(2)}M`);

// Step 1: NOPAT Year 11
const ebit_year11 = year_2035.ebit * (1 + terminal_growth_rate);
const taxes_year11 = -ebit_year11 * TAX_RATE;
const nopat_year11 = ebit_year11 + taxes_year11;

console.log(`\nStep 1: NOPAT Year 11`);
console.log(`  EBIT Year 11: $${ebit_year11.toFixed(2)}M`);
console.log(`  Taxes Year 11: $${taxes_year11.toFixed(2)}M`);
console.log(`  NOPAT Year 11: $${nopat_year11.toFixed(2)}M`);

// Step 2: ROIC
const ebitda_margin_2035 = year_2035.ebitda / year_2035.revenue_total;
const roic_2035 = (ebitda_margin_2035 - DEPRECIATION_RATE) 
                  * (1 - TAX_RATE) 
                  * year_2035.revenue_total / year_2035.ic_ending;

console.log(`\nStep 2: ROIC`);
console.log(`  EBITDA Margin: ${(ebitda_margin_2035 * 100).toFixed(2)}%`);
console.log(`  DEPRECIATION_RATE: ${(DEPRECIATION_RATE * 100).toFixed(2)}%`);
console.log(`  (Margin - Depreciation): ${((ebitda_margin_2035 - DEPRECIATION_RATE) * 100).toFixed(2)}%`);
console.log(`  (1 - Tax): ${(1 - TAX_RATE).toFixed(4)}`);
console.log(`  Revenue / IC: ${(year_2035.revenue_total / year_2035.ic_ending).toFixed(4)}`);
console.log(`  ROIC: ${(roic_2035 * 100).toFixed(2)}%`);

// Step 3: Reinvestment rate
const reinvestment_rate = terminal_growth_rate / roic_2035;

console.log(`\nStep 3: Reinvestment Rate`);
console.log(`  Terminal Growth: ${(terminal_growth_rate * 100).toFixed(2)}%`);
console.log(`  Reinvestment Rate: ${(reinvestment_rate * 100).toFixed(2)}%`);

// Step 4: FCF Perpetuity
const fcf_perpetuity = nopat_year11 * (1 - reinvestment_rate);

console.log(`\nStep 4: FCF Perpetuity`);
console.log(`  FCF Perpetuity: $${fcf_perpetuity.toFixed(2)}M`);

// Step 5: Continuing Value
const continuing_value_at_2035 = fcf_perpetuity / (WACC - terminal_growth_rate);

console.log(`\nStep 5: Continuing Value`);
console.log(`  WACC - Terminal Growth: ${((WACC - terminal_growth_rate) * 100).toFixed(2)}%`);
console.log(`  Continuing Value at 2035: $${continuing_value_at_2035.toFixed(2)}M`);

// Step 6: Discount to present
const terminal_value = continuing_value_at_2035 / Math.pow(1 + WACC, 10);

console.log(`\nStep 6: Present Value`);
console.log(`  Discount Factor (10 years): ${(1 / Math.pow(1 + WACC, 10)).toFixed(6)}`);
console.log(`  Terminal Value (PV): $${terminal_value.toFixed(2)}M`);

console.log("\n=== COMPARISON TO BAU ===");
console.log("BAU Round 0 (2035):");
console.log("  Continuing Value: $26,783.19M");
console.log("  Expected lower for Round 1 due to IC changes");
