/**
 * Business as Usual (BAU) Financial Calculation Engine
 * 
 * This engine calculates the 10-year DCF projection and share price
 * based on baseline financial parameters without any decisions or scenarios.
 */

// ============================================================================
// CONSTANTS (Don't change across rounds/scenarios)
// ============================================================================

export const CONSTANTS = {
  WACC: 0.08,                    // Weighted Average Cost of Capital
  TERMINAL_GROWTH: 0.02,         // Terminal growth rate (perpetuity)
  TAX_RATE: 0.22,                // Corporate tax rate
  CAPEX_REVENUE_RATIO: 0.04,     // Capex as % of revenue
  NET_DEBT: 7765,                // Net debt (millions)
  MINORITY_INTEREST: 418,        // Minority interest (millions)
  SHARES_OUTSTANDING: 287.34,    // Shares outstanding (millions)
} as const;

// ============================================================================
// BASELINE STATE (Year 0 / 2025)
// ============================================================================

export interface BaselineState {
  // Starting values
  revenue: number;              // Base revenue (millions)
  cogs_revenue_ratio: number;   // COGS as % of revenue
  sga: number;                  // SG&A expenses (millions)
  invested_capital: number;     // Invested capital (millions)
  
  // Growth rates (BAU assumptions)
  revenue_growth_rate: number;  // Revenue growth rate
  sga_growth_rate: number;      // SG&A growth rate
  ebitda_margin: number;        // EBITDA margin
}

export const BASELINE_2025: BaselineState = {
  revenue: 42836,
  cogs_revenue_ratio: 0.8646232141189654,
  sga: 2061,
  invested_capital: 15827.72,
  revenue_growth_rate: 0.02,
  sga_growth_rate: 0.02,
  ebitda_margin: 0.08726304977122047,
};

// ============================================================================
// YEAR PROJECTION (Single Year)
// ============================================================================

export interface YearProjection {
  year: number;                  // Calendar year
  
  // Revenue
  revenue_base: number;          // Revenue from prior year
  revenue_growth_dollars: number; // Growth in dollars
  revenue_total: number;         // Total revenue
  
  // Income Statement
  cogs: number;                  // Cost of goods sold
  sga: number;                   // SG&A expenses
  ebitda: number;                // EBITDA
  depreciation: number;          // D&A (= Capex)
  ebit: number;                  // EBIT
  
  // Cash Flow
  implementation_cost: number;   // One-time costs (decisions)
  taxes: number;                 // Taxes on EBIT
  capex: number;                 // Capital expenditures
  new_investments: number;       // Change in invested capital
  acquisitions: number;          // Acquisition costs (decisions)
  fcf: number;                   // Free cash flow
  
  // Valuation
  continuing_value: number;      // Terminal value (Year 10 only)
  discount_factor: number;       // PV discount factor
  discounted_fcf: number;        // Discounted FCF
  
  // Metrics
  roic: number;                  // Return on invested capital
  ic_beginning: number;          // Invested capital at start
  ic_ending: number;             // Invested capital at end
}

// ============================================================================
// BAU ENGINE - 10-Year Projection
// ============================================================================

/**
 * Calculate a single year's financials
 */
function calculateYear(
  yearIndex: number,           // 0 = 2026, 1 = 2027, ..., 9 = 2035
  priorYear: YearProjection | null,
  state: BaselineState,
): YearProjection {
  const year = 2026 + yearIndex;
  
  // ---------------------------------------------------------------------------
  // Revenue Calculation
  // ---------------------------------------------------------------------------
  const revenue_base = priorYear ? priorYear.revenue_total : state.revenue;
  const revenue_growth_dollars = revenue_base * state.revenue_growth_rate;
  const revenue_total = revenue_base + revenue_growth_dollars;
  
  // ---------------------------------------------------------------------------
  // Income Statement
  // ---------------------------------------------------------------------------
  const cogs = -revenue_total * state.cogs_revenue_ratio;
  const sga = priorYear 
    ? priorYear.sga * (1 + state.sga_growth_rate)
    : -state.sga * (1 + state.sga_growth_rate);
  
  const ebitda = revenue_total + cogs + sga; // Note: cogs and sga are negative
  
  const capex = -revenue_total * CONSTANTS.CAPEX_REVENUE_RATIO;
  const depreciation = capex; // D&A = Capex in this model
  
  const ebit = ebitda + depreciation;
  
  // ---------------------------------------------------------------------------
  // Cash Flow
  // ---------------------------------------------------------------------------
  const implementation_cost = 0; // No decisions in BAU
  const taxes = Math.min(0, -(ebit + implementation_cost) * CONSTANTS.TAX_RATE);
  
  // Invested capital logic
  const ic_beginning = priorYear ? priorYear.ic_ending : state.invested_capital;
  
  // In BAU: IC stays flat for Years 1-5 (2026-2030), then calculated based on fixed Capital Turnover
  let ic_ending: number;
  if (yearIndex < 5) {
    ic_ending = state.invested_capital; // Flat for years 0-4 (2026-2030)
  } else {
    // After 2030, IC is calculated as: Revenue × (1 / Capital_Turnover_2030)
    // Capital Turnover locks at 2030 level
    // We can calculate this from 2030 baseline: Revenue_2030 / IC_2030
    // For 2% growth: Revenue_2030 = 42836 × 1.02^5 = 47294.41
    const revenue_2030 = state.revenue * Math.pow(1 + state.revenue_growth_rate, 5);
    const capital_turnover_2030 = revenue_2030 / state.invested_capital;
    
    // IC_Ending = Revenue_Total × (1 / Capital_Turnover_2030)
    ic_ending = revenue_total / capital_turnover_2030;
  }
  
  const new_investments = -(ic_ending - ic_beginning); // Negative because it's a cash outflow
  const acquisitions = 0; // No acquisitions in BAU
  
  const fcf = ebitda + implementation_cost + taxes + capex + new_investments + acquisitions;
  
  // ---------------------------------------------------------------------------
  // Continuing Value (Year 10 only)
  // ---------------------------------------------------------------------------
  let continuing_value = 0;
  if (yearIndex === 9) { // Year 10 (2035)
    // Calculate NOPAT for Year 11 (first year beyond projection)
    const ebit_year11 = ebit * (1 + CONSTANTS.TERMINAL_GROWTH);
    const taxes_year11 = -ebit_year11 * CONSTANTS.TAX_RATE;
    const nopat_year11 = ebit_year11 + taxes_year11;
    
    // ROIC calculation: (EBITDA_margin - Capex_ratio) * (1 - Tax_rate) * Revenue / IC
    const roic = (state.ebitda_margin - CONSTANTS.CAPEX_REVENUE_RATIO) 
                 * (1 - CONSTANTS.TAX_RATE) 
                 * revenue_total / ic_ending;
    
    // Continuing value formula: NOPAT * (1 - g/ROIC) / (WACC - g)
    const reinvestment_rate = CONSTANTS.TERMINAL_GROWTH / roic;
    const fcf_perpetuity = nopat_year11 * (1 - reinvestment_rate);
    continuing_value = fcf_perpetuity / (CONSTANTS.WACC - CONSTANTS.TERMINAL_GROWTH);
  }
  
  // ---------------------------------------------------------------------------
  // Discounting
  // ---------------------------------------------------------------------------
  const discount_factor = 1 / Math.pow(1 + CONSTANTS.WACC, yearIndex + 1);
  const discounted_fcf = (fcf + continuing_value) * discount_factor;
  
  // ---------------------------------------------------------------------------
  // ROIC
  // ---------------------------------------------------------------------------
  const roic = (state.ebitda_margin - CONSTANTS.CAPEX_REVENUE_RATIO) 
               * (1 - CONSTANTS.TAX_RATE) 
               * revenue_total / ic_ending;
  
  return {
    year,
    revenue_base,
    revenue_growth_dollars,
    revenue_total,
    cogs,
    sga,
    ebitda,
    depreciation,
    ebit,
    implementation_cost,
    taxes,
    capex,
    new_investments,
    acquisitions,
    fcf,
    continuing_value,
    discount_factor,
    discounted_fcf,
    roic,
    ic_beginning,
    ic_ending,
  };
}

/**
 * Run full 10-year BAU projection
 */
export function runBAUProjection(state: BaselineState = BASELINE_2025): YearProjection[] {
  const projections: YearProjection[] = [];
  
  for (let i = 0; i < 10; i++) {
    const priorYear = i > 0 ? projections[i - 1] : null;
    const yearProjection = calculateYear(i, priorYear, state);
    projections.push(yearProjection);
  }
  
  return projections;
}

// ============================================================================
// VALUATION - Calculate Share Price
// ============================================================================

export interface Valuation {
  enterprise_value: number;      // NPV of all FCF
  net_debt: number;              // Net debt
  minority_interest: number;     // Minority interest
  equity_value: number;          // EV - Net Debt - Minority
  shares_outstanding: number;    // Shares
  share_price: number;           // Equity Value / Shares
  
  // Breakdown
  fcf_projections: YearProjection[];
}

/**
 * Calculate share price from 10-year projection
 */
export function calculateSharePrice(
  projections: YearProjection[] = runBAUProjection()
): Valuation {
  // Sum all discounted FCF (includes continuing value in Year 10)
  const enterprise_value = projections.reduce(
    (sum, year) => sum + year.discounted_fcf,
    0
  );
  
  // Bridge from EV to Equity Value
  const net_debt = CONSTANTS.NET_DEBT;
  const minority_interest = CONSTANTS.MINORITY_INTEREST;
  const equity_value = enterprise_value - net_debt - minority_interest;
  
  // Calculate share price
  const shares_outstanding = CONSTANTS.SHARES_OUTSTANDING;
  const share_price = equity_value / shares_outstanding;
  
  return {
    enterprise_value,
    net_debt,
    minority_interest,
    equity_value,
    shares_outstanding,
    share_price,
    fcf_projections: projections,
  };
}

// ============================================================================
// ROUND 0 - Initial State
// ============================================================================

/**
 * Calculate Round 0 (t=0) starting share price
 */
export function calculateRound0(): Valuation {
  return calculateSharePrice();
}
