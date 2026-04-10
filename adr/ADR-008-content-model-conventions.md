# ADR-008: Content Model Conventions

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field | Value |
|---|---|
| **ADR Number** | ADR-008 |
| **Status** | `active` |
| **Date** | 2026-04-09 |
| **Primary Owner** | Architecture |
| **Decider** | Human developer |

---

## Conditional Fields

| Field | Value |
|---|---|
| **Related ADRs** | ADR-001 — Project File and Folder Structure, ADR-002 — Data Fetching Patterns, ADR-006 — Type and Schema Conventions |

---

## Scope

Governs the structure, organisation, and consumption of content in `$lib/content/`. Defines the relationship between content files and their two consumers — static page load functions and the server-side system prompt assembler. Does not name specific content files, as these are implementation details that change without architectural significance. Does not govern the system prompt assembler's implementation beyond its dependency relationship with `$lib/content/`.

---

## Context

CXII has no CMS and no database. All content is version-controlled TypeScript source. This content serves two distinct consumers simultaneously: static route pages that render it as HTML, and the AI system prompt that uses it to answer user questions about the owner. The content model must satisfy both consumers without duplicating data or introducing a build step that derives one representation from another. A third potential consumer — external LLM tooling for tasks such as generating tailored documents from the source data — is acknowledged but deferred.

---

## Decision

### Rule 1 — TypeScript objects are the single source of truth

All content is defined as typed TypeScript objects in `$lib/content/`. No content exists in markdown files, JSON files, or any other format within the project. Markdown and other serialised representations are derived outputs — not source files.

This applies without exception. If content is needed in a format other than TypeScript, a serialiser produces that format from the TypeScript source. The source is never maintained in two formats simultaneously.

### Rule 2 — One file per content domain

Each distinct area of content occupies exactly one file in `$lib/content/`. A content domain is a coherent subject area — professional history, skills, current focus, availability, and so on. The specific files that exist at any point in time are implementation details governed by the content itself, not by this ADR.

A file is added when a new content domain is introduced. A file is removed when a domain is retired. Neither action requires an ADR update unless the pattern governing content files changes.

### Rule 3 — Each content file defines its own type

The TypeScript type describing a content domain's shape is defined in the same file as the content data. It is not placed in `$lib/types/` — content types are scoped to their domain and have no reason to be shared globally.

```ts
// $lib/content/[domain].ts

export type SkillCategory = {
  name: string
  skills: Skill[]
}

export type Skill = {
  name: string
  proficiency: 'fluent' | 'proficient' | 'familiar'
  notes?: string
}

const data: SkillCategory[] = [ /* ... */ ]

export const getSkills = (): Promise<SkillCategory[]> =>
  Promise.resolve(data)
```

Types are exported alongside the content function so consumers can reference the shape without importing the data.

### Rule 4 — Content functions return `Promise<T>`

Every content function follows the `Promise.resolve()` pattern established in ADR-002. The return type is always `Promise<T>` — never a raw value. This ensures the data fetching contract is uniform across all content domains and the pattern remains migration-safe if a domain later sources data from an external provider.

```ts
export const getSkills = (): Promise<SkillCategory[]> =>
  Promise.resolve(data)
```

No content file exports raw data directly as a named export intended for direct consumption. All consumption goes through the function.

### Rule 5 — Content files are client-safe

`$lib/content/` files must not import from `$lib/server/`, `$env/static/private`, or any server-only module. Content files are consumed by both client-side load functions (`+page.ts`) and server-side code (`$lib/server/`). A server-only import in a content file would break the client-side consumer.

The dependency direction is strictly one-way:

```
$lib/server/ → $lib/content/    ✓ permitted
$lib/content/ → $lib/server/    ✗ violation
```

### Rule 6 — The system prompt assembler is the server-side content consumer

The system prompt assembler in `$lib/server/` is the only server-side consumer of `$lib/content/`. It imports content functions, resolves their promises, and composes the results into the AI system prompt. No other file in `$lib/server/` imports content directly — all content access from the server side goes through the assembler.

This keeps content aggregation in one place and prevents content access patterns from scattering across the server layer.

### Rule 7 — Content is structured for serialisation readiness

Content types are designed as structured, serialisable objects. Fields use primitive types — strings, numbers, booleans, arrays, and nested objects. No content type contains functions, class instances, symbols, or non-serialisable values.

This ensures that a serialisation utility can traverse any content type and produce text representations (markdown, plain text, structured prompt fragments) without special-casing. The serialisation utility itself is deferred — this rule ensures content types do not preclude it.

### Rule 8 — No Zod schemas in `$lib/content/`

Content files are version-controlled TypeScript source that never receive external input at runtime. Per ADR-006, Zod is required only at network boundaries. Content files do not cross a network boundary and do not require runtime validation. TypeScript types are sufficient.

---

## Alternatives Considered

### Markdown as source, TypeScript as derived

Author content in `.md` files and parse them at build time into typed TypeScript objects for consumption.

**Rejected because:** Structured content — categorised skills, dated experience entries, metadata-rich project records — does not map cleanly to markdown without inventing a fragile parsing convention. TypeScript objects express structure natively and provide compile-time safety. Markdown is a better output format than input format for structured data.

---

### Shared global types in `$lib/types/`

Define all content types in `$lib/types/` for discoverability.

**Rejected because:** Content types are scoped to their domain. A `Skill` type is not shared across unrelated modules — it is used only by the skills content file and its direct consumers. Co-locating the type with the data it describes is cleaner and avoids `$lib/types/` accumulating domain-specific types that do not qualify as global.

---

### Direct data exports without wrapper functions

Export content data directly as named constants rather than wrapping in `Promise.resolve()` functions.

**Rejected because:** Direct exports bypass the `Promise<T>` contract established in ADR-002. If a content domain migrates to an external async source, every consumer importing the raw export must be updated. The function wrapper localises that change to the content file.

---

## Consequences

### Benefits

- Single source of truth eliminates the risk of content diverging across formats
- The `Promise<T>` wrapper makes content source migrations transparent to consumers
- Co-located types keep the shape of data visible alongside the data itself
- Serialisation readiness means external tooling can be added later without restructuring content types
- The one-way dependency rule prevents content files from inadvertently pulling server-only code into the client bundle

### Trade-offs

- TypeScript object syntax is more verbose than markdown for human-authored content — editing content requires familiarity with TypeScript syntax
- The `Promise.resolve()` wrapper is artificial overhead for data that is currently synchronous

### Follow-up

- A serialisation utility in `$lib/server/` that converts content types to markdown or plain text should be implemented when external LLM tooling or custom document generation is required. This ADR establishes the readiness; the implementation is deferred.
- If the content model ever requires external sourcing for a specific domain (e.g. pulling the "now" content from a remote API), that change is isolated to the relevant content function. No ADR update is required unless the sourcing pattern changes for all content domains.

---

## Agent Directives

- **When creating a new content file in `$lib/content/`:** define the TypeScript type in the same file as the data. Export a single function returning `Promise<T>`. Do not export raw data directly.
- **When writing a content type:** use only primitive types, arrays, and nested objects. No functions, class instances, or non-serialisable values.
- **When importing from `$lib/content/` inside `$lib/server/`:** route the import through the system prompt assembler only. Do not import content functions directly into other server-side modules.
- **When importing from `$lib/server/` inside `$lib/content/`:** stop. This is a dependency direction violation. Content files must remain client-safe.
- **When adding a Zod schema to a content file:** stop. Content files do not require runtime validation. TypeScript types are sufficient per ADR-006.
- **When a content domain is added or removed:** no ADR update is required. Update the index only if the pattern governing content files changes.
