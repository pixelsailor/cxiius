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
6. Submit for review. Once accepted, update Status to `Accepted`.]

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

---

### UI

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| ADR-004 | UI | [Semantic HTML and Accessibility Standards](ADR-004-semantic-html-and-accessibility.md) | active | Fixed document structure with always-present landmarks and nav; HTML is the accessibility layer; CSS and JS are the design layer; ARIA only when native HTML is insufficient |

---

### Security

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| — | — | — | — | *No ADRs yet* |

---

### Quality

| ID | Domain | Title | Status | Description |
|---|---|---|---|---|
| — | — | — | — | *No ADRs yet* |
