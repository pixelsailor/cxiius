# Acceptance Criteria — resume-skills-chartjs

## Functional

- [ ] **AC-01:** `skills.ts` `SkillRecord` includes required `yearsOfExperience: number` (finite, non-negative) on every row in the `skillRecords` datasource (currently 74 rows); `getSkillRecords()` returns sorted records containing the field.
- [ ] **AC-02:** Resume Skills SSR HTML includes semantic non-canvas baseline markup (preferred: `<table>` with column headers using `scope="col"` or equivalent accessibility pattern) listing every skill with skill name, proficiency label or tier text, numeric years of experience, category label, and human-readable stack tag list, all readable without JavaScript.
- [ ] **AC-03:** Chart.js initializes only client-side via explicit registrations (no careless `chart.js/auto` SSR path); Chart.js stays on dependency major 4 compatible with existing `chart.js ^4.5.1` constraint.
- [ ] **AC-04:** User can choose chart types: vertical bar, horizontal bar, pie, doughnut, polar area, bubble, radar, and scatter via UI wired with Svelte 5 `$state` (or equivalently reactive UI without legacy stores).
- [ ] **AC-05:** Proficiency filter restricts the dataset reflected in Chart.js and documents empty-selection semantics in implementation or deviation log (consistent with planned `SkillsChartProficiencyFilter` once open questions settle).
- [ ] **AC-06:** Category filter restricts the dataset (`all` versus `include subset` per planned `SkillsChartCategoryFilter`; multi-category selection optional if UX matches plan).
- [ ] **AC-07:** Tech stack filter allows multi-select semantics per `SkillsChartStackFilter` in `plan.md` (or documented deviation); behaviour when no stacks selected is exercised in tests and explained in UI copy.
- [ ] **AC-08:** Years-of-experience range filter applies inclusively `[minYears, maxYears]` to `yearsOfExperience` across all charts.
- [ ] **AC-09:** Grouping dimension control exposes at least four modes: category, proficiency, stack, years-band, using a control pattern that is **not only** three equal-footprint radios sharing the legacy layout verbatim.
- [ ] **AC-10:** At least one aggregation metric besides `count` (`avg-years` or `sum-years`) changes bar and pie-compatible chart values when toggled so that non-count bars or slices visibly differ under a fixed fixture snapshot (asserted numeric expectations in tests, not screenshots).
- [ ] **AC-11:** Proficiency legend copy from `proficiencyLevels` remains in `<aside aria-label="Proficiency level descriptions">` beside the interactive chart pane at wide breakpoints, matching predecessor intent unless justified in Validator report.
- [ ] **AC-12:** Explorer preferences serialize as JSON with a documented `version` field under one new localStorage key; when that key is absent but `cxii-resume-skills-view-mode` exists, migration restores grouping preference without wiping chart defaults unless documented.
- [ ] **AC-13:** When chart type is radar, grouping dimension control is disabled visually or conveys that grouping does not apply, while filters (`stacks`, `category`, `proficiency`, `years`) still affect counts.

## Architectural / ADR alignment

- [ ] **AC-14:** `src/routes/resume/+page.ts` keeps awaited `load()` returning plain serialisable props and exports `export const prerender = true`; skills textual content continues to originate from route `data` without `onMount` content loading.
- [ ] **AC-15:** New resume skills explorer components satisfy ADR-007: Svelte 5 runes for component state (`$props`, `$state`, `$derived`, disciplined `$effect`); no `writable`/legacy stores introduced for explorer state.
- [ ] **AC-16:** `$lib/content/skills.ts` remains client-safe: no `$lib/server/` imports; types remain co-located per ADR-008. Either `system-prompt.service.ts` reflects `formatSkillsForPrompt` after years are introduced, or `build-log.md` documents human-approved omission while years still surface on the resume page.

## Accessibility

- [ ] **AC-17:** New controls (chart type picker, grouping, filters, sliders) expose accessible names and full keyboard activation per ADR-004; manual sanity notes recorded in Validator or test report checklist.
- [ ] **AC-18:** Active chart rendering target has concise non-empty accessible name reflecting chart type plus filtered outcome (for example aggregated label count), via `aria-label` or labelled-by pattern.

## Automated tests

- [ ] **AC-19:** Unit tests (`skills-chart-data.spec.ts` plus optional `skills-explorer-storage.spec.ts` or equivalent module) verify at least four cases: filtered stack semantics (`any-of` per plan default), inclusive year-boundary filtering, aggregation bucketing for `years-band`, and persistence parse rejecting unknown `version` or corrupt JSON with deterministic defaults documented in assertions.
- [ ] **AC-20:** `skills-presentation.spec.ts` updated or supplemented so existing behaviours (`groupSkillsForDisplay`, optional persistence shim) compile and pass once `SkillRecord` gains required fields (`vitest fixtures` include `yearsOfExperience`).
