# Test Report — resume-skills-chart-type-picker

## Summary

| Suite | Result |
| ----- | ------ |
| In-scope (`skills-chart-config.spec.ts` + `src/lib/ui/skills-explorer/`) | **Pass** — 31/31 |
| Full (`npm test`) | **Fail** — 128 passed, 7 failed, 1 skipped (pre-existing, unrelated) |

**In-scope tests green:** yes  
**Full suite green:** no (unrelated failures documented below)

## Tests added / extended

| File | Change |
| ---- | ------ |
| `src/lib/utils/skills-chart-config.spec.ts` | **Created** — dispatcher + four builders: Chart.js `type`, non-empty data, empty placeholder contracts (AC-22) |
| `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte.spec.ts` | **Extended** — third trigger + chart-type pane (AC-21); default `bar` checked (AC-02 partial); bindable `chartType` on radio click |
| `src/lib/ui/skills-explorer/skills-explorer-split.source.spec.ts` | **Extended** — `bind:chartType` / `bind:chartTypeHydrated` on page (AC-10); third trigger label; chart-type hydration in popover (AC-07 / AC-10 partial) |

## Coverage map

| AC ID | Test file | Test name(s) | Status |
| ----- | --------- | ------------ | ------ |
| AC-01 | `ResumeSkillsChartOptionsPopover.svelte.spec.ts` | `AC-P2-03 AC-P2-04 AC-P2-19: built-in triggers open correct pane on hover` (includes Chart type trigger + pane heading) | Pass |
| AC-02 | `ResumeSkillsChartOptionsPopover.svelte.spec.ts` | `AC-21: chart-type pane exposes fieldset…` (`bar` radio `checked` by default) | Pass (partial: four radios + default bar; not persistence) |
| AC-03 | — | — | Uncovered (responsive CSS grid; visual/layout) |
| AC-04 | — | — | Uncovered (browser Chart.js integration / resume page) |
| AC-05 | — | — | Uncovered (chart repaint on inclusion change) |
| AC-06 | — | — | Uncovered (invalid/missing localStorage fallback; no `skills-presentation` unit spec in plan) |
| AC-07 | `skills-explorer-split.source.spec.ts` | `AC-10: popover owns hydration and persistence for chartType` | Pass (source: hydrate/write in popover, gated by `chartTypeHydrated`) |
| AC-08 | — | — | Uncovered (type export contract; no dedicated spec) |
| AC-09 | `skills-explorer-split.source.spec.ts` | `AC-P2-03 AC-P2-14: built-in trigger buttons…` (`Chart type` string in source) | Pass (partial: trigger label in source; pane `selectedPane === 'chartType'` not asserted) |
| AC-10 | `skills-explorer-split.source.spec.ts` | `AC-P2-02 AC-P2-11 AC-P2-15: page composes siblings…` (`bind:chartType`, `bind:chartTypeHydrated`) | Pass |
| AC-11 | `skills-chart-config.spec.ts` | `buildResumeSkillsChart` dispatcher tests (×4) | Pass |
| AC-12 | — | — | Uncovered (Chart destroy/recreate lifecycle in `ResumeSkillsChart.svelte`) |
| AC-13 | — | — | Uncovered (dependency policy; not unit-testable) |
| AC-14 | `ResumeSkillsChartOptionsPopover.svelte.spec.ts` | `AC-21: chart-type pane exposes fieldset, sr-only legend, and four type radios` | Pass |
| AC-15 | `ResumeSkillsChartOptionsPopover.svelte.spec.ts` | `AC-P2-03…` + `AC-21: chart-type pane…` (`aria-controls` on triggers) | Pass |
| AC-16 | — | — | Uncovered (dynamic canvas `aria-label` in chart component) |
| AC-17 | — | — | Uncovered (Validator / `npm run lint`; Builder reported pass) |
| AC-18 | — | — | Uncovered (Validator / `npm run check`; Builder reported pass) |
| AC-19 | — | — | **Fail** on full `npm test` due to unrelated failures (see below); in-scope subset pass |
| AC-20 | — | — | Uncovered (Validator / `npm run build`; Builder reported pass) |
| AC-21 | `ResumeSkillsChartOptionsPopover.svelte.spec.ts` | `AC-21: chart-type pane exposes fieldset…`; `AC-21: selecting a chart type updates bindable chartType` | Pass |
| AC-22 | `skills-chart-config.spec.ts` | `buildResumeSkillsChart` (×4); `buildCategoryProficiencyBarChart` (×2); `buildCategoryProficiencyPolarChart` (×2); `buildCategoryProficiencyRadarChart` (×2); `buildCategoryProficiencyScatterChart` (×2) | Pass |

## Uncovered criteria

| AC ID | Reason |
| ----- | ------ |
| AC-03 | Responsive grid breakpoints are CSS-only; no stable DOM assertion without layout engine. |
| AC-04 | End-to-end chart render on `/resume` requires browser + Chart.js canvas; out of Vitest component scope. |
| AC-05 | Inclusion-driven repaint is chart `$effect` behavior; not isolated in current specs. |
| AC-06 | `hydrateChartType` / invalid storage fallback needs `skills-presentation` unit tests or mocked `localStorage` (not in plan allowlist). |
| AC-08 | Barrel/type exports — low risk; source could be added later. |
| AC-09 | Conditional pane render (`selectedPane === 'chartType'`) — implicit via component tests when pane visible; no dedicated source grep. |
| AC-12 | Instance destroy/recreate on type change — chart component not under browser Vitest project in this run. |
| AC-13 | Policy constraint (no new deps) — not automated. |
| AC-16 | Type-aware `aria-label` on chart canvas — chart component untested in browser project here. |
| AC-17–AC-18, AC-20 | Quality gates owned by Validator; Builder already ran lint/check/build successfully. |

## Test stability notes

- Popover specs use `expect.poll` waiting for `fieldset` after hover — depends on bits-ui hover open delay; stable in local runs (31/31).
- `AC-21: selecting a chart type updates bindable chartType` uses getter/setter props for two-way binding; passes in Vitest browser project.

## Commands to run

In-scope (recommended; avoids duplicate `--run` from `npm test` script):

```bash
npx vitest --run src/lib/utils/skills-chart-config.spec.ts src/lib/ui/skills-explorer/
```

Full default gate (package script already passes `--run` once):

```bash
npm test
```

**Note:** `npm test -- --run <paths>` duplicates `--run` and errors in Vitest 4.x; use `npx vitest --run <paths>` for scoped runs.

### In-scope result (2026-05-24)

```
Test Files  3 passed (3)
Tests       31 passed (31)
```

### Full suite result (2026-05-24)

```
Test Files  4 failed | 16 passed | 1 skipped (21)
Tests       7 failed | 128 passed | 1 skipped (136)
```

## Unrelated full-suite failures (not fixed by Test agent)

| File | Failure |
| ---- | ------- |
| `src/tests/layout-chat-keyboard.source.spec.ts` | 3 tests — layout source no longer matches expected Escape/`showNav`/nav gate strings |
| `src/lib/content/projects.spec.ts` | 3 tests — seed data: multiple `featuredAsHero`, `whats-for-dinner` portfolio inclusion |
| `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | 1 test — `whats-for-dinner` present in `entries()` |
| `src/tests/chat-sidebar-layout.svelte.spec.ts` | Suite import error — `$env/dynamic/public` `env` undefined in test harness |

Skills-explorer and chart-config specs introduced by this task are included in the **128 passed** count.

## Handoff

- **Validator** next: ADR compliance, lint/check/build confirmation, manual smoke for AC-04–06 and AC-16.
- **Orchestrator:** set `current_agent` to `validator` when manifest is updated.
