# Content domains (`$lib/content/`)

Typed TypeScript modules are the **source of truth** for site content. Authoritative conventions: [`adr/ADR-008-content-model-conventions.md`](../../../adr/ADR-008-content-model-conventions.md).

Agent-oriented workflows and hard rules live in [`.cursor/rules/content-model.mdc`](../../../.cursor/rules/content-model.mdc).

## Inventory

Update this table when domains are added or removed.

| File | Domain | Getter return type |
| :--- | :--- | :--- |
| `identity.ts` | Professional identity, differentiators, contact | `Promise<Identity>` |
| `experience.ts` | Work history | `Promise<ExperienceEntry[]>` |
| `skills.ts` | Technical proficiencies by category | `Promise<SkillCategory[]>` |
| `education.ts` | Formal education and certifications | `Promise<EducationEntry[]>` |
| `background.ts` | Military service, martial arts, instructor roles | `Promise<Background>` |
| `availability.ts` | Current availability status | `Promise<Availability>` |

## `availability.ts`

Confirm with a human before treating `available` and `statusMessage` as authoritative.
