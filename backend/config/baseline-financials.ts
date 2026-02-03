/**
 * Value Creation Challenge - Baseline Financials
 * Starting position for all teams (2024 EOY / 2025 Start)
 * 
 * Based on Magna International's 2024 Annual Report
 * All values in USD Millions unless otherwise noted
 */

import type { BaselineFinancials, FinancialMetrics } from '../types/game.js';

/**
 * 2024 End of Year baseline financials (from Magna International 2024 Annual Report)
 * This is the starting position for all teams
 */
export const BASELINE_FINANCIALS: BaselineFinancials = {
  // Income Statement
  revenue: 42836,           // $42,836M - Annual report
  cogs: -37037,             // ($37,037M) - Cost of Goods Sold - Annual report
  sga: -2061,               // ($2,061M) - SG&A - Annual report
  ebitda: 3738,             // $3,738M - Revenue - COGS - SG&A
  depreciation: -1510,      // ($1,510M) - Annual report
  amortization: -112,       // ($112M) - Annual report
  ebit: 2116,               // $2,116M - EBITDA - Depreciation - Amortization
  
  // Cash Flow
  cashTaxes: -466,          // ($466M) - Assume 22% of incremental EBIT
  capex: -1713,             // ($1,713M) - 4% of revenue (average CAPEX as % of revenue)
  operatingFCF: 1559,       // $1,559M - EBIT - Taxes + D&A - CapEx
  beginningCash: 1247,      // $1,247M - End of year cash position
  dividends: -539,          // ($539M) - Annual report
  shareBuybacks: -207,      // ($207M) - Repurchase of Common Shares - Annual report
  
  // Balance Sheet
  netDebt: 7765,            // $7,765M - MVI (Market Value Index)
  minorityInterest: 418,    // $418M - Annual report
  investedCapital: 15828,   // $15,828M - MVI, adjusted to reclassify Equity Investments as operating
  
  // Valuation
  npv: 22738,               // $22,738M - Enterprise Value / NPV
  equityValue: 14555,       // $14,555M - NPV - Net Debt - Minority Interest
  sharesOutstanding: 287.34, // 287.34M shares - MVI
  sharePrice: 50.67,        // $50.67 per share - Equity Value / Shares
  
  // Rates
  costOfEquity: 0.09,       // 9% - Cost of Equity
};

/**
 * Creates a full FinancialMetrics object from baseline
 * Used to initialize team state at game start
 */
export function createInitialMetrics(): FinancialMetrics {
  const baseline = BASELINE_FINANCIALS;
  
  // Calculate ROIC: EBIT * (1 - Tax Rate) / Invested Capital
  const nopat = baseline.ebit * (1 - TAX_RATE);
  const roic = nopat / baseline.investedCapital;
  
  return {
    // Income Statement
    revenue: baseline.revenue,
    cogs: baseline.cogs,
    sga: baseline.sga,
    ebitda: baseline.ebitda,
    depreciation: baseline.depreciation,
    amortization: baseline.amortization,
    ebit: baseline.ebit,
    
    // Cash Flow
    cashTaxes: baseline.cashTaxes,
    capex: baseline.capex,
    operatingFCF: baseline.operatingFCF,
    beginningCash: baseline.beginningCash,
    endingCash: baseline.beginningCash + baseline.operatingFCF + baseline.dividends + baseline.shareBuybacks,
    
    // Valuation
    npv: baseline.npv,
    equityValue: baseline.equityValue,
    sharesOutstanding: baseline.sharesOutstanding,
    sharePrice: baseline.sharePrice,
    
    // Derived Metrics
    ebitMargin: baseline.ebit / baseline.revenue,  // ~4.94%
    roic: roic,  // NOPAT / Invested Capital (~10.4%)
  };
}

/**
 * Starting cash available for investments
 * Based on Operating FCF minus assumed dividends/buybacks
 */
export const STARTING_INVESTMENT_CASH = 1200;  // $1,200M available per round initially

/**
 * WACC (Weighted Average Cost of Capital)
 * Used for NPV calculations
 */
export const WACC = 0.075;  // 7.5%

/**
 * Terminal growth rate for DCF calculations
 */
export const TERMINAL_GROWTH_RATE = 0.02;  // 2%

/**
 * Tax rate for cash flow calculations
 */
export const TAX_RATE = 0.22;  // 22%
