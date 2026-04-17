# Test report — cxii-theme-five-options

## Coverage map

| AC ID | Test file | Test name(s) | Notes |
| ----- | --------- | ------------ | ----- |
| AC-01 | `src/lib/utils/theme.spec.ts` | `applyTheme > sets data-theme to light, stone, twilight, dark for indices 1 to 4`, `applyTheme > clears data-theme for index 0 (system)` | Covers DOM contract for `applyTheme`; Slider integration is manual. |
| AC-02 | `src/lib/utils/theme.spec.ts` | `clampThemeIndex > rounds and clamps to 0 through 4` | |
| AC-03 | — | — | **Uncovered** — requires visual or computed-style snapshot against baseline; documented under Uncovered criteria. |
| AC-04 | — | — | **Uncovered** — explicit light token parity vs `:root`; code review in Validator. |
| AC-05 | — | — | **Uncovered** — explicit dark parity vs former media block; code review in Validator. |
| AC-06 | — | — | **Uncovered** — qualitative distinct palettes; manual/visual. |
| AC-07 | — | — | **Uncovered** — depends on cascade + OS; code review (`:root:not([data-theme])` + attribute selectors). |
| AC-08 | — | — | **Uncovered** — no `console.log` verified by grep / Validator review of `+layout.svelte`. |
| AC-09 | `src/lib/utils/theme.spec.ts` | `applyTheme` tests | `applyTheme` lives in `$lib/utils/theme.ts`; no new theme store. |
| AC-10 | — | — | **Uncovered** — Svelte 5 runes in layout; `npm run check` + Validator file review. |
| AC-11 | — | — | **Uncovered** — structural/markup review (Validator). |
| AC-12 | — | — | **Uncovered** — no-JS baseline; Validator ADR-003 review. |
| AC-13 | — | — | **Command verification** — `npm run check`, `npm run lint`, `npm run test` executed successfully in this pipeline (see Commands to run). |

## Uncovered criteria

- **AC-03–AC-08, AC-10–AC-12:** Not fully expressed as automated tests. Rationale: CSS cascade, OS `prefers-color-scheme`, layout markup, and absence of logging are verified by static review, `svelte-check`, ESLint, and targeted unit tests for `theme.ts`. Visual or E2E tests would require additional harness (e.g. Playwright scenarios with forced color scheme).

## Test stability notes

- None for `theme.spec.ts` (synchronous, mocked `document`).

## Commands to run

```bash
npm run check
npm run lint
npm run test
```

**Browser (client) Vitest project:** `npm run test` runs the Playwright-backed browser project for `*.svelte.spec.ts`. **Chromium must be installed** (`npx playwright install chromium`) or that project fails at browser launch. After install, full suite passed: 3 files, 5 tests.
