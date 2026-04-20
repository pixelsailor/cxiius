# Plan — portfolio-slug-keyboard-nav

## Objective restatement

The design portfolio detail route exposes serializable previous/next slugs matching `getDesignPortfolio()` order with wrap-around, and with JavaScript enabled only, ArrowLeft / ArrowRight navigate to those routes while ignoring key events when focus is in an editable control, with automated tests proving load-time neighbor targets and wrap behavior.

## Scope boundary

**In scope**

- Extend `src/routes/portfolio/[slug]/+page.ts` `load()` to compute neighbor slugs from the **same ordered array** returned by `await getDesignPortfolio()` (that getter sorts by leading circa year descending per `design-portfolio.ts`).
- Add client-side keyboard handling in `src/routes/portfolio/[slug]/+page.svelte` only when `data.entry !== null`, using Svelte 5 runes and patterns allowed by ADR-007.
- Skip navigation on ArrowLeft / ArrowRight when the active element is an editable field: `input`, `textarea`, `select`, or `HTMLElement` with `contenteditable` (including `contenteditable="true"` / `plaintext-only`).
- Wrap: first entry’s previous slug is the last entry’s slug; last entry’s next slug is the first’s slug.
- No new visible UI, labels, or hints for this feature.
- Automated tests: load tests for the slug route (same spirit as `portfolio-route-load.spec.ts`), asserting `prerender`, serializable `data`, and `prevSlug` / `nextSlug` for representative cases including wrap; optional pure unit tests for extracted neighbor math if a util is introduced.

**Out of scope**

- Changing `getDesignPortfolio()` sort order or content data.
- Adding `<a>` prev/next links or any new affordances in the page markup (baseline remains unchanged; keyboard is enhancement only).
- `+page.server.ts`, KV, or API routes.
- Command palette, layout, or global shortcuts beyond this page.
- Browser E2E / Playwright flows unless the Builder chooses to add them; the plan’s test bar is **load + optional util** as stated in the task objective.

## Component/file map

| File | Action | Purpose |
| --- | --- | --- |
| `src/routes/portfolio/[slug]/+page.ts` | Modify | After resolving `entry` from the sorted list, compute and return `prevSlug` and `nextSlug` (see Interface contracts). Keep `export const prerender = true` and existing `entries()` behavior. |
| `src/routes/portfolio/[slug]/+page.svelte` | Modify | Register client-only key handling when `entry !== null`: on ArrowLeft navigate to `/portfolio/[prevSlug]`, on ArrowRight to `/portfolio/[nextSlug]`, using SvelteKit client navigation (`goto` from `$app/navigation`) with `resolve()` from `$app/paths` for base-aware URLs. Guard editable fields. Clean up listeners if using imperative `addEventListener` (e.g. in `$effect` return). |
| `src/lib/utils/portfolio-neighbors.ts` (optional) | Create | If extracted: pure functions e.g. `getNeighborSlugs(orderedSlugs: string[], currentSlug: string): { prevSlug: string; nextSlug: string } \| null` for index/wrap logic; returns `null` if `currentSlug` not found. |
| `src/routes/portfolio/[slug]/portfolio-slug-route-load.spec.ts` (or `+page.spec.ts` co-located) | Create | Node `load` tests: import `load` / `prerender` from `./+page.js`, call `load` with `params: { slug }` and minimal `RouteParams` / loader context as existing portfolio tests do; assert neighbor slugs and wrap. |
| `src/lib/utils/portfolio-neighbors.spec.ts` (optional) | Create | Unit tests for pure neighbor resolution if `portfolio-neighbors.ts` exists. |

## Interface contracts

### `load()` return shape (extends current fields)

All values must remain JSON-serializable (ADR-002).

```ts
// Conceptual PageData additions (exact names in generated $types after implementation)
{
  // existing: title, slug, entry
  prevSlug: string | null;
  nextSlug: string | null;
}
```

**Semantics**

- `entry === null` (unknown slug): `prevSlug` and `nextSlug` are both `null`.
- `entry !== null`: `prevSlug` and `nextSlug` are non-empty strings, each a valid slug from the sorted portfolio list, with wrap-around as specified. If the list has exactly one entry, `prevSlug` and `nextSlug` both equal that slug.

**Ordering source of truth**

- Neighbors are derived from `const list = await getDesignPortfolio()` order only (do not re-sort differently in the route).

### Keyboard handler (page component)

- **Inputs:** `data.prevSlug`, `data.nextSlug`, `data.entry` (from `$props()`).
- **Behavior:** When `entry === null`, do not attach behavior that navigates via arrows. When `entry !== null`, on `keydown`: if `event.key` is `ArrowLeft` or `ArrowRight`, first check whether navigation should be suppressed (editable target); if not suppressed, `preventDefault()` and `goto(resolve('/portfolio/' + targetSlug))` for the appropriate slug.
- **Editable guard:** Treat as non-navigating when `document.activeElement` is:
  - `HTMLInputElement`, `HTMLTextAreaElement`, `HTMLSelectElement`, or
  - an `HTMLElement` with `isContentEditable === true`.

### Optional pure util

```ts
export function getNeighborSlugs(
  orderedSlugs: readonly string[],
  currentSlug: string
): { prevSlug: string; nextSlug: string } | null;
```

- If `currentSlug` is not in `orderedSlugs`, return `null`.
- Otherwise return wrapped neighbors using modulo indexing on `orderedSlugs.length`.

## ADR references

### ADR-002 — Data fetching patterns

**Implication:** Neighbor slugs must be computed inside `+page.ts` `load()` and returned as plain serializable fields alongside `entry`. Do not defer neighbor resolution to client-fetched data or unresolved promises. Do not use `onMount` to compute navigation targets. Keep `prerender = true`.

### ADR-003 — Progressive enhancement and no-JS baseline

**Implication:** Prev/next via arrow keys is a JavaScript enhancement only. The no-JS experience and HTML output must remain complete without this feature; do not replace or remove link-based navigation elsewhere. Use client-side routing (`goto`) only inside the keyboard handler, not as the only way to move between portfolio entries.

### ADR-007 — State management conventions

**Implication:** Use Svelte 5 runes (`$props`, `$derived`, etc.) and allowed DOM patterns. Do not introduce Svelte 4 stores, `$:`, or `on:` for this feature. If a window-level listener is needed, prefer `$effect` with a teardown that removes the listener, or an equivalent pattern that avoids `$effect` for derived state (navigation targets come from `data`, not from `$effect` computation). Do not add a global store for this page-local behavior.

## Open questions

- None. Tie-breaking for equal circa years follows JavaScript’s stable `Array.prototype.sort` on the copy of `data` inside `getDesignPortfolio()`; the route must use the same `list` from a single `await getDesignPortfolio()` call for both `entry` and neighbors so order is consistent.
