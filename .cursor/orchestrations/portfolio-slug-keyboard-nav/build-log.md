# Build log — portfolio-slug-keyboard-nav

## Files created

- **`src/lib/utils/portfolio-neighbors.ts`** — Pure `getNeighborSlugs` with modulo wrap, null when slug missing; single-entry returns both neighbors as that slug.
- **`src/lib/utils/portfolio-neighbors.spec.ts`** — Node unit tests: middle, first wrap, last wrap, single-entry, missing slug (AC-13).
- **`src/routes/portfolio/portfolio-slug-route-load.spec.ts`** — Imports `load` / `prerender` from `./[slug]/+page.js`; asserts prerender, serialisable `load()` output, neighbors for a middle slug, unknown slug nulls, first/last wrap from real `getDesignPortfolio()` order, and no `+page.server.ts` (AC-01–AC-05, AC-12, AC-14).
- **`src/routes/portfolio/[slug]/bits-ui-button-stub.svelte`** — Test-only stand-in for `bits-ui` `Button.Root` (plain `<a>`) so browser tests can render the not-found stub without Bits UI runtime context. Uses `resolve('/portfolio')` for the link target to satisfy `svelte/no-navigation-without-resolve` and typed `resolve` (avoids `RouteId` casts on a generic `href` string).
- **`src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts`** — Browser (`vitest-browser-svelte`) tests with `vi.mock` for `$app/navigation`, `$app/environment`, `$app/paths`, and partial `bits-ui` (swap `Button.Root` for the stub); asserts ArrowLeft/ArrowRight call `goto` with `/portfolio/<slug>`, stub state does not navigate, input/textarea/select/contenteditable suppress navigation (AC-07–AC-11). Named without a `+` prefix because SvelteKit reserves `+*` under `routes/` during sync.

## Files modified

- **`src/routes/portfolio/[slug]/+page.ts`** — After `getDesignPortfolio()`, maps slugs, uses `getNeighborSlugs` when `entry !== null`, returns `prevSlug` / `nextSlug` else null; single `await` of portfolio list (plan).
- **`src/routes/portfolio/[slug]/+page.svelte`** — Client-only (`browser` from `$app/environment`) window `keydown` via `$effect` with teardown when `data.entry !== null`; editable guard for input, textarea, select, `isContentEditable`; `goto(resolve(portfolioEntryPath(slug)))` where `portfolioEntryPath` returns a `` `/portfolio/${string}` `` typed for SvelteKit `goto`/`resolve` (same behavior as string concat with base-aware `resolve`).

## Deviations from plan

- **Browser spec filename:** Requested `+page.svelte.spec.ts` co-located under `[slug]/`; SvelteKit `sync` rejects non-route files whose names start with `+`. Implemented the same tests in `portfolio-slug-page.svelte.spec.ts` beside `+page.svelte` instead.

## Unresolved open questions

- Plan listed none; none encountered during implementation.

## Known gaps

- Load spec file lives under `src/routes/portfolio/` (next to `portfolio-route-load.spec.ts`) rather than inside `[slug]/`; behavior matches plan import path `./[slug]/+page.js` and AC-12 co-location intent for slug route tests.
- Browser tests partial-mock `bits-ui` only for this spec file’s module graph; other suites are unchanged.
