# Validation Report — skills-explorer-split-popover-chart

**Validator:** fresh-context audit (2026-05-24)  
**Inputs:** `plan.md`, `acceptance-criteria.md`, `architecture-constraints.md`, `build-log.md`, `test-report.md`, implementation under `src/lib/ui/skills-explorer/` and `src/routes/resume/+page.svelte`.

---

## 1. Verdict

**PASS_WITH_NOTES**

The split refactor meets functional, architectural, accessibility, and in-scope quality gates. **AC-21** (`npm test` exit 0 for the full repo) is not satisfied due to **pre-existing** unrelated failures; in-scope skills specs (29/29 per Test) pass. Resume page button **label copy** changed vs `build-log.md` (“Prettier only”) — behavior and props unchanged.

---

## 2. AC audit

| AC | Status | Evidence |
| --- | --- | --- |
| **AC-01** | ✅ met | `ResumeSkillsChart.svelte` — canvas at 107–108; no `Popover` import or `skills-explorer-pane` markup. Source: `skills-explorer-split.source.spec.ts` AC-01. |
| **AC-02** | ✅ met | `ResumeSkillsChartOptionsPopover.svelte` — `import { Popover } from 'bits-ui'` (2); panes 150–234; no `chart.js` / `<canvas>`. Source spec AC-02. |
| **AC-03** | ✅ met | `ResumeSkillsExplorer.svelte` — composes `<ResumeSkillsChartOptionsPopover>` (80–88) + `<ResumeSkillsChart>` (89–95); no pane/canvas blocks in markup. Source spec AC-03. |
| **AC-04** | ✅ met | Shared `SvelteSet`: popover `toggleSkillInclusion` / `toggleCategoryInclusion` (64–93); chart `$effect` reads `includedSkillIds.size` and calls `repaintChart()` (81–87). Browser: `ResumeSkillsChartOptionsPopover.svelte.spec.ts` AC-04 (checkbox mutates Set). Chart repaint path is code-linked, not Chart.js-asserted. |
| **AC-05** | ✅ met | `activateSkillStack` clears Set and adds stack skills (`ResumeSkillsChartOptionsPopover.svelte:105–111`); chart repaints via same `$effect` as AC-04. No dedicated stack-radio spec (Test gap); logic preserved from monolith pattern. |
| **AC-06** | ✅ met | Composer `onMount` → `hydrateIncludedSkillIds` (`ResumeSkillsExplorer.svelte:40–49`); `$effect` → `writeIncludedSkillIds` (53–59). `skills-presentation.spec.ts` round-trip. |
| **AC-07** | ✅ met | `+page.svelte:102–118` — `onpointerenter` sets `chartOptionsOpen = true` and `chartOptionsPane` (`skillStacks` / `domains`); `bind:open` / `selectedPane` on explorer (136–138). **Note:** button visible text changed to “Tech stacks” / “Skills by domain” (97–121); open/pane wiring unchanged. |
| **AC-08** | ✅ met | Anchor `bind:this={chartOptionsAnchorEl}` (`+page.svelte:125–127`); `customAnchor` forwarded composer → popover → `Popover.Content customAnchor={customAnchor ?? undefined}` (`ResumeSkillsExplorer.svelte:87`, `ResumeSkillsChartOptionsPopover.svelte:148`). Visual alignment not E2E-asserted. |
| **AC-09** | ✅ met | `onChartReady?.(true)` after first paint (`ResumeSkillsChart.svelte:60–63`); forwarded composer (`ResumeSkillsExplorer.svelte:94`); page sets `skillsExplorerMounted` and `data-explorer-ready` (`+page.svelte:128–135`). No Chart.js mock spec. |
| **AC-10** | ✅ met | Single `new SvelteSet<string>()` in composer (38); hydrate/persist only in composer (40–59); chart/popover source lack `hydrate`/`write` helpers. Source spec AC-10. |
| **AC-11** | ✅ met | `Popover.Root` / `Trigger` / `Portal` / `Content` (`ResumeSkillsChartOptionsPopover.svelte:136–236`). Source + browser specs AC-11. |
| **AC-12** | ✅ met | `open = $bindable(false)` (43); `<Popover.Root bind:open>` (136); `customAnchor` on Content (148). Source spec AC-12. |
| **AC-13** | ✅ met | `trigger?: Snippet` (35); `{@render trigger()}` (138–139); default sr-only button (141); `@component` documents interim/future (114–133). Source spec AC-13. |
| **AC-14** | ✅ met | Composer props: `skillRecords`, `skillCategories`, `skillStacks`, `open = $bindable`, `selectedPane`, `customAnchor`, `onChartReady` (`ResumeSkillsExplorer.svelte:11–33`). Page usage unchanged (`+page.svelte:129–139`). `src/lib/ui/index.ts` still does not export chart/popover (plan default). |
| **AC-15** | ✅ met | Changes confined to CXII repo; `git status` / build-log: no `sunrise2-ui` edits. Process assertion only. |
| **AC-16** | ✅ met | No new deps in `package.json` (diff clean); no `writable()` / `$lib/stores` in skills-explorer grep. |
| **AC-17** | ✅ met | Page `aria-controls="skills-chart-options"` + `aria-expanded` (`+page.svelte:100–114`); content `id="skills-chart-options"` (`ResumeSkillsChartOptionsPopover.svelte:146`). Source spec AC-17. |
| **AC-18** | ✅ met | `fieldset` / sr-only `legend` / radios (213–231); domain checkboxes + `use:categoryCheckboxState` (165–171). Source + browser AC-18. |
| **AC-19** | ✅ met | `npm run lint` exit 0 (Validator 2026-05-24). |
| **AC-20** | ✅ met | `npm run check` exit 0 (Validator 2026-05-24). |
| **AC-21** | ⚠️ partial | **Full** `npm test`: exit **1** (7 failed, 112 passed, 1 skipped) — failures in `layout-chat-keyboard.source.spec.ts`, `projects.spec.ts`, `portfolio-slug-route-load.spec.ts`, `chat-sidebar-layout.svelte.spec.ts` (import/env); **not** skills-explorer. **In-scope:** server skills specs 26/26 pass; Test reports 29/29 skills-related with client popover spec when Chromium installed. |
| **AC-22** | ✅ met | `npm run build` exit 0 per `test-report.md` (not re-run by Validator; build-log agrees). |
| **AC-23** | ✅ met | `<noscript>` static `skills-chart` block present (`+page.svelte:168+`). Source spec AC-23. |
| **AC-24** | ✅ met | `ResumeSkillsBaseline.svelte` — no chart/popover/bits-ui imports. Source spec AC-24. |

---

## 3. ADR compliance

| ADR | Status | Evidence |
| --- | --- | --- |
| **ADR-001** | ✅ | New files `ResumeSkillsChart.svelte`, `ResumeSkillsChartOptionsPopover.svelte` under `src/lib/ui/skills-explorer/`; PascalCase; `index.ts` exports (4–6). No server/API changes. |
| **ADR-004** | ✅ | Chart `role="img"` + dynamic `aria-label` (`ResumeSkillsChart.svelte:106–107`). Page buttons keep `aria-expanded` / `aria-controls`. Popover panes: `h4`, `fieldset`/`legend`, labeled checkboxes/radios, `categoryCheckboxState` indeterminate action (95–103, 213–231). Interim Trigger: `sr-only`, `tabindex="-1"`, `aria-hidden="true"` (141). Popover hover uses short CSS transition (297) — same class of motion as pre-split; no new load-bearing animation. |
| **ADR-007** | ✅ | Runes throughout (`$props`, `$bindable`, `$state`, `$derived`, `$effect`); `SvelteSet` for inclusion; persistence `$effect` in composer only; no `writable` / `export let` / `$:` in skills-explorer. Documented deviation: `inclusionHydrated` prop on chart (`build-log.md`, `ResumeSkillsChart.svelte:18`, `ResumeSkillsExplorer.svelte:93`). |
| **ADR-011** | ✅ | Raw `bits-ui` `Popover` (not `$lib/ui/popover/Popover.svelte`); required `Popover.Trigger` inside `Popover.Root` even with `customAnchor` on Content (136–148). Optional `trigger` snippet for future migration. |

---

## 4. Regressions

| Area | Assessment |
| --- | --- |
| **Skills split / wiring** | No structural regression found. Chart and popover are separated; composer owns Set + persistence; page API props stable. |
| **Resume button labels** | User-visible copy changed (“Tech stack options” → “Tech stacks”, “Show chart options” → “Skills by domain”). Not listed in plan functional ACs; aligns with plan examples. `build-log.md` understates this as “Prettier only.” |
| **Full test suite** | Pre-existing failures unrelated to skills-explorer (see AC-21). Risk: CI gate may block merge if it runs full `npm test`. |
| **Hydration race** | `inclusionHydrated` gates chart paint until composer `onMount` hydrate — intentional deviation; reduces empty-set flash vs monolith. |

---

## 5. Required remediations

**N/A** (verdict is not **FAIL**).

For orchestration / human gate on **AC-21** only (prerequisite fixes — **do not** assign to this task’s Builder):

1. Repair `src/tests/layout-chat-keyboard.source.spec.ts` expectations vs current `+layout.svelte`.
2. Repair `src/lib/content/projects.spec.ts` and `src/routes/portfolio/portfolio-slug-route-load.spec.ts` for `whats-for-dinner` / portfolio slug expectations.
3. Fix `src/tests/chat-sidebar-layout.svelte.spec.ts` suite import (`virtual:env/dynamic/public`) or skip policy.

---

## 6. Recommended remediations

1. **Correct `build-log.md`** — resume `+page.svelte` includes button label changes, not formatting-only.
2. **AC-05 / AC-09 tests** — optional browser or Chart.js-mocked spec for stack replacement and `onChartReady` / `data-explorer-ready`.
3. **AC-04 integration** — optional composer-level test mounting chart + popover with mocked `repaintChart` or dataset assertion after toggle.
4. **Plan contract** — add `inclusionHydrated` to documented `ResumeSkillsChart` props in `plan.md` if kept long-term.
5. **Manual smoke** — `/resume`: hover header buttons (panes), toggle domain skill (chart updates), select stack (inclusion replace), reload (persistence), confirm popover anchors over chart.

---

## 7. Structure verification (independent)

| Check | Result |
| --- | --- |
| Chart vs popover separation | **Pass** — chart: Chart.js + canvas only; popover: bits-ui + panes only. |
| `Popover.Trigger` present | **Pass** — `ResumeSkillsChartOptionsPopover.svelte:137–143` (snippet or sr-only default). |
| Composer owns persistence | **Pass** — hydrate `onMount`, `writeIncludedSkillIds` in `$effect`; chart/popover share Set reference. |
| Page API unchanged | **Pass** — same props/bindings; cosmetic button label copy only. |

---

## 8. Handoff

- **Orchestrator:** **PASS_WITH_NOTES** — proceed to human approval; treat **AC-21** full-suite as repo prerequisite debt unless CI scopes tests.
- **Builder:** No mandatory code changes from Validator.

---

# Phase 2 — Page compose & popover-owned state

**Validator:** re-validation after Builder remediation (2026-05-24)  
**Prior audit:** FAIL (2026-05-24) — AC-P2-01 only blocker (orphan composer on disk).  
**Scope:** Phase 2 per `plan.md`, `acceptance-criteria.md` (AC-P2-*), `architecture-constraints.md` (Phase 2), `build-log.md` (remediation §), `test-report.md` (Phase 2).

---

## 1. Verdict (Phase 2)

**PASS_WITH_NOTES**

Remediation satisfied **AC-P2-01**: `ResumeSkillsExplorer.svelte` is **absent** on disk (`Test-Path` false; `existsSync` in source spec). Page compose, popover-owned state, barrels, and in-scope specs (16/16 skills-explorer per `test-report.md`) match Phase 2 intent. **AC-P2-24** full-repo `npm test` still fails on **pre-existing** unrelated suites (same debt as Phase 1 AC-21); in-scope gate passes.

---

## 2. AC audit (Phase 2)

| AC | Status | Evidence |
| --- | --- | --- |
| **AC-P2-01** | ✅ met | `ResumeSkillsExplorer.svelte` **deleted** — `Test-Path` false (Validator re-run); `skills-explorer-split.source.spec.ts:36–37` `expect(existsSync(explorerComponentPath)).toBe(false)`; no imports in `+page.svelte` or barrels (grep clean). Re-validation: source spec **12/12 pass**. |
| **AC-P2-02** | ✅ met | `+page.svelte:97–118` — `ResumeSkillsChartOptionsPopover` in header, `ResumeSkillsChart` in shell; no explorer. |
| **AC-P2-03** | ✅ met | `ResumeSkillsChartOptionsPopover.svelte:157–185` — `Popover.Trigger` + `{#snippet child({ props })}` + two buttons (“Tech stacks”, “Skills by domain”). Browser: `ResumeSkillsChartOptionsPopover.svelte.spec.ts` AC-P2-03. |
| **AC-P2-04** | ✅ met | Popover internal `selectedPane` on trigger hover (`ResumeSkillsChartOptionsPopover.svelte`); browser spec hovers both triggers → “Tech Stacks” and “Skill Domains” (`test-report.md` AC-P2-04). |
| **AC-P2-05** | ✅ met | `toggleSkillInclusion` / `toggleCategoryInclusion` (`87–116`); chart `$effect` on `includedSkillIds.size` (`ResumeSkillsChart.svelte:81–87`). Browser: checkbox mutates shared Set (`79–99`; test title mislabels as AC-P2-05). Chart repaint not Chart.js-asserted. |
| **AC-P2-06** | ✅ met | `activateSkillStack` (`128–134`); chart repaints via shared Set + `$effect`. No stack-radio browser spec (same gap class as Phase 1 AC-05). |
| **AC-P2-07** | ✅ met | `onMount` → `hydrateIncludedSkillIds` (`62–72`); `$effect` → `writeIncludedSkillIds` (`75–81`). `skills-presentation.spec.ts` (existing util suite per `build-log.md`). |
| **AC-P2-08** | ✅ met | Page `chartOptionsAnchorEl` + `skills-explorer-anchor` (`+page.svelte:106–108`); `customAnchor={chartOptionsAnchorEl}` (`101`); `Popover.Content customAnchor={customAnchor ?? undefined}` (`191`). Visual alignment not E2E-asserted. |
| **AC-P2-09** | ✅ met | `onChartReady?.(true)` after first paint (`ResumeSkillsChart.svelte:60–63`); page `skillsExplorerMounted` / `data-explorer-ready` (`109–117`). No Chart.js mock spec. |
| **AC-P2-10** | ✅ met | Popover owns Set default + hydrate/persist (`44–45`, `62–81`); chart/page lack `hydrate`/`write`. Source: `skills-explorer-split.source.spec.ts` AC-P2-10. |
| **AC-P2-11** | ✅ met | Page: no `chartOptionsOpen` / `chartOptionsPane` / external `button-group` (grep clean). Bridge: `bind:includedSkillIds`, `bind:inclusionHydrated` (`+page.svelte:22–23`, `102–103`). |
| **AC-P2-12** | ✅ met | `openOnHover` + `openDelay` / `closeDelay` (`157`, `24–25`, `POPOVER_*_MS`); internal `popoverOpen` (`48`, `156`); no page `bind:open`. Source spec AC-P2-11/12. |
| **AC-P2-13** | ✅ met | `import { Popover, mergeProps } from 'bits-ui'` (`3`); no `$lib/ui/popover/Popover.svelte` import in skills-explorer. |
| **AC-P2-14** | ✅ met | `mergeProps(props, { class: 'button-group' })` on wrapper (`159`); two `type="button"` elements inside snippet (`160–183`). Source spec AC-P2-03/14. |
| **AC-P2-15** | ✅ met | `customAnchor={customAnchor ?? undefined}` on Content (`191`); page anchor div retained (`106–108`). |
| **AC-P2-16** | ✅ met | `let selectedPane = $state<ChartOptionsPane>` (`49`); not a page prop; no `$bindable` for pane. Source spec AC-P2-15/16. |
| **AC-P2-17** | ✅ met | `skills-explorer/index.ts` exports chart, popover, baseline only (`4–6`); `lib/ui/index.ts:7` exports chart + popover, not explorer. |
| **AC-P2-18** | ✅ met | No new deps / no `$lib/stores` in skills-explorer (source review; `package.json` unchanged per build-log). |
| **AC-P2-19** | ✅ met | Trigger buttons: `aria-controls="skills-chart-options"`, `aria-expanded={popoverOpen}` (`163–164`, `175–176`); content `id="skills-chart-options"` (`189`). Source + browser specs. |
| **AC-P2-20** | ✅ met | `fieldset` / sr-only `legend` / radios (`256–275`); domain checkboxes + `categoryCheckboxState` (`218–224`). Source + browser specs. |
| **AC-P2-21** | ✅ met | Specs updated: no composer/page `bind:open`/sr-only trigger assertions (`skills-explorer-split.source.spec.ts:57–66`). Validator re-ran server source spec: **11/11 pass**. |
| **AC-P2-22** | ✅ met | `npm run lint` exit 0 per `build-log.md` Phase 2 validation. |
| **AC-P2-23** | ✅ met | `npm run check` exit 0 per `build-log.md`. |
| **AC-P2-24** | ⚠️ partial | **In-scope** `npm test -- src/lib/ui/skills-explorer`: **16/16 pass** per `test-report.md` + remediation re-run (source 12/12). **Full** `npm test`: exit **1** (7 failed, unrelated — layout, projects, portfolio, chat-sidebar env). |
| **AC-P2-25** | ✅ met | `npm run build` exit 0 per `build-log.md`. |
| **AC-P2-26** | ✅ met | `<noscript>` static skills chart (`+page.svelte:147+`). Source spec AC-P2-26. |
| **AC-P2-27** | ✅ met | `ResumeSkillsBaseline.svelte` — no chart/popover/bits-ui imports. Source spec AC-P2-27. |

---

## 3. ADR compliance (Phase 2)

| ADR | Status | Evidence |
| --- | --- | --- |
| **ADR-001** | ✅ | Chart/popover under `src/lib/ui/skills-explorer/`; barrels updated; composer **removed** (AC-P2-01). |
| **ADR-004** | ✅ | Trigger buttons carry `aria-controls` / `aria-expanded`; chart `role="img"` + dynamic label (`ResumeSkillsChart.svelte`); panes retain semantic structure (popover `193–277`). |
| **ADR-007** | ✅ | Runes throughout; `SvelteSet` + `$state.raw` page bridge (`+page.svelte:22`); persistence `$effect` in popover only; no Svelte 4 stores. |
| **ADR-011** | ✅ | Raw `bits-ui` `Popover` + `mergeProps`; `Popover.Trigger` with `openOnHover` and delays; `customAnchor` on Content; child snippet pattern. |

**Phase 2 architecture-constraints:** Prior orphan-composer breach **resolved** (file deleted; `build-log.md` remediation § documents post-fix status).

---

## 4. Regressions (Phase 2)

| Area | Assessment |
| --- | --- |
| **Dead composer file** | **Resolved** — explorer removed; no stale import surface. |
| **Hover UX** | `openDelay={100}` / `closeDelay={300}` per `build-log.md`; not manually validated on `/resume`. |
| **Full test suite** | Unrelated failures still block repo-wide `npm test` (see Phase 1 AC-21 list). |
| **build-log accuracy** | Remediation § records deletion; aligns with disk after fix. |

---

## 5. Required remediations (Phase 2)

**N/A** (verdict is not **FAIL**).

Prior FAIL items **verified fixed:**

1. ~~Delete `ResumeSkillsExplorer.svelte`~~ — **Done** (`Test-Path` false; `existsSync` in AC-P2-01 spec).
2. ~~Correct `build-log.md`~~ — **Done** — remediation subsection in `build-log.md` (lines 66–76).
3. ~~Extend AC-P2-01 spec for file absence~~ — **Done** — `skills-explorer-split.source.spec.ts:37`.

For orchestration / human gate on **AC-P2-24** full-suite only: same prerequisite fixes as Phase 1 §5 (unrelated suites).

---

## 6. Recommended remediations (Phase 2)

1. ~~Add browser spec: hover “Skills by domain”~~ — **Addressed** per `test-report.md` AC-P2-04.
2. Add browser or integration spec for stack radio → `activateSkillStack` replaces Set (AC-P2-06) — **partially addressed** (`test-report.md` AC-P2-06 browser test exists; Chart.js repaint still not asserted).
3. Append **Phase 2** section to `test-report.md` with AC-P2 coverage map (mirror Phase 1).
4. Manual smoke on `/resume`: hover both triggers, toggle inclusion, select stack, reload persistence, confirm anchor overlay.

---

## 7. Structure verification (Phase 2 — independent)

| Check | Result |
| --- | --- |
| Page uses chart + popover directly, no `ResumeSkillsExplorer` import | **Pass** — `+page.svelte:8–9`, `97–118`. |
| No page `chartOptionsOpen` / `chartOptionsPane` / button-group | **Pass** — only `chartOptionsAnchorEl` remains (`20`, `106`). |
| Popover: Trigger child snippet, two buttons, `openOnHover`, `customAnchor`, owns `includedSkillIds` | **Pass** — `ResumeSkillsChartOptionsPopover.svelte:44–81`, `156–191`. |
| `ResumeSkillsExplorer` deleted | **Pass** — file absent; AC-P2-01 spec + `Test-Path` confirm. |

---

## 8. Handoff (Phase 2)

- **Orchestrator:** **PASS_WITH_NOTES** — proceed to human approval; treat **AC-P2-24** full-suite as repo prerequisite debt unless CI scopes tests.
- **Builder:** No mandatory code changes from Validator (remediation complete).
- **Human approval:** Phase 2 unblocked; optional manual smoke on `/resume` (hover triggers, inclusion, persistence).
