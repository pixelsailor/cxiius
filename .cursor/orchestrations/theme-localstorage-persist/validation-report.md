## Verdict
PASS_WITH_NOTES

## AC audit
AC-01: ✅ met — `handleThemeChange` persists selected index via `persistThemeIndex(i)` after applying theme. `persistThemeIndex` clamps and writes `THEME_STORAGE_KEY` (`cxii.themeIndex`) as a string.  
Evidence: `src/routes/+layout.svelte:42-47` and `src/lib/utils/theme.ts:5-55`

AC-02: ⚠️ partial — `onMount` restores the stored index into `activeThemeIndex` and calls `applyTheme(stored)`, which should drive the slider through its `bind:value={activeThemeIndex}`. However, there is no automated integration/e2e test simulating a full reload and asserting slider value/UI state.  
Evidence: `src/routes/+layout.svelte:53-60` + `src/routes/+layout.svelte:122-133` + `src/lib/utils/theme.ts:28-43`; test coverage gap noted in `test-report.md` (no simulated reload)

AC-03: ⚠️ partial — `applyTheme` maps index `0` to removing `data-theme` and indices `1..4` to `data-theme` values `light|stone|twilight|dark`. Layout also calls `applyTheme(stored)` on restore. No automated test verifies the end-to-end “saved index -> reload -> document matches” path.  
Evidence: `src/lib/utils/theme.ts:57-64` (mapping) and `src/routes/+layout.svelte:56-59` (restoration). Unit tests cover `applyTheme` mapping (`theme.spec.ts` `describe('applyTheme', ...)`), but not reload integration (`test-report.md` uncovered note).

AC-04: ⚠️ partial — If there is no stored value, `readStoredThemeIndex()` returns `null` and layout leaves `activeThemeIndex` at its initial `$state(0)` value. Layout does not explicitly call `applyTheme(0)` in the “no stored value” case, so correctness depends on the existing baseline HTML/CSS having `data-theme` absent for system mode. No test verifies the document attribute after “missing key” through full client init.  
Evidence: `src/lib/utils/theme.ts:28-35` (missing returns `null`) and `src/routes/+layout.svelte:40` + `src/routes/+layout.svelte:56-59` (only apply on non-null).

AC-05: ✅ met — Invalid stored values are handled deterministically without throwing: non-numeric values cause `readStoredThemeIndex()` to remove the key and return `null`; whitespace/empty also return `null`. Layout then keeps initial theme index `0`. Unit tests cover these behaviors.  
Evidence: `src/lib/utils/theme.ts:35-39` + `src/lib/utils/theme.ts:28-44` and `theme.spec.ts` tests `read returns null for empty or whitespace-only value` and `read returns null for non-numeric value and removes the key`.

AC-06: ✅ met — Single constant `THEME_STORAGE_KEY = 'cxii.themeIndex'` is used for both reads and writes.  
Evidence: `src/lib/utils/theme.ts:5-7` and `src/lib/utils/theme.ts:31` and `src/lib/utils/theme.ts:51`; test `THEME_STORAGE_KEY is the documented localStorage key` in `theme.spec.ts`.

AC-07: ✅ met — localStorage is only accessed when `window` exists (browser guard inside `canUseLocalStorage()`), and the restore/persist entry points are client-side (`onMount` and user handler).  
Evidence: `src/lib/utils/theme.ts:14-21` and `src/lib/utils/theme.ts:28-43` and `src/lib/utils/theme.ts:46-55`; `src/routes/+layout.svelte:53-60`

AC-08: ✅ met — Theme preference state remains local `$state` in `+layout.svelte` (`let activeThemeIndex = $state(0);`) with no new Svelte stores added for theme.  
Evidence: `src/routes/+layout.svelte:40-47`; no `src/lib/stores/**/*theme*` or theme store files found via repo search.

AC-09: ✅ met — `theme.spec.ts` covers `readStoredThemeIndex` and `persistThemeIndex` with mocked `localStorage`/`window` for valid/missing/invalid paths (including SSR `window` undefined) and clamps on write.  
Evidence: `src/lib/utils/theme.spec.ts` `describe('readStoredThemeIndex / persistThemeIndex', ...)` including:
  - `read returns null for missing key`
  - `read returns null for empty or whitespace-only value`
  - `read returns clamped index for valid decimal strings`
  - `read returns null for non-numeric value and removes the key`
  - `persist writes clamped string under THEME_STORAGE_KEY`
  - `persist is a no-op when window is undefined`

AC-10: ✅ met — Process verification: `npm run check` and `npm run test` passed per Builder’s build-log/test-report.  
Evidence: `build-log.md:31-33`

## ADR compliance
ADR-001 (Project File and Folder Structure): ✅ met — Theme persistence utilities are implemented as client-safe helpers in `src/lib/utils/theme.ts` (no `$lib/server/*` usage).  
Evidence: `src/lib/utils/theme.ts` (no server imports) and usage from `src/routes/+layout.svelte`.

ADR-003 (Progressive Enhancement and No-JS Baseline): ✅ met — The theme switcher UI is gated behind JS enablement (`{#if isJsEnabled}`) and restore/persistence occurs in `onMount` / user handler, so no-JS users keep the existing HTML/CSS baseline.  
Evidence: `src/routes/+layout.svelte:105-140` and `src/routes/+layout.svelte:53-60`

ADR-004 (Semantic HTML and Accessibility Standards): ✅ met — Landmark structure (`<header>`, `<main>`, `<footer>`) remains present; only the header controls are gated.  
Evidence: `src/routes/+layout.svelte:88-149` and conditional block `src/routes/+layout.svelte:105-140`

ADR-006 (Type and Schema Conventions): ✅ met — The implementation uses plain TypeScript and internal validation helpers (`clampThemeIndex`) and introduces no Zod/network-boundary schemas.  
Evidence: `src/lib/utils/theme.ts` (no zod imports; TS-only helpers)

ADR-007 (State Management Conventions): ✅ met — `activeThemeIndex` is local component `$state`, and persistence/restore uses plain functions rather than adding new stores or `$effect` state loops.  
Evidence: `src/routes/+layout.svelte:40-47` and `src/lib/utils/theme.ts` (no Svelte stores/runes)

## Regressions
No direct regressions detected from the reviewed changes. The only broader change referenced in `build-log.md` was an unrelated typing narrowing in `src/lib/content/design-portfolio.spec.ts` to satisfy `npm run check`; theme functionality boundaries appear contained to `theme.ts` and `+layout.svelte`.

## Required remediations
N/A

## Recommended remediations
1. Add an integration/e2e test for `AC-02`/`AC-03` that simulates: set slider -> verify `localStorage` -> reload -> assert `activeThemeIndex`/slider value and `document.documentElement.dataset.theme` (or its absence for system).
2. Make the “missing key” restore path explicitly deterministic by calling `applyTheme(0)` when `readStoredThemeIndex()` returns `null`, or add a unit test that verifies the document attribute state after “missing key” through a client-init scenario.
