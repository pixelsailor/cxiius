# Build log — `resume-skills-chartjs`

## Files created

| Path | Purpose / key decisions |
|------|-------------------------|
| `src/lib/utils/skills-chart-data.ts` | Pure filtering, `years-band` binning (`[0,3)`, `[3,8)`, `[8,15)`, `[15,∞)`), aggregation, radar helpers; stacks `any-of` with empty IDs = no filter. |
| `src/lib/utils/skills-chart-data.spec.ts` | Vitest coverage: band boundaries (inclusive/exclusive as test names/docs), stacks, proficiency (`none`), year clamps, aggregates, persistence-edge parsing via `parsePersistedSkillsExplorerJson`. |
| `src/lib/utils/skills-chart-config.ts` | `ensureResumeSkillChartsRegistered`; `buildChartConfiguration` maps explorer state → Chart.js data/options; `"bar-horizontal"` → `bar` + `indexAxis: 'y'` (valid Chart.js `type`). |
| `src/lib/ui/skills-explorer/ResumeSkillsBaseline.svelte` | SSR semantic table (`sr-only` when `hideVisually`); full datasource with years/stacks/categories; `$derived.by` for stable sort by category order. |
| `src/lib/ui/skills-explorer/ResumeSkillsExplorer.svelte` | Client explorer: Bits `Tabs` grouping, dual-thumb Slider, filters, dynamic `chart.js` import + registration in repaint path (`onMount` hydrates persisted state first). `explorerSeed` / `explorerDraft` / `$derived explorerState` pattern fixes Svelte 5 “initial capture” diagnostics. Radar disables grouping tabs. `chartReady` bindable for baseline visibility. Canvas inside `role="img"` wrapper. |
| `src/lib/ui/skills-explorer/index.ts` | Barrel re-exports. |

## Files modified

| Path | What changed |
|------|----------------|
| `src/lib/content/skills.ts` | `SkillRecord` includes `yearsOfExperience`; **all** datasource rows populated (whole-number estimates aligned with narrative). `formatSkillsForPrompt` appends `years=…` per line. ASCII-only content preserved. |
| `src/lib/utils/skills-presentation.ts` | `cxii-resume-skills-explorer-state` persistence (`PersistedSkillsExplorerStateV1`), JSON parse/candidate validation with strict stack/category ids, migrate from `cxii-resume-skills-view-mode`, clamp years via `clampSkillsExplorerYearsToExtents`. |
| `src/lib/utils/skills-presentation.spec.ts` | Fixtures gained `yearsOfExperience`; proficiency assertion narrows `{ mode: 'include' }` for `tiers`. |
| `src/lib/ui/index.ts` | Re-exports explorer components. |
| `src/routes/resume/+page.svelte` | Baseline + explorer composition; `data-explorer-ready` + `bind:chartReady`; removed legacy bar-meter CSS/markup. |

## Deviations from plan

| Item | Reason |
|------|--------|
| `src/lib/server/system-prompt.service.ts` not edited | No change needed: consumer already calls `formatSkillsForPrompt(skillRecords)`, which now includes `years=` in `skills.ts`. |

## Unresolved open questions (from plan, resolved during build)

Handled per orchestration defaults provided to Builder:

1. **Stack filter:** `any-of`; empty selection = **no stack filter** (all skills).
2. **Baseline hiding:** After explorer mounts and chart binds `chartReady`, parent sets `hideVisually` / `sr-only` on baseline via `data-explorer-ready`; table remains in DOM for assistive tech.
3. **`formatSkillsForPrompt`:** Appends **`years=X`** per skill line.
4. **Radar:** Fixed proficiency-tier semantics in config path; Bits grouping **Tabs** **`disabled`** when chart type is `radar`.
5. **`years-band` buckets:** `[0,3)`, `[3,8)`, `[8,15)`, `[15,∞)` documented in util JSDoc and asserted in **`skills-chart-data.spec.ts`** (`yearsBandKeyForYears boundaries` describe block).

*(No items left blocked for human decision.)*

## Known gaps

- **`npm run test` (full monorepo):** Fails in this environment due to unrelated **server** assertions (`layout-chat-keyboard.source.spec.ts`, `projects.spec.ts`, `portfolio-slug-route-load.spec.ts`) appearing out of sync with current `+layout.svelte` / `projects.ts`, plus **Vitest browser (Playwright)** project: Chromium executable not installed (`npx playwright install` would unblock browser tests).
- **Targeted regression:** `npx vitest run src/lib/utils/skills-chart-data.spec.ts src/lib/utils/skills-presentation.spec.ts` — **passed** (20 tests).

## Verification

| Command | Result |
|---------|--------|
| `npm run check` | **Pass** (0 errors, 0 warnings after explorer state refactor). |
| `npm run test` | **Fail** — see Known gaps (7 unrelated server tests + Playwright unhandled error). |
| `vitest run` (skills-chart-data + skills-presentation only) | **Pass** — 20/20 tests. |

## Svelte MCP

- **`svelte-autofixer`** run on **`ResumeSkillsBaseline.svelte`**: no issues or suggestions returned.
- **`ResumeSkillsExplorer.svelte`**: large payload not run through MCP autofixer here; **`svelte-check` clean** post-refactor.
