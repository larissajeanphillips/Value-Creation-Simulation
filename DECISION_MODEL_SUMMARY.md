# Decision Model Structure Summary

## ✅ Excel Model Structure Confirmed

### Decision Metadata Location
**Tab:** Decisions  
**Range:** U4:AF79 (75 decisions total)

**Columns:**
- U: Decision Number (1-75)
- V: Lever (Grow / Optimize / Sustain)
- W: Type (Organic, Inorganic, COGS savings, SGA savings, etc.)
- X: Lesson Learned
- Y: Category (e.g., "Expand Manufacturing Footprint")
- Z: Name (e.g., "Mexico Capacity Expansion")
- AA: Description (detailed text)
- AB: Round (1-5, 15 decisions per round)
- AC: Size (1-5 scale)
- AD: Fundamentals (impact rating 1-5)
- AE: Investment Period (years)
- AF: Selected (1 = selected, 0 = not selected)

---

## 📊 Round 1 Decisions (15 Total)

### GROW Decisions (5)
1. **Mexico Capacity Expansion** ⭐ SELECTED in model
   - Category: Expand Manufacturing Footprint
   - Type: Organic
   - Size: 3, Investment Period: 2 years

2. **Advanced Powertrain R&D Expansion**
   - Category: Scale R&D for Next-Gen Portfolio
   - Type: Organic
   - Size: 4, Investment Period: 3 years

3. **Southeast Asia Market Entry**
   - Category: Enter New Geography / Market
   - Type: Organic
   - Size: 3, Investment Period: 2 years

4. **Battery Technology JV**
   - Category: JV / Strategic Partnership
   - Type: Organic
   - Size: 5, Investment Period: 2 years

5. **Concentrated OEM Capacity Investment**
   - Category: Expand Manufacturing Footprint
   - Type: Organic
   - Size: 4, Investment Period: 2 years

### OPTIMIZE Decisions (5)
6. **Smart Factory Pilot Program**
   - Category: Factory of the Future
   - Type: Manufacturing OH savings
   - Size: 2, Investment Period: 2 years

7. **Shared Services Consolidation**
   - Category: SG&A Optimization
   - Type: SGA savings
   - Size: 2, Investment Period: 1 year

8. **Supplier Dual-Sourcing Initiative**
   - Category: Global Supply Chain Redesign
   - Type: COGS savings
   - Size: 3, Investment Period: 1 year

9. **ERP System Upgrade**
   - Category: Enterprise Digital Transformation
   - Type: Manufacturing OH savings
   - Size: 2, Investment Period: 2 years

10. **Management Delayering**
    - Category: Organizational Restructure
    - Type: SGA savings
    - Size: 2, Investment Period: 1 year

### SUSTAIN Decisions (5)
11. **Customer Diversification Initiative**
    - Category: Portfolio management (maintenance)
    - Type: Sustain Topline
    - Size: 1, Investment Period: 1 year

12. **Technical Talent Development**
    - Category: Talent & Leadership Upskilling
    - Type: COGS savings
    - Size: 2, Investment Period: 1 year

13. **Cybersecurity Enhancement**
    - Category: Risk & Compliance Upgrade
    - Type: Sustain Topline
    - Size: 2, Investment Period: 1 year

14. **Equipment Refresh Program**
    - Category: Capital allocation strategy (maintenance)
    - Type: Sustain Topline
    - Size: 2, Investment Period: 1 year

15. **Environmental Compliance Investment**
    - Category: Risk & Compliance Upgrade
    - Type: SGA savings
    - Size: 1, Investment Period: 1 year

---

## 💰 Decision Cash Flow Structure

**Location:** Decisions tab, A120:P1545

**Column Structure:**
- A: Decision Number (1-75)
- B: Round (1-5)
- C: Type (Organic, etc.) - can ignore for now
- D: Comment
- E: Line Item Name (P&L / Cash Flow item)
- F: Base Input
- G-P: Years R1 through R10 (relative years, NOT calendar years)

**Important:** Columns G-P represent **relative years** (R1-R10), not calendar years!
- For Round 1 decision: R1 = 2026, R2 = 2027, ..., R10 = 2035
- For Round 2 decision: R1 = 2027, R2 = 2028, ..., R10 = 2036

### Line Items Per Decision (19 rows each)

Each decision has these P&L/CF line items:

1. **Investment Period** - Flags when capital is deployed (1 = yes, 0 = no)
2. **Operating Period** - Flags when operations begin (x = not yet, 0+ = operating)
3. **Growth Period** - Flags when growth phase is active
4. **Investment** - Capex spend (negative values, e.g., -400M)
5. **Implementation Cost** - One-time costs
6. **Revenue** - Incremental revenue generated
7. **Growth** - Incremental revenue growth
8. **COGS** - Incremental cost of goods sold
9. **SG&A** - Incremental selling, general & admin expenses
10. **EBITDA** - Calculated (Revenue - COGS - SG&A)
11. **COGS savings** - Cost reductions
12. **Manufacturing OH savings** - Manufacturing overhead savings
13. **SG&A savings** - SG&A cost reductions
14. **Synergies** - Additional synergies (M&A)
15. **Capex maintenance** - Ongoing maintenance capex
16. **Taxes** - Tax impacts
17. **Acquisition** - Acquisition cost (M&A deals)
18. **Premium** - Acquisition premium

---

## 🔄 Consolidation Logic

### Selection Mechanism
- Column AF (Decisions tab, rows 5-79): 1 = selected, 0 = not selected

### Consolidation Flow
1. **Selection** → Column AF in Decisions tab (U4:AF79)
2. **Decision Cash Flows** → Pulled from A120:P1545 for selected decisions
3. **Consolidated P&L** → E85:R113 (BAU + Selected Decisions)
4. **Output Tab** → Q:AD (Consolidated financials)
5. **Full Valuation** → Output tab B:O (BAU + Decisions → DCF → Share Price)

### Calculation Logic
```
Consolidated Revenue = BAU Revenue + Sum(Decision Revenues for selected decisions)
Consolidated COGS    = BAU COGS    + Sum(Decision COGS for selected decisions)
Consolidated SG&A    = BAU SG&A    + Sum(Decision SG&A for selected decisions)
→ Consolidated EBITDA = Consolidated Revenue - Consolidated COGS - Consolidated SG&A
→ Consolidated FCF    = (calculated from consolidated P&L)
→ NPV                 = DCF on consolidated FCF
→ Share Price         = (EV - Net Debt) / Shares Outstanding
```

---

## ⚠️ Frontend vs Excel Model Comparison

### ❌ Current Frontend Issues

**Frontend has 9 demo decisions (demoData.ts), NOT 75 real decisions:**
- "EV Battery Technology JV" (demo) vs "Battery Technology JV" (Excel #4)
- "Mexico Manufacturing Expansion" (demo) vs "Mexico Capacity Expansion" (Excel #1)
- Decision IDs are random strings, not aligned with Excel numbering
- Financial impacts are placeholder values, not from Excel cash flows

### ✅ What Needs to Happen

1. **Replace demo decisions** with real Excel decisions (all 75)
2. **Match decision structure** to Excel metadata
3. **Extract cash flow data** for each decision from A120:P1545
4. **Implement calculation engine** that consolidates BAU + selected decisions
5. **Connect frontend to backend** for real-time calculations

---

## 🎯 Next Steps

### Phase 1: Extract Decision Cash Flows
- [ ] Extract cash flow data for Decision #1 (Mexico Capacity Expansion)
- [ ] Verify structure (19 line items × 10 years)
- [ ] Understand calculation logic (how Revenue, COGS, etc. are derived)

### Phase 2: Build Decision Engine
- [ ] Create `backend/decision-engine.ts`
- [ ] Implement decision cash flow calculations
- [ ] Test with Decision #1 only

### Phase 3: Build Consolidation Engine
- [ ] Create `backend/consolidation-engine.ts`
- [ ] Implement BAU + Decisions summing logic
- [ ] Calculate consolidated P&L and FCF

### Phase 4: Calculate Round 1 Share Price
- [ ] Run BAU alone (no decisions) → Share Price Round 1
- [ ] Run BAU + Decision #1 → Share Price Round 1 with Mexico Expansion
- [ ] Verify against Excel Output tab

---

## ❓ Open Questions for User

1. **Decision #1 Cash Flows**: Can we extract the full cash flow data for Decision #1?
2. **Formulas vs Values**: Are the cells in A120:P1545 formulas or hardcoded values?
3. **Validation**: What should the share price be for Round 1 with ONLY Decision #1 selected?
4. **Frontend Update**: Should we update the frontend decisions now, or after backend is working?

---

**Status:** ✅ Structure understood, ready to extract decision cash flows!
