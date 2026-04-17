# Acceptance Criteria — portfolio-page

## Functional

- [ ] AC-01: Visiting `/portfolio` with JavaScript disabled shows a complete page: hero region, filter links, and a grid of design portfolio entries (no empty shell waiting on client JS).
- [ ] AC-02: Filter links are real `<a href>` elements pointing to `/portfolio` with query param `type` (and `type=all` or bare `/portfolio` for show all), and each link shows only entries matching that filter when the page is loaded with that URL (no-JS full navigation).
- [ ] AC-03: Direct load (or prerendered static file) for each supported filter URL (`all`, `branding`, `illustration`, `ui`) renders the correct filtered set in HTML without requiring JavaScript.
- [ ] AC-04: With JavaScript enabled, activating a filter can update the URL using navigation that does **not** push a new history entry (e.g. `replaceState` / `goto` with `replaceState: true`), while the no-JS path still works via plain links alone.
- [ ] AC-05: The featured hero entry defaults to the most recent entry by the documented circa/sort rule unless a content flag overrides it (`featuredAsHero` or equivalent per plan).
- [ ] AC-06: Each grid item and the hero CTA link follow the plan’s explicit detail-link strategy (stub route or `#`, documented; no accidental 404 if Option A is chosen).
- [ ] AC-07: Placeholder image URLs load from public HTTP(S) placeholders (e.g. placehold.co) for thumbnail, hero, and full image fields in seed data.

## Content and data

- [ ] AC-08: Design portfolio entries live in a **new** `$lib/content/` file separate from `projects.ts`, with types co-located, serialisable fields only, and a single exported getter returning `Promise<...>`.
- [ ] AC-09: Each entry includes: name; project type (one of Branding & Identity, Illustration, User Interface); thumbnail, hero, and full image URLs; `circa` string; `technologies[]`; one-line summary; full description; optional live URL; slug for linking.
- [ ] AC-10: `src/lib/content/INDEX.md` lists the new domain file and getter return type.
- [ ] AC-11: All strings in `src/lib/content/**/*.ts` for this feature are ASCII-only (pass ESLint `content-ascii/only-ascii`).

## Routes and architecture

- [ ] AC-12: `src/routes/portfolio/+page.ts` exports `prerender = true`, uses an `async` `load` that awaits the content getter and derives the `type` filter from the request URL in a prerender-safe way (e.g. parse `type` from `url.href`; SvelteKit blocks `url.search` / `url.searchParams` during prerender); it returns only plain serialisable data (no promises on `data` for body content).
- [ ] AC-13: Prerender configuration lists each filter URL used by the UI on POSIX (`/portfolio?type=...`) so static HTML exists for no-JS direct access; on Windows hosts the filesystem cannot emit `?` filenames, so those variants are omitted locally and full parity is verified on Linux CI (or WSL).
- [ ] AC-14: No `+page.server.ts` is added for this page.
- [ ] AC-15: Exactly one module under `src/lib/server/` imports `$lib/content/` for the new domain (assembler / prompt composition), satisfying ADR-008 Rule 6; no other server files import `$lib/content/` directly.

## UI, layout, and accessibility

- [ ] AC-16: Global header nav includes a Portfolio link to `/portfolio` using the same `resolve()` pattern as existing nav items.
- [ ] AC-17: The portfolio page has exactly one `<h1>`; subsequent headings follow a sensible `h1` → `h2` → `h3` order for hero and sections.
- [ ] AC-18: Visual design matches the stated direction: dark background, glassy hero/header treatment, rainbow stripe accent, green filter links, glossy diagonal treatment on card thumbnails (within reasonable CSS interpretation).
- [ ] AC-19: Responsive layout: single column on small viewports, three columns for the featured grid on larger viewports (as specified in the objective).
- [ ] AC-20: Any CSS transitions or animations added for this page respect `prefers-reduced-motion` (ADR-004).

## State and stack

- [ ] AC-21: New UI code uses Svelte 5 runes (`$props`, `$state`, etc.) and avoids deprecated Svelte 4 patterns listed in ADR-007 for new code.
- [ ] AC-22: No new global store is introduced solely to hold the selected portfolio filter; filter state for PE remains local or URL-driven.
