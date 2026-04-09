# ADR-003: Progressive Enhancement and No-JS Baseline

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field | Value |
|---|---|
| **ADR Number** | ADR-003 |
| **Status** | `active` |
| **Date** | 2026-04-08 |
| **Primary Owner** | Architecture |
| **Decider** | Human developer |

---

## Conditional Fields

| Field | Value |
|---|---|
| **Related ADRs** | ADR-001 — Project File and Folder Structure, ADR-002 — Data Fetching Patterns |

---

## Scope

Governs the baseline functional requirements that must be satisfied without JavaScript across all routes, layout, and navigation. Applies to all `.svelte` files, `+page.ts` load functions, and `+layout.svelte`. Defines the acknowledged JavaScript dependency boundary for the chat feature. Does not govern visual design or interaction micro-details.

---

## Context

CXII's README establishes that the site must remain functional without JavaScript. JavaScript is an enhancement layer — not a requirement. The chat interface is the primary interactive feature and is explicitly dependent on JavaScript, but its absence must not prevent a user from accessing the site or navigating between routes. Without a formal definition of what "functional without JavaScript" means in this project, agents will make inconsistent decisions about what requires JS and what must work without it.

---

## Decision

### Rule 1 — Content is the no-JS baseline

All content routes must render their full content as static HTML without JavaScript. A no-JS user visiting any content route receives a complete, readable, and accessible page. This is guaranteed by the SSG prerender strategy established in ADR-002 — content resolves at build time and is written to disk as HTML.

### Rule 2 — Navigation must function without JavaScript

Site navigation must be fully operational without JavaScript. Navigation links must be standard `<a>` elements with valid `href` attributes pointing to real URL paths. No navigation mechanism may depend on JavaScript event handlers, stores, or client-side routing logic to function.

The command palette and slash command system are JavaScript enhancements. When JavaScript is unavailable, navigation links must be present and accessible in the HTML — either visibly or as a semantically structured fallback — so the site remains navigable.

```svelte
<!-- Correct — works without JS -->
<a href="/resume">Résumé</a>

<!-- Violation — depends on JS -->
<button on:click={() => goto('/resume')}>Résumé</button>
```

### Rule 3 — The chat interface is an acknowledged JavaScript dependency

The chat interface requires JavaScript. This is accepted. The chat feature is a top-tier capability of the site but not a prerequisite for using it. Its absence must degrade gracefully — the interface may be hidden or inert without JavaScript, but its absence must not:

- Prevent access to any content route
- Remove or obscure navigation
- Produce layout breakage visible to no-JS users
- Generate JavaScript errors that affect non-chat functionality

### Rule 4 — No content may be loaded exclusively in `onMount`

Any content that must be present in rendered HTML must not be loaded inside `onMount`. See ADR-002 Rule 7. This rule exists independently of data fetching — it applies to any use of `onMount` that conditionally renders or reveals content.

### Rule 5 — Progressive enhancement is the implementation order

Build the no-JS experience first. Add JavaScript as an enhancement layer on top of a working HTML foundation. Features are not considered complete until the no-JS baseline is verified.

The implementation order is:

1. Semantic HTML structure with full content
2. Accessible navigation via `<a>` elements
3. CSS layout and visual presentation
4. JavaScript enhancements (interactivity, animation, chat)

---

## Alternatives Considered

### JavaScript-first with graceful degradation

Build the full JS experience and add fallbacks afterward.

**Rejected because:** In practice, fallbacks added after the fact are incomplete. The no-JS baseline becomes a second-class concern and degrades over time. Building no-JS first ensures the baseline is structural, not cosmetic.

---

### Treat chat as a hard dependency

Gate the entire site on JavaScript being available, given that the chat interface is the primary interaction model.

**Rejected because:** The README explicitly states the site must function without JavaScript. Static content routes have standalone value independent of the chat feature. Users with JavaScript disabled, crawlers, and assistive technologies must be able to access content.

---

## Consequences

### Benefits

- Crawlers and assistive technologies receive complete, semantic HTML for all content routes
- Navigation works in all environments — no JS, slow JS, failed JS
- The chat interface failing or being slow does not affect the rest of the site
- SSG output is clean static HTML — no hydration required for content pages to be usable

### Trade-offs

- Navigation links must exist as real `<a>` elements even when the command palette is the primary navigation mechanism — this may require a visually minimal but semantically present fallback nav
- The implementation order discipline (no-JS first) requires more deliberate planning than building interactively

### Follow-up

- A fallback navigation structure for no-JS users should be designed alongside the command palette. This is a UI concern and belongs in the UI conventions ADR.
- The accessibility ADR (when written) should reference this decision and expand on ARIA and semantic HTML requirements.

---

## Agent Directives

- **When creating any navigation element:** use `<a href="...">` with a valid path. Never use `<button>` with `goto()` as the sole navigation mechanism for a route.
- **When implementing the chat interface or command palette:** ensure their absence or failure does not remove, hide, or break navigation or content visible to a no-JS user.
- **When using `onMount`:** confirm the content inside is a browser-only side effect, not content. If it affects what a user sees, it must not be in `onMount`.
- **When a feature is considered complete:** verify it renders correct HTML without JavaScript before marking it done.
- **When adding any JavaScript-dependent UI:** ask whether its failure or absence affects content routes or navigation. If yes, the no-JS path must be implemented first.
