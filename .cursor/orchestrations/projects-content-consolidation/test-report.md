# Test report — projects-content-consolidation

## Coverage map

| AC | Description (abbrev.) | Test file | Test name(s) |
|----|------------------------|-----------|--------------|
| **AC-01** | `design-portfolio.ts` removed; no `$lib/content/design-portfolio` import | `src/lib/content/content-adr008-imports.spec.ts` | `design-portfolio removal (AC-01) > legacy file is absent and src does not import $lib/content/design-portfolio` |
| **AC-02** | Single `projects.ts` domain, merged data, co-located types, `Promise` getters | `src/lib/content/projects.spec.ts` | `getDesignPortfolio > returns a Promise of entries`; `getProjects > returns a stable superset including non-portfolio entries`; `getProjects > narrows personal-project shape when includeInPortfolio is false` |
| **AC-03** | `status` and `includeInPortfolio` on every record; portfolio vs AI-only values | `src/lib/content/projects.spec.ts` | `getDesignPortfolio > exposes expected fields on each portfolio entry`; `getProjects > narrows personal-project shape when includeInPortfolio is false` |
| **AC-04** | Portfolio branch: full `images` + optional `hero`/`showcase`; non-portfolio: no required thumbnail/full | `src/lib/content/projects.spec.ts` | `getDesignPortfolio > exposes expected fields on each portfolio entry`; `getProjects > narrows personal-project shape when includeInPortfolio is false` |
| **AC-05** | Portfolio-only getter: only `includeInPortfolio: true`, sort by `circaYearFromString` desc | `src/lib/content/projects.spec.ts` | `getDesignPortfolio > orders entries by circa year descending (most recent first)`; `getDesignPortfolio > excludes non-portfolio slugs from the portfolio list` |
| **AC-06** | Portfolio routes use portfolio getter, `prerender`, serialisable `data` | `src/routes/portfolio/portfolio-route-load.spec.ts` | `exports prerender true`; `load returns serialisable data: filterKey, entries, filteredEntries, hero`; `load entries match portfolio-only getter order and membership (AC-06)`; `src/routes/portfolio/portfolio-slug-route-load.spec.ts` — `load returns serialisable data including prevSlug and nextSlug (AC-02)`; `exports prerender true (AC-01)` on slug route |
| **AC-07** | `entries()` only for `includeInPortfolio === true` | `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | `entries() yields only portfolio getter slugs; non-portfolio slugs are omitted (AC-07)` |
| **AC-08** | System prompt: `getProjects`, all records, non-portfolio narrative in string | `src/lib/server/system-prompt.service.spec.ts` | `includes the projects section and non-portfolio narrative fields from getProjects (AC-08)`; `includes portfolio-formatted lines for on-site case studies` |
| **AC-09** | Content modules do not import server-only / private env | `src/lib/content/content-adr008-imports.spec.ts` | `ADR-008 content client boundary (AC-09) > no $lib/content module imports server-only or private env` |
| **AC-10** | Only `system-prompt.service.ts` imports `$lib/content/projects` from `src/lib/server` | `src/lib/server/content-projects-import-boundary.spec.ts` | `only system-prompt.service.ts imports the unified projects module` |
| **AC-11** | `npm run check` passes | — | See **Uncovered criteria** (typecheck is not a Vitest test; last run recorded under **Commands to run**) |
| **AC-12** | `INDEX.md` matches unified `projects.ts` and rules | `src/lib/content/INDEX-inventory.spec.ts` | `documents unified projects.ts, includeInPortfolio, image rules, and getters` |
| **AC-13** | Tests use `projects.ts`; ordering, fields, load serialisability | `src/lib/content/projects.spec.ts` (entire `getDesignPortfolio` / `getProjects` describes); `src/routes/portfolio/portfolio-slug-route-load.spec.ts`; `src/routes/portfolio/portfolio-route-load.spec.ts`; `src/lib/utils/portfolio-load.spec.ts`; `src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts` | As named in each file (portfolio ordering, neighbor navigation, `pickHero` / filters, etc.) |
| **AC-14** | No `{#await}` for primary portfolio content | `src/routes/portfolio/portfolio-route-load.spec.ts` | `portfolio Svelte routes do not defer primary page data with {#await} (AC-14)` |

## Uncovered criteria

- **AC-11** — No Vitest test asserts `svelte-check`. This acceptance item is a **typecheck / CI gate**. It was satisfied in this run by `npm run check` (0 errors, 0 warnings). Re-run that command after future edits to the same area.

## Test stability notes

- No new time-based or animation-dependent assertions were added. File-walking tests in `content-adr008-imports.spec.ts` and `content-projects-import-boundary.spec.ts` depend on repository layout; they will fail if new production files reintroduce forbidden imports (intentional guardrail).
- `assembleSystemPromptFromSiteContent` integration test pulls real content from all domains; it is I/O bound but deterministic for a given `src/lib/content` tree.

## Commands to run

From the repository root (exactly):

```sh
npm run test
```

```sh
npm run check
```

Optional: run only server-side (Node) unit tests, which include the new specs under `src/lib/content`, `src/lib/server`, and `src/routes/portfolio`:

```sh
npx vitest run --project server
```

Last run in this session: `npm run test` — **exit 0** (98 tests, 1 skipped). `npm run check` — **exit 0** (0 errors).
