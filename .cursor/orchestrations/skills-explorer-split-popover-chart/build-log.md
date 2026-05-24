# Build log — skills-explorer-split-popover-chart

## Files created

| Path | Purpose | Key decisions |
| ---- | ------- | ------------- |
| `src/lib/ui/skills-explorer/ResumeSkillsChart.svelte` | Chart.js canvas, dynamic import, destroy lifecycle, `onChartReady` | Reads shared `includedSkillIds`; repaints in `$effect` gated by `inclusionHydrated` from composer; popover/chart styles split per plan |
| `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte` | bits-ui `Popover.Root` + **required** `Popover.Trigger`, domains/stacks panes | Interim sr-only placeholder trigger (`tabindex="-1"`, `aria-hidden="true"`); optional `trigger` snippet; `customAnchor` on `Popover.Content`; inclusion helpers moved here |

## Files modified

| Path | What changed | Why |
| ---- | ------------ | --- |
| `src/lib/ui/skills-explorer/ResumeSkillsExplorer.svelte` | Thin composer: owns `SvelteSet`, `onMount` hydrate, `$effect` persist, composes chart + popover | Public props unchanged for resume route |
| `src/lib/ui/skills-explorer/index.ts` | Export `ResumeSkillsChart`, `ResumeSkillsChartOptionsPopover` | Plan default export surface for tests/reuse |
| `src/routes/resume/+page.svelte` | Prettier only (no prop/markup changes) | `npm run format` workspace pass |

**Unchanged (read-only per plan):** `types.ts`, `ResumeSkillsBaseline.svelte`, `skills-presentation.ts`, `skills-chart-data.ts`, `skills-chart-config.ts`, `src/lib/ui/index.ts`.

## Deviations from plan

1. **`inclusionHydrated` prop on `ResumeSkillsChart`** — Not listed in plan interface contract. Added so Chart.js does not paint with an empty set before composer `onMount` hydration (parent `onMount` runs after child mount). Composer passes `inclusionHydrated={clientHydrated}`.

## Unresolved open questions

| Plan item | Outcome |
| --------- | ------- |
| Hidden Trigger a11y (`aria-hidden` + `tabindex="-1"` vs `disabled`) | Implemented **sr-only** button with `tabindex="-1"` and `aria-hidden="true"`; page header buttons remain primary open controls (`aria-expanded` / `aria-controls`). Not `disabled` — bits-ui open state is driven by page `bind:open`. Escalate to human only if Validator finds focus/AT issues. |
| Export surface (`index.ts` vs `lib/ui/index.ts`) | Exported both new components from `skills-explorer/index.ts` only; `src/lib/ui/index.ts` unchanged. |
| Optional component tests | Not added (Test agent scope). |

## Known gaps (for Test)

- No Vitest component specs for `ResumeSkillsChart` / `ResumeSkillsChartOptionsPopover` (AC coverage via manual/browser or new specs).
- Full `npm test` fails on **pre-existing** unrelated suites (layout source, projects, portfolio slug) and Playwright browser binary missing locally — skills util specs (`skills-chart-data`, `skills-presentation`) pass.
- Svelte MCP `svelte-autofixer` run on all three touched `.svelte` files; chart `$effect` + `repaintChart` side effect acknowledged (intentional Chart.js integration).

---

# Phase 2 — Page compose & popover-owned state

## Files created

| Path | Purpose | Key decisions |
| ---- | ------- | ------------- |
| _(none)_ | — | Phase 2 modifies/deletes only |

## Files modified

| Path | What changed | Why |
| ---- | ------------ | --- |
| `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte` | Owns `includedSkillIds` + `inclusionHydrated` (`$bindable`), hydrate/persist, internal `selectedPane` / `popoverOpen`, `Popover.Trigger` child snippet with two header buttons + `CaretDownIcon`, `openOnHover` | Phase 2 popover-owned triggers and state per plan |
| `src/lib/ui/skills-explorer/ResumeSkillsChart.svelte` | Doc comments only (popover vs composer) | No logic change |
| `src/routes/resume/+page.svelte` | Direct compose of popover (header) + chart (shell); removed `chartOptionsOpen` / `chartOptionsPane` / external button-group; `$state.raw(SvelteSet)` bridge | Thin page wire per AC-P2-02 / AC-P2-11 |
| `src/lib/ui/skills-explorer/index.ts` | Dropped `ResumeSkillsExplorer` export | AC-P2-17 |
| `src/lib/ui/index.ts` | Export `ResumeSkillsChart` + `ResumeSkillsChartOptionsPopover` instead of explorer | AC-P2-17 |
| `src/lib/ui/skills-explorer/skills-explorer-split.source.spec.ts` | Phase 2 source ACs (no composer, popover ownership, built-in triggers) | AC-P2-21 |
| `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte.spec.ts` | Built-in triggers, hover-open panes, inclusion mutation | AC-P2-21 |

## Files deleted

| Path | Why |
| ---- | --- |
| `src/lib/ui/skills-explorer/ResumeSkillsExplorer.svelte` | Composer absorbed into popover + page compose (AC-P2-01). **Validator Phase 2 FAIL (2026-05-24):** file was still on disk when audited; remediated by confirming removal (see **Remediation (Phase 2 validator FAIL)** below). |

### Remediation (Phase 2 validator FAIL)

**Date:** 2026-05-24  
**Trigger:** `validation-report.md` Phase 2 — AC-P2-01 not met; `build-log.md` listed explorer as deleted while file remained.

| Action | Outcome |
| ------ | ------- |
| Delete `ResumeSkillsExplorer.svelte` | **Done** — confirmed absent on disk under `src/lib/ui/skills-explorer/` (`Test-Path` false; directory listing has no explorer file; no imports in `src/`). |
| Correct Phase 2 “Files deleted” | This section records actual deletion status post-remediation. |
| `skills-explorer-split.source.spec.ts` AC-P2-01 | **Done** — `existsSync(explorerComponentPath)` asserts composer path missing, plus resume/barrel import checks. |
| `npm run lint` / `npm run check` / `npm test -- src/lib/ui/skills-explorer` | Re-run after remediation (see **Validation (Phase 2 remediation)**). |

### Validation (Phase 2 remediation)

| Command | Result |
| ------- | ------ |
| `npm run lint` | pass (2026-05-24 remediation) |
| `npm run check` | pass — 0 errors, 0 warnings |
| `npm test -- src/lib/ui/skills-explorer` | pass — 16/16 (2 files) |

## Deviations from plan

- **Page `includedSkillIds` declaration:** Plan shows `let includedSkillIds = $state(new SvelteSet())`. Implemented `let includedSkillIds = $state.raw(new SvelteSet<string>())` to satisfy ESLint `svelte/no-unnecessary-state-wrap` (SvelteSet is already reactive) and svelte-check `non_reactive_update` for `bind:includedSkillIds`.

## Unresolved open questions

| Plan item | Outcome |
| --------- | ------- |
| Hover delay values | **`openDelay={100}`**, **`closeDelay={300}`** (constants `POPOVER_OPEN_DELAY_MS` / `POPOVER_CLOSE_DELAY_MS`). Snappier than bits-ui defaults (700/300), closer to Phase 1 immediate pointerenter. |
| Trigger `props` merge target | **Wrapper `div.button-group`** via `mergeProps(props, { class: 'button-group' })`; no escalation. |
| Future chart type + skills controls | Not scaffolded (out of scope). |

## Hover timing (build-log detail)

| Prop | Value | Rationale |
| ---- | ----- | --------- |
| `openOnHover` | `true` | Replaces page `onpointerenter` open handlers |
| `openDelay` | `100` ms | Low delay preserves snappy UX (plan open question #1) |
| `closeDelay` | `300` ms | bits-ui-style close grace when leaving trigger group |

## Known gaps

- Full-repo `npm test` still fails on **unrelated** suites (`layout-chat-keyboard.source`, `projects.spec`, `portfolio-slug-route-load`, `chat-sidebar-layout` env import). **Skills-explorer** specs (14 tests) pass.
- Svelte MCP `svelte-autofixer`: no issues; intentional `$effect` for `writeIncludedSkillIds` and chart `repaintChart` (persistence / Chart.js side effects).

## Validation (Phase 2)

| Command | Result |
| ------- | ------ |
| `npm run format` | pass |
| `npm run lint` | pass |
| `npm run check` | pass (0 errors, 0 warnings after `$state.raw` fix) |
| `npm test -- src/lib/ui/skills-explorer` | pass (14/14) |
| `npm run build` | pass |
| `npm test` (full) | **fail** — pre-existing unrelated failures (see above) |
