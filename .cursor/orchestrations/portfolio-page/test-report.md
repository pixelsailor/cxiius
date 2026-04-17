# Test report — portfolio-page

## 1. Coverage map

| AC ID | Description (short) | Automated test(s) |
| ----- | ------------------- | ------------------- |
| AC-01 | No-JS: full HTML shell (hero, filters, grid) | *Uncovered* — see below |
| AC-02 | Real `<a href>` filters; no-JS navigation matches filter | *Partial:* `portfolio-route-load.spec.ts` ("load returns serialisable data…", "invalid type query…"); `portfolio-load.spec.ts` (`parseFilter`, `typeQueryFromPageHref`, `filterEntries`) — **not** DOM/markup |
| AC-03 | Direct load / prerendered HTML per filter URL | *Uncovered* — build output / CI (see build-log Windows note) |
| AC-04 | JS: `replaceState` / `goto` without history push | *Uncovered* — client navigation; manual or browser test |
| AC-05 | Hero: featured override or most recent by circa | `portfolio-load.spec.ts` (`pickHero`); `design-portfolio.spec.ts` ("at most one featuredAsHero") |
| AC-06 | Grid + hero CTA detail links per plan (stub / no 404) | *Uncovered* — markup / route smoke not automated |
| AC-07 | Placeholder images from public HTTPS placeholders | `design-portfolio.spec.ts` ("uses placehold.co URLs…") |
| AC-08 | Design entries in new `$lib/content/` file; `Promise` getter | `design-portfolio.spec.ts` ("returns a Promise of entries") |
| AC-09 | Required fields on each entry | `design-portfolio.spec.ts` ("exposes expected fields…") |
| AC-10 | `INDEX.md` lists domain + getter type | *Uncovered* — documentation file |
| AC-11 | ASCII-only content TS (ESLint rule) | *Uncovered* — enforced by `npm run lint`, not duplicated in Vitest |
| AC-12 | `prerender = true`; async `load`; `url`-based filter; plain `data` | `portfolio-route-load.spec.ts` ("exports prerender true", "load returns serialisable data…") |
| AC-13 | Prerender emits each filter URL as static HTML | *Uncovered* — verify `npm run build` output / POSIX CI per build-log |
| AC-14 | No `+page.server.ts` for portfolio | `portfolio-route-load.spec.ts` ("does not use +page.server.ts…") |
| AC-15 | Single `$lib/server/` module imports `$lib/content` (ADR-008) | *Uncovered* — assembler smoke-tested; full repo rule needs static analysis / Validator |
| AC-16 | Global nav Portfolio link via `resolve()` pattern | *Uncovered* — layout markup |
| AC-17 | One `<h1>`; sensible heading order | *Uncovered* — a11y / markup |
| AC-18 | Visual design (dark, glass, rainbow, green filters, card sheen) | *Uncovered* — manual / visual QA |
| AC-19 | Responsive columns (1 / 3) | *Uncovered* — visual or browser layout test |
| AC-20 | Motion respects `prefers-reduced-motion` | *Uncovered* — CSS / browser |
| AC-21 | Svelte 5 runes; no legacy patterns in new UI | *Uncovered* — review / ESLint where applicable |
| AC-22 | No new global store for filter | *Uncovered* — code review |

### Test file index

| File | Test names (grouped) |
| ---- | --------------------- |
| `src/lib/utils/portfolio-load.spec.ts` | `circaYearFromString` (2); `parseFilter` (3); `typeQueryFromSearch` (4); `typeQueryFromPageHref` (2); `filterEntries` (2); `pickHero` (3) |
| `src/lib/content/design-portfolio.spec.ts` | `getDesignPortfolio` (4) |
| `src/lib/server/system-prompt.service.spec.ts` | `assembleSystemPromptFromSiteContent` (1) |
| `src/routes/portfolio/portfolio-route-load.spec.ts` | `portfolio +page load` (5) |

## 2. Uncovered criteria

| AC | Reason |
| -- | ------ |
| AC-01 | Needs prerendered HTML or browser without JS; not covered by current Vitest node suite. |
| AC-02 (markup) | Unit tests cover the same filter/query logic as `load()`; they do not assert `<a href>` attributes or link text in `+page.svelte`. |
| AC-03 | Static output paths and query variants depend on OS/build (`build-log.md`); assert via build artifact inspection or CI on POSIX. |
| AC-04 | Requires client `goto` / click harness or manual check. |
| AC-06 | Stub `[slug]` route and `resolve()` usage; add component/E2E or manual link checks. |
| AC-10 | Human-maintained `INDEX.md`; optional snapshot or content test if desired later. |
| AC-11 | ESLint `content-ascii/only-ascii` is the authority; `npm run lint`. |
| AC-13 | Same as AC-03; optional script grepping `.svelte-kit/output` after build on Linux/macOS. |
| AC-15 | `system-prompt.service.spec.ts` only checks assembler output; proving "exactly one server importer" needs repo-wide grep or dedicated lint rule. |
| AC-16–AC-22 | UI, CSS, and architecture conventions — manual review, browser tools, or future a11y/E2E tests. |

## 3. Test stability notes

- **Deterministic:** All current tests use pure functions, fixed seed data, or `load()` with `URL` inputs — no `setTimeout`, randomness, or network I/O.
- **Working directory:** The `+page.server.ts` absence check uses `process.cwd()`; it assumes tests run from the repository root (default for `npm run test`).

## 4. Commands to run

```bash
npm run test
```

```bash
npm run check
```

```bash
npm run lint
```

**Implementation note for Validator:** Pure portfolio load helpers were extracted to `src/lib/utils/portfolio-load.ts` and `src/routes/portfolio/+page.ts` imports them, so filter parsing, hero selection, and query parsing are unit-tested without duplicating logic in tests.
