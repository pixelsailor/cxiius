# Test report — portfolio-slug-keyboard-nav

## Coverage map

| AC ID | Test file | Test name(s) |
|-------|-----------|----------------|
| **AC-01** | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `exports prerender true (AC-01)` |
| **AC-02** | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `load returns serialisable data including prevSlug and nextSlug (AC-02)` |
| **AC-03** | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `returns matching prevSlug and nextSlug from getDesignPortfolio order (AC-03)` |
| **AC-04** | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `returns null entry and null neighbors for unknown slug (AC-04)` |
| **AC-05** | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `wraps first to last and last to first using real portfolio order (AC-05, AC-12)` |
| **AC-06** | — | See **Uncovered criteria** |
| **AC-07** | `src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts` | `does not call goto for ArrowLeft/ArrowRight when entry is null (AC-07)` |
| **AC-08** | `src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts` | `ArrowLeft calls goto with resolved prev portfolio path (AC-08)` |
| **AC-09** | `src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts` | `ArrowRight calls goto with resolved next portfolio path (AC-09)` |
| **AC-10** | `src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts` | `does not navigate from input focus (AC-10)`; `does not navigate from textarea or select focus (AC-10)` |
| **AC-11** | `src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts` | `does not navigate when contenteditable is focused (AC-11)` |
| **AC-12** | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `wraps first to last and last to first using real portfolio order (AC-05, AC-12)` (spec imports `load` and `prerender` from `./[slug]/+page.js`; wrap proved on real `getDesignPortfolio()` order) |
| **AC-13** | `src/lib/utils/portfolio-neighbors.spec.ts` | `returns wrapped neighbors for a middle entry`; `wraps previous from first to last`; `wraps next from last to first`; `uses the same slug for prev and next when the list has one entry`; `returns null when currentSlug is missing` |
| **AC-14** | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `does not use +page.server.ts for this route (AC-14)` |

## Uncovered criteria

- **AC-06:** No automated test asserts that the portfolio detail page adds no new visible text, icons, or controls advertising or hinting at arrow-key navigation. That requirement is a progressive-enhancement / copy-and-markup contract; covering it would need explicit DOM or snapshot assertions (or manual/visual QA), which are not present in the current suite.

## Test stability notes

- **AC-02 nuance:** The named test asserts that every top-level value on the returned `load` data is not a `Promise`. It does not spy on `getDesignPortfolio` to prove it is awaited exactly once per `load` invocation; that part of AC-02 is enforced by implementation review rather than instrumentation.
- **Browser component tests:** `portfolio-slug-page.svelte.spec.ts` uses `vitest-browser-svelte` with synchronous `keydown` dispatch after `render`. No `waitFor` or arbitrary timers are used; risk of flakiness is low unless the harness or component timing changes.

## Commands to run

```bash
npm run test
```
