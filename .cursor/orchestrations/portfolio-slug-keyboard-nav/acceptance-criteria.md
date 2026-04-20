# Acceptance Criteria — portfolio-slug-keyboard-nav

## Data / load (ADR-002)

- [ ] **AC-01:** `src/routes/portfolio/[slug]/+page.ts` exports `prerender === true`.
- [ ] **AC-02:** `load()` awaits `getDesignPortfolio()` once per invocation and returns a plain object whose every top-level value is not a `Promise` (same serializability check pattern as `portfolio-route-load.spec.ts`).
- [ ] **AC-03:** When `params.slug` matches an entry, returned `prevSlug` and `nextSlug` are non-null strings equal to slugs from the sorted list returned by `getDesignPortfolio()`, with `prevSlug` being the slug at index `(i - 1 + n) % n` and `nextSlug` at `(i + 1) % n` where `i` is the index of the current slug and `n` is the list length.
- [ ] **AC-04:** When `params.slug` does not match any entry, `entry` is null and both `prevSlug` and `nextSlug` are null.
- [ ] **AC-05:** For the first entry in `getDesignPortfolio()` order, `prevSlug` equals the slug of the last entry in that order; for the last entry, `nextSlug` equals the slug of the first entry (wrap verified by assertions on real data or deterministic slug list from the same getter).

## Progressive enhancement (ADR-003)

- [ ] **AC-06:** No new visible text, icons, or controls are added to advertise or hint at arrow-key navigation on the portfolio detail page.

## Client behavior (ADR-007)

- [ ] **AC-07:** Keyboard navigation runs only when `data.entry !== null` (no navigation triggered for the “not found” stub state via this feature’s handler).
- [ ] **AC-08:** With `data.entry !== null`, simulating `keydown` for `ArrowLeft` navigates to `/portfolio/<data.prevSlug>` (respecting app base path if configured — use the same resolution approach as the implementation, verifiable via unit test with mocked `goto` or browser project test if implemented).
- [ ] **AC-09:** With `data.entry !== null`, simulating `keydown` for `ArrowRight` navigates to `/portfolio/<data.nextSlug>`.
- [ ] **AC-10:** When `document.activeElement` is an `input`, `textarea`, or `select`, ArrowLeft / ArrowRight do not trigger portfolio navigation (handler returns without calling `goto` / equivalent).
- [ ] **AC-11:** When `document.activeElement` has `contenteditable` true, ArrowLeft / ArrowRight do not trigger portfolio navigation.

## Automated tests

- [ ] **AC-12:** A server-environment spec file co-located with the slug route imports `load` (and `prerender` if asserted) from `./+page.js` and contains at least one test that proves wrap behavior using loaded data from `getDesignPortfolio()` or explicit slug expectations derived from it.
- [ ] **AC-13:** If a pure util `getNeighborSlugs` (or equivalent) exists, unit tests cover: middle entry, first entry wrap, last entry wrap, single-entry list (prev and next both that slug), and missing `currentSlug` returning null.

## Architectural

- [ ] **AC-14:** The slug route does not add `+page.server.ts` for this feature.
