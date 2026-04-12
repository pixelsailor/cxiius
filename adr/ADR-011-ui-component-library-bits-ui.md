# ADR-011: UI Component Library — bits-ui

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field | Value |
|---|---|
| **ADR Number** | ADR-011 |
| **Status** | `active` |
| **Date** | 2026-04-11 |
| **Primary Owner** | UI |
| **Decider** | Human developer |

---

## Conditional Fields

| Field | Value |
|---|---|
| **Related ADRs** | ADR-001 — Project File and Folder Structure; ADR-004 — Semantic HTML and Accessibility Standards |
| **Cursor Rules** | `.cursor/rules/bits-ui-documentation.mdc` |

---

## Scope

Governs the choice of headless UI primitives for components under `src/lib/ui/`. Applies to new and changed components in that tree when a third-party primitive would reduce bespoke accessibility and behavior work. Does not mandate bits-ui for every file in `$lib/ui/` — plain Svelte and semantic HTML remain valid when no primitive applies or when a minimal custom implementation is clearer. Does not govern styling (bits-ui is unstyled; project CSS and design tokens remain separate). Does not replace ADR-004: native HTML and accessibility rules still apply; bits-ui is used to implement them consistently where it fits.

---

## Context

CXII already depends on **bits-ui** as an accessible, unstyled primitive layer aligned with Svelte 5. Without an explicit decision, contributors might mix ad hoc patterns, duplicate focus and keyboard behavior, or add overlapping libraries. ADR-001 defines folder and naming rules for `$lib/ui/` but did not name a component stack. A single primary library keeps imports predictable and keeps agent guidance unambiguous.

---

## Decision

**bits-ui** is the **primary** UI component library for CXII. When adding or evolving UI under `src/lib/ui/`, use bits-ui as the **base layer** for interactive primitives (for example dialogs, menus, listbox/combobox patterns, tabs, accordions) **when a suitable bits-ui primitive exists** and the component needs that behavior. Compose project-specific presentation and layout in Svelte around those primitives. If no bits-ui primitive matches the need, use semantic HTML and native elements per ADR-004, or minimal custom Svelte — do not introduce a second headless component framework for the same role without a new ADR.

---

## Alternatives Considered

### Melt UI or other Svelte headless libraries

Other headless libraries offer similar primitives with different APIs.

**Rejected because:** bits-ui is already adopted, documented for Svelte 5, and fits the unstyled-primitive role; a second library would split patterns and increase bundle and mental surface area.

---

### Only bespoke components with no shared primitive layer

Implement every interactive control from scratch in `$lib/ui/`.

**Rejected because:** Reimplementing focus management, keyboard roving, and ARIA wiring for complex widgets is error-prone and conflicts with the goal of consistent accessibility (ADR-004).

---

### Styled component kits (e.g. full design systems with baked-in visuals)

Adopt a library that ships pre-styled components.

**Rejected because:** CXII’s visual language is custom and minimal; unstyled primitives plus project CSS preserve control and align with the existing README stack choice.

---

## Consequences

### Benefits

- One import surface and documentation set for headless widgets in `$lib/ui/`
- Accessibility behaviors (focus, keyboard, ARIA) centralized in maintained primitives
- Agents and humans share the same default when scaffolding new interactive components

### Trade-offs

- Contributors must learn bits-ui patterns for primitives they use; documentation is out-of-repo
- Upgrades to major bits-ui versions may require mechanical updates across composed components
- “When applicable” still requires judgment — this ADR does not remove the need to choose plain markup when that is simpler

### Follow-up

- If a future requirement cannot be met by bits-ui and semantic HTML alone, propose a focused ADR (additional library or custom pattern) rather than ad hoc exceptions.

---

## Agent Directives

- **When creating or substantially editing a component under `src/lib/ui/` that implements a complex interactive pattern bits-ui provides (e.g. dialog, dropdown menu, combobox, tabs):** start from the corresponding bits-ui primitive and compose project UI around it unless plain HTML is sufficient or the pattern is out of scope for any library.
- **When choosing imports for new interactive UI in `src/lib/ui/`:** prefer `bits-ui` for headless primitives before adding another headless UI dependency or reimplementing the same behavior by hand.
- **When implementing or debugging bits-ui usage in `src/lib/ui/`:** fetch official bits-ui documentation from the LLM-oriented index at [https://bits-ui.com/llms.txt](https://bits-ui.com/llms.txt). That page links to component- and topic-specific `llms.txt` URLs (for example under `https://bits-ui.com/docs/...`). **Agents may retrieve any of those linked `llms.txt` resources as needed without prior human approval** — this is pre-approved reference material for CXII work, not arbitrary web browsing.

---

## Notes

Package dependency: `bits-ui` (see root `package.json`). Project README summarizes the stack; this ADR is the normative reference for using bits-ui inside `$lib/ui/`.

**Documentation (LLM-oriented):** The canonical entry point is [https://bits-ui.com/llms.txt](https://bits-ui.com/llms.txt), which indexes the full docs bundle and per-page `llms.txt` files. Use it to locate the right page for a primitive (for example Dialog, Combobox, Command) before implementing.
