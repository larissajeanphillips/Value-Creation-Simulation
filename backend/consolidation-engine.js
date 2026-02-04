/**
 * Consolidation Engine - Combines BAU + Selected Decisions
 *
 * Implements the full calculation logic:
 * 1. Adjust BAU growth based on Sustain Topline decisions
 * 2. For each year, consolidate BAU + Decision cash flows
 * 3. Calculate consolidated P&L, IC, FCF
 * 4. Run DCF to get share price
 */
import { calculateBAUGrowthAdjustment, getDecision } from './decision-data';
/**
 * Calculate consolidated projection for a round
 */
export function calculateConsolidatedProjection(round, selectedDecisions, cumulativeGrowthDecline = 0, // Accumulated decline from previous rounds
startingSharePrice = 52.27 // Share price from Round 0
) {
    // Constants (from BAU engine)
    const WACC = 0.093;
    const TAX_RATE = 0.22; // 22% - CORRECTED
    const DEPRECIATION_RATE = 0.04; // Maintenance Capex = 4% of Revenue = Depreciation
    const COST_OF_EQUITY = 0.093;
    const NET_DEBT = 4900;
    const MINORITY_INTEREST = -2700;
    const SHARES_OUTSTANDING = 287.34; // CORRECTED from BAU engine
    // Baseline 2025 values (from BAU engine - Round 0)
    const revenue_2025 = 42836;
    const cogs_revenue_ratio = 0.8646232141189654; // 86.46% - CORRECTED
    const sga_2025 = 2061; // CORRECTED from BAU engine
    const sga_growth_rate = 0.02; // 2.0% - CORRECTED
    const invested_capital_2025 = 15827.72; // CORRECTED from BAU engine
    // Calculate current round's BAU growth decline
    const currentRoundDecline = calculateBAUGrowthAdjustment(selectedDecisions, round);
    const totalGrowthDecline = cumulativeGrowthDecline + currentRoundDecline;
    // Base BAU growth rate (2.0%) adjusted for cumulative decline
    const base_growth_rate = 0.02;
    const adjusted_growth_rate = base_growth_rate - totalGrowthDecline;
    console.log(`\n=== Round ${round} Consolidation ===`);
    console.log(`Selected Decisions: ${selectedDecisions.join(', ')}`);
    console.log(`Cumulative Growth Decline: ${(totalGrowthDecline * 100).toFixed(2)}%`);
    console.log(`Adjusted BAU Growth: ${(adjusted_growth_rate * 100).toFixed(2)}%\n`);
    // =================================================================
    // RUN BAU ENGINE WITH ADJUSTED GROWTH
    // =================================================================
    // Create adjusted BAU state (Round 0 assumptions)
    // Only revenue_growth_rate changes based on Sustain decisions
    const adjustedBAUState = {
        revenue: revenue_2025,
        cogs_revenue_ratio: cogs_revenue_ratio, // 86.46%
        sga: sga_2025, // Positive in state (2061)
        sga_growth_rate: sga_growth_rate, // 2.0%
        revenue_growth_rate: adjusted_growth_rate, // Adjusted for Sustain decisions
        invested_capital: invested_capital_2025,
        ebitda_margin: 0.08726304977122047, // From BAU engine
    };
    // Run BAU projection with ORIGINAL growth for 2026, then ADJUSTED for 2027+
    // We need to handle this specially because 2026 always uses 2.0%
    const years = [];
    // Track BAU IC separately for calculating investment_bau
    let ic_bau_current = invested_capital_2025;
    // Project 2026-2035
    for (let yearIndex = 0; yearIndex < 10; yearIndex++) {
        const year = 2026 + yearIndex;
        const priorYear = years[yearIndex - 1];
        // =================================================================
        // BAU CALCULATIONS (Using BAU Engine Logic)
        // =================================================================
        // Revenue (BAU) - Apply adjusted growth starting from 2027 (yearIndex >= 1)
        let revenue_bau;
        if (yearIndex === 0) {
            // 2026: Use original 2.0% growth
            revenue_bau = revenue_2025 * (1 + base_growth_rate);
        }
        else {
            // 2027+: Use adjusted growth (accounts for cumulative decline)
            revenue_bau = priorYear.revenue_bau * (1 + adjusted_growth_rate);
        }
        // COGS (BAU) - Using BAU engine formula: -Revenue × COGS/Revenue ratio (86.46%)
        const cogs_bau = -revenue_bau * cogs_revenue_ratio;
        // SG&A (BAU) - Using BAU engine formula: Prior SG&A × (1 + growth rate) = 2.0%
        // BAU engine formula: -state.sga × (1 + growth) for first year, then priorYear.sga × (1 + growth)
        const sga_bau = yearIndex === 0
            ? -sga_2025 * (1 + sga_growth_rate) // Make negative: -2061 × 1.02
            : priorYear.sga_bau * (1 + sga_growth_rate); // Already negative, grows at 2%
        // BAU New Investment - From BAU engine logic (mirrors bau-engine.ts exactly)
        // Years 2026-2030 (yearIndex 0-4): IC stays flat at 15,827.72
        // Years 2031-2035 (yearIndex 5-9): IC grows based on capital turnover locked at 2030
        const ic_beginning_bau = ic_bau_current; // IC from prior year
        let ic_ending_bau;
        if (yearIndex < 5) {
            // Years 0-4: IC stays flat
            ic_ending_bau = invested_capital_2025;
        }
        else {
            // Years 5-9: IC grows based on capital turnover
            // Calculate Revenue_2030 accounting for different growth rates:
            // - 2026: uses 2.0% (not affected by Sustain decline)
            // - 2027-2030: uses adjusted_growth_rate (e.g., 1.7% if 3 Sustain decisions skipped)
            // Revenue_2026 = Revenue_2025 × 1.02
            const revenue_2026 = revenue_2025 * 1.02;
            // Revenue_2030 = Revenue_2026 × (1 + adjusted_growth_rate)^4
            const revenue_2030 = revenue_2026 * Math.pow(1 + adjusted_growth_rate, 4);
            // Capital Turnover 2030 = Revenue_2030 / IC_2030
            const capital_turnover_2030 = revenue_2030 / invested_capital_2025;
            // IC_Ending = Revenue_BAU / Capital_Turnover_2030
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
        for (const decisionId of selectedDecisions) {
            const decision = getDecision(decisionId);
            if (!decision)
                continue;
            const cf = decision.cashFlows;
            // Add decision cash flows (column index = yearIndex)
            revenue_decisions += cf.Revenue[yearIndex];
            growth_decisions += cf['Growth '][yearIndex]; // Note the space!
            cogs_decisions += cf.COGS[yearIndex]; // Already negative
            sga_decisions += cf['SG&A'][yearIndex]; // Already negative
            cogs_savings += cf['COGS savings'][yearIndex];
            sga_savings += cf['SG&A savings'][yearIndex];
            mfg_oh_savings += cf['Manufacturing OH savings'][yearIndex];
            synergies += cf.Synergies[yearIndex];
            investment_decisions += cf.Investment[yearIndex]; // Already negative
            implementation_cost += cf['Implementation Cost'][yearIndex]; // Already negative
            acquisition += cf.Acquisition[yearIndex]; // Already negative
            premium += cf.Premium[yearIndex]; // Already negative
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
            + cogs_total // cogs_total is negative
            + sga_total // sga_total is negative
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
        // Total New Investments = Investment Decisions + Acquisition Decisions + BAU New Investment
        // Note: Implementation Cost does NOT affect IC
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
        // FCF = EBITDA + Implementation Cost + Taxes + Maintenance Capex + New Investments + Acquisitions
        // All items are signed (positive/negative), so we just SUM them
        // Following BAU engine formula exactly
        const fcf = ebitda + implementation_cost + taxes + maintenance_capex + new_investments + acquisition;
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
    // Terminal growth rate: 2.5%
    const terminal_growth_rate = 0.025;
    // Terminal FCF = 2035 FCF × (1 + terminal growth)
    const terminal_fcf = year_2035.fcf * (1 + terminal_growth_rate);
    // Terminal Value = Terminal FCF / (WACC - terminal growth)
    const terminal_value_at_2035 = terminal_fcf / (WACC - terminal_growth_rate);
    // Discount terminal value to present (end of 2025)
    const terminal_value = terminal_value_at_2035 / Math.pow(1 + WACC, 10);
    // NPV of 10-year cash flows
    const npv_10year = years.reduce((sum, y) => sum + y.pv_fcf, 0);
    // Enterprise Value
    const enterprise_value = npv_10year + terminal_value;
    // Equity Value = EV - Net Debt + Minority Interest
    const equity_value = enterprise_value - NET_DEBT + MINORITY_INTEREST;
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
