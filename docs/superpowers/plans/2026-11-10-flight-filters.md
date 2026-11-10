# Flight Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an adaptive filters and sorting panel that works with local flight data.

**Architecture:** Keep filtering and sorting in a pure function. Store draft and applied filter state in `FlightSelectionPage`, render controls through a focused `FlightFiltersPanel`, and pass filtered data into the existing `FlightList`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library

**Spec:** User-provided Trello card screenshots from 2026-11-10.

## Global Constraints

- Use only local mock flights; backend integration is out of scope.
- Preserve selected values when the panel closes.
- Support desktop, tablet, and mobile layouts.
- Do not commit changes; stop after verification and report all modified files.

## Review Focus

- Inclusive price boundaries must keep flights priced exactly at the minimum or maximum.
- Multiple airlines use OR logic, while different filter groups use AND logic.
- Reset restores all flights and default sorting.
- Applying filters with no matches shows an explicit empty state.
- Sorting must not mutate the shared mock array.

---

### Task 1: Filtering and sorting logic

**Files:**

- Create: `src/pages/flight-selection/flightFilters.ts`
- Test: `src/pages/flight-selection/flightFilters.test.ts`

**Interfaces:**

- Consumes: `Flight[]` from `types.ts`.
- Produces: `FlightFilters`, `DEFAULT_FLIGHT_FILTERS`, `filterAndSortFlights()`.

- [ ] Write failing tests for price, stops, baggage, airlines, sorting, reset defaults, and input immutability.
- [ ] Run the focused test and confirm expected failures.
- [ ] Implement the minimum pure filtering and sorting logic.
- [ ] Run the focused test and confirm it passes.

### Task 2: Adaptive filter panel

**Files:**

- Create: `src/pages/flight-selection/FlightFiltersPanel.tsx`
- Test: `src/pages/flight-selection/FlightFiltersPanel.test.tsx`

**Interfaces:**

- Consumes: draft `FlightFilters`, airline options, and callbacks.
- Produces: accessible controls for filters, sorting, apply, reset, and close.

- [ ] Write failing interaction tests for all controls and panel actions.
- [ ] Run the focused test and confirm expected failures.
- [ ] Implement the accessible panel with responsive Tailwind styles.
- [ ] Run the focused test and confirm it passes.

### Task 3: Page integration

**Files:**

- Modify: `src/pages/flight-selection/FlightSelectionPage.tsx`
- Modify: `src/pages/flight-selection/FlightSelectionPage.test.tsx`

**Interfaces:**

- Consumes: `FlightFiltersPanel` and `filterAndSortFlights()`.
- Produces: working panel state, applied filtering, result count, dynamic tags, and empty state.

- [ ] Write failing page tests for open/close persistence, apply, reset, count, sorting, and empty state.
- [ ] Run the focused test and confirm expected failures.
- [ ] Integrate draft and applied filter state into the page.
- [ ] Run the focused test and confirm it passes.

### Task 4: Verification

**Files:**

- Modify only files required by failures found during verification.

- [ ] Run `pnpm test:run`.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm format` and `pnpm format:check`.
- [ ] Run `pnpm build`.
- [ ] Review `git diff` and stop before commit.
