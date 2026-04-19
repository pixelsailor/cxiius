# Content domains (`$lib/content/`)

Typed TypeScript modules are the **source of truth** for site content. Authoritative conventions: [`adr/ADR-008-content-model-conventions.md`](../../../adr/ADR-008-content-model-conventions.md).

Agent-oriented workflows and hard rules live in [`.cursor/rules/content-model.mdc`](../../../.cursor/rules/content-model.mdc).

**Elicitation (interview before writing):** [`.cursor/rules/content-interview.mdc`](../../../.cursor/rules/content-interview.mdc) — use when adding or updating narrative content; it defers to `content-model.mdc` for TypeScript structure and ADR-008 compliance.

## Inventory

Update this table when domains are added or removed.

| File                  | Domain                                           | Getter return type                |
| :-------------------- | :----------------------------------------------- | :-------------------------------- |
| `identity.ts`         | Professional identity, differentiators, contact  | `Promise<Identity>`               |
| `experience.ts`       | Work history                                     | `Promise<ExperienceEntry[]>`      |
| `skills.ts`           | Technical proficiencies by category              | `Promise<SkillCategory[]>`        |
| `education.ts`        | Formal education and certifications              | `Promise<EducationEntry[]>`       |
| `background.ts`       | Military service, martial arts, instructor roles | `Promise<Background>`             |
| `availability.ts`     | Current availability status                      | `Promise<Availability>`           |
| `projects.ts`         | Personal projects (products, tools, experiments) | `Promise<ProjectEntry[]>`         |
| `design-portfolio.ts` | Design portfolio (case studies, visual work)     | `Promise<DesignPortfolioEntry[]>` |

**`design-portfolio.ts` — images:** Each visual is a `DesignPortfolioImage` (`src`, `alt`). Thumbnail and full are required; `hero` is optional (index page falls back to full). Optional `images.showcase` is an array of extra images rendered only on `/portfolio/[slug]`.

**Routes:** Page `+page.ts` files **`await`** these getters and return plain values on `data` so HTML works without JavaScript ([ADR-002](../../../adr/ADR-002-data-fetching-patterns.md)). Getters stay `Promise<T>`; the route resolves them.

## `availability.ts`

Confirm with a human before treating `available` and `statusMessage` as authoritative.
