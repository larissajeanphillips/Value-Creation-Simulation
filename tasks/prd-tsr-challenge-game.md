# PRD: Value Creation Simulation

## Introduction

The **Value Creation Simulation** is a live simulation game for Magna International's global leadership meeting in March 2026. Approximately 150 leaders (15 teams of 10) will compete as "CEOs" making capital allocation decisions across 5 rounds (representing fiscal years 2026-2030). The game teaches Total Shareholder Return (TSR) drivers through experiential learning, with the winner determined by cumulative shareholder value creation from 2026-2035.

### Problem Statement

Magna's leadership needs to internalize complex capital allocation trade-offs and their impact on shareholder value. Traditional presentations don't create lasting understanding. This simulation creates visceral, memorable learning by putting leaders in the CEO seat during varying market conditions.

### Context

- **Event:** Magna International Global Leadership Meeting
- **Date:** March 2026
- **Duration:** 120 minutes total session
- **Participants:** ~150 leaders across 15 teams of 10
- **Setting:** Conference room with one laptop per team table

### Production URLs (Vercel)

The frontend is deployed on Vercel. **Base URL:** `https://value-creation-simulation.vercel.app`

| Purpose | Link |
|--------|------|
| **Facilitator demo** (displays, scoreboard, rounds, debrief, admin; start here for Phil) | https://value-creation-simulation.vercel.app/demo/admin |
| **Player demo** (team interface entry for participants) | https://value-creation-simulation.vercel.app/demo |
| **Live admin** (facilitator control panel) | https://value-creation-simulation.vercel.app/admin |
| **Live player** (team interface) | https://value-creation-simulation.vercel.app/ |
| **Live display** (Display Hub — big-screen menu) | https://value-creation-simulation.vercel.app/display |

Use these links as the single source of truth when sharing or referencing the live simulation. Full list for Verso: **docs/demo-links-for-phil.md**.

---

## Goals

- Enable 15 teams to simultaneously make capital allocation decisions within time constraints
- Calculate and display team performance (stock price / TSR) after each round
- Teach core value creation principles through gameplay mechanics
- Support facilitator control of game flow (start/pause/advance rounds, trigger events)
- Deliver a functional MVP focused on the core game loop

---

## Core Learning Objectives

The game mechanics should be designed so that teams who follow these principles tend to outperform.

### Magna's Four Guiding Principles

The game reinforces Magna's strategic framework through experiential learning:

| Guiding Principle | What It Means | Key Behaviors |
|-------------------|---------------|---------------|
| **Long-Term Ownership Mentality** | Incentives aligned to execution and long-term value; partnership-driven approach with OEMs | Avoid short-term cuts that destroy long-term value; maintain investment capacity |
| **Portfolio Management** | Target attractive markets; back leaders with path to profitable growth; exit non-core assets | Diversify across customers/suppliers/geographies; actively manage portfolio |
| **Maintain Strong Balance Sheet** | Protect liquidity and investment-grade leverage (Debt/EBITDA: 1.0-1.5x) | Preserve cash optionality; maintain flexibility through cycles |
| **Capital Allocation Strategy** | Maximize long-term FCF per share; prioritize profitable growth | Margin improvement over volume growth; return excess capital appropriately |

### Core Lessons Mapped to Principles

| Lesson | Guiding Principle | Why It Matters |
|--------|-------------------|----------------|
| **Margin expansion > Growth** | Capital Allocation Strategy | At MGA's position on the growth spread matrix (ROIC slightly above WACC), margin improvement creates significantly more value than chasing growth |
| **Diversification pays off** | Portfolio Management | Spreading risk across customers, suppliers, and geographies protects against concentrated failures |
| **Cash optionality matters** | Maintain Strong Balance Sheet | Sometimes holding cash beats investing, especially before downturns |
| **Balance sheet flexibility enables opportunism** | Maintain Strong Balance Sheet | Dry powder allows opportunistic M&A when competitors struggle |
| **Position for recovery** | Long-Term Ownership Mentality | Those who maintain investment capacity can ride the rising tide |

### KPI Scorecard

Magna's Financial Framework (2025 Strategy) defines six target financial metrics: **Growth over Market** (2–4%), **EBIT Margin** (10%+), **CapEx to Sales** (4–4.5%), **FCF Conversion** (>70%), **ROIC** (15%+), and **EPS Growth** (10%). In this simulation we assess only the five metrics below. We do not actively test CapEx to Sales (or debt-related metrics) because the game simplifies with **fixed assumptions for debt and capex**; those levers are held constant so teams focus on capital allocation and operating decisions.

| KPI | Target | Assessment Criteria |
|-----|--------|---------------------|
| **EBIT Margin** | ≥10% | 🟢 ≥10% / 🟡 8-10% / 🔴 <8% |
| **Free Cash Flow Conversion** | >70% | 🟢 ≥70% / 🟡 50-70% / 🔴 <50% |
| **ROIC** | ≥15% | 🟢 ≥15% / 🟡 12-15% / 🔴 <12% |
| **EPS Growth** | ≥10% | 🟢 ≥10% / 🟡 5-10% / 🔴 <5% |
| **Revenue Growth** | 2-4% | 🟢 On target / 🟡 Below target / 🔴 Negative or chasing volume unsustainably |

---

## Scenario Dynamics & Expected Responses

### Macro Environment by Round

| Round | Year | Scenario | What Happens | Smart Response | Trap to Avoid |
|-------|------|----------|--------------|----------------|---------------|
| 1 | 2026 | **Business as Usual** | Stable market, EV transition underway | Balance growth & optimization; build foundation | Over-investing in risky growth bets too early |
| 2 | 2027 | **Business as Usual** | Continued stability; investments ramping | Execute on strategy; position for efficiency; diversify OEM exposure | Complacency; concentrating on single OEM relationships |
| 3 | 2028 | **Cost Pressure** | Raw materials ↑, labor ↑, OEM pushback; **OEM program cancellation hits** | Pivot to Optimize decisions; preserve cash | Doubling down on Grow (penalized at 0.7x!) |
| 4 | 2029 | **Recession** | Auto sales ↓↓, cash is king | Sustain investments; opportunistic M&A if cash available | Aggressive expansion (penalized at 0.5x!) |
| 5 | 2030 | **Recovery** | Market rebounds, optimism returns | Grow investments rewarded (1.3x); ride the wave | Over-defensive play; excessive Sustain (0.8x) |

### Scenario Multipliers

| Scenario | Grow | Optimize | Sustain | Strategic Implication |
|----------|------|----------|---------|----------------------|
| Business as Usual (R1-2) | 1.0x | 1.0x | 1.0x | Balanced approach works |
| Cost Pressure (R3) | **0.7x** | **1.2x** | 1.0x | Margin focus rewarded |
| Recession (R4) | **0.5x** | 1.0x | **1.5x** | Survival mode; protect the base |
| Recovery (R5) | **1.3x** | 1.0x | **0.8x** | Growth bets pay off |

---

## Special Events (Facilitator-Triggered)

These events test whether teams have built resilience through diversification and risk management:

| Event | Round | Description | Protected If... | Punished If... |
|-------|-------|-------------|-----------------|----------------|
| **OEM Program Cancellation** | 3 | Major OEM cancels high-volume program that was expected to drive significant returns | Diversified OEM investments (spread across multiple customers) | Concentrated single-OEM investment (the "bait" card from Round 2) |
| **Supply Chain Disruption** | 3-4 | Major supplier failure disrupts production | Invested in dual-sourcing, supplier relationships | Single-source dependencies |
| **Key Customer Loss** | 3-4 | OEM in-sources a key component | Diversified customer base | Over-reliance on single customer |
| **Technology Shift** | 2-3 | EV transition accelerates faster than expected | Early investment in EV/next-gen portfolio | Underinvestment in technology transition |
| **Regulatory Change** | 3-4 | New environmental regulations announced | Proactive compliance investments | Deferred compliance spending |
| **Competitor Acquisition** | 4-5 | Competitor acquired, creating market opportunities | Have capacity and cash to capture share | Overleveraged or capacity-constrained |

### Round 2 "Bait" Decisions

Two key Grow decisions in Round 2 test diversification learning:

| Decision | Apparent Return | Actual Outcome | Learning |
|----------|-----------------|----------------|----------|
| **Diversified OEM Capacity Investment** | Lower projected return (+$80M/yr) | Stable, predictable return | Diversification provides insurance |
| **Concentrated OEM Capacity Investment** | Higher projected return (+$120M/yr) | **Returns to $0** when OEM cancels program in R3 | Concentration risk is real |

---

## Game Structure

### Overview
| Aspect | Detail |
|--------|--------|
| Teams | 10-20 teams (configurable), ~10 people each |
| Rounds | 5 rounds (representing FY2026-2030) |
| Time per round | ~10-15 minutes for decisions |
| Starting position | Magna 2025 EOY financials |
| Scoring | Total Shareholder Return (2026-2035) |
| Final simulation | Years 2031-2035 auto-simulated (no decisions) |

### Round-by-Round Design

| Round | Year | Scenario | Core Lesson |
|-------|------|----------|-------------|
| 1 | 2026 | Business as usual | Standard trade-offs, get comfortable |
| 2 | 2027 | Business as usual | Execution and incremental decisions |
| 3 | 2028 | Cost pressure emerges | Sometimes cash > investing |
| 4 | 2029 | Recession hits | Balance sheet strength enables opportunistic M&A |
| 5 | 2030 | Recovery begins | Rising tide — investments outperform |

### Decision System

**75+ unique decision cards** organized into 3 categories:

| Category | Total Cards | Per Round | Description | Examples |
|----------|-------------|-----------|-------------|----------|
| **Grow** | 25+ | 5+ | Large strategic commitments to expand capacity, enter new markets, or acquire | New geography expansion, OEM tooling commitments, bolt-on acquisitions, JV partnerships |
| **Optimize** | 25 | 5 | ROI-driven projects for efficiency and margin improvement | Factory automation, footprint consolidation, dual-sourcing, digital transformation |
| **Sustain** | 25 | 5 | Non-discretionary investments to maintain operations | Mandatory equipment, compliance, workforce retention, safety |

**Card Availability per Round:**
- **15 cards available each round** (5 Grow + 5 Optimize + 5 Sustain)
- Different cards appear in different rounds (based on "Introduced Year" attribute)

Each decision card has attributes:
- **Guiding Principle** (which strategic principle it relates to)
- **Decision Category** (Grow/Optimize/Sustain subcategory)
- **Decision Name** (short title)
- **Decision Narrative** (detailed description)
- **Decision Type** (Organic / Inorganic)
- **Introduced Year** (which round it becomes available: 1-5)
- **Impact Magnitude** (1-5 scale)
- **Category-specific metrics** — fixed inputs per card drive display and calculation; see [Decision Card Metrics (Fixed Inputs)](#decision-card-metrics-fixed-inputs)

### Decision Card Metrics (Fixed Inputs)

All metrics shown on decision cards are **fixed inputs** per card (sourced from Excel/CSV and applied via the decision pipeline). The tables below define the exact fields displayed and used for calculation by category. Values are to be supplied per decision (see pipeline and backend config).

**Grow cards** — fixed inputs per card:

| Metric | Field / source | Description |
|--------|----------------|-------------|
| Investments (total) | `growMetrics.investmentsTotal` or `cost` | Total investment in $M |
| Investment period | `growMetrics.investmentPeriod` or `durationYears` | Years over which investment is spent |
| In-year investment | `growMetrics.inYearInvestment` or total ÷ period | $M per year |
| Revenue 1 year | `growMetrics.revenue1Year` | Revenue impact in year 1 ($M) |
| 5-year growth | `growMetrics.fiveYearGrowth` | 5-year revenue growth rate (%) |
| EBIT margin | `growMetrics.ebitMargin` | Expected EBIT margin (%) |

**Optimize cards** — fixed inputs per card:

| Metric | Field / source | Description |
|--------|----------------|-------------|
| Investments (total) | `optimizeMetrics.investment` or `cost` | Total investment in $M |
| Investment period | `optimizeMetrics.investmentPeriod` or `durationYears` | Years |
| In-year investment | `optimizeMetrics.inYearInvestment` or total ÷ period | $M per year |
| Implementation cost | `optimizeMetrics.implementationCost` | One-time implementation cost ($M) |
| Annual cost savings | `optimizeMetrics.annualCostSavings` | Recurring savings ($M) |

**Sustain cards** — fixed inputs per card:

| Metric | Field / source | Description |
|--------|----------------|-------------|
| Investments (total) | `sustainMetrics.investment` or `cost` | Total investment in $M |
| Investment period | `sustainMetrics.investmentPeriod` or `durationYears` | Years |
| In-year investment | `sustainMetrics.inYearInvestment` or total ÷ period | $M per year |
| Implementation cost | `sustainMetrics.implementationCost` | One-time implementation cost ($M) |
| Annual cost | `sustainMetrics.annualCost` | Recurring cost/savings ($M) |
| Revenue protection | Narrative | Protects against losing business-as-usual revenue; no incremental cash flow when no category metrics |

*Product owner will provide the complete set of fixed input values per decision for card display and backend calculation.*

### Decision Card Design (UI)

**Card front (summary):**
- **Decision number** — e.g. "Decision #1" (top right)
- **Category badge** — Grow (emerald) / Optimize (blue) / Sustain (amber) with icon
- **Name** — decision title
- **Total investment** — $XM, with **Period** (N years) and **In-year investment** ($YM per year)
- **Business case** — brief (from Excel/`brief`) or first sentence of narrative
- **Impact badges** — short labels (e.g. "$400M/yr", "COGS -1%", "Protects revenue")
- **Footer** — investment period summary + "View business case" (opens expanded view)
- **Disabled state** — when unaffordable: muted styling and "Exceeds available funds — cannot select"

**Card back / expanded modal:**
- **Header** — category badge, Decision #, close button; name and total investment + period + in-year investment
- **Business case** — full narrative; note "Modeled assumptions; actual outcomes may differ."
- **Expected outcomes** — category-specific metrics from fixed inputs (Grow: Revenue 1 year, 5-year growth, EBIT margin, Investments total, Investment period; Optimize/Sustain: Annual cost/savings, Implementation cost, Investments, Investment period). Sustain cards without category metrics show "No incremental cash flow created" and "Revenue Protection" narrative.
- **Actions** — Close; Select Investment / Remove Selection (or "Cannot Afford" when disabled)

**Selection state:** Selected cards show checkmark, category-colored border and tint; select/deselect updates remaining cash.

### Constraints & Mechanics

- **Capital constraint:** Teams have limited free cash flow each round (after dividends and buybacks). Teams may select multiple decisions up to their available cash only; there is no per-round cap on the *number* of decisions.
- **Multi-year investments:** See Investment Duration Model below (investments can span 1, 2, 3 or more years as specified on each card).
- **Scenario-dependent returns:** Decision outcomes are multiplied by scenario modifiers (cost pressure, recession, recovery) so returns depend on market conditions and round.

### Investment Duration Model

Investments follow a **multi-year cost + recurring benefit** pattern. **Investment period is not limited to 2 years**; cards can specify 1, 2, 3 or more years of investment (cost spread over that period).

| Aspect | Detail |
|--------|--------|
| **Duration** | 1, 2, 3 or more years (specified on each card via investment period / duration) |
| **Cost timing** | Cost is spread over the investment period (e.g. $400M/yr for 2 years; $333M/yr for 3 years) |
| **Benefit timing** | Recurring; may take 1-3 years to fully ramp up after investment |
| **Exception** | Divestitures provide one-time benefit (sale proceeds); some cards have 0 investment period |

**Example patterns:**
- **1-year investment:** Pay $200M in Year 1 → +$50M/year recurring benefit starting Year 2
- **2-year investment:** Pay $300M in Year 1, $200M in Year 2 → +$100M/year recurring benefit starting Year 3
- **3-year investment:** Pay $267M in Year 1, $267M in Year 2, $266M in Year 3 → +$80M/year recurring benefit ramping in Years 2–4
- **Divestiture:** Receive $500M one-time in Year 1, lose $30M/year recurring revenue

**Ramp-up:** Impact ramps by **ramp-up length** (1, 2, or 3 years) per card (`rampUpYears`):
- **1-year ramp:** 100% of full impact in year 1.
- **2-year ramp:** 50% in year 1, 100% in year 2.
- **3-year ramp:** Year 1: 30%, Year 2: 70%, Year 3+: 100%.

Backend uses these schedules in `backend/calculation-engine.ts` (`RAMP_UP_SCHEDULE` and `calculateRampUpFactor`).

### Scenario Modifiers

Scenarios apply **category-specific multipliers** to decision outcomes:

| Scenario | Grow Decisions | Optimize Decisions | Sustain Decisions |
|----------|---------------|-------------------|-------------------|
| **Business as usual** (R1-2) | 1.0x | 1.0x | 1.0x |
| **Cost pressure** (R3) | 0.7x | 1.2x | 1.0x |
| **Recession** (R4) | 0.5x | 1.0x | 1.5x |
| **Recovery** (R5) | 1.3x | 1.0x | 0.8x |

*Note: Exact multipliers are illustrative and will be tuned during implementation.*

**Rationale:**
- Recession hits **Grow** hardest (expansion during downturn underperforms)
- Cost pressure rewards **Optimize** (margin focus pays off when costs rise)
- **Sustain** investments prove valuable in recession (avoiding catastrophic failures)
- Recovery rewards **Grow** (positioned for upturn)

---

## User Stories

### US-001: Team Decision Interface
**Description:** As a team, I want to view available investment options and submit our decisions so that we can participate in each round.

**Acceptance Criteria:**
- [ ] Team sees their current cash balance prominently displayed
- [ ] Team sees remaining time in the round (countdown timer)
- [ ] Team can browse decisions by category (Grow / Optimize / Sustain)
- [ ] Each decision card shows: name, total investment, period, in-year investment, business case brief, impact badges
- [ ] Team can expand card to see full narrative and category-specific expected outcomes (Grow/Optimize/Sustain metrics)
- [ ] Team can select/deselect decisions (selections update remaining cash)
- [ ] Team cannot exceed available cash (visual warning if attempted)
- [ ] Team can submit final decisions before timer expires
- [ ] Decisions auto-submit when timer reaches zero
- [ ] Typecheck passes

### US-002: Round Results Display
**Description:** As a team, I want to see the results of my decisions after each round so that I understand how my choices impacted performance.

**Acceptance Criteria:**
- [ ] After round ends, team sees updated financial metrics (revenue, EBIT, ROIC, stock price)
- [ ] Team sees their TSR for the round and cumulative TSR
- [ ] Team sees their rank among all 15 teams
- [ ] Team sees brief narrative explaining market conditions that round
- [ ] Results display for ~60-90 seconds before next round begins
- [ ] Typecheck passes

### US-003: Team Identification
**Description:** As a team, I want to identify ourselves at the start so that our decisions are tracked correctly.

**Acceptance Criteria:**
- [ ] On app load, team selects their team number from available list (based on configured team count)
- [ ] Only unclaimed team numbers are selectable
- [ ] Team name displays in header throughout the game
- [ ] Team cannot change team selection after game starts
- [ ] Typecheck passes

### US-004: Facilitator Access & Game Setup
**Description:** As a facilitator, I want to securely access admin controls and configure the game before starting.

**Acceptance Criteria:**
- [ ] Facilitator navigates to `/admin` route
- [ ] PIN entry required before accessing controls (e.g., 4-6 digit PIN)
- [ ] Incorrect PIN shows error, does not grant access
- [ ] After PIN entry, facilitator can configure number of teams (10-20)
- [ ] Facilitator can see which team numbers have been claimed
- [ ] Configuration locked once game starts
- [ ] Typecheck passes

### US-005: Facilitator Round Control
**Description:** As a facilitator, I want to control game flow so that I can pace the session appropriately.

**Acceptance Criteria:**
- [ ] Facilitator can start Round 1 (all teams see decision interface)
- [ ] Facilitator can pause the current round (timers freeze)
- [ ] Facilitator can resume a paused round
- [ ] Facilitator can end round early (force-submit all pending decisions)
- [ ] Facilitator can advance to next round
- [ ] Facilitator can trigger scenario events (e.g., recession announcement)
- [ ] Typecheck passes

### US-006: Final Results & Winner
**Description:** As a team, I want to see final standings after Round 5 so that we know who won.

**Acceptance Criteria:**
- [ ] After Round 5 decisions, system simulates years 2031-2035 automatically
- [ ] Final leaderboard shows all teams ranked by total TSR (2026-2035)
- [ ] Winner is highlighted/celebrated in UI
- [ ] Teams see their final stock price and cumulative return
- [ ] Typecheck passes

### US-007: Game State Synchronization
**Description:** As a system, I need to keep all team clients and facilitator in sync so that the game runs smoothly.

**Acceptance Criteria:**
- [ ] All teams see the same round state (waiting / active / results)
- [ ] Timer is synchronized across all clients (within 1 second)
- [ ] When facilitator advances round, all teams transition together
- [ ] If a team's connection drops and reconnects, they rejoin current state
- [ ] Typecheck passes

---

## Functional Requirements

### Game Flow
- **FR-1:** System shall support configurable number of teams (10-20), identified by team number
- **FR-2:** System shall run 5 sequential rounds, each with a configurable time limit (default: 10 minutes)
- **FR-3:** System shall prevent teams from submitting decisions after round timer expires
- **FR-4:** System shall auto-submit any selected (but not submitted) decisions when timer expires

### Decision Management
- **FR-5:** System shall load 75 decision cards from configuration (25 per category)
- **FR-6:** System shall display exactly 15 decisions per round (5 Grow + 5 Optimize + 5 Sustain) based on "Introduced Year" attribute
- **FR-7:** System shall track each team's available cash (FCF) and prevent overspending
- **FR-8:** System shall allow teams to select multiple decisions up to their cash limit
- **FR-9:** System shall record all team decisions with timestamps

### Scoring & Results
- **FR-10:** System shall calculate team financial metrics after each round based on decisions made and scenario conditions
- **FR-11:** System shall calculate stock price / TSR based on financial metrics
- **FR-12:** System shall rank teams by stock price (highest share price = rank 1) after each round and for final results
- **FR-13:** System shall simulate years 2031-2035 after Round 5 using team's ending position and auto-pilot logic
- **FR-14:** System shall apply scenario modifiers (cost pressure, recession, recovery) to decision outcomes based on current round

### Facilitator Controls
- **FR-15:** Facilitator shall access admin mode via password/PIN (e.g., `/admin` route with PIN entry)
- **FR-16:** Facilitator shall be able to: start game, start round, pause round, resume round, end round, trigger events
- **FR-17:** Facilitator actions shall propagate to all team clients in real-time
- **FR-22:** Facilitator shall be able to configure number of teams (10-20) before game starts

---

## Non-Goals (Out of Scope for MVP)

- **No shared/projected leaderboard display** — Teams see only their own screen (will add later)
- **No persistence or replay** — Game state not saved after session ends
- **No authentication** — Teams self-identify by number; no login required
- **No detailed analytics export** — No post-game data export
- **No scenario editor** — Scenarios are hardcoded for this event
- **No mobile optimization** — Designed for laptop screens only
- **No sound effects or advanced animations** — Focus on functional UI
- **No AI opponents** — All 15 teams are human-controlled
- **No multiple simultaneous games** — Single game instance at a time

---

## Design Considerations

### UI/UX Direction
- **Aesthetic:** Clean, professional, financial/corporate feel (not gamified/cartoonish)
- **Inspiration:** Bloomberg terminal meets modern fintech dashboard
- **Color palette:** Use Magna brand colors as accents; neutral base
- **Typography:** Clear, readable; financial data should feel authoritative

### Key Screens

1. **Team Selection Screen**
   - Simple team number selector (1-15)
   - "Join Game" button

2. **Waiting/Lobby Screen**
   - "Waiting for game to start..."
   - Team name displayed

3. **Decision Screen** (main game interface)
   - Header: Team name, current cash, remaining cash, timer
   - Three collapsible sections: Grow / Optimize / Sustain
   - Card grid within each section
   - Selected cards highlighted with running total
   - "Submit Decisions" button

4. **Card Detail View (Expanded Modal)**
   - Modal with category-colored header
   - Full narrative (business case), note that outcomes are modeled
   - Category-specific expected outcomes from fixed inputs (Grow: revenue 1yr, 5yr growth, EBIT margin, investments total/period; Optimize/Sustain: annual cost/savings, implementation cost, investments, period)
   - Total investment, period, in-year investment
   - Close; Select Investment / Remove Selection (or Cannot Afford when unaffordable)

5. **Round Results Screen**
   - Key metrics with delta indicators (↑↓)
   - Mini leaderboard (team's rank + nearby teams)
   - Scenario narrative text
   - "Waiting for next round..." indicator

6. **Final Results Screen**
   - Full leaderboard (all 15 teams)
   - Winner celebration state
   - Team's journey summary (optional)

7. **Facilitator Control Panel** (PIN-protected)
   - PIN entry screen before accessing controls
   - Game configuration (number of teams: 10-20)
   - Game state indicator
   - Round controls (start/pause/resume/end)
   - Event trigger buttons
   - Overview of how many teams have submitted

---

## Technical Considerations

### Architecture
- **Frontend:** React + TypeScript (per project tech stack)
- **State Management:** Zustand for local state; consider real-time sync solution
- **Real-time:** WebSocket or Server-Sent Events for facilitator → team communication
- **Backend:** Node.js + Express for game state management and calculations
- **Data:** Decision cards loaded from JSON configuration file

### Key Technical Decisions

1. **Game state management:** Central server holds authoritative game state; clients subscribe to updates
2. **Timer synchronization:** Server broadcasts remaining time; clients display but don't control
3. **Calculation engine:** Backend calculates all financial outcomes (not in client). The authoritative implementation is in [Value Creation Simulation](https://github.com/larissajeanphillips/Value-Creation-Simulation); do not use financial logic from any other repository
4. **Decision card data:** 75 cards defined in JSON/TypeScript config based on Excel data

### Decision data import and validation

Decision inputs are validated by row count when updating from the source (Excel or feed). The pipeline expects approximately **1,199 rows** from the source; update this when the source structure changes.

- **Run:** `npm run update-decisions` (or run `scripts/read-decisions-excel.mjs`, then `scripts/apply-decisions-from-excel.mjs`, then `scripts/verify-decisions.mjs`).
- **Check:** The scripts report rows pulled from source (expected ~1,199), records in export JSON, updates applied to backend, and backend ALL_DECISIONS count (expected ≥ 75). Validation fails (non-zero exit) if large chunks are missing.
- **Where to update expected count:** In `scripts/read-decisions-excel.mjs`, set `EXPECTED_SOURCE_ROWS` (default 1199) and `EXPECTED_SOURCE_ROWS_TOLERANCE_PCT` (default 10). In `scripts/apply-decisions-from-excel.mjs`, `EXPECTED_MIN_RECORDS` is 75.

### Data Model (Conceptual)

```typescript
interface GameState {
  status: 'lobby' | 'active' | 'paused' | 'results' | 'finished';
  currentRound: number; // 1-5
  roundTimeRemaining: number; // seconds
  teams: TeamState[];
  scenario: ScenarioState;
}

interface TeamState {
  teamId: number; // 1-15
  cashBalance: number;
  decisions: Decision[]; // decisions made this round
  allDecisions: Decision[]; // all decisions across rounds
  metrics: FinancialMetrics;
  stockPrice: number;
  cumulativeTSR: number;
}

interface Decision {
  id: string;
  category: 'grow' | 'optimize' | 'sustain';
  name: string;
  narrative: string;
  cost: number;                    // one-time cost in $M
  impactMagnitude: number;         // 1-5 scale
  introducedYear: number;          // 1-5, which round this card appears
  type: 'organic' | 'inorganic';
  guidingPrinciple: string;
  
  // Duration & Timing
  durationYears: number;           // how many years of cost commitment (1, 2, 3 or more)
  rampUpYears: 1 | 2 | 3;          // years until full impact realized
  isOneTimeBenefit: boolean;       // true for divestitures
  
  // Impact specifics (for calculation engine)
  revenueImpact?: number;          // % change to revenue (Grow decisions)
  cogsImpact?: number;             // % change to COGS (Optimize decisions)
  sgaImpact?: number;              // % change to SG&A (Optimize decisions)
  recurringBenefit?: number;       // annual $M benefit after ramp-up
  riskPrevention?: string;         // which risk event this prevents (Sustain)
}

interface FinancialMetrics {
  // Income Statement
  revenue: number;
  cogs: number;
  sga: number;
  ebitda: number;
  depreciation: number;
  amortization: number;
  ebit: number;
  // Cash Flow
  cashTaxes: number;
  capex: number;
  operatingFCF: number;
  beginningCash: number;
  endingCash: number;
  // Valuation
  npv: number;           // Enterprise Value
  equityValue: number;
  sharesOutstanding: number;
  sharePrice: number;
  // Derived
  ebitMargin: number;    // EBIT / Revenue
  roic: number;          // calculated
}
```

### Performance Requirements
- Timer updates: At least 1 update/second visible to users
- Decision submission: < 500ms response time
- Round transition: < 2 seconds for all clients to sync

---

## Financial Model

**Source of truth for implementation:** All fixed inputs and calculation formulas are defined in the [Value Creation Simulation](https://github.com/larissajeanphillips/Value-Creation-Simulation) backend. Use only that repository for financial constants, baseline data, and formulas. Do not use values or formulas from any other repository or document.

### Starting Position (2025 EOY Baseline)

All teams start with Magna's simplified 2025 financials (USD Millions), as defined in `backend/config/baseline-financials.ts` in Value Creation Simulation:

**Simplified Income Statement:**
| Metric | 2025 Baseline |
|--------|---------------|
| Revenue | $42,836 |
| COGS | ($37,037) |
| SG&A | ($2,061) |
| **EBITDA** | **$3,738** |
| Depreciation | ($1,510) |
| Amortization | ($112) |
| **EBIT** | **$2,116** |

**Simplified Cash Flow Statement:**
| Metric | 2025 Baseline |
|--------|---------------|
| Cash Taxes | ($466) |
| CapEx | ($1,713) |
| **Operating FCF** | **$1,559** |
| Beginning Cash | $1,247 |

**Valuation:**
| Metric | 2025 Baseline |
|--------|---------------|
| NPV / Enterprise Value | $22,738 |
| Equity Value | $14,555 |
| Shares Outstanding | 287.34M |
| **Share Price** | **$50.67** |

### Scoring Logic

**Primary metric:** Increase in NPV (Enterprise Value) over the game period

**Secondary factor:** Investor expectations management — teams communicate expectations to "investors" which creates slight noise around outcomes. Managing expectations well (under-promise, over-deliver) improves TSR slightly; over-promising and under-delivering penalizes.

**TSR Calculation:** 
```
TSR = (Ending Share Price - Starting Share Price + Dividends) / Starting Share Price
```

Share price derived from: `Equity Value / Shares Outstanding`

### Fixed Inputs and Constants

All financial calculation inputs are **fixed in the backend** and must not be overridden by clients or game configuration. Changes require backend code or config changes in [Value Creation Simulation](https://github.com/larissajeanphillips/Value-Creation-Simulation). Values below are the canonical inputs; WACC 8% and net debt $7,765M are set in `backend/config/baseline-financials.ts`, `backend/calculation-engine.ts`, `backend/consolidation-engine.ts`, and `backend/bau-engine.ts` (pull latest from that repo for current values).

| Input | Value | Location (Value Creation Simulation repo) |
|-------|--------|--------------------------------------------|
| Tax rate | 22% | `TAX_RATE` in `backend/config/baseline-financials.ts`; same in `consolidation-engine.ts`, `bau-engine.ts` |
| WACC | 8% | `WACC` in `backend/config/baseline-financials.ts`; same in `backend/consolidation-engine.ts`, `backend/bau-engine.ts` |
| Terminal growth rate | 2% | `TERMINAL_GROWTH_RATE` in `backend/config/baseline-financials.ts` |
| Dividend payout ratio | 25% of FCF | `DIVIDEND_PAYOUT_RATIO` in `backend/calculation-engine.ts` |
| Net debt | $7,765M | `NET_DEBT` in `backend/calculation-engine.ts`; `BASELINE_FINANCIALS.netDebt` and `backend/consolidation-engine.ts`, `backend/bau-engine.ts` |
| Minority interest | $418M | `backend/consolidation-engine.ts` (subtracted from equity value); `backend/bau-engine.ts` |
| Capex maintenance (depreciation) | 4% of revenue | `CAPEX_REVENUE_RATIO` / `DEPRECIATION_RATE` in `backend/bau-engine.ts`, `backend/consolidation-engine.ts`; baseline capex comment in `baseline-financials.ts` |
| Cost of equity (baseline) | 9% | `costOfEquity` in `BASELINE_FINANCIALS` in `backend/config/baseline-financials.ts` |
| Cost of equity (forward price) | 9.3% | `COST_OF_EQUITY` in `backend/consolidation-engine.ts` (used only for Forward Price: share_price × (1 + COST_OF_EQUITY)) |
| Invested capital (ROIC) | 40% of revenue | Hardcoded in `calculateROIC()` in `backend/calculation-engine.ts` |
| DCF projection years | 10 | `DCF_PROJECTION_YEARS` in `backend/calculation-engine.ts` |
| Ramp-up schedule | 1-yr: 100% in yr1; 2-yr: 50% then 100%; 3-yr: 30% / 70% / 100% | `RAMP_UP_SCHEDULE` and `calculateRampUpFactor` in `backend/calculation-engine.ts` |
| Investor expectations noise | ±5% on NPV | `INVESTOR_NOISE_FACTOR` in `backend/calculation-engine.ts` |
| Stock price bounds | 0.5× to 2× starting price | `MIN_STOCK_PRICE_MULTIPLIER`, `MAX_STOCK_PRICE_MULTIPLIER` in `backend/calculation-engine.ts` |
| Starting investment cash (round 1) | $1,200M | `STARTING_INVESTMENT_CASH` in `backend/config/baseline-financials.ts`; used for round 1; thereafter FCF varies by outcomes |

Baseline financials (revenue, COGS, SG&A, depreciation, amortization, capex, shares outstanding, etc.) are fixed in `BASELINE_FINANCIALS` in `backend/config/baseline-financials.ts`.

### Decision Impact Model

| Category | Primary Impact | Secondary Effects |
|----------|---------------|-------------------|
| **Grow** | ↑ Revenue | May increase CapEx, may dilute ROIC short-term |
| **Optimize** | ↓ Costs (COGS or SG&A) | Improves margins, may require upfront investment |
| **Sustain** | Prevents value destruction | No upside, but avoids downside risk events |

**FCF Dynamics:**
- FCF is NOT fixed per round — it varies based on:
  - Previous round's business outcomes
  - Investment decisions made (CapEx commitments)
  - Scenario conditions (recession reduces cash generation)
- Teams must manage cash carefully; overspending in early rounds may leave them vulnerable

### Backend Calculation Formulas (Authoritative)

The following formulas are implemented in [Value Creation Simulation](https://github.com/larissajeanphillips/Value-Creation-Simulation) in `backend/calculation-engine.ts` (Rounds 2–5) and `backend/consolidation-engine.ts` (Round 1). Use these as the single source of truth; do not derive formulas from any other repository or document.

**Income statement and cash flow (per round/year):**
- **EBITDA** = Revenue + COGS + SG&A (COGS and SG&A are negative).
- **Depreciation / Amortization** = Baseline D&A × |capex / baseline capex| (proportional to capex).
- **EBIT** = EBITDA + Depreciation + Amortization (D&A negative).
- **Taxable income** = max(0, EBIT).
- **Cash taxes** = −Taxable income × Tax rate (tax rate fixed at 22% in backend).
- **Operating FCF** = EBITDA + Cash taxes + Capex + One-time benefits (e.g. divestitures).
- **Ending cash** = Beginning cash + Operating FCF.

**Valuation (calculation-engine):**
- **NPV (enterprise value):** Sum over t = 1..10 of FCF_t / (1 + WACC)^t, where FCF_t = FCF_{t−1} × (1 + terminal growth). Plus terminal value: TV = FCF_10 × (1 + g) / (WACC − g), discounted by (1 + WACC)^10. (WACC 8%, g 2%.)
- **Adjusted NPV** = NPV × (1 + investor noise), where investor noise is ±5%.
- **Equity value** = Adjusted NPV − Net debt (net debt $7,765M).
- **Share price** = Equity value / Shares outstanding, then clamped to [0.5 × starting price, 2 × starting price].

**ROIC:**
- **NOPAT** = EBIT × (1 − Tax rate).
- **Invested capital** = Revenue × 40% (fixed assumption in backend).
- **ROIC** = NOPAT / Invested capital.

**TSR:**
- **TSR** = (Ending share price − Starting share price + Dividends per share) / Starting share price.
- **Round dividends** = max(0, Operating FCF × 25%); dividends per share = total dividends / shares outstanding.
- **Cumulative TSR** uses the same TSR formula with cumulative dividends per share from game start.

**Decision impacts (per decision, then summed):**
- **Revenue change** = Base revenue × decision revenueImpact × scenario category multiplier × ramp-up factor.
- **COGS change** = Base COGS × decision cogsImpact × category multiplier × ramp-up factor.
- **SG&A change** = Base SG&A × decision sgaImpact × category multiplier × ramp-up factor.
- **Capex change** = Decision cost / duration years (only in years where cost is still paid).
- **One-time benefit** = From decision (e.g. divestiture) × category multiplier, only in year 1 when applicable.
- **Ramp-up:** By `rampUpYears` (1, 2, or 3): 1-year → 100% in year 1; 2-year → 50% then 100%; 3-year → 30% / 70% / 100%. Investment period (duration) can be 1, 2, 3 or more years; cost is spread over that period.

**Ranking:** Teams are ranked by **stock price** (highest share price = rank 1). Round and final results use this.

**Final simulation (2031–2035):** FCF grows at terminal growth rate (2%); dividends at 25% of FCF; share price grows with FCF and small random factor; same stock price bounds; final TSR = (final price − starting price + total dividends) / starting price.

*WACC 8% and net debt $7,765M are used consistently in baseline-financials, calculation-engine, consolidation-engine, and bau-engine.*

---

## Success Metrics

| Metric | Target |
|--------|--------|
| All 15 teams can submit decisions | 100% of rounds |
| Round transitions complete without errors | 100% |
| Teams understand how to use interface | < 2 min onboarding |
| Session completes within 120 minutes | Yes |
| Debrief reveals meaningful decision variance | Teams make different choices |

---

## Open Questions

All key questions have been answered. See relevant sections throughout the PRD.

### Resolved Questions Log
1. ✅ **Starting financials** — See Financial Model section
2. ✅ **Cash per round** — FCF varies based on investments and business outcomes
3. ✅ **Scoring formula** — Based on NPV increase, with noise from investor expectations
4. ✅ **Decision impacts** — Grow→Revenue, Optimize→Costs, Sustain→Risk prevention
5. ✅ **Scenario modifiers** — Category-specific (Grow hit harder in recession than Optimize)
6. ✅ **Card availability** — 15 cards per round (5 Grow / 5 Optimize / 5 Sustain)
7. ✅ **Multi-year decisions** — Investment period can be 1, 2, 3 or more years (specified per card); costs spread over period; ramp-up by rampUpYears (1/2/3) with fixed schedules.
8. ✅ **Facilitator access** — Password/PIN protected admin mode
9. ✅ **Team count** — Configurable 10-20 teams
10. ✅ **Ranking** — By stock price (highest = rank 1)

---

## Appendix: Decision Card Categories (from Excel)

### Grow (25 decisions)
Subcategories include:
- Scale R&D for Next-Gen Portfolio
- Acquire a Business
- JV / Strategic Partnership
- Enter New Geography / Market
- Expand Manufacturing Footprint
- Launch a New Business
- Platform-Level Technology Bets

### Optimize (25 decisions)
Subcategories include:
- SG&A Optimization
- Organizational Restructure
- Enterprise Digital Transformation
- Factory of the Future
- Select Group Transformation
- Divest Group
- Global Supply Chain Redesign

### Sustain (25 decisions)
Subcategories include:
- Risk & Compliance Upgrade
- Talent & Leadership Upskilling
- Capital allocation strategy (maintenance)
- Portfolio management (maintenance)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-16 | AI + Adam | Initial PRD draft |
| 0.2 | 2026-01-17 | AI + Adam | Added learning framework: guiding principles, KPI scorecard, scenario dynamics, special events |
| 0.3 | 2026-02-05 | — | Financial model aligned to [Value Creation Simulation](https://github.com/larissajeanphillips/Value-Creation-Simulation) only: added source-of-truth note, fixed inputs table, backend calculation formulas (tax, ROIC, NPV, FCF, TSR, decision impacts). Baseline valuation and operating FCF updated to match repo. No references to any other repository for financial implementation. |
| 0.4 | 2026-02-05 | — | Fixed inputs corrected: WACC 8% (was 7.5%), net debt $7,765M (was $8,574M). Values pulled from where WACC is set to 8% in code: baseline-financials.ts, consolidation-engine.ts, bau-engine.ts. Backend in this repo updated so calculation-engine and baseline-financials use 8% and $7,765M consistently. |
| 0.5 | 2026-02-05 | — | Added capex maintenance 4% of revenue and cost of equity (9% baseline, 9.3% for forward price) to Fixed Inputs table. |
| 0.6 | 2026-02-06 | — | Added Production URLs (Vercel) section: base https://value-creation-simulation.vercel.app with live admin, live player, live display, and demo links as single source of truth. |
| 0.7 | 2026-02-06 | — | Decision card logic: added Decision Card Metrics (by category) and Decision Card Design (UI) sections; Grow/Optimize/Sustain metrics (investments total, period, in-year, category-specific). Multi-year investments: investment period can be 1, 2, 3 or more years (no longer limited to 2); updated Investment Duration Model, Data Model, user stories, and Resolved Questions Log. |
| 0.8 | 2026-02-06 | — | Removed risk/risky flag entirely from PRD and decision logic. Consolidated decision logic: ranking by stock price (FR-12); ramp-up by rampUpYears (1/2/3) with all three schedules documented; decision limits = cash only; starting cash $1,200M clarified as round 1 only (FCF varies thereafter). Added Decision Card Metrics (Fixed Inputs) section with placeholder for product-owner-supplied values per card. Removed Risky Decision Outcomes, Risk/Chance Mechanic, FR-18/19/20/21, isRisky from Data Model, risky from backend formulas and Resolved Questions. |