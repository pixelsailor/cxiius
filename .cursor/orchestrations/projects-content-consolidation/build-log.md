# Build log — projects-content-consolidation

## Files created

- **`src/lib/content/projects.spec.ts`** — Unified content tests merged from `design-portfolio.spec.ts`, plus `getProjects` coverage, portfolio vs non-portfolio discrimination, and assertion that `whats-for-dinner` stays out of `getDesignPortfolio()`.

## Files modified

- **`src/lib/content/projects.ts`** — Single domain: types `DesignPortfolioEntry` (with `includeInPortfolio: true`, `status`), `NonPortfolioProjectEntry` (with `includeInPortfolio: false`, optional `projectType` and `images`), `ProjectContentEntry` union; merged seed data from former `design-portfolio.ts` and former `projects.ts`; `getProjects()` returns all rows in stable order (portfolio seed array order, then non-portfolio); `getDesignPortfolio()` filters to portfolio branch and sorts by `circaYearFromString` descending. Migrated on-site portfolio rows use **`status: 'Shipped'`** (orchestrator default). Non-portfolio “What’s For Dinner” uses slug `whats-for-dinner` without `projectType`. File-level and public API JSDoc per documentation conventions.
- **`src/lib/server/system-prompt.service.ts`** — Imports `getProjects` only for this domain; builds one `## Projects and portfolio (all entries)` section covering every record (portfolio lines plus full narrative serialization for non-portfolio). File-level `@fileoverview` / `@module` added.
- **`src/lib/utils/portfolio-load.ts`** — Type imports from `$lib/content/projects`.
- **`src/routes/portfolio/+page.ts`**, **`src/routes/portfolio/[slug]/+page.ts`** — Import `getDesignPortfolio` from `$lib/content/projects`.
- **`src/routes/portfolio/[slug]/+page.svelte`** — Author comment updated to reference `projects.ts`.
- **`src/lib/utils/portfolio-load.spec.ts`** — Test helper entries include `includeInPortfolio: true` and `status: 'Shipped'`; type import from `projects`.
- **`src/routes/portfolio/portfolio-slug-route-load.spec.ts`**, **`src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts`** — Import `getDesignPortfolio` from `projects`.
- **`src/lib/content/INDEX.md`** — Single `projects.ts` row; documents `includeInPortfolio`, `status`, branch image rules, and getters.

## Files removed

- **`src/lib/content/design-portfolio.ts`** — Merged into `projects.ts` (replaced by unified domain file).
- **`src/lib/content/design-portfolio.spec.ts`** — Replaced by `projects.spec.ts`.

## Deviations from plan

- None. Kept the **`getDesignPortfolio`** name and portfolio sort behavior per plan (minimal churn). Used a one-off local generator script to inject `includeInPortfolio` / `status` into migrated portfolio objects; the script was **not** left in the repo (content is committed only in `projects.ts`).

## Unresolved open questions

1. **`projectType` for `includeInPortfolio: false`:** Resolved per orchestrator: optional on the false branch; **no** widening of `DESIGN_PORTFOLIO_PROJECT_TYPES` for non-portfolio rows. “What’s For Dinner” omits `projectType`.
2. **Default `status` for migrated design portfolio rows:** Resolved per orchestrator: **`Shipped`** for all migrated on-site portfolio entries, consistently in data and noted here.

## Known gaps

- If future non-portfolio rows set optional `projectType` for prompt labeling, `projects.spec.ts` assertions may need to stay scoped to specific slugs (current pattern for `whats-for-dinner`).
