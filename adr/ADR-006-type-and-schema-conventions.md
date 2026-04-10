# ADR-006: Type and Schema Conventions

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field | Value |
|---|---|
| **ADR Number** | ADR-006 |
| **Status** | `active` |
| **Date** | 2026-04-09 |
| **Primary Owner** | Architecture |
| **Decider** | Human developer |

---

## Conditional Fields

| Field | Value |
|---|---|
| **Related ADRs** | ADR-001 — Project File and Folder Structure, ADR-005 — Error Handling Conventions |

---

## Scope

Governs where types, interfaces, and Zod schemas are defined, how they are named, and the boundaries within which runtime validation is required. Applies to all TypeScript files across `src/`. Does not govern runtime behaviour or API response design beyond the validation boundary.

---

## Context

Prior ADRs established partial type conventions in passing — ADR-001 named the `TheThing` / `TheThingSchema` pattern and mandated `z.infer` over parallel manual types; ADR-005 introduced `Result<T>`, `AppError`, and `ErrorCode` as foundational types. Without a consolidating ADR, these conventions are scattered and incomplete. Additionally, the question of where schemas live relative to types, and when Zod is required vs. TypeScript alone, has not been formally resolved.

---

## Decision

### Rule 1 — TypeScript is the default; Zod is used only at network boundaries

TypeScript types and interfaces are sufficient for all code that does not receive external input at runtime. Zod schemas are required only where data crosses a network boundary — data that arrives from outside the application and cannot be trusted at compile time.

| Location | Validation required | Tool |
|---|---|---|
| `src/routes/api/*/+server.ts` | Yes — request body from network | Zod |
| `$lib/server/*.service.ts` | Yes — inputs from route handlers | Zod |
| `$lib/content/*.ts` | No — version-controlled source | TypeScript |
| `$lib/ui/` components | No — props from same codebase | TypeScript |
| `$lib/stores/` | No — internal state | TypeScript |
| `$lib/utils/` | No — internal utilities | TypeScript |

### Rule 2 — Schemas live in `$lib/server/` exclusively

Zod schemas are defined only in `$lib/server/*.schemas.ts` files. No schema is defined outside this directory. Components, stores, utilities, and content files do not import from Zod.

The `*.schemas.ts` file for a domain contains all schemas relevant to that domain's API boundary. Types inferred from those schemas are defined in the corresponding `*.types.ts` file using `z.infer`.

```ts
// $lib/server/chat.schemas.ts
import { z } from 'zod'

export const ERROR_CODES = [
  'RATE_LIMITED',
  'UPSTREAM_UNAVAILABLE',
  'INVALID_INPUT',
  'NOT_FOUND',
  'UNKNOWN'
] as const

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().uuid().optional()
})
```

```ts
// $lib/server/chat.types.ts
import type { z } from 'zod'
import type { ChatRequestSchema, ERROR_CODES } from './chat.schemas'

export type ChatRequest = z.infer<typeof ChatRequestSchema>
export type ErrorCode = typeof ERROR_CODES[number]
```

### Rule 3 — `z.infer` is the canonical way to derive types from schemas

Types are never defined manually when a Zod schema exists for the same shape. The schema is the single source of truth. The inferred type is derived from it via `z.infer`.

Maintaining a manual `type ChatRequest` alongside a `ChatRequestSchema` that describes the same shape is a violation — the two will diverge. Only the inferred type is permitted.

### Rule 4 — `as const` is used instead of TypeScript enums

String literal unions derived from `as const` arrays are the project standard for enumerated values. TypeScript enums are not used.

`as const` arrays serve as the source of truth for both the TypeScript union type and the Zod schema, eliminating duplication:

```ts
// Single definition drives both type and schema
export const ERROR_CODES = ['RATE_LIMITED', 'UPSTREAM_UNAVAILABLE', 'INVALID_INPUT'] as const
export type ErrorCode = typeof ERROR_CODES[number]        // TypeScript union
export const ErrorCodeSchema = z.enum(ERROR_CODES)        // Zod schema, no re-listing
```

TypeScript enums require `z.nativeEnum()` and compile to JavaScript runtime objects. `as const` arrays are erased at compile time and integrate directly with `z.enum()` without duplication.

### Rule 5 — Naming conventions

| Artifact | Convention | Example |
|---|---|---|
| TypeScript type | `PascalCase` | `ChatRequest` |
| TypeScript interface | `PascalCase` | `RouteDefinition` |
| Zod schema | `PascalCaseSchema` | `ChatRequestSchema` |
| `as const` array | `SCREAMING_SNAKE_CASE` | `ERROR_CODES` |
| Inferred type from schema | Same root as schema, no suffix | `ChatRequest` |
| Inferred union from `as const` | Same root as array, singular | `ErrorCode` |

A type and its schema share the same root name. The `Schema` suffix is the only distinction. They are always defined in the same file or the schema file exports the array and the types file imports and infers from it.

### Rule 6 — `$lib/types/` is for cross-cutting TypeScript types with no API association

`$lib/types/` exists for types that are genuinely shared across multiple unrelated modules and have no association with a specific API domain or service. This directory contains TypeScript types and interfaces only — no Zod schemas, no `as const` arrays, no runtime values of any kind.

A type belongs in `$lib/types/` when it meets all of the following:
- It is used across two or more unrelated modules
- It has no natural home in a specific service domain, component, or utility file
- It has no runtime validation counterpart

Current residents:

| Type | Rationale |
|---|---|
| `Result<T>` | Used in service layer and consumed by route handlers and components |
| `AppError` | Used in service layer, route handlers, and error state components |
| `Route` | Used by `routes.ts`, the command palette component, and the intent resolver |

`$lib/types/` is not created speculatively. It is created when the first type meeting these criteria exists. Types are not moved here for organisational convenience — they must genuinely qualify.

### Rule 7 — Component-scoped types live in the component directory

Types used only within a single component are defined within that component's directory. They are not moved to `$lib/types/` unless they later qualify under Rule 6.

```
$lib/ui/CommandPalette/
├── CommandPalette.svelte
├── CommandPalette.test.ts
└── commandPalette.types.ts    # types used only by this component
```

If a component type file grows beyond types for that single component, that is a signal the types have become shared and should be re-evaluated against Rule 6.

---

## Alternatives Considered

### Zod throughout — validate all data at every layer

Use Zod for all type definitions regardless of whether data crosses a network boundary.

**Rejected because:** Zod schemas are runtime objects with non-trivial bundle weight. Applying them to internal TypeScript-only data — content files, component props, store state — adds overhead with no safety benefit. TypeScript's compile-time checking is sufficient for data that never arrives from an untrusted external source.

---

### TypeScript enums for enumerated values

Use `enum ErrorCode { RATE_LIMITED = 'RATE_LIMITED', ... }` as the project standard.

**Rejected because:** TypeScript enums compile to JavaScript runtime objects, adding to bundle size. They require `z.nativeEnum()` to integrate with Zod, which means the values must be maintained in two places. `as const` arrays are erased at compile time, integrate directly with `z.enum()`, and produce idiomatic TypeScript string literal unions.

---

### All types in `$lib/types/` regardless of scope

Centralise every type definition in a single directory for discoverability.

**Rejected because:** This creates an undifferentiated grab-bag that obscures the relationship between types and the code that uses them. Types scoped to a service domain belong with that domain. Types scoped to a component belong with that component. `$lib/types/` is meaningful precisely because it is reserved for types that genuinely have no better home.

---

## Consequences

### Benefits

- Zod is used only where it provides runtime safety — bundle size is not inflated by validating trusted internal data
- `z.infer` and `as const` eliminate the most common source of type drift — manual types that diverge from their schema over time
- Type location is deterministic — given a type, there is exactly one correct place it should live
- `$lib/types/` remains small and purposeful rather than becoming a dumping ground

### Trade-offs

- Types inferred from schemas in `$lib/server/` are not directly importable by client code — if a component needs a type that matches a server schema shape, it must either be duplicated or abstracted into `$lib/types/` as a plain TypeScript type without the schema
- `$lib/types/` requires discipline to remain lean — the qualification criteria in Rule 6 must be applied strictly

### Follow-up

- `Result<T>`, `AppError`, and `Route` must be the first types defined in `$lib/types/` before service layer or routing code is written. These are foundational and referenced by multiple ADRs.
- `ErrorCode` and `ErrorCodeSchema` live in `$lib/server/` as established by this ADR. If route handlers or components need to reference `ErrorCode` by value, the type is re-exported from `$lib/types/` as a plain TypeScript type — the schema stays in `$lib/server/`.

---

## Agent Directives

- **When defining a type for data that arrives from a network request:** define a Zod schema in the relevant `$lib/server/*.schemas.ts` file and infer the TypeScript type from it using `z.infer`. Do not write the type manually.
- **When defining an enumerated set of string values:** use `as const` array with `SCREAMING_SNAKE_CASE` naming. Do not use TypeScript enums. Derive the Zod schema with `z.enum(THE_ARRAY)` and the TypeScript union with `typeof THE_ARRAY[number]`.
- **When adding a Zod import:** confirm the file is inside `$lib/server/`. A Zod import outside `$lib/server/` is a violation.
- **When creating a type used only within one component:** define it in that component's directory. Do not place it in `$lib/types/`.
- **When considering placing a type in `$lib/types/`:** confirm it is used across two or more unrelated modules and has no natural home in a service domain or component. If it does not meet this bar, keep it co-located.
- **When a schema exists for a type:** never write a manual parallel type for the same shape. The inferred type from `z.infer` is the only valid type for that shape.
