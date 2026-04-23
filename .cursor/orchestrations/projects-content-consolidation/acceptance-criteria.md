# Acceptance Criteria — projects-content-consolidation

## Functional — content and routing

- [ ] **AC-01:** `src/lib/content/design-portfolio.ts` is removed from the repository and no production import path references `$lib/content/design-portfolio`.
- [ ] **AC-02:** `src/lib/content/projects.ts` is the only module defining project/portfolio records; it exports co-located types, `Promise`-returning getter(s), and merged data covering all former `design-portfolio.ts` entries plus former `projects.ts` entries without dropping fields from the current “What’s For Dinner” `ProjectEntry`.
- [ ] **AC-03:** Every record includes `status: string` and `includeInPortfolio: boolean`; portfolio-visible records use `includeInPortfolio: true`, AI-only / non-Portfolio records use `includeInPortfolio: false`.
- [ ] **AC-04:** Portfolio-visible records (`includeInPortfolio: true`) retain required `images.thumbnail` and `images.full` (each `DesignPortfolioImage`-shaped) and the same optional `hero` / `showcase` semantics as today; non-portfolio records do not require `thumbnail` or `full` at the type level.
- [ ] **AC-05:** A portfolio-only getter (whether named `getDesignPortfolio` or otherwise) returns **only** `includeInPortfolio: true` entries, sorted by descending leading year from `circa` using the same `circaYearFromString` behavior as the pre-change `getDesignPortfolio()` implementation.
- [ ] **AC-06:** `src/routes/portfolio/+page.ts` and `src/routes/portfolio/[slug]/+page.ts` obtain their lists from `projects.ts` via the portfolio-only getter (or equivalent in-loader filter that is provably equivalent), still export `prerender = true`, and return plain serialisable `data`.
- [ ] **AC-07:** `entries()` for `src/routes/portfolio/[slug]/+page.ts` yields **only** slugs for which `includeInPortfolio === true`; slugs for `includeInPortfolio: false` never receive a prerendered detail route.
- [ ] **AC-08:** `assembleSystemPromptFromSiteContent()` imports project content only from `$lib/content/projects`, resolves **all** records (both `includeInPortfolio` values), and includes non-portfolio narrative content in the assembled string (not left commented out).

## Architectural

- [ ] **AC-09:** No `$lib/content/` file imports from `$lib/server/`, `$env/static/private`, or other server-only modules (ADR-008 Rule 5).
- [ ] **AC-10:** Aside from `system-prompt.service.ts`, no file under `src/lib/server/` imports `$lib/content/projects` or any other content module for this domain (ADR-008 Rule 6 unchanged in spirit).

## Types and tests

- [ ] **AC-11:** `npm run check` (or the repo’s equivalent typecheck) passes with no new errors attributable to this change set.
- [ ] **AC-12:** `src/lib/content/INDEX.md` inventory matches the post-merge reality (single `projects.ts` row, documented `includeInPortfolio` and image rules).
- [ ] **AC-13:** Automated tests that referenced `design-portfolio` are updated to `projects.ts` and still validate portfolio ordering, field presence for on-site entries, and any existing neighbor / load serialisability expectations.

## Accessibility / no-JS baseline

- [ ] **AC-14:** Portfolio pages continue to render primary content from `load()` `data` without relying on `{#await}` for that primary content (ADR-002 / ADR-003 baseline preserved).
