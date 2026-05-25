# Build Log — resume-skills-chart-type-picker

## Files created

- None (chart-config unit spec deferred to Test agent per Builder contract).

## Files modified

| Path | Purpose / changes |
| ---- | ----------------- |
| `src/lib/ui/skills-explorer/types.ts` | Added `RESUME_SKILLS_CHART_TYPES`, `ResumeSkillsChartType`, extended `ChartOptionsPane` with `'chartType'`. |
| `src/lib/ui/skills-explorer/index.ts` | Re-export chart type symbols. |
| `src/lib/utils/skills-presentation.ts` | `RESUME_SKILLS_CHART_TYPE_KEY`, `readPersistedChartType`, `writePersistedChartType`, `hydrateChartType` (union validation, default `bar`). |
| `src/lib/utils/skills-chart-config.ts` | Per-type lazy registration (`ensureResumeSkillChartRegistered`), `buildResumeSkillsChart` dispatcher, polar/radar/scatter builders; kept `buildCategoryProficiencyBarChart` + `ensureResumeSkillBarChartRegistered` aliases. |
| `src/lib/ui/skills-explorer/ResumeSkillsChart.svelte` | `chartType` / `chartTypeHydrated` props; destroy/recreate on type change; type-aware `aria-label`. |
| `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte` | Third trigger "Chart type", chart-type pane (fieldset + 4 radios, responsive 4-col grid), bindable chart type + hydration/persistence. |
| `src/routes/resume/+page.svelte` | Page-owned `chartType` / `chartTypeHydrated` bound to popover and passed to chart. |

## Deviations from plan

- None.

## Unresolved open questions

| Plan item | Outcome |
| --------- | ------- |
| Scatter axes (product) | Implemented plan default: **x = years of experience**, **y = proficiency tier (0–4)**. |
| Third trigger label | Used plan default **"Chart type"**. |
| Polar vs radar differentiation | v1: same proficiency magnitude + tooltips; no extra datasets. |

## Known gaps

- **Test agent:** `skills-chart-config.spec.ts` (new) and popover spec extensions (third trigger, chart-type pane, four radios) not added by Builder per role contract.
- **Optional:** `skills-explorer-split.source.spec.ts` page `bind:chartType` assertion not updated.
- **Full suite:** `npm run test:unit -- --run` reports 7 failures in unrelated areas (`layout-chat-keyboard`, `projects.spec`, `portfolio-slug-route-load`, `chat-sidebar-layout` env). Skills-explorer–related specs (30 tests) pass.

## Scatter semantics (documented)

Scatter points use `x: row.yearsOfExperience`, `y: proficiencyBarValue(row)` (proficiency level 0–4). Tooltip title is skill name; label is tier + years.

## Command results

| Command | Result |
| ------- | ------ |
| `npm run format` | Pass (repo-wide Prettier; touched orchestration/docs unrelated to feature) |
| `npm run lint` | Pass |
| `npm run check` | Pass (0 errors) |
| `npm run test:unit -- --run` (full) | **Fail** — 7 pre-existing unrelated failures (see Known gaps) |
| `npm run test:unit -- --run` (skills-related subset) | Pass — 30/30 |
| `npm run build` | Pass |
