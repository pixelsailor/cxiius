# Plan — projects-content-consolidation

## Objective restatement

All project-related site content (design portfolio case studies and personal product/tool narratives) lives in a single `src/lib/content/projects.ts` domain with one unified type system: portfolio-visible entries keep the current design-portfolio field set plus `status` and a portfolio-inclusion flag; AI-only entries share the same module and assembler path while skipping the Portfolio routes and full image requirements.

## Scope boundary

**In scope**

- Merge types, constants, and data from `design-portfolio.ts` into `projects.ts`; remove `design-portfolio.ts` as a separate domain file once call sites are migrated.
- Add `status: string` to portfolio-visible records (aligned with the string already used on personal-project entries).
- Introduce a single boolean on each record that controls **whether the entry appears on public Portfolio surfaces** (`/portfolio`, `/portfolio/[slug]`, including `entries()` for prerender).
- Relax image field requirements for records excluded from the Portfolio so authors are not forced to supply thumbnail/full assets for AI-only rows, without weakening types for on-site portfolio rendering.
- Update `assembleSystemPromptFromSiteContent()` so the AI sees **all** records from the unified getter (portfolio + non-portfolio), with formatting that uses the richer narrative fields where present.
- Update route loaders, utilities, specs, and `src/lib/content/INDEX.md` to import from `$lib/content/projects` and to use portfolio-filtered lists wherever the UI assumes full image sets and slugs.
- Preserve today’s portfolio **sort order** for on-site lists: descending by leading year from `circa` (same behavior as current `getDesignPortfolio()`).

**Out of scope**

- New Portfolio UI, new filters, or new public pages for product projects.
- CMS, KV, or API changes.
- Zod schemas in `$lib/content/` (still forbidden per ADR-008 / ADR-006).
- Changing ADR-008 text (this task implements a deliberate merge of two former domains into one file, consistent with “one file per domain” **after** consolidation).

## Component/file map

| File | Action | Purpose |
| ---- | ------ | ------- |
| `src/lib/content/projects.ts` | **Modify / expand** | Single domain: unified discriminated union (or equivalent) for all project records; co-located types; `DESIGN_PORTFOLIO_PROJECT_TYPES` and image types moved here; merged `const data`; `getProjects(): Promise<…>` returns **every** record; **exported portfolio getter** (see Interface contracts) returns only portfolio-eligible entries, sorted like current `getDesignPortfolio()`. |
| `src/lib/content/design-portfolio.ts` | **Remove** after migration | Eliminates duplicate domain; avoids violating ADR-008 “one file per domain” once `projects.ts` is the only source. |
| `src/lib/content/design-portfolio.spec.ts` | **Rename / merge** into `projects.spec.ts` (or equivalent) | Tests target unified module; cover union narrowing, image rules per branch, sort, and portfolio filter. |
| `src/lib/content/INDEX.md` | **Update** | One row for unified `projects.ts`; document boolean, `status`, image rules for each branch; remove `design-portfolio.ts` row. |
| `src/lib/server/system-prompt.service.ts` | **Modify** | Import unified getter(s) from `$lib/content/projects` only; build prompt sections from **full** `getProjects()` (or equivalent), including non-portfolio entries; remove commented `getProjects` / duplicate portfolio-only path that omits narratives. |
| `src/routes/portfolio/+page.ts` | **Modify** | Await portfolio-filtered getter from `projects.ts` (not raw `getProjects()` unless filtered in-loader). |
| `src/routes/portfolio/[slug]/+page.ts` | **Modify** | Same; ensure `entries()` only yields slugs with `includeInPortfolio === true`; neighbor order uses same sorted list as index. |
| `src/routes/portfolio/[slug]/+page.svelte` | **Modify** (comment/docs only if needed) | Reference `projects.ts` instead of `design-portfolio.ts` in author-facing copy. |
| `src/lib/utils/portfolio-load.ts` | **Modify** | Import portfolio entry types from `$lib/content/projects`; function signatures remain portfolio-only types (entries passed in are already filtered). |
| `src/lib/utils/portfolio-load.spec.ts` | **Modify** | Import types from `projects.ts`; test helpers construct valid portfolio-branch entries. |
| `src/routes/portfolio/portfolio-slug-route-load.spec.ts` | **Modify** | Import portfolio getter / types from `projects.ts`; preserve ordering assertions against the portfolio-filtered getter. |
| `src/routes/portfolio/[slug]/portfolio-slug-page.svelte.spec.ts` | **Modify** | Same import path updates. |

**Read-only dependencies (no edits required for this task unless a violation is found)**

- `src/lib/server/ai.service.ts` — continues to call `assembleSystemPromptFromSiteContent()` only.

## Interface contracts

### Boolean flag semantics

- **Name (contract for Builder):** `includeInPortfolio` — `true` = shown on public Portfolio index and detail routes, eligible for `entries()` prerender paths, hero/grid/filter utilities, and must satisfy portfolio image rules; `false` = **excluded** from all of the above, still included in `getProjects()` for AI assembly and any future non-Portfolio consumers.

### Unified content getters (`projects.ts`)

- **`getProjects()`** — `(): Promise<ProjectContentEntry[]>` where `ProjectContentEntry` is the discriminated union (or structurally equivalent) covering both branches. Returns **all** records in a stable order (documented in file: e.g. data array order or explicit sort — Builder must pick one and keep assembler/tests consistent).
- **Portfolio-only getter** — `(): Promise<DesignPortfolioEntry[]>` (name may remain **`getDesignPortfolio`** for minimal churn, or **`getPortfolioPageEntries`** if Builder renames all call sites in this task). Contract: `await getProjects()`, filter `includeInPortfolio === true`, assert/narrow to portfolio branch type, sort by `circaYearFromString(b.circa) - circaYearFromString(a.circa)` (same as today). Return type is **only** the portfolio branch so `portfolio-load.ts` and routes do not accept AI-only rows.

### Type shape — portfolio branch (canonical design portfolio + additive fields)

Preserve existing public fields from current `DesignPortfolioEntry` as required on the **`includeInPortfolio: true`** branch:

- `slug`, `name`, `projectType` (`DesignPortfolioProjectType`), `images` with required `thumbnail` and `full`, optional `hero`, optional `showcase`, `circa`, `technologies`, `summary`, `description`, optional `liveUrl`, optional `featuredAsHero`.
- **Add** `status: string` (required on this branch).
- **Add** `includeInPortfolio: true` (literal) as discriminator.

Optional **narrative** fields from the former `ProjectEntry` may be added on this branch only if needed for a single record that is both a case study and a product; otherwise keep narratives on the false branch only (Builder implements minimal set that matches migrated data).

### Type shape — non-portfolio branch (AI / narrative projects)

- **`includeInPortfolio: false`** (literal discriminator).
- **Required:** `slug`, `name`, `status`, and fields needed for AI and future pages: at minimum migrate current `ProjectEntry` **summary** and the narrative arrays/strings (`context`, `selectionAndFreshness`, `dataAndSync`, `assistant`, `authorNotes`, `roadmap`, `techStack`, `links`) so nothing is lost from today’s `projects.ts` data.
- **`images`:** optional; if present, individual image slots may be partial. Types must **not** require `thumbnail`/`full` on this branch so authors can omit assets entirely.
- **`circa`:** optional string; omit or supply for prompt context only (not used for portfolio sort when excluded).
- **`projectType`:** optional or use a widened union only if needed for prompt labeling; must not force non-design work into fake `branding`/`ui`/`illustration` values **unless** the human author explicitly accepts that (see Open questions).

### Migration path for current `ProjectEntry`

1. For each existing `ProjectEntry` row (e.g. “What’s For Dinner”), create a **`includeInPortfolio: false`** record in `projects.ts` with a unique `slug`, same `name`, `status`, and all narrative fields copied unchanged.
2. Omit `images` or supply partial images when assets exist later.
3. Remove the standalone `ProjectEntry` type as the exported shape; replace with the **`includeInPortfolio: false`** branch type (or a named alias like `PersonalProjectEntry` co-located in `projects.ts`).
4. **`getProjects`** becomes the single exported “full list” getter for this domain (ADR-008 Rule 4: `Promise<T>`).

### `assembleSystemPromptFromSiteContent`

- Import **`getProjects`** (only content import for this domain, or also portfolio getter if needed for ordering — prefer **one** full list).
- Emit at least one section that includes **every** entry: for portfolio-branch rows, continue to surface type, circa, description, technologies as today; for false-branch rows, serialize narrative fields (summary, context, bullets, roadmap, links, tech stack) so the model gains product context that is currently commented out.

## ADR references

- **ADR-008 (Content Model):** After consolidation, **`projects.ts` is the sole domain file** for all project-like content, with types co-located, serialisable fields only, and getters returning `Promise<T>`. Content remains client-safe (no `$lib/server/` imports). **ADR-008 Rule 6:** only `system-prompt.service.ts` imports this domain from `$lib/server/`; update its import path from `design-portfolio` to `projects` and wire **`getProjects`** into the assembler.
- **ADR-002 (Data Fetching):** Portfolio routes keep **`export const prerender = true`**, `async` `load()` that **awaits** the portfolio-filtered getter, and plain serialisable `data` (no deferred promises for primary content).
- **ADR-001 (Structure):** All changes stay under `src/lib/content/` for data, `src/lib/server/` for prompt assembly, and existing route paths under `src/routes/portfolio/`.

## Open questions

1. **`projectType` for `includeInPortfolio: false` entries:** If a personal product is not a branding/illustration/UI case study, should the Builder **omit** `projectType`, add a **new** union member (requires updating `DESIGN_PORTFOLIO_PROJECT_TYPES` and portfolio filter semantics even if unused on-site), or require authors to pick the **closest** existing label for prompt tagging only? This affects typing and prompt wording; **do not guess** — confirm with the human author or leave `projectType` optional on the false branch only.

2. **Default `status` for migrated design portfolio rows:** Existing visual entries have no `status` today. Builder should either use a documented default string (e.g. `''` or `'Shipped'`) for all migrated rows **after** human confirmation, or leave placeholders flagged in data until filled.
