# ADR-004: Semantic HTML and Accessibility Standards

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field | Value |
|---|---|
| **ADR Number** | ADR-004 |
| **Status** | `active` |
| **Date** | 2026-04-08 |
| **Primary Owner** | UI |
| **Decider** | Human developer |

---

## Conditional Fields

| Field | Value |
|---|---|
| **Related ADRs** | ADR-003 — Progressive Enhancement and No-JS Baseline |

---

## Scope

Governs semantic HTML structure, ARIA usage, keyboard and input accessibility, animation, and the relationship between visual design and accessibility across all `.svelte` files. Applies to `+layout.svelte`, all route components, and all components in `$lib/ui/`. Does not govern visual design specifics or CSS implementation details beyond accessibility requirements.

---

## Context

CXII presents a deliberately minimal and opaque interface. The design aesthetic may appear to conflict with accessibility standards — there is no traditional navigation visible by default, the primary interaction is a command-driven prompt, and the visual presentation is intentionally ambiguous. However, the opacity of the design is produced entirely by CSS and JavaScript layered on top of complete, semantic, accessible HTML. The underlying document is not opaque. This ADR establishes that accessibility is a structural requirement, not a feature — and that the visual design must never compromise the semantic foundation it is built on.

---

## Decision

### Rule 1 — Document structure is fixed

Every page in CXII uses the following layout structure without exception. This structure is established in `+layout.svelte` and is not overridden or restructured by child routes.

```svelte
<header>
  <!-- Site identity — headline element or structured div -->
  <!-- Primary navigation — always present in the DOM -->
</header>

<main>
  <!-- Route content — structured with heading hierarchy -->
</main>

<footer>
  <!-- Site-level secondary content -->
</footer>
```

All three landmark elements — `<header>`, `<main>`, and `<footer>` — must be present in every rendered page. None may be conditionally rendered or removed by JavaScript or store state.

### Rule 2 — Navigation is always in the DOM; hiding is contextual

The primary `<nav>` element lives inside `<header>` and is always present in the DOM. It contains standard `<a>` elements with valid `href` attributes for all navigable routes. Navigation is never conditionally rendered or gated on JavaScript in the sense of *removing* links from the document — the markup remains available for crawlers, no-JS users, and progressive enhancement (see ADR-003).

`display: none`, `visibility: hidden`, and `aria-hidden="true"` are **not** blanket-forbidden on `<nav>` or elsewhere. They are **forbidden when used to hide content that has no other reachable, equivalent path** for the user’s current mode (no-JS baseline vs. enhanced UI). They are **permitted when** hiding avoids duplicate announcements or redundant tab stops **and** route access remains available through another channel that meets the same bar (keyboard operable, nameable destinations, predictable activation). The decision is **always contextual**; apply the following **hierarchy** so implementations stay consistent.

#### Hierarchy — when may `<nav>` (or similar landmarks) be visually hidden or removed from the accessibility tree?

1. **No-JS / baseline (ADR-003):** Navigation must be clearly visible and usable. Standard links in `<nav>` must not be hidden in a way that removes them from the no-JS experience. Do not rely on `display: none` or `aria-hidden="true"` on `<nav>` to implement the minimal aesthetic *at the expense of* the baseline — the baseline is the visible, focusable link list (styling may be minimal; hiding is not).

2. **Enhanced UI with equivalent route access:** When JavaScript provides another surface that exposes the **same routes** in a keyboard-accessible, screen-reader-sensible way, the literal `<nav>` may be visually suppressed **and** omitted from the accessibility tree **only while** that enhancement is active and equivalent. Example: a bits-ui (or similar) control where typing `/` in the primary text input opens a list or combobox whose options are the same destinations as the `<nav>` links — users can move through options and activate a route without the header `<nav>` being visible or duplicated for assistive technologies. In that scenario, `display: none`, `visibility: hidden`, or `aria-hidden="true"` on `<nav>` is acceptable **because** navigation is not lost; it is **relocated** to the enhanced control.

3. **User or system preference:** Respect browser zoom, high contrast, focus visibility, and other OS or browser settings that affect how content is shown. Do not override those preferences with CSS or scripts in ways that reduce accessibility (for example, forcing a low-contrast or hidden presentation when the user has asked for higher contrast or visible focus rings).

If an enhancement fails to load, errors, or does not expose all routes, the implementation must **not** leave users with no way to reach those routes — fall back to the visible `<nav>` and links per tier 1.

The command palette / slash-driven navigation is an **enhancement layered on** the same destinations as `<nav>` — not an excuse to omit real `href`s from the document. It may **replace the need to expose `<nav>` in the accessibility tree** only when tier 2 is satisfied.

#### Enhanced primary input — command surface and focus (related challenge)

The enhanced UI may visually de-emphasize or “hide” not only `<nav>` but also the **primary text input** used for commands and chat (e.g., borderless, blended into the layout). That is allowed **only** together with a deliberate **command surface** contract:

- The primary input should be **autofocused** when appropriate so keyboard users land on the main interaction surface.
- The interface should treat that input as the **default command target**: global or contextual shortcuts (e.g., `/` for navigation options) should **still work** when practical even if focus has moved elsewhere (e.g., after reading content or using another control). Losing focus must not strand users who expect to type commands without re-clicking.
- **Focus visibility:** The usual rule is that `:focus` is not suppressed without a visible replacement. For this primary input, **minimal or no outline** may be acceptable **if** active engagement is communicated by other persistent means (caret, prompt state, attached palette visibility) and keyboard operability is verified — including after `Escape` and when focus is not inside the input. This is a **known hard problem** for the enhanced UI; implementations must test keyboard-only flows and screen reader announcements, not only the default focused state.

This subsection does not relax ADR-003: without JavaScript, navigation remains link-based and visible as required there.

### Rule 3 — Heading hierarchy is semantic and sequential

Each content route owns exactly one `<h1>` that describes the page. Headings descend sequentially (`h1` → `h2` → `h3`) without skipping levels. Headings are used to describe document structure — not to apply visual styling. If a visual style requires a heading-like appearance at a level that would break the hierarchy, use the correct heading element and apply the desired style via CSS.

The layout does not establish a global `<h1>`. Each route is responsible for its own heading hierarchy starting at `<h1>`.

### Rule 4 — HTML is the accessibility layer; CSS and JavaScript are the design layer

The HTML document must be complete, readable, and navigable before any CSS or JavaScript is applied. Visual design and interactivity are enhancements applied on top of a working semantic foundation.

This means:
- No content is withheld from the DOM to produce a visual effect
- No DOM element is removed or conditionally rendered solely for aesthetic reasons
- `display: none` and `visibility: hidden` are permitted when an element is genuinely not applicable in context, **or** when Rule 2’s hierarchy applies (e.g., duplicate navigation removed from the accessibility tree because an enhanced control exposes the same routes). They must not hide content that is the **only** path to that information or action for the user’s current mode
- Elements that are visually hidden for design purposes but must remain accessible use the established visually-hidden CSS utility class rather than `display: none` — **unless** hiding uses `display: none` / `aria-hidden` deliberately to avoid duplication per Rule 2 tier 2, with equivalent access elsewhere

### Rule 5 — ARIA is used only when semantic HTML is insufficient

Native HTML elements provide accessibility semantics by default. ARIA attributes are used only when no native HTML element or attribute provides the required semantic.

The order of preference is:
1. Use the correct native HTML element
2. Use native HTML attributes (`disabled`, `required`, `aria-label` on interactive elements with no visible label)
3. Use ARIA roles and attributes only when 1 and 2 are genuinely inadequate

ARIA must never be used to compensate for incorrect HTML structure. Applying `role="button"` to a `<div>` when a `<button>` is available is a violation. Fixing the HTML is required.

### Rule 6 — All interactive elements must be keyboard accessible

Every interactive element — links, buttons, inputs, the command palette, the chat interface — must be fully operable via keyboard. This is not supplementary to mouse or touch interaction; keyboard is the primary control surface of the interface.

Requirements:
- All interactive elements are reachable via `Tab` in a logical, predictable order
- `Enter` and `Space` activate buttons and controls per native browser behaviour
- `Escape` closes any open overlay, palette, or modal and returns focus to the triggering element
- Focus is never lost or sent to `<body>` after an interaction
- Focus indicators are never suppressed with `outline: none` without a visible replacement — **except** where Rule 2 (enhanced primary input command surface) allows a negotiated alternative: minimal outline on the primary command input when other cues and keyboard behaviour preserve operability; that exception still requires explicit keyboard and assistive-technology testing

### Rule 7 — Touch and voice input are first-class input surfaces

The interface must be operable via touch and compatible with browser-native voice control and text-to-speech. Requirements:

- All tap targets are a minimum of 44×44px per WCAG 2.5.5
- No interaction requires hover as its sole trigger
- All visible text in interactive elements is the accessible label — do not override with `aria-label` unless the visible label is genuinely insufficient
- Voice control users activate elements by speaking their visible label; labels must match or be contained within the spoken trigger

### Rule 8 — Focus management for dynamic content

Dynamic UI — the command palette, chat responses, overlays — must manage focus explicitly.

- When the command palette opens, focus moves to the first interactive element within it
- When the command palette closes, focus returns to the element that triggered it
- Streamed chat responses must not move focus involuntarily
- New content that appears in the DOM after a user action uses `aria-live` regions only when the content is genuinely a real-time update the user needs to be informed of

### Rule 9 — Animation must respect `prefers-reduced-motion`

All animations and transitions must have a non-animated equivalent. Any element animated with CSS or JavaScript must be wrapped in a `prefers-reduced-motion` media query or checked via `matchMedia` in JavaScript, such that the animation is disabled or reduced when the user has expressed this preference.

Animations in CXII are light and purposeful — icon transitions, fade-ins, subtle motion. No animation is load-bearing. If an animation were removed entirely, the interface must remain fully functional and comprehensible.

```css
/* Required pattern for any animation */
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    transition: opacity 200ms ease;
  }
}
```

---

## Alternatives Considered

### Use `<noscript>` for no-JS navigation fallback

Render a `<nav>` inside a `<noscript>` block so it appears only when JavaScript is disabled.

**Rejected because:** `<noscript>` is a degradation pattern. It withholds content from the DOM when JavaScript is available, removing it from the accessibility tree for all JS-enabled users regardless of their assistive technology. The nav belongs in the DOM unconditionally. CSS and JavaScript style it — they do not determine whether it exists.

---

### Liberal ARIA use for enhanced screen reader context

Apply ARIA roles and properties broadly to provide richer screen reader descriptions throughout the interface.

**Rejected because:** Unnecessary ARIA overrides native semantics and frequently worsens screen reader behaviour. The ARIA specification itself states that no ARIA is better than incorrect ARIA. Native HTML elements carry correct semantics by default. ARIA is introduced only at the precise point where native HTML is genuinely insufficient.

---

## Consequences

### Benefits

- The HTML document is fully accessible to crawlers, screen readers, keyboard users, and voice control independently of CSS and JavaScript state
- The "opaque by design" aesthetic is a CSS and JavaScript concern — it does not require compromising the document structure
- The no-JS baseline remains navigable via real links (ADR-003); enhanced UI may hide duplicate `<nav>` from view and from the accessibility tree only when equivalent route access exists
- Animation preferences are respected without requiring JavaScript — the CSS media query is sufficient for CSS transitions

### Trade-offs

- Implementations must maintain two mental models: baseline (visible `<nav>`) vs. enhanced (slash/command UI may supersede `<nav>` in the accessibility tree). Getting the handoff, fallback on failure, and keyboard behaviour when focus leaves the primary input is non-trivial
- Heading hierarchy discipline constrains visual heading design — CSS handles the appearance, not the element choice

### Follow-up

- A visually-hidden utility class must be defined in the project's base CSS and documented. This class is the canonical way to hide content visually while keeping it accessible when **no** duplicate accessible path exists. Rule 2 clarifies when `display: none` / `aria-hidden` replace that pattern for duplicate navigation.
- Focus indicator styling must be defined as part of the design system. The default browser outline may be replaced but never simply removed without a documented exception for the enhanced primary command input (Rule 2).
- `aria-live` region usage rules should be expanded when the chat streaming implementation is defined.
- Document and test the enhanced command surface: keyboard shortcuts when focus is outside the primary input, and fallback if the enhancement script fails to load.

---

## Agent Directives

- **When creating any page or layout component:** include `<header>`, `<main>`, and `<footer>` as the top-level landmark structure. None of these may be conditionally rendered.
- **When adding navigation:** place `<a href="...">` elements inside `<nav>` inside `<header>`. Never gate navigation on JavaScript or store state.
- **When adding an interactive element that is not a native `<a>` or `<button>`:** stop. Use the native element. Only introduce a non-semantic element with ARIA if no native element is adequate, and document why in a comment.
- **When hiding an element visually for design purposes that must remain accessible:** use the visually-hidden utility class unless Rule 2 (tier 2) applies — duplicate navigation hidden because an enhanced bits-ui–style control exposes the same routes with equivalent keyboard access. Never use `display: none` or `aria-hidden="true"` to hide the **only** path to that content or action for the user’s current mode.
- **When implementing the enhanced primary text input:** follow Rule 2’s command-surface contract (autofocus, shortcuts when focus has moved, focus visibility); verify keyboard-only and screen reader flows.
- **When adding any CSS animation or transition:** wrap it in `@media (prefers-reduced-motion: no-preference)`. Animations outside this query are a violation.
- **When the command palette or any overlay opens:** move focus to the first interactive element inside it. When it closes, return focus to the trigger.
- **When adding a tap target:** confirm the interactive area is at minimum 44×44px.
- **When writing a heading:** use the correct level for document hierarchy. Do not choose a heading level based on its default visual size.
