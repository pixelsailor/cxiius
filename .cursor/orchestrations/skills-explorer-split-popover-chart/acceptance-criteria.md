# Acceptance Criteria — skills-explorer-split-popover-chart

## Functional

- [ ] AC-01: `ResumeSkillsChart.svelte` exists and renders only the chart canvas wrapper (no `Popover.*` imports or options pane markup).
- [ ] AC-02: `ResumeSkillsChartOptionsPopover.svelte` exists and renders only the skills options popover (domains + tech-stacks panes); no Chart.js import or `<canvas>`.
- [ ] AC-03: `ResumeSkillsExplorer.svelte` is a thin composer that renders chart + popover and contains no duplicated pane or canvas implementation blocks from the pre-split monolith.
- [ ] AC-04: Toggling skills or categories in the popover updates the bar chart datasets without a full page reload (same inclusion behavior as before split).
- [ ] AC-05: Selecting a tech stack in the popover replaces chart inclusion with that stack’s skills (same behavior as before split).
- [ ] AC-06: After reload in the browser, previously excluded skills remain excluded (persistence via `skills-presentation` / `cxii-resume-skills-chart-selection` v2).
- [ ] AC-07: Resume page header buttons (“Tech stacks”, “Skills by domain”) still open the popover and set the correct pane (`skillStacks` vs `domains`) on hover.
- [ ] AC-08: Popover panel anchors to the page’s anchor element (`customAnchor` / `chartOptionsAnchorEl`) so the panel aligns over the chart area as before.
- [ ] AC-09: `onChartReady` still fires once the chart has rendered at least once, driving `skillsExplorerMounted` / `data-explorer-ready` on the resume page.

## Architectural

- [ ] AC-10: Composer owns a single `SvelteSet` for `includedSkillIds`, calls `hydrateIncludedSkillIds` on client mount and `writeIncludedSkillIds` when inclusion changes (not duplicated in chart or popover).
- [ ] AC-11: Popover component’s markup includes `Popover.Root`, **`Popover.Trigger`**, `Popover.Portal`, and `Popover.Content` from `bits-ui` per ADR-011.
- [ ] AC-12: `Popover.Content` accepts `customAnchor` from props; `Popover.Root` supports `bind:open` synced with the resume page.
- [ ] AC-13: Popover exposes an optional trigger `Snippet` prop; when omitted, a default interim `Popover.Trigger` is still rendered (documented in `@component` for future migration).
- [ ] AC-14: `ResumeSkillsExplorer` public props remain compatible with current `+page.svelte` usage (`skillRecords`, `skillCategories`, `skillStacks`, `bind:open`, `selectedPane`, `customAnchor`, `onChartReady`) without requiring page button removal.
- [ ] AC-15: No files under `sunrise2-ui` or outside the CXII repo are modified.
- [ ] AC-16: No new npm dependencies; no new global `$lib/stores/` classes for this feature.

## Accessibility

- [ ] AC-17: Page header buttons retain `aria-expanded` and `aria-controls="skills-chart-options"`; popover content retains `id="skills-chart-options"`.
- [ ] AC-18: Tech-stacks pane retains `fieldset` / `legend` (including sr-only legend) and labeled radio controls; domains pane retains checkbox labels and category indeterminate state behavior.

## Quality / validation

- [ ] AC-19: `npm run lint` exits 0.
- [ ] AC-20: `npm run check` exits 0.
- [ ] AC-21: `npm test` exits 0 (existing `skills-chart-data.spec.ts` and `skills-presentation.spec.ts` still pass).
- [ ] AC-22: `npm run build` exits 0.

## Regression guard

- [ ] AC-23: No-JS resume skills section (`<noscript>` static chart) is unchanged by this task.
- [ ] AC-24: `ResumeSkillsBaseline.svelte` is unchanged unless a mechanical import path update is required (expected: no change).

---

## Phase 2 — Page compose & popover-owned state

### Functional

- [ ] AC-P2-01: `ResumeSkillsExplorer.svelte` is **deleted**; no imports of `ResumeSkillsExplorer` remain in `src/routes/resume/+page.svelte` or barrels.
- [ ] AC-P2-02: `+page.svelte` composes `ResumeSkillsChartOptionsPopover` and `ResumeSkillsChart` as siblings (popover in skills section header, chart in explorer shell).
- [ ] AC-P2-03: Popover renders “Tech stacks” and “Skills by domain” buttons inside `Popover.Trigger` **child snippet** (not on the page).
- [ ] AC-P2-04: Hovering “Tech stacks” opens the popover (via `openOnHover`) and shows the `skillStacks` pane; hovering “Skills by domain” opens and shows the `domains` pane.
- [ ] AC-P2-05: Toggling skills or categories in the popover updates the bar chart without a full page reload (same inclusion behavior as Phase 1).
- [ ] AC-P2-06: Selecting a tech stack in the popover replaces chart inclusion with that stack’s skills (same behavior as Phase 1).
- [ ] AC-P2-07: After reload in the browser, previously excluded skills remain excluded (persistence via `skills-presentation` v2).
- [ ] AC-P2-08: Popover panel anchors to the page-supplied `customAnchor` element so the panel aligns over the chart area.
- [ ] AC-P2-09: `onChartReady` still fires once the chart has rendered at least once, driving `skillsExplorerMounted` / `data-explorer-ready` on the resume page.

### Architectural

- [ ] AC-P2-10: **Popover** (not page, not chart, not deleted composer) owns `includedSkillIds`, `hydrateIncludedSkillIds` on mount, and `writeIncludedSkillIds` in `$effect`.
- [ ] AC-P2-11: Page exposes only a minimal bridge: `bind:includedSkillIds` and `bind:inclusionHydrated` (or equivalent) from popover to chart; page does **not** declare `chartOptionsOpen`, `chartOptionsPane`, or manual `onpointerenter` open handlers.
- [ ] AC-P2-12: `Popover.Trigger` uses `openOnHover` with explicit `openDelay` and `closeDelay`; popover open state is internal to the popover/bits-ui tree (no page `bind:open`).
- [ ] AC-P2-13: Popover uses raw `import { Popover, mergeProps } from 'bits-ui'`; **does not** import `$lib/ui/popover/Popover.svelte`.
- [ ] AC-P2-14: `Popover.Trigger` child snippet spreads bits-ui `props` via `mergeProps` onto the trigger wrapper; two `<button type="button">` elements live inside the snippet.
- [ ] AC-P2-15: `Popover.Content` retains `customAnchor={customAnchor ?? undefined}` from a page prop; page retains the zero-height `skills-explorer-anchor` div.
- [ ] AC-P2-16: `selectedPane` is internal popover `$state`; it is **not** a prop from `+page.svelte`.
- [ ] AC-P2-17: `skills-explorer/index.ts` and `lib/ui/index.ts` no longer export `ResumeSkillsExplorer`; chart and popover remain exported.
- [ ] AC-P2-18: No new npm dependencies; no global `$lib/stores/` for inclusion state.

### Accessibility

- [ ] AC-P2-19: Popover trigger buttons retain `aria-controls="skills-chart-options"` and `aria-expanded` reflecting popover open state; content retains `id="skills-chart-options"`.
- [ ] AC-P2-20: Tech-stacks pane retains `fieldset` / sr-only `legend` and labeled radios; domains pane retains checkbox labels and `categoryCheckboxState` indeterminate behavior.

### Quality / validation

- [ ] AC-P2-21: Component/source specs updated — no assertions requiring `ResumeSkillsExplorer`, page `bind:open`, or sr-only placeholder trigger.
- [ ] AC-P2-22: `npm run lint` exits 0.
- [ ] AC-P2-23: `npm run check` exits 0.
- [ ] AC-P2-24: `npm test` exits 0.
- [ ] AC-P2-25: `npm run build` exits 0.

### Regression guard

- [ ] AC-P2-26: No-JS resume skills section (`<noscript>` static chart) is unchanged.
- [ ] AC-P2-27: `ResumeSkillsBaseline.svelte` is unchanged unless a mechanical import path update is required (expected: no change).
