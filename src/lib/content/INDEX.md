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
| `background.ts`       | Personal background, interests, favorites, work style | `Promise<Background>`         |
| `availability.ts`     | Current availability status                      | `Promise<Availability>`           |
| `projects.ts`         | Design portfolio, product narratives, and unified getters | `Promise<ProjectContentEntry[]>` (see below) |

**`projects.ts`:** Single domain for on-site design case studies and off-site (AI) product/tool narratives. Each row has `status: string` and `includeInPortfolio: boolean`. **Portfolio branch** (`includeInPortfolio: true`): `projectType` is `branding` \| `illustration` \| `ui`; `images.thumbnail` and `images.full` are required `DesignPortfolioImage`; optional `hero` and `images.showcase` (detail page only). Use **`getDesignPortfolio()`** for `/portfolio` routes (sorted by circa). **Non-portfolio branch** (`includeInPortfolio: false`): `images` optional with partial slots; `projectType` optional. **`getProjects()`** returns all records (portfolio seed order, then non-portfolio) for the AI system prompt and future consumers.

**Routes:** Page `+page.ts` files **`await`** these getters and return plain values on `data` so HTML works without JavaScript ([ADR-002](../../../adr/ADR-002-data-fetching-patterns.md)). Getters stay `Promise<T>`; the route resolves them.

## `availability.ts`

Confirm with a human before treating `available` and `statusMessage` as authoritative.
