# Test Report — skills-explorer-split-popover-chart

## Summary

| Verdict | Scope |
| ------- | ----- |
| **PASS (Phase 2 in-scope)** | AC-P2-01–03, AC-P2-05–06, AC-P2-10–21, AC-P2-26–27; skills-explorer suite **16/16**; related util specs **14/14** |
| **GAP** | Chart repaint without reload (AC-P2-05 partial), browser persistence reload (AC-P2-07), `customAnchor` visual alignment (AC-P2-08), `onChartReady` / `data-explorer-ready` (AC-P2-09), full-repo `npm test` gate (AC-P2-24) |

**Phase 2 tests (this run)**

- `src/lib/ui/skills-explorer/skills-explorer-split.source.spec.ts` — **12** tests (server)
- `src/lib/ui/skills-explorer/ResumeSkillsChartOptionsPopover.svelte.spec.ts` — **4** tests (client/browser)

**Related util specs (AC-P2-07)**

- `src/lib/utils/skills-presentation.spec.ts` — persistence v2 round-trip
- `src/lib/utils/skills-chart-data.spec.ts` — filter/stack helpers

---

## Phase 2 coverage map (AC-P2)

| AC ID | Evidence | Status |
| ----- | -------- | ------ |
| AC-P2-01 | `skills-explorer-split.source.spec.ts` — `AC-P2-01: ResumeSkillsExplorer deleted and not imported from resume or barrels` | **PASS** |
| AC-P2-02 | `skills-explorer-split.source.spec.ts` — `AC-P2-02 AC-P2-11 AC-P2-15: page composes siblings with minimal inclusion bridge and customAnchor` | **PASS** |
| AC-P2-03 | Source: built-in triggers + `mergeProps`; Browser: `AC-P2-03 AC-P2-04 AC-P2-19: built-in triggers open correct pane on hover` | **PASS** |
| AC-P2-04 | Browser: hover Tech stacks → “Tech Stacks”; hover Skills by domain → “Skill Domains” | **PASS** |
| AC-P2-05 | Browser: `AC-P2-05: toggling a domain skill checkbox mutates shared includedSkillIds` | **PASS** (Set mutation; chart repaint not asserted) |
| AC-P2-06 | Browser: `AC-P2-06: selecting a tech stack replaces includedSkillIds with stack skills` | **PASS** |
| AC-P2-07 | `skills-presentation.spec.ts` — `round-trips excluded skill ids` | **PASS** (unit); full browser reload not automated |
| AC-P2-08 | Source: page `customAnchor={chartOptionsAnchorEl}` + anchor div; popover `customAnchor={customAnchor ?? undefined}` on Content | **PASS** (wiring); visual overlay alignment manual/E2E |
| AC-P2-09 | — | **GAP** — `onChartReady` / `data-explorer-ready` needs Chart.js mock or E2E |
| AC-P2-10 | Source: `AC-P2-10: popover owns hydration and persistence for includedSkillIds` | **PASS** |
| AC-P2-11 | Source: `AC-P2-02 AC-P2-11 AC-P2-15: page composes siblings…` (no page hydrate/persist/open/pane) | **PASS** |
| AC-P2-12 | Source: `AC-P2-12 AC-P2-13: popover uses bits-ui openOnHover…` | **PASS** |
| AC-P2-13 | Source: bits-ui import; no `$lib/ui/popover` | **PASS** |
| AC-P2-14 | Source: `AC-P2-03 AC-P2-14: built-in trigger buttons in child snippet with mergeProps` | **PASS** |
| AC-P2-15 | Source: page + popover `customAnchor` wiring (see AC-P2-02 test) | **PASS** |
| AC-P2-16 | Source: `AC-P2-15 AC-P2-16: customAnchor on Content; selectedPane is internal state` | **PASS** |
| AC-P2-17 | Source: `AC-P2-01` (barrel exports chart + popover, no explorer) | **PASS** |
| AC-P2-18 | — | **PASS** (source review: no new deps/stores in skills-explorer) |
| AC-P2-19 | Source: `AC-P2-19: trigger buttons reference skills-chart-options popover id`; Browser: `aria-controls` on both triggers | **PASS** |
| AC-P2-20 | Source: fieldset/legend/checkboxes; Browser: tech-stacks fieldset/radios | **PASS** |
| AC-P2-21 | Specs updated: no `ResumeSkillsExplorer`, page `bind:open`, or sr-only placeholder trigger assertions | **PASS** |
| AC-P2-22 | `npm run lint` | **Not re-run this session** — Builder Phase 2 log: pass |
| AC-P2-23 | `npm run check` | **Not re-run this session** — Builder Phase 2 log: pass |
| AC-P2-24 | `npm test` full suite | **FAIL** — pre-existing unrelated failures (see Commands) |
| AC-P2-25 | `npm run build` | **Not re-run this session** — Builder Phase 2 log: pass |
| AC-P2-26 | Source: `AC-P2-26: resume page still ships noscript static skills chart` | **PASS** |
| AC-P2-27 | Source: `AC-P2-27: baseline component unchanged by split` | **PASS** |

---

## Phase 1 coverage map (retained — superseded where noted)

| AC ID | Phase 2 note | Status |
| ----- | ------------ | ------ |
| AC-01–02 | Still valid via same source tests | **PASS** |
| AC-03 | Superseded by AC-P2-01 (composer deleted, not thin) | **N/A** |
| AC-04 | Covered by AC-P2-05 browser test | **PASS** (partial) |
| AC-05 | Covered by AC-P2-06 browser test | **PASS** |
| AC-06 | Covered by AC-P2-07 util spec | **PASS** |
| AC-07–08 | Superseded by AC-P2-03–04, AC-P2-15 (popover-owned triggers + page anchor) | **PASS** / manual for layout |
| AC-09 | Still **GAP** | **GAP** |
| AC-10 | Superseded by AC-P2-10 (popover owns Set) | **PASS** |
| AC-11–14 | Phase 1 composer/trigger-snippet ACs replaced by AC-P2-10–17 | See Phase 2 map |
| AC-15–24 | Unchanged from prior report where still applicable | Mixed |

---

## Uncovered criteria (Phase 2)

| AC | Reason |
| --- | ------ |
| AC-P2-05 (chart side) | Inclusion Set updates asserted; Chart.js repaint without full page reload not unit-tested. |
| AC-P2-07 (browser) | localStorage round-trip after real reload — covered at util layer only. |
| AC-P2-08 (visual) | Panel position over chart shell — manual QA. |
| AC-P2-09 | `onChartReady` → `skillsExplorerMounted` / `data-explorer-ready` — Chart.js lifecycle / E2E. |
| AC-P2-22–23, AC-P2-25 | Not executed in Test agent session; rely on Builder validation or Validator re-run. |
| AC-P2-24 (full suite) | Seven failures in unrelated suites (see Commands). |

---

## Test stability notes

- **Browser project** requires Playwright Chromium (`npx playwright install chromium`).
- **Hover-open:** Tests use `button.hover()` on built-in triggers; depends on bits-ui `openOnHover` + `openDelay` (100 ms). No arbitrary `setTimeout`; `expect.poll` used for portaled fieldset.
- **Portaled content:** `id="skills-chart-options"` asserted in **source**; browser tests use visible pane headings (`Tech Stacks`, `Skill Domains`).
- **AC-P2-06:** Assumes seed `skillRecords` — Angular stack includes `typescript` + `angular`, excludes `react`-only rows.

---

## Commands to run

```bash
# Phase 2 skills-explorer specs only (server + client) — 16 tests
npm test -- src/lib/ui/skills-explorer

# Persistence + chart data helpers (AC-P2-07 related)
npm test -- --project server src/lib/utils/skills-chart-data.spec.ts src/lib/utils/skills-presentation.spec.ts

# Combined in-scope skills gate (30 tests)
npm test -- src/lib/ui/skills-explorer --project server src/lib/utils/skills-chart-data.spec.ts src/lib/utils/skills-presentation.spec.ts

# Full orchestration gate (AC-P2-24)
npm test

# Quality gates (AC-P2-22–23, AC-P2-25) — run before merge if not already verified
npm run lint
npm run check
npm run build
```

### Command results (2026-05-24, Test agent Phase 2)

| Command | Exit | Notes |
| ------- | ---- | ----- |
| `npm test -- src/lib/ui/skills-explorer` | **0** | 2 files, **16** tests passed (~2.5s) |
| `npm test -- --project server src/lib/utils/skills-chart-data.spec.ts src/lib/utils/skills-presentation.spec.ts` | **0** | 2 files, **14** tests passed |
| `npm test` (full) | **1** | **113** passed, **7** failed, **1** skipped suite — failures **unrelated** to skills-explorer |

**Skills-explorer suite breakdown**

| File | Project | Tests |
| ---- | ------- | ----- |
| `skills-explorer-split.source.spec.ts` | server | 12 |
| `ResumeSkillsChartOptionsPopover.svelte.spec.ts` | client | 4 |
| **Total** | | **16** |

**Full `npm test` failures (out of scope)**

- `src/tests/layout-chat-keyboard.source.spec.ts` (3)
- `src/lib/content/projects.spec.ts` (3)
- `src/routes/portfolio/portfolio-slug-route-load.spec.ts` (1)
- `src/tests/chat-sidebar-layout.svelte.spec.ts` — import error (`virtual:env/dynamic/public`)

---

## Handoff

- **Validator:** Phase 2 ADR compliance, manual AC-P2-08–09 on `/resume`, confirm lint/check/build if not re-run.
- **Orchestrator:** Set `current_agent` to `validator`. AC-P2-24 full-suite FAIL is pre-existing debt unless gate is scoped to in-scope specs.
