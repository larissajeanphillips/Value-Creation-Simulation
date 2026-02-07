/**
 * Consolidation Engine - Combines BAU + Selected Decisions
 * 
 * Implements the full calculation logic:
 * 1. Adjust BAU growth based on Sustain Topline decisions
 * 2. For each year, consolidate BAU + Decision cash flows
 * 3. Calculate consolidated P&L, IC, FCF
 * 4. Run DCF to get share price
 */

import { calculateBAUGrowthAdjustment, getDecision } from './decision-data.js';

export interface ConsolidatedYear {
  year: number;
  yearIndex: number;
  
  // Revenue
  revenue_bau: number;
  revenue_decisions: number;
  growth_decisions: number;  // Growth is $ for decisions
  revenue_total: number;      // Revenue + Growth
  
  // Costs
  cogs_bau: number;
  cogs_decisions: number;
  cogs_total: number;
  
  sga_bau: number;
  sga_decisions: number;
  sga_total: number;
  
  // Savings (positive values)
  cogs_savings: number;
  sga_savings: number;
  mfg_oh_savings: number;
  synergies: number;
  
  // EBITDA & EBIT
  ebitda: number;
  depreciation: number;
  ebit: number;
  
  // Taxes
  taxes: number;
  nopat: number;
  
  // Capex & Investments
  investment_bau: number;
  investment_decisions: number;
  implementation_cost: number;
  acquisition: number;
  premium: number;
  capex_maintenance: number;
  total_capex: number;
  
  // Invested Capital
  ic_beginning: number;
  ic_ending: number;
  change_in_ic: number;
  
  // Free Cash Flow
  fcf: number;
  discount_factor: number;
  pv_fcf: number;
}

export interface ConsolidatedProjection {
  years: ConsolidatedYear[];
  npv_10year: number;
  terminal_value: number;
  enterprise_value: number;
  equity_value: number;
  share_price: number;
  forward_price: number;
  tsr: number;
}

/**
 * Calculate consolidated projection for a round
 */
export function calculateConsolidatedProjection(
  round: number,
  selectedDecisions: number[],
  declinesByRound: number[] = [], // Array of declines from each previous round [R1, R2, R3, ...]
  startingSharePrice: number = 52.27   // Share price from Round 0
): ConsolidatedProjection {
  
  // Constants (from BAU engine)
  const WACC = 0.08; // 8.0% - CORRECTED (was incorrectly 9.3%)
  const TAX_RATE = 0.22; // 22%
  const DEPRECIATION_RATE = 0.04; // Maintenance Capex = 4% of Revenue = Depreciation
  const COST_OF_EQUITY = 0.093; // 9.3% - Used ONLY for Forward Price calculation
  const NET_DEBT = 7765; // From Excel model
  const MINORITY_INTEREST = 418; // From Excel model (positive value, will be subtracted)
  const SHARES_OUTSTANDING = 287.34; // From BAU engine
  
  // Baseline 2025 values (from BAU engine - Round 0)
  const revenue_2025 = 42836;
  const cogs_revenue_ratio = 0.8646232141189654; // 86.46% - CORRECTED
  const sga_2025 = 2061; // CORRECTED from BAU engine
  const sga_growth_rate = 0.02; // 2.0% - CORRECTED
  const invested_capital_2025 = 15827.72; // CORRECTED from BAU engine
  
  // Calculate current round's BAU growth decline
  const currentRoundDecline = calculateBAUGrowthAdjustment(selectedDecisions, round);
  
  // Add current round's decline to the array
  const allDeclines = [...declinesByRound, currentRoundDecline];
  
  // Base BAU growth rate (2.0%)
  const base_growth_rate = 0.02;

  // Scenario constants (per PRD Consolidation Engine Spec §2.5)
  const RECESSION_RATE = 0.15;   // One-time BAU revenue decline in 2029
  const RECOVERY_RATE = 0.18;   // One-time BAU revenue increase in 2030
  const COST_PRESSURE_COGS_ADD = 0.005; // From 2028: BAU COGS ratio = cogs_revenue_ratio + 0.005
  
  console.log(`\n=== Round ${round} Consolidation ===`);
  console.log(`Selected Decisions: ${selectedDecisions.join(', ')}`);
  console.log(`Declines by Round: ${allDeclines.map((d, i) => `R${i+1}=${(d*100).toFixed(2)}%`).join(', ')}`);
  console.log(`Current Round Decline: ${(currentRoundDecline * 100).toFixed(2)}%\n`);
  
  // =================================================================
  // RUN BAU ENGINE WITH ADJUSTED GROWTH
  // =================================================================
  
  const years: ConsolidatedYear[] = [];
  
  // Track BAU IC separately for calculating investment_bau
  let ic_bau_current = invested_capital_2025;
  
  // Project 2026-2035
  for (let yearIndex = 0; yearIndex < 10; yearIndex++) {
    const year = 2026 + yearIndex;
    const priorYear = years[yearIndex - 1];
    
    // =================================================================
    // BAU CALCULATIONS (Using BAU Engine Logic)
    // =================================================================
    
    // Calculate applicable decline for this year
    // Rule: Round N decline kicks in starting year (2026 + N)
    // Example: Round 1 decline starts 2027, Round 2 decline starts 2028, etc.
    let applicable_decline = 0;
    for (let r = 1; r <= allDeclines.length; r++) {
      const decline_start_year = 2026 + r;
      if (year >= decline_start_year) {
        applicable_decline += allDeclines[r - 1];
      }
    }
    
    // Calculate growth rate for this specific year
    // For recession/recovery years, the scenario REPLACES the base growth rate
    let year_growth_rate: number;
    
    if (yearIndex === 3 && round >= 4) {
      // 2029 Recession: -15% replaces base growth for this year
      year_growth_rate = -RECESSION_RATE - applicable_decline;
    } else if (yearIndex === 4 && round >= 5) {
      // 2030 Recovery: +18% replaces base growth for this year
      year_growth_rate = RECOVERY_RATE - applicable_decline;
    } else {
      // Normal years: use base growth minus declines
      year_growth_rate = base_growth_rate - applicable_decline;
    }
    
    // Revenue (BAU) - Apply year-specific growth
    let revenue_bau: number;
    if (yearIndex === 0) {
      // 2026: Always use base 2.0% growth (no declines apply yet)
      revenue_bau = revenue_2025 * (1 + base_growth_rate);
    } else {
      // 2027+: Use year-specific growth rate
      revenue_bau = priorYear!.revenue_bau * (1 + year_growth_rate);
    }
    
    // COGS (BAU) - Cost pressure from 2028 onward: use cogs_revenue_ratio + 0.005 (spec §2.5, §6.1)
    // Cost Pressure (2028/yearIndex 2+) only applies in Round 3+
    const cogs_ratio_bau = (yearIndex >= 2 && round >= 3) ? cogs_revenue_ratio + COST_PRESSURE_COGS_ADD : cogs_revenue_ratio;
    const cogs_bau = -revenue_bau * cogs_ratio_bau;
    
    // SG&A (BAU) - Using BAU engine formula: Prior SG&A × (1 + growth rate) = 2.0%
    // BAU engine formula: -state.sga × (1 + growth) for first year, then priorYear.sga × (1 + growth)
    const sga_bau = yearIndex === 0 
      ? -sga_2025 * (1 + sga_growth_rate) // Make negative: -2061 × 1.02
      : priorYear!.sga_bau * (1 + sga_growth_rate); // Already negative, grows at 2%
    
    // BAU New Investment - From BAU engine logic (mirrors bau-engine.ts exactly)
    // Years 2026-2030 (yearIndex 0-4): IC stays flat at 15,827.72
    // Years 2031-2035 (yearIndex 5-9): IC grows based on capital turnover locked at 2030
    
    const ic_beginning_bau = ic_bau_current; // IC from prior year
    let ic_ending_bau: number;
    
    if (yearIndex < 5) {
      // Years 0-4: IC stays flat
      ic_ending_bau = invested_capital_2025;
    } else {
      // Years 5-9: IC grows based on capital turnover locked at 2030
      // Use the ACTUAL revenue_bau from 2030 (yearIndex 4), which includes recession effects
      const revenue_2030_bau = years[4].revenue_bau;
      
      // Capital Turnover 2030 = Revenue_2030_BAU / IC_2030
      const capital_turnover_2030 = revenue_2030_bau / invested_capital_2025;
      
      // IC_Ending_BAU = Revenue_BAU / Capital_Turnover_2030
      // This grows IC proportionally with revenue growth
      ic_ending_bau = revenue_bau / capital_turnover_2030;
    }
    
    // BAU New Investment = -(IC_ending - IC_beginning) [negative = cash outflow]
    const investment_bau = -(ic_ending_bau - ic_beginning_bau);
    
    // Update BAU IC tracker for next year
    ic_bau_current = ic_ending_bau;
    
    // =================================================================
    // DECISION CASH FLOWS
    // =================================================================
    
    let revenue_decisions = 0;
    let growth_decisions = 0;
    let cogs_decisions = 0;
    let sga_decisions = 0;
    let cogs_savings = 0;
    let sga_savings = 0;
    let mfg_oh_savings = 0;
    let synergies = 0;
    let investment_decisions = 0;
    let implementation_cost = 0;
    let acquisition = 0;
    let premium = 0;
    
    // Scenario multiplier: Only apply scenarios if we've reached that round
    // AND only to decisions from earlier rounds
    // - Recession (2029/yearIndex 3): affects decisions 1-45 (Rounds 1-3) when in Round 4+
    // - Recovery (2030/yearIndex 4+): affects decisions 1-60 (Rounds 1-4) when in Round 5
    // Scenarios affect: Revenue, Growth, COGS, COGS savings, Synergies (NOT SG&A per spec)
    for (const decisionId of selectedDecisions) {
      const decision = getDecision(decisionId);
      if (!decision) continue;
      
      const cf = decision.cashFlows;
      let mult = 1;
      
      // Apply scenario multipliers based on current round, year, and decision ID
      if (yearIndex >= 4 && round >= 5) {
        // 2030 onward and we're in Round 5: apply both recession and recovery to R1-R4 decisions
        if (decisionId <= 60) {
          mult = (1 - RECESSION_RATE) * (1 + RECOVERY_RATE);
        }
      } else if (yearIndex >= 3 && round >= 4) {
        // 2029 onward and we're in Round 4: apply recession only to R1-R3 decisions
        // Recession multiplier persists for all future years in Round 4
        if (decisionId <= 45) {
          mult = 1 - RECESSION_RATE; // 0.85
        }
      }
      
      revenue_decisions += cf.Revenue[yearIndex] * mult;
      growth_decisions += cf['Growth '][yearIndex] * mult;
      cogs_decisions += cf.COGS[yearIndex] * mult;
      cogs_savings += cf['COGS savings'][yearIndex] * mult;
      synergies += cf.Synergies[yearIndex] * mult;
      // No scenario multiplier: SG&A, SG&A savings, Manufacturing OH savings, Investment, Implementation Cost, Acquisition, Premium
      sga_decisions += cf['SG&A'][yearIndex];
      sga_savings += cf['SG&A savings'][yearIndex];
      mfg_oh_savings += cf['Manufacturing OH savings'][yearIndex];
      investment_decisions += cf.Investment[yearIndex];
      implementation_cost += cf['Implementation Cost'][yearIndex];
      acquisition += cf.Acquisition[yearIndex];
      premium += cf.Premium[yearIndex];
    }
    
    // =================================================================
    // CONSOLIDATED P&L
    // =================================================================
    
    const revenue_total = revenue_bau + revenue_decisions + growth_decisions;
    const cogs_total = cogs_bau + cogs_decisions; // Both negative
    const sga_total = sga_bau + sga_decisions; // Both negative
    
    // EBITDA = Revenue + COGS + SG&A + Savings + Synergies
    // (COGS and SG&A are negative, so this is Revenue - COGS - SG&A + Savings)
    const ebitda = revenue_total 
                 + cogs_total  // cogs_total is negative
                 + sga_total   // sga_total is negative
                 + cogs_savings 
                 + sga_savings 
                 + mfg_oh_savings 
                 + synergies;
    
    // =================================================================
    // CAPEX & INVESTED CAPITAL
    // =================================================================
    
    // Maintenance Capex = 4% of Revenue Total = Depreciation
    const maintenance_capex = -revenue_total * DEPRECIATION_RATE; // Negative (4%)
    const depreciation = maintenance_capex; // D&A = Maintenance Capex
    
    // Total New Investments = Investment Decisions + Acquisition + BAU New Investment
    // Note: Implementation Cost does NOT affect IC
    // Acquisition IS included in IC (increases invested capital base)
    const new_investments_total = investment_decisions + acquisition + investment_bau;
    
    // EBIT = EBITDA + Depreciation (depreciation is negative, so this subtracts)
    const ebit = ebitda + depreciation;
    
    // Taxes (negative, applied to EBIT + Implementation Cost)
    const taxes = Math.min(0, -(ebit + implementation_cost) * TAX_RATE);
    const nopat = ebit + taxes;
    
    // Invested Capital
    // IC_Ending = IC_Beginning + New Investments
    // New Investments are NEGATIVE (cash outflows), so we subtract them (which adds to IC)
    const ic_beginning = priorYear ? priorYear.ic_ending : invested_capital_2025;
    const ic_ending = ic_beginning - new_investments_total; // Subtract negative = add positive
    const change_in_ic = ic_ending - ic_beginning;
    
    // For FCF calculation
    const new_investments = -change_in_ic; // Negative of IC change (cash outflow)
    
    // Store for output
    const total_capex = new_investments_total;
    const capex_maintenance = maintenance_capex;
    
    // =================================================================
    // FREE CASH FLOW
    // =================================================================
    
    // FCF = EBITDA + Implementation Cost + Taxes + Maintenance Capex + New Investments + Premium
    // All items are signed (positive/negative), so we just SUM them
    // Following BAU engine formula exactly
    // Note: Acquisition is already included in new_investments (via IC change), so don't add it again
    // Premium is NOT part of IC, so it's added separately
    // Synergies ARE included in EBITDA and flow through to FCF
    const fcf = ebitda + implementation_cost + taxes + maintenance_capex + new_investments + premium;
    
    // Discount to present value (t=0, end of 2025)
    const discount_factor = Math.pow(1 + WACC, yearIndex + 1);
    const pv_fcf = fcf / discount_factor;
    
    years.push({
      year,
      yearIndex,
      revenue_bau,
      revenue_decisions,
      growth_decisions,
      revenue_total,
      cogs_bau,
      cogs_decisions,
      cogs_total,
      sga_bau,
      sga_decisions,
      sga_total,
      cogs_savings,
      sga_savings,
      mfg_oh_savings,
      synergies,
      ebitda,
      depreciation,
      ebit,
      taxes,
      nopat,
      investment_bau,
      investment_decisions,
      implementation_cost,
      acquisition,
      premium,
      capex_maintenance,
      total_capex,
      ic_beginning,
      ic_ending,
      change_in_ic,
      fcf,
      discount_factor,
      pv_fcf,
    });
  }
  
  // =================================================================
  // TERMINAL VALUE & VALUATION
  // =================================================================
  
  const year_2035 = years[9];
  
  // Terminal growth rate: 2.0% (matches BAU engine)
  const terminal_growth_rate = 0.02;
  
  // Continuing Value formula (EXACTLY from BAU engine):
  // 1. Calculate NOPAT for Year 11 (first year beyond projection)
  const ebit_year11 = year_2035.ebit * (1 + terminal_growth_rate);
  const taxes_year11 = -ebit_year11 * TAX_RATE;
  const nopat_year11 = ebit_year11 + taxes_year11;
  
  // 2. Calculate ROIC for Year 10 (2035) - BAU ENGINE FORMULA
  // ROIC = (EBITDA_margin - Capex_ratio) * (1 - Tax_rate) * Revenue / IC
  // Use ACTUAL 2035 ebitda_margin for continuing value calculation
  const ebitda_margin_2035 = year_2035.ebitda / year_2035.revenue_total;
  const roic_2035 = (ebitda_margin_2035 - DEPRECIATION_RATE) 
                    * (1 - TAX_RATE) 
                    * year_2035.revenue_total / year_2035.ic_ending;
  
  // 3. Calculate reinvestment rate
  const reinvestment_rate = terminal_growth_rate / roic_2035;
  
  // 4. Calculate FCF perpetuity
  const fcf_perpetuity = nopat_year11 * (1 - reinvestment_rate);
  
  // 5. Continuing value at end of 2035
  const terminal_value_at_2035 = fcf_perpetuity / (WACC - terminal_growth_rate);
  
  // Discount terminal value to present (end of 2025)
  const terminal_value = terminal_value_at_2035 / Math.pow(1 + WACC, 10);
  
  // NPV of 10-year cash flows
  const npv_10year = years.reduce((sum, y) => sum + y.pv_fcf, 0);
  
  // Enterprise Value
  const enterprise_value = npv_10year + terminal_value;
  
  // Equity Value = EV - Net Debt - Minority Interest (matching BAU engine formula)
  const equity_value = enterprise_value - NET_DEBT - MINORITY_INTEREST;
  
  // Share Price (Spot Price)
  const share_price = equity_value / SHARES_OUTSTANDING;
  
  // Forward Price = Spot Price × (1 + Cost of Equity)
  const forward_price = share_price * (1 + COST_OF_EQUITY);
  
  // TSR = (Forward Price / Starting Price) - 1
  const tsr = (forward_price / startingSharePrice) - 1;
  
  return {
    years,
    npv_10year,
    terminal_value,
    enterprise_value,
    equity_value,
    share_price,
    forward_price,
    tsr,
  };
}
