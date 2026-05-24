# Architecture Constraints — skills-explorer-split-popover-chart

## Applicable ADRs

| ADR | Title | Key constraint |
| --- | ----- | -------------- |
| ADR-001 | Project File and Folder Structure | New UI lives under `src/lib/ui/skills-explorer/`; PascalCase filenames; direct imports; no new server modules |
| ADR-004 | Semantic HTML and Accessibility Standards | Native controls in popover panes; `aria-expanded` / `aria-controls` on page triggers; focus/Escape behavior from bits-ui; reduced-motion for any new motion |
| ADR-007 | State Management Conventions | Svelte 5 runes only; `$props()` / `$bindable`; local `$state` / `$derived`; `SvelteSet` for inclusion; no Svelte 4 stores |
| ADR-011 | UI Component Library — bits-ui | Popover uses bits-ui primitives; `Popover.Root` includes `Popover.Trigger`; `customAnchor` on `Popover.Content` for interim page anchors |

## Mandatory constraints

- Split `ResumeSkillsExplorer.svelte` into **chart-only**, **popover-only**, and a **thin composer** that wires shared `includedSkillIds` and persistence; do not redesign chart UX or pane markup beyond moves.
- **Composer (`ResumeSkillsExplorer`)** owns `includedSkillIds` lifecycle: `hydrateIncludedSkillIds` on client mount, `writeIncludedSkillIds` when the set changes, and passes the **same** `SvelteSet` instance to chart (read/repaint) and popover (mutate).
- **Popover component** must follow bits-ui structure: `Popover.Root` → `Popover.Trigger` (required, even with `customAnchor`) → `Popover.Portal` → `Popover.Content` with `customAnchor` when provided.
- Expose an optional **trigger snippet** (or equivalent) on the popover component so a future task can render real `Popover.Trigger` children; interim default is a non-interactive, visually hidden trigger inside the popover tree while the resume page keeps external buttons + `bind:open`.
- **Page (`src/routes/resume/+page.svelte`)** keeps `chartOptionsOpen`, `chartOptionsPane`, `chartOptionsAnchorEl`, and header buttons unchanged in behavior; only import/wiring updates if prop names on the composer stay stable.
- **Persistence** stays in `$lib/utils/skills-presentation.ts` (`hydrateIncludedSkillIds`, `writeIncludedSkillIds`); do not duplicate storage keys or JSON shape.
- **Svelte 5 only**: `$props()`, `$bindable`, `$state`, `$derived`, `$effect` per ADR-007; Chart.js dynamic import and `onMount`/`onDestroy` lifecycle stay in the chart component.
- Run **`npm run lint`**, **`npm run check`**, **`npm test`**, **`npm run build`** before handoff; use **`npm run format`** if Prettier check fails.
- **Do not modify** `sunrise2-ui` or any path outside the CXII repo.

## Banned approaches

- Leaving chart and popover coupled in a single 500+ line component after this task.
- Removing `Popover.Trigger` from the popover tree to “simplify” external buttons (bits-ui expects Trigger in structure; use hidden/sr-only trigger instead).
- Moving page-level header buttons into `Popover.Trigger` in this task (explicitly deferred).
- Removing `customAnchor` / page anchor div in this task.
- Introducing a second headless UI library, Svelte 4 stores, or global `$lib/stores/` class for inclusion state.
- Broad chart feature work (new chart types, legend redesign, new panes) beyond the split refactor.
- New npm dependencies without Orchestrator approval.
- Barrel re-exports that violate existing `skills-explorer/index.ts` patterns beyond adding named exports for new components.

## Repo areas affected

- `src/lib/ui/skills-explorer/` — new chart and popover components; composer refactor; `index.ts` exports
- `src/routes/resume/+page.svelte` — only if composer public props or markup structure require it (target: unchanged external API)
- `src/lib/utils/skills-presentation.ts` — read-only unless a tiny shared helper is justified (prefer no change)
- `src/lib/utils/skills-chart-data.ts`, `skills-chart-config.ts` — read-only; existing specs remain source of truth
- Optional: `src/lib/ui/skills-explorer/*.test.ts` — new or updated Vitest component tests if Builder adds them per plan

## ADR gaps discovered

- None.

---

# Phase 2 — Page compose & popover-owned state

## Applicable ADRs (Phase 2)

Same as Phase 1 (ADR-001, ADR-004, ADR-007, ADR-011). Phase 2 shifts trigger ownership from page to popover and removes the composer layer.

## Mandatory constraints (Phase 2)

- **Delete `ResumeSkillsExplorer.svelte`** when page compose is complete; absorb composer responsibilities into **popover** (inclusion + persistence) and **page** (anchor + chart bridge only).
- **`ResumeSkillsChartOptionsPopover`** owns: `includedSkillIds` `SvelteSet`, `hydrateIncludedSkillIds` / `writeIncludedSkillIds`, internal `selectedPane`, internal open state via bits-ui **`openOnHover`**, and header trigger buttons in **`Popover.Trigger` child snippet** with **`mergeProps`**.
- **`Popover.Trigger`** MUST set `openOnHover`, `openDelay`, and `closeDelay`; MUST use `{#snippet child({ props })}` with a **button-group wrapper** and **two buttons** (“Tech stacks”, “Skills by domain”); each button sets `selectedPane` on hover.
- **`Popover.Content`** MUST keep `customAnchor={customAnchor ?? undefined}`; page supplies anchor element via prop (decision **1B**).
- **`+page.svelte`** MUST NOT own `chartOptionsOpen`, `chartOptionsPane`, external trigger buttons, or hydration logic; MUST compose popover + chart directly with **`bind:includedSkillIds`** and **`bind:inclusionHydrated`** (or equivalent) as the only shared-state bridge.
- **`ResumeSkillsChart`** remains chart-only; receives `includedSkillIds` and `inclusionHydrated` from page bridge; no popover imports.
- Use **raw bits-ui** `{ Popover, mergeProps } from 'bits-ui'` — reference `$lib/ui/popover/Popover.svelte` for pattern only.
- Update barrels: remove `ResumeSkillsExplorer` from `skills-explorer/index.ts` and `lib/ui/index.ts`.
- Update/remove tests that reference composer, page `bind:open`, or sr-only placeholder trigger.
- Run **`npm run lint`**, **`npm run check`**, **`npm test`**, **`npm run build`** before handoff.

## Banned approaches (Phase 2)

- Keeping or reintroducing **`ResumeSkillsExplorer`** as a composer wrapper.
- Page-level **`chartOptionsOpen`**, **`chartOptionsPane`**, or **`onpointerenter`** handlers on external header buttons.
- Page **`bind:open`** or **`selectedPane`** props to popover.
- **Sr-only / hidden placeholder** `Popover.Trigger` (Phase 2 uses real trigger buttons in child snippet).
- Importing or wrapping with **`$lib/ui/popover/Popover.svelte`**.
- Optional external **`trigger` snippet** prop on popover (replaced by built-in header controls).
- Duplicating **`hydrateIncludedSkillIds` / `writeIncludedSkillIds`** on page or chart.
- Removing **`customAnchor`** or the page anchor div.
- Introducing global stores, Svelte 4 patterns, or new npm dependencies.
- Scaffolding **future chart type + skills** controls in Phase 2.

## Repo areas affected (Phase 2)

- `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte` — triggers, state ownership, interaction
- `src/lib/ui/skills-explorer/ResumeSkillsExplorer.svelte` — **delete**
- `src/lib/ui/skills-explorer/index.ts`, `src/lib/ui/index.ts` — barrel updates
- `src/routes/resume/+page.svelte` — thin compose; remove open/pane/button state
- `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte.spec.ts` — update for built-in triggers
- `src/lib/ui/skills-explorer/skills-explorer-split.source.spec.ts` — replace composer/page-open ACs with Phase 2 checks
- `src/lib/ui/skills-explorer/ResumeSkillsChart.svelte` — read/minimal (unchanged role)

## ADR gaps discovered (Phase 2)

- None.
