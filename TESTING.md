# Event Studio: Automated Verification & Acceptance Test Suite

This document records the unit test coverage, invariant tests, and user acceptance test verification for Event Studio.

---

## 1. Automated Pure Unit Tests (`src/utils/calculations.ts`)

These tests execute automatically inside the application via the **"Run Unit Self-Checks"** modal (available on Screen 6 and top navigation toolbar) and run against pure mathematical functions without mock dependencies.

| Test ID | Test Name | Formula / Invariant | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **CHK-1** | Budget Total Spent & Reserve Derivation | `TotalSpent = sum(Paid + Pending)`<br>`Reserve = TotalBudget − TotalSpent` | Total Spent: $60,650<br>Reserve: $4,350 | Total Spent: $60,650<br>Reserve: $4,350 | **PASS** |
| **CHK-2** | Zero Negative Expense Invariant | `amount = Math.max(0, input)`<br>Negative amounts prohibited | Clamped to $0; Total: $5,000 | Clamped to $0; Total: $5,000 | **PASS** |
| **CHK-3** | Category Allocation 100% Invariant | `sum(Category Pct) == 100.0%`<br>(Venue 30% + Catering 35% + AV 15% + Decor 10% + Band 5% + Contingency 5%) | Exactly 100.0% | Exactly 100.0% | **PASS** |
| **CHK-4** | Venue Capacity & Budget Fit Ratio | `isUnderCapacity = (capacity < guests)`<br>`BudgetFit = (rent ÷ totalBudget) * 100` | 300 < 450 flagged `true`<br>Rent $18.5k ÷ $65k = 28.5% | Flagged `true`<br>Budget Fit = 28.5% | **PASS** |
| **CHK-5** | Door Turnstile Ingress Queue Math | `WaitTime = (guests × 8s) ÷ (gates × 60s)` | 2 Gates: 30 mins<br>4 Gates: 15 mins | 2 Gates: 30 mins<br>4 Gates: 15 mins | **PASS** |
| **CHK-6** | Shift Health & Fatigue Derivation | `isFatigued = (hours >= 12 && !handover)`<br>Score must never be 100% during active fatigue | 1 fatigued staff<br>Score: 71% (< 100%) | 1 fatigued staff<br>Score: 71% | **PASS** |

---

## 2. User Acceptance Test (UAT) Verification

### Acceptance Test 1: The app opens on Screen 1 every time
- **Observation**: Setup completion navigates directly to `activeScreenIndex = 0` (Screen 1: Dashboard).
- **Fix Verification**: Removed the legacy `messagesEndRef.current?.scrollIntoView()` and autofocus from the chatbot screen that previously forced the browser viewport to Screen 7. Screen 7 chat now uses strictly internal container scrolling (`container.scrollTop = container.scrollHeight`).
- **Result**: Verified. The app opens on Screen 1 every time.

### Acceptance Test 2: Changing the city shows 8 or more different venues
- **Observation**: Calling `/api/venues?city=Chicago&guests=450&budget=65000` returns 10 city-specific venues (e.g. *The Grand Royal Palace & Atrium of Chicago*, *The Chicago Glass Conservatory*, *The Heritage Pavilion of Chicago*).
- **Pagination**: Screen 2 displays 4 venues initially with an explicit "Load More Venues" button revealing the remaining venues up to 10-12.
- **Result**: Verified. 10 unique venues returned per city query.

### Acceptance Test 3: Changing guests from 450 to 120 and budget from $65k to $20k
- **Venue Fit**: Venues with capacity between 120 and 449 that were previously flagged as "Under capacity" now dynamically become eligible. Budget Fit percentages dynamically recalculate: `(rent ÷ $20,000) * 100`.
- **Budget Numbers**: Total authorized budget updates to $20,000; cost per guest updates to `Math.round(20000 / 120) = $167/guest`.
- **Chatbot Context**: On every chat message, `/api/chat` receives the live updated guest count (120) and budget ($20,000), quoting the exact new numbers in its answers.
- **Result**: Verified. All derived calculations and AI context reflect live parameters.

### Acceptance Test 4: No negative expenses, and totals match on every screen
- **Budget Ledger**: Adding a negative expense triggers input validation rejection and clamps value via `Math.max(0, amount)`.
- **Single Source of Truth**: Total Budget ($65,000), Committed Spent ($60,650), and Contingency Reserve ($4,350) match across Screen 1 Dashboard summary, Screen 4 Smart Budget tiles, Screen 4 AI Conflict card, Screen 6 Event Hub wrap-up, and Screen 7 AI Concierge responses.
- **Result**: Verified. Zero discrepancy across screens.

---

## 3. Screen Order & Architecture Traceability

| Screen Index | Screen Name | Layout Standard | Primary Capabilities |
|---|---|---|---|
| **Screen 1** | Dashboard | Sticky Header + Telemetry Row + AI Card 1 + Main Content | Readiness index, event highlights, countdown, master preparation checklist |
| **Screen 2** | Venue Search | Sticky Header + Telemetry Row + AI Card 2 + Main Content | Search-grounded venues, under-capacity disabling, budget fit, 4-per-view pagination |
| **Screen 3** | Guest Manager | Sticky Header + Telemetry Row + AI Card 3 + Main Content | Real guest list stats, sample cohort clarification, explicit turnstile queue box |
| **Screen 4** | Smart Budget | Sticky Header + Telemetry Row + AI Card 4 + Main Content | 100% category allocation, central reserve ledger, strictly positive expenses |
| **Screen 5** | Staff Ops | Sticky Header + Telemetry Row + AI Card 5 + Main Content | Derived shift health, fatigue warnings, radio channel matrix, deputy handover |
| **Screen 6** | Event Hub | Sticky Header + Telemetry Row + AI Card 6 + Main Content | Debrief generator, share portal & PIN, legal T&C, reset demo, self-checks launch |
| **Screen 7** | AI Concierge | Sticky Header + Telemetry Row + AI Card 7 + Main Content | Live state grounded reasoning, Day -1 to Day 3 matrix, container-only scroll |
