# Round 1 Calculation Engine - Fixes Summary

**Date**: 2026-02-03
**Status**: ✅ VALIDATED - Share price matches Excel exactly ($53.73)

## Key Fixes Applied

### 1. Tax Rate
- **Was**: 16.13%
- **Fixed to**: 22%
- **Location**: `backend/consolidation-engine.ts` line 91

### 2. WACC (Weighted Average Cost of Capital)
- **Was**: 9.3% (incorrectly used Cost of Equity)
- **Fixed to**: 8.0%
- **Note**: Cost of Equity (9.3%) is ONLY used for Forward Price calculation
- **Location**: `backend/consolidation-engine.ts` line 90

### 3. Net Debt
- **Was**: $4,900M
- **Fixed to**: $7,765M
- **Location**: `backend/consolidation-engine.ts` line 94

### 4. Minority Interest
- **Was**: -$2,700M
- **Fixed to**: $418M (positive value, subtracted in equity formula)
- **Location**: `backend/consolidation-engine.ts` line 95

### 5. Shares Outstanding
- **Was**: Variable
- **Fixed to**: 287.34M
- **Location**: `backend/consolidation-engine.ts` line 96

### 6. Investment BAU Calculation
- **Issue**: IC growth calculation didn't account for different growth rates by year
- **Fixed**: 
  - 2026 uses 2.0% growth (not affected by Sustain Topline decline)
  - 2027-2030 use adjusted growth rate (1.7% when 3 Sustain decisions skipped)
  - Capital Turnover 2030 = Revenue_2026 × (1 + 1.7%)^4 / IC_2025
  - IC grows from 2031-2035 based on this locked capital turnover
- **Location**: `backend/consolidation-engine.ts` lines 174-195

### 7. Equity Value Formula
- **Was**: `enterprise_value - NET_DEBT + MINORITY_INTEREST`
- **Fixed to**: `enterprise_value - NET_DEBT - MINORITY_INTEREST`
- **Location**: `backend/consolidation-engine.ts` line 387

## Validation Results

### Test Case: Round 1, Decision #1 Only (Mexico Capacity Expansion)

| Metric | Calculated | Expected | Status |
|--------|-----------|----------|--------|
| Share Price (Spot) | $53.73 | $53.73 | ✅ EXACT |
| Forward Price | $58.72 | - | ✅ |
| TSR | 12.35% | - | ✅ |
| Enterprise Value | $23,621M | $23,621M | ✅ EXACT |
| NPV 10-Year | $10,721M | - | ✅ |
| Terminal Value | $12,899M | - | ✅ |

## Files Modified

1. `backend/consolidation-engine.ts` - Core calculation engine
2. `backend/export-round1-csv.ts` - CSV export script (import fixes)
3. `backend/test-round1.ts` - Test script (import fixes)

## Next Steps

### Before Committing to Main Code:
1. ✅ Test with Decision #1 only - PASSED
2. ⏳ Test with different decision combinations
3. ⏳ Test with multiple decisions selected
4. ⏳ Test with no decisions (pure BAU Round 1)
5. ⏳ Test with all Sustain Topline decisions selected

### Use Testing Script:
```bash
cd backend
node test-different-decisions.js
```

## Key Learnings

1. **WACC vs Cost of Equity**: Different rates used for different purposes
   - WACC (8.0%) → Discounting cash flows
   - Cost of Equity (9.3%) → Forward price calculation

2. **Capital Turnover**: Locks at 2030 level using ADJUSTED growth rates
   - Must account for year-specific growth (2026 = 2.0%, 2027+ = adjusted)

3. **Equity Bridge**: Subtract BOTH Net Debt AND Minority Interest from EV

4. **ROIC Formula**: Uses BASELINE 2025 EBITDA margin, not current year margin
   - Formula: `(EBITDA_margin_2025 - Capex_ratio) × (1 - Tax) × Revenue / IC`

## Excel Model Reference

- **File**: `260127 TSR decisions_v2.8 (1).xlsx`
- **Key Sheet**: Output tab, columns B:O
- **Continuing Value Formula**: Cell M40
- **Constants**: Row 10 (AW10=Terminal Growth, AZ10=WACC)
- **ROIC**: Row 59
