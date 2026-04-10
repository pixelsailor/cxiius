# ADR-001: Project File and Folder Structure

| Field | Value |
|---|---|
| **ADR Number** | ADR-001 |
| **Status** | `active` |
| **Date** | 2026-04-08 |
| **Primary Owner** | Architecture |
| **Decider** | Human developer |

---

## Scope

Governs the location, naming, and organizational rules for all files and directories in the CXII project. Applies to `src/`, `static/`, and `tests/` and all files within. Does not govern runtime configuration files at the project root (`svelte.config.js`, `wrangler.toml`, `.env.example`) beyond their established placement there.

---

## Context

CXII is a greenfield SvelteKit project targeting Cloudflare Pages and Workers. The application has two distinct runtime boundaries — client and server/edge — and a service layer that must never be reachable from the browser. SvelteKit's compiler enforces this boundary only for code placed inside `src/lib/server/`. Without an explicit structure decision, agents will make inconsistent placement choices and the server/client boundary will not be reliably enforced.

---

## Decision

The project uses the following canonical structure. Every file must be placed according to this layout. No alternative locations are valid for the categories described.

```
cxii.us/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte             # Global layout — meta, ARIA landmarks, skip links
│   │   ├── +page.svelte               # Root — interface shell
│   │   ├── [route]/                   # Content routes — one folder per path segment
│   │   │   └── +page.svelte           # Prerendered static page
│   │   ├── api/
│   │   │   └── [endpoint]/
│   │   │       └── +server.ts         # Edge endpoint — thin handler only
│   │   └── sitemap.xml/
│   │       └── +server.ts             # Server-rendered sitemap
│   ├── lib/
│   │   ├── server/                    # Server-only — compiler blocks client imports
│   │   │   ├── *.models.ts
│   │   │   ├── *.schemas.ts
│   │   │   ├── *.service.ts
│   │   │   └── *.types.ts
│   │   ├── content/                   # Typed content source files — one per domain
│   │   │   └── *.ts
│   │   ├── stores/                    # Svelte stores
│   │   ├── types/                     # Global shared types — client-safe
│   │   ├── ui/                        # Component folders
│   │   │   └── ComponentName/
│   │   │       ├── ComponentName.svelte
│   │   │       └── ComponentName.test.ts
│   │   ├── utils/                     # Client-safe shared utilities
│   │   └── routes.ts                  # Slash command registry — singleton
│   └── app.html
├── static/
│   ├── favicon.svg
│   └── robots.txt
├── tests/                             # Non-component tests
│   └── *.test.ts
├── .env.example
├── svelte.config.js
└── wrangler.jsonc
```

---

## Naming Conventions

### Files

| Context | Convention | Example |
|---|---|---|
| SvelteKit routes | SvelteKit defaults | `+page.svelte`, `+layout.svelte`, `+server.ts` |
| Server modules | `domain.role.ts` | `chat.service.ts`, `chat.schemas.ts` |
| Content files | `domain.ts` | `resume.ts`, `portfolio.ts` |
| Stores | `domain.ts` | `interface.ts` |
| Utils | `camelCase.ts` | `intentResolver.ts` |
| Components | `PascalCase.svelte` | `CommandPalette.svelte` |
| Component tests | `PascalCase.test.ts` | `CommandPalette.test.ts` |
| Non-component tests | `camelCase.test.ts` | `intentResolver.test.ts` |

### Types and Schemas

| Pattern | Convention | Example |
|---|---|---|
| Type | `PascalCase` | `ChatRequest` |
| Zod schema | `PascalCaseSchema` | `ChatRequestSchema` |
| Inferred type from schema | `PascalCase` (same name, inferred via `z.infer`) | `ChatRequest` |

A type and its corresponding schema share a root name. The schema always carries the `Schema` suffix. Types inferred from schemas are the canonical type — do not define a parallel manual type for the same shape.

---

## `lib/server/` vs `routes/api/` — Mandatory Distinction

These two directories serve fundamentally different purposes and must never be conflated.

**`src/routes/api/`** contains SvelteKit `+server.ts` files that define HTTP endpoints. These are the HTTP interface of the application — they receive a `Request` and return a `Response`. Handlers here must be thin: validate input, delegate to the service layer, return the response. No business logic, no direct API client calls.

**`src/lib/server/`** contains the service layer — business logic, external API clients, KV helpers, prompt assembly, and anything that requires access to secrets or the server runtime. The SvelteKit compiler enforces that nothing in this directory can be imported by client-side code. This is not a convention; it is a build-time guarantee.

---

## Component Rules

Each component lives in its own folder under `src/lib/ui/`. The folder name, the `.svelte` filename, and the `.test.ts` filename must all match exactly and use PascalCase. No barrel or index files. Import components by direct path.

Types specific to a single component are defined within that component's directory, not in `lib/types/`. `lib/types/` is reserved for types used across multiple unrelated modules.

---

## Alternatives Considered

### Flat `lib/` structure (preliminary spec)

The initial project sketch placed `stores.ts`, `routes.ts`, and `system-prompt.ts` as flat files alongside `components/` and `content/` in `lib/`.

**Rejected because:** Does not scale beyond a handful of files, provides no enforced boundary between server and client code, and gives agents no placement rule to follow when adding new modules.

---

### `lib/api/` for the service layer

Naming the service layer `lib/api/` mirrors the naming of `routes/api/` and is a common convention in other frameworks.

**Rejected because:** The name collision between `src/routes/api/` and `src/lib/api/` creates persistent ambiguity about which directory handles HTTP routing vs. business logic. `lib/server/` leverages SvelteKit's built-in compiler enforcement, which `lib/api/` does not receive.

---

## Consequences

### Benefits

- SvelteKit's compiler enforces the server/client boundary automatically via `lib/server/` — no runtime risk of secrets leaking to the browser
- Agents have an unambiguous placement rule for every file type
- Component colocation of tests eliminates the question of where a test file lives
- Naming conventions for schemas and inferred types prevent parallel type definitions for the same shape

### Trade-offs

- Direct component imports are more verbose than barrel imports (`$lib/ui/CommandPalette/CommandPalette.svelte` vs `$lib/ui`)
- `lib/server/` naming is SvelteKit-specific — developers from other frameworks may not recognise the compiler significance without reading this ADR

### Follow-up

- As server-side domains grow beyond `chat`, the `lib/server/` naming pattern (`domain.role.ts`) should be validated against new domains before adding them. If a domain spans multiple files in ways the current pattern doesn't accommodate, a new ADR should be proposed rather than improvising a local structure.

---

## Agent Directives

- **When creating any file that imports from `$env/static/private`, uses `ANTHROPIC_API_KEY`, or accesses Cloudflare KV:** place the file in `src/lib/server/`. Any other location is a violation.
- **When creating a new UI component:** create a folder under `src/lib/ui/` with the PascalCase component name; the `.svelte` file and `.test.ts` file must match the folder name exactly.
- **When adding a new `+server.ts` route handler:** the handler must delegate business logic to `src/lib/server/`. Do not implement service logic directly in the route handler.
- **When defining a Zod schema and its inferred type:** name the schema `ThingSchema` and infer the type as `type Thing = z.infer<typeof ThingSchema>`. Do not define a separate manual `type Thing`.
- **When adding a type:** if the type is used only within a single component, place it in that component's directory. If it is shared across two or more unrelated modules, place it in `src/lib/types/`.
