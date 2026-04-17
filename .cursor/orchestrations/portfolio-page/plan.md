# Plan — portfolio-page

## Objective restatement

Deliver a prerendered `/portfolio` page that presents a glass-styled hero (one featured design work, defaulting to the most recent by circa unless overridden in content), neon-green filter links, and a responsive featured-works grid with placeholder imagery, driven by a new client-safe `$lib/content/` domain file, with server-resolved filtering from the URL (query string), optional JS enhancement using `replaceState` (no extra history entries), and outbound links that target an explicit non-detail placeholder strategy.

## Scope boundary

### In scope

- New content domain file under `$lib/content/` for **design portfolio** entries (do **not** extend `projects.ts`; that domain is product/tool projects per existing comment and ADR-008 one-domain-per-file).
- Route folder `src/routes/portfolio/` with `+page.ts` (universal load, `prerender = true`) and `+page.svelte`.
- Visual treatment aligned to the reference: dark background, glassy header area for the hero block, rainbow stripe accent, green styling for filter links, glossy diagonal overlay on card thumbnails.
- Filter values: **Branding & Identity**, **Illustration**, **User Interface**, plus **show all**; filtering is **computed in `load()`** from `url.searchParams` so HTML is correct **without JavaScript**.
- Progressive enhancement: when JS runs, filter navigation may use `history.replaceState` / SvelteKit navigation with **`replaceState: true`** so activations do not grow the history stack (baseline remains plain links).
- Global nav: add a **Portfolio** link next to existing items in `src/routes/+layout.svelte` (real `href`, ADR-003).
- Update `src/lib/content/INDEX.md` with the new domain row.
- **System prompt assembler:** Per ADR-008 Rule 6, wire the new content getter into **one** server module under `src/lib/server/` that aggregates content for the AI system prompt. The repository **currently has no** `src/lib/server/` tree; this task **includes** introducing that assembler (minimal composition of portfolio text alongside any placeholder structure needed to satisfy the rule), not leaving a new domain unregistered on the server side.
- Placeholder images via URLs such as `https://placehold.co/...` (or equivalent) until real assets exist.
- ASCII-only source in `src/lib/content/**/*.ts` (ESLint `content-ascii/only-ascii`).

### Out of scope

- Full **project detail** page UX, CMS editing UI, real asset pipeline, and analytics.
- Replacing or redesigning global layout beyond adding one nav item and any page-local styles.

## Component/file map

| File | Purpose |
| --- | --- |
| `src/lib/content/design-portfolio.ts` (name may be `portfolio-design.ts` if Builder standardizes on one kebab filename; **must** remain one domain file) | Defines `DesignPortfolioEntry` (or equivalent) type, `const data`, exported getter `getDesignPortfolio` (or `getDesignPortfolioEntries`) returning `Promise<...[]>`. Fields: `slug`, `name`, `projectType` (union of the three filters + internal `all` handling), `images: { thumbnail, hero, full }`, `circa` (string), `technologies: string[]`, `summary` (one line), `description` (full), optional `liveUrl?: string`, optional **`featuredAsHero?: boolean`** (or **`heroOverrideSlug?: string`**) to override default hero selection. |
| `src/lib/content/INDEX.md` | New row for the design portfolio domain and getter. |
| `src/routes/portfolio/+page.ts` | `export const prerender = true`; `load({ url })` **awaits** the design-portfolio getter; reads `url.searchParams` (see Interface contracts); returns plain serialisable `data` (hero entry, filtered list, active filter key, and any derived labels). **No** `+page.server.ts`. |
| `src/routes/portfolio/+page.svelte` | One `<h1>` for the page (ADR-004); hero + section heading for featured works + filter list (`<a>` links) + grid; scoped or linked CSS for reference look; optional small script for `replaceState` / `goto(..., { replaceState: true })` enhancement **without** replacing the no-JS link behavior as the baseline. |
| `src/routes/+layout.svelte` | Add `{ label: 'Portfolio', path: '/portfolio' }` to `navItems` (use `resolve()` like existing items). |
| `src/lib/server/*` (exact filename per ADR-001 `domain.role.ts` — e.g. `system-prompt.service.ts` or `prompt.assembler.ts`) | **Single** place that imports `$lib/content` for server-side prompt assembly; imports the new getter and exposes a function used by future chat code; **no other** `$lib/server/` file imports `$lib/content/` directly (ADR-008 Rule 6). |
| `svelte.config.js` (or other Kit-supported prerender hook) | Ensure static prerender emits HTML for **each** filter URL variant used by the filter links (including no-query “all”), so no-JS direct loads and crawlers get correct filtered markup. |
| Optional: `static/styles/portfolio.css` **or** large `<style>` block in `+page.svelte` | Centralize portfolio-specific layout/visual rules; link from `+page.svelte` or rely on scoped styles. |
| Optional: `src/lib/ui/...` | Only if extracting presentational sections improves clarity; filters remain plain `<a>` (bits-ui not required for link-based filters per ADR-011). |

### Detail link strategy (explicit)

- **Do not** implement real project detail content.
- **Choose one** and implement consistently (document in `build-log.md` which one):
  - **A (preferred):** `href={resolve('/portfolio/' + slug)}` and add a **minimal** `src/routes/portfolio/[slug]/+page.svelte` that only shows a short “coming soon” / title stub (no real detail body). **Or**
  - **B:** `href="#"` (or a single shared `href="/portfolio"` fragment-free anchor) for all items **only if** the team rejects adding a stub dynamic segment; accept weaker UX and ensure keyboard/screen-reader labels remain sensible.

## Interface contracts

### Content type (indicative; exact names may match Builder naming)

```ts
export const DESIGN_PORTFOLIO_PROJECT_TYPES = [
	'branding',
	'illustration',
	'ui'
] as const;

export type DesignPortfolioProjectType = (typeof DESIGN_PORTFOLIO_PROJECT_TYPES)[number];

export type DesignPortfolioEntry = {
	slug: string;
	name: string;
	projectType: DesignPortfolioProjectType;
	images: { thumbnail: string; hero: string; full: string };
	circa: string;
	technologies: string[];
	summary: string;
	description: string;
	liveUrl?: string;
	/** If true, this entry wins the hero slot over default “most recent” logic. */
	featuredAsHero?: boolean;
};
```

- Getter: `export const getDesignPortfolio = (): Promise<DesignPortfolioEntry[]> => Promise.resolve(data);` (or equivalent name; **must** be `Promise<T>`).

### Query parameter contract

- **Parameter name:** `type` (ASCII).
- **Values:** `all` (default when absent or empty), `branding`, `illustration`, `ui` — map to display labels `Show all`, `Branding & Identity`, `Illustration`, `User Interface` using a fixed map in `+page.ts` or a shared constant object (no user input echoed without validation).
- **Invalid values:** Treat as `all` or `all` with a recoverable default; do not throw from `load()` for bad query strings (validation-first, predictable page).

### Hero selection algorithm (deterministic)

1. If exactly one entry has `featuredAsHero === true`, use it (if multiple, first in array order wins — **avoid** multiple `true` in seed data).
2. Else pick the entry with the **greatest** sortable date derived from `circa` (Builder must define a single rule: e.g. optional numeric `circaYear` field in content, or parse leading 4-digit year from `circa`; document the rule in code comment).
3. Hero must be drawn from the **same** `DesignPortfolioEntry[]` as the grid source (single getter).

### `load()` return shape (indicative)

```ts
export const load = async ({ url }: LoadEvent) => {
	const entries = await getDesignPortfolio();
	// Prerender: use `url.href` + `typeQueryFromPageHref` — `url.search` / `url.searchParams` throw during prerender.
	const filterKey = parseFilter(typeQueryFromPageHref(url.href));
	const filtered = filterEntries(entries, filterKey);
	const hero = pickHero(entries /* or filtered — product choice; default: from full list for hero even when a filter is active unless Builder documents otherwise */);
	return {
		filterKey,
		entries,
		filteredEntries: filtered,
		hero
	};
};
```

- **Open item:** Whether the hero should follow the **active filter** (only show hero if it matches filter) is **not** specified; Builder must pick one behavior and record it in `build-log.md`.

### Progressive enhancement (`replaceState`)

- Baseline: each filter is a real `<a href="/portfolio?type=...">` (and `/portfolio` or `?type=all` for show all).
- Enhanced: intercept click (e.g. `onclick` on the anchor or a wrapper) **only when** JS runs; call SvelteKit `goto` with **`replaceState: true`** (or `history.replaceState` plus `invalidateAll` / `goto` per Kit patterns) so the URL updates without pushing a history entry. **Must not** be the only way to navigate.
- Do **not** use a global store for filter state for the primary path (ADR-007: local `$state` in the page is enough).

## ADR references

- **ADR-001 (structure):** New route under `src/routes/portfolio/`; new content file under `src/lib/content/`; new UI only under `src/lib/ui/` if extracted; new server assembly logic only under `src/lib/server/`. Component folder naming if adding `$lib/ui` components.

- **ADR-002 (data fetching):** Content route uses universal `+page.ts`, **`await`** getters, **plain `data`**, **`export const prerender = true`**. No `{#await}` for primary route data. Configure prerender so **all** filter URLs used by `<a href>` produce static HTML.

- **ADR-003 (no-JS):** Filters work as real links; full content and filtered lists in server-rendered HTML; PE is additive. Nav uses `<a href>`; new Portfolio nav entry follows the same pattern.

- **ADR-004 (a11y):** One `<h1>` on `/portfolio`; landmarks come from root layout; filter controls are links, not buttons-without-href; heading order for hero and featured sections; motion behind `prefers-reduced-motion` if any transitions are added.

- **ADR-005 (errors):** Invalid query does not crash `load()`; if `{#await}` is absent (per ADR-002), rely on normal Kit error boundaries only for exceptional failures.

- **ADR-006 (types):** Enumerations via `as const` arrays; no Zod in content; TypeScript types co-located in the content file.

- **ADR-007 (state):** Svelte 5 runes for any local enhancement state; no new global store for filters.

- **ADR-008 (content):** One new domain file; `Promise` getter; no server imports from content; **assembler is the only server importer** of `$lib/content/` — implement `src/lib/server/` assembler as part of this task because it does not exist yet.

- **ADR-011 (bits-ui):** Optional; link-based filters do not require bits-ui primitives.

## Open questions

1. **Hero vs active filter:** Should the hero slot hide or change when the selected `type` excludes the hero entry? (Planner does not pick; Builder documents the chosen behavior.)
2. **`circa` sorting:** If real data later uses non-parseable `circa` strings, adding an explicit numeric `sortKey` or `circaYear` in content may be needed — seed data should use a parseable convention from day one.
3. **Minimal `[slug]` stub:** Confirm with product whether Option A (minimal dynamic route) is acceptable or Option B (`#` links) is required — plan allows either; Builder must not leave broken `href` without stub.
