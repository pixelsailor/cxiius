# Acceptance Criteria — resume-skills-chart-type-picker

## Functional

- [ ] AC-01: `ResumeSkillsChartOptionsPopover` exposes a third header trigger button (beside "Tech stacks" and "Skills by domain") that sets `selectedPane` to the chart-type pane on `pointerenter`, using the same hover-open pattern as existing triggers.
- [ ] AC-02: Chart-type pane renders a `fieldset` with a visually hidden `legend`, a radio group of exactly four options — **Bar**, **Polar**, **Radar**, **Scatter** — with `bar` selected by default when no persisted value exists.
- [ ] AC-03: Chart-type options layout uses a responsive CSS grid reaching **four columns** at the largest breakpoint (one column per type), with narrower breakpoints stepping down (mirror tech-stacks progressive columns, extended for four items).
- [ ] AC-04: Selecting a chart type updates the chart rendered in `ResumeSkillsChart` on the resume page without a full page reload.
- [ ] AC-05: Changing skill inclusion (domains/stacks) still repaints the active chart type using the same `chartSkillsFromSelection` row set.
- [ ] AC-06: Default chart type is **bar**; persisted invalid or missing storage values fall back to `bar`.
- [ ] AC-07: Chart type preference persists to `localStorage` (same browser guard as inclusion) and rehydrates on popover mount before chart paints (gated by hydration flag, same pattern as `inclusionHydrated`).

## Architectural

- [ ] AC-08: `ResumeSkillsChartType` union (`'bar' | 'polar' | 'radar' | 'scatter'`) is defined in `src/lib/ui/skills-explorer/types.ts` and exported from `skills-explorer/index.ts`.
- [ ] AC-09: `ChartOptionsPane` includes `'chartType'`; popover conditionally renders the chart-type pane when `selectedPane === 'chartType'`.
- [ ] AC-10: `+page.svelte` owns bindable `chartType` (and hydration flag) passed to both `ResumeSkillsChartOptionsPopover` and `ResumeSkillsChart` — same bridge pattern as `includedSkillIds` / `inclusionHydrated`.
- [ ] AC-11: `skills-chart-config.ts` provides builder functions (or a single dispatcher) for all four types and registers only the Chart.js components required for the active type family.
- [ ] AC-12: When `chartType` changes, `ResumeSkillsChart` destroys the previous Chart instance and constructs a new one (no in-place `update()` across incompatible chart `type` values).
- [ ] AC-13: No new npm dependencies; Chart.js remains the sole chart dependency.

## Accessibility

- [ ] AC-14: Chart-type pane uses `fieldset` + `legend` (sr-only legend text describes the control group) and associates radios with visible labels.
- [ ] AC-15: Header trigger buttons retain `aria-controls="skills-chart-options"` and `aria-expanded` bound to popover open state.
- [ ] AC-16: Chart frame `role="img"` `aria-label` describes the **active** chart type and included skill count (not hard-coded to bar-only copy).

## Quality / validation

- [ ] AC-17: `npm run lint` exits 0.
- [ ] AC-18: `npm run check` exits 0.
- [ ] AC-19: `npm test -- --run` exits 0 (including updated popover spec and chart-config unit tests for new builders).
- [ ] AC-20: `npm run build` exits 0.

## Tests (intended coverage)

- [ ] AC-21: Popover spec asserts third trigger opens chart-type pane and radios include all four types.
- [ ] AC-22: Unit tests in `skills-chart-config` (or adjacent spec) assert each builder returns the expected Chart.js `type` and maps an empty selection to a single placeholder dataset (consistent with bar empty state).
