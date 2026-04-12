# ADR Index — CXII

## Agent Instructions

- Consult this index before making any architectural decision
- Only `active` ADRs are binding; do not act on `proposed`, `deprecated`, or `superseded` entries
- `superseded by ADR-NNN` in the Status column means the listed ADR is invalid — follow the referenced ADR instead
- If no relevant ADR exists for a decision you are about to make, draft one with status `proposed` and surface it for review before proceeding
- ADRs are grouped by Domain table

## Governance

ADR lifecycle governance -- including ownership model, proposal and approval workflows, mandatory triggers, exception
handling, supersession policy, and review cadence -- is defined in [GOVERNANCE.md](GOVERNANCE.md).

## Index Maintenance Rules

- Update this index in the same session as any ADR status change
- `Title` should link to the corresponding ADR file.
- The index and the ADR file must never be out of sync
- ADRs are never removed from this index; use `deprecated` or `superseded by ADR-NNN` as appropriate

## Creating a New ADR

1. Copy [TEMPLATE.md](TEMPLATE.md).
2. Assign the next sequential ID number (e.g., `ADR-025`).
3. Name the file `ADR-NNN-short-kebab-title.md`.
4. Set Status to `Proposed`
5. Fill in all sections.
6. Submit for review. Once accepted, update Status to `active`.]

---

## Index

### Platform

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| — | — | — | — | *No ADRs yet* |

---

### Architecture

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| ADR-001 | Architecture | [Project File and Folder Structure](ADR-001-project-file-and-folder-structure.md) | active | Defines canonical directory layout, file naming conventions, and the enforced server/client boundary via `lib/server/` |
| ADR-002 | Architecture | [Data Fetching Patterns](ADR-002-data-fetching-patterns.md) | active | All content routes return unresolved promises from `+page.ts`; components consume data exclusively via `{#await}` with all three branches required |
| ADR-003 | Architecture | [Progressive Enhancement and No-JS Baseline](ADR-003-progressive-enhancement.md) | active | Defines no-JS functional baseline; navigation must work without JS; chat is an acknowledged JS dependency that must degrade gracefully |
| ADR-005 | Architecture | [Error Handling Conventions](ADR-005-error-handling-conventions.md) | active | Handle errors at the level they occur; result types in service layer; inline error states mandatory; toast notifications prohibited; chat unavailability is the single layout-level exception |
| ADR-006 | Architecture | [Type and Schema Conventions](ADR-006-type-and-schema-conventions.md) | active | TypeScript for internal code; Zod only at network boundaries in `$lib/server/`; `z.infer` over manual types; `as const` over enums; `$lib/types/` for cross-cutting types only |
| ADR-007 | Architecture | [State Management Conventions](ADR-007-state-management-conventions.md) | active | Svelte 5 runes only; reactive classes over stores; scope determines mechanism — local `$state`, subtree context, or global store class; all Svelte 4 patterns prohibited |
| ADR-008 | Architecture | [Content Model Conventions](ADR-008-content-model-conventions.md) | active | TypeScript objects as single source of truth; one file per domain; content types co-located with data; `Promise<T>` wrapper required; client-safe with strict one-way dependency to server layer |
| ADR-010 | Architecture | [Storage Conventions — Cloudflare KV](ADR-010-storage-conventions-cloudflare-kv.md) | active | KV as ephemeral support layer; per-concern namespaces and fixed bindings; `src/lib/server/kv/` helpers only; prefixed keys, Zod values, mandatory TTL; fail closed (limits) / fail open (cache); no `+page.server.ts` for KV |

---

### UI

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| ADR-004 | UI | [Semantic HTML and Accessibility Standards](ADR-004-semantic-html-and-accessibility.md) | active | Fixed document structure with always-present landmarks and nav; HTML is the accessibility layer; CSS and JS are the design layer; ARIA only when native HTML is insufficient |
| ADR-011 | UI | [UI Component Library — bits-ui](ADR-011-ui-component-library-bits-ui.md) | active | bits-ui is the primary headless UI library; use as the base layer for `$lib/ui/` when a suitable primitive exists; LLM docs index at bits-ui.com/llms.txt; agents may fetch linked `llms.txt` without prior approval |

---

### Security

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| ADR-009 | Security | [API Boundary Security and Sanitization Model](ADR-009-boundary-security-and-sanitization.md) | active | Cloudflare Worker is the sole authority for input validation, sanitization, rate limiting, and AI request shaping at `/api/ai`; untrusted client input constrained to a single `input` field; secrets and enforcement remain server-only |

---

### Quality

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| — | — | — | — | *No ADRs yet* |
