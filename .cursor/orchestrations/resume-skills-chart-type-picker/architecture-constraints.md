# Architecture Constraints — resume-skills-chart-type-picker

## Applicable ADRs

| ADR | Title | Key constraint |
| --- | ----- | ----- |
| ADR-001 | Project File and Folder Structure | Colocate changes in `src/lib/ui/skills-explorer/` and `src/lib/utils/`; page wiring in `src/routes/resume/+page.svelte` only |
| ADR-004 | Semantic HTML and Accessibility Standards | Chart-type pane uses native `fieldset`/`legend`/radio group; dynamic chart `aria-label` reflects active type; keyboard-operable controls |
| ADR-006 | Type and Schema Conventions | `ResumeSkillsChartType` as `as const` union in `types.ts`; no TypeScript `enum`; persisted chart type validated against union |
| ADR-007 | State Management Conventions | Svelte 5 runes only; page-owned bindable state bridged to popover + chart; no global store; `$effect` for persistence after hydration flag |
| ADR-011 | UI Component Library — bits-ui | Third trigger stays inside existing `Popover.Trigger` child snippet; no second headless library |

## Mandatory constraints

- Default chart type remains **`bar`** when storage is missing or invalid.
- Page (`+page.svelte`) owns the **`chartType`** (and hydration flag) instance; popover and chart receive the same bindable reference — mirror `includedSkillIds` / `inclusionHydrated`.
- Chart type persistence lives in **`src/lib/utils/skills-presentation.ts`** (sibling localStorage key, same `canPersistSkillsViewMode` guard) — do not invent a parallel persistence module.
- Extend **`ChartOptionsPane`** in `types.ts`; do not duplicate pane id strings ad hoc.
- Register Chart.js controllers/scales **lazily per chart family** (bar vs radial vs scatter) in `skills-chart-config.ts`; no new npm dependencies.
- When **`chartType` changes**, **destroy** the Chart.js instance and create a new one with the matching `type` — do not call `update()` across incompatible controllers.
- Skills explorer remains **JS-gated** on the resume page (`{#if isJsEnabled}`); no requirement to render Chart.js variants in `<noscript>`.
- JSDoc on substantive new/changed `.ts` exports per project documentation rules.

## Banned approaches

- Adding a second chart library or global Chart.js store.
- Persisting chart type inside `ResumeSkillsChart` or only inside the popover without page bridge (breaks single source of truth).
- Svelte 4 patterns (`writable`, `export let`, `$:`, `<slot>`).
- Replacing or removing domains / tech-stacks panes.
- Introducing new npm packages for Chart.js plugins.
- Guessing product semantics for scatter axes without documenting the chosen mapping in `build-log.md` if human overrides open question.

## Repo areas affected

- `src/lib/ui/skills-explorer/types.ts`
- `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte`
- `src/lib/ui/skills-explorer/ResumeSkillsChart.svelte`
- `src/lib/ui/skills-explorer/index.ts` (type export only if needed)
- `src/lib/utils/skills-chart-config.ts`
- `src/lib/utils/skills-presentation.ts`
- `src/routes/resume/+page.svelte`
- Vitest: `ResumeSkillsChartOptionsPopover.svelte.spec.ts`, `skills-chart-config` tests (new or extended), `skills-explorer-split.source.spec.ts` (if page bindings asserted)

## ADR gaps discovered

- None. Chart-type UX is a localized enhancement; no new cross-cutting ADR required.
