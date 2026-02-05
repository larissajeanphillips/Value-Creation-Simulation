# PRD Financial Calculations Update — Plan (Revised)

## Source of truth

**All fixed inputs and financial formulas must be taken from this repo only:**

- **Repo:** [Value-Creation-Simulation](https://github.com/larissajeanphillips/Value-Creation-Simulation.git)
- **Do not** use values or formulas from any other repository or document for financial implementation.
- **Going forward:** Use only the Value-Creation-Simulation repo for financial inputs, baseline financials, and calculation logic. Pull latest from GitHub (`main`) for current values.

## Corrections (from user)

- **WACC:** Should be **8.0%** (not 7.5%). User indicated "VAC should be 80%" — interpreted as WACC = 8.0%.
- **Net debt:** Value in the plan was incorrect; pull the correct value from Value-Creation-Simulation backend (e.g. `backend/calculation-engine.ts` or `backend/config/baseline-financials.ts` or `backend/consolidation-engine.ts` in that repo).
- **All other inputs:** Tax rate, terminal growth, dividend payout, invested capital assumption, baseline financials, etc. must be read from the same repo and documented in the PRD.

## Implementation steps

1. **Clone or open the Value-Creation-Simulation repo** (if not already in workspace):
   - `https://github.com/larissajeanphillips/Value-Creation-Simulation.git`
   - Ensure you have the latest `main` (or the branch you use).

2. **Read these files in Value-Creation-Simulation:**
   - `backend/calculation-engine.ts` — constants (NET_DEBT, DIVIDEND_PAYOUT_RATIO, RAMP_UP_SCHEDULE, DCF_PROJECTION_YEARS, INVESTOR_NOISE_FACTOR, stock price bounds), and all formulas (NPV, ROIC, TSR, decision impacts, operating FCF, etc.).
   - `backend/config/baseline-financials.ts` — TAX_RATE, WACC, TERMINAL_GROWTH_RATE, BASELINE_FINANCIALS, STARTING_INVESTMENT_CASH.
   - `backend/config/game-settings.ts` — any financial-related settings.
   - `backend/consolidation-engine.ts` and `backend/bau-engine.ts` (if used for Round 1) — their constants (WACC, TAX_RATE, NET_DEBT, etc.) so the PRD can note Round 1 vs Rounds 2–5 if they differ.

3. **Update the PRD** ([tasks/prd-tsr-challenge-game.md](tasks/prd-tsr-challenge-game.md)):
   - **Fixed inputs table:** Populate every row with values from Value-Creation-Simulation (WACC 8.0% per user; net debt and all others from the repo).
   - **Backend calculation formulas:** Keep the same formula descriptions, but ensure any numeric constants in the PRD text (e.g. WACC %, tax %, net debt) match the repo.
   - Add a short note: *"All values and formulas in this section are authoritative as implemented in [Value-Creation-Simulation](https://github.com/larissajeanphillips/Value-Creation-Simulation) backend; do not use other repos for financial inputs."*

4. **Version history:** Add a row for this update (e.g. 0.3) and note that financial inputs and formulas are now sourced from Value-Creation-Simulation with WACC and net debt corrections.

## Summary

| Item | Action |
|------|--------|
| Source repo | Value-Creation-Simulation only |
| WACC | 8.0% (corrected from 7.5%) |
| Net debt | From Value-Creation-Simulation backend |
| All other inputs | Read from Value-Creation-Simulation and document in PRD |
| Future work | Use only Value-Creation-Simulation repo |
