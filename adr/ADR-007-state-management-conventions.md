# ADR-007: State Management Conventions

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field             | Value           |
| ----------------- | --------------- |
| **ADR Number**    | ADR-007         |
| **Status**        | `active`        |
| **Date**          | 2026-04-09      |
| **Primary Owner** | Architecture    |
| **Decider**       | Human developer |

---

## Conditional Fields

| Field                   | Value                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Deprecated Patterns** | `writable()` / `readable()` Svelte stores, `export let` prop declaration, `on:event` directive, `<slot>` and `$$slots`, `$:` reactive statements |
| **Related ADRs**        | ADR-002 — Data Fetching Patterns, ADR-005 — Error Handling Conventions, ADR-006 — Type and Schema Conventions                                    |

---

## Scope

Governs how reactive state is defined, shared, and scoped across CXII. Applies to all `.svelte` files, `$lib/stores/`, and any shared state classes. Defines which state mechanism is used for which context and establishes the deprecated Svelte 4 patterns that must not appear in new code.

---

## Context

CXII is built on Svelte 5, which introduces runes as the primary reactive primitive. Svelte 5 deprecates several Svelte 4 patterns — including `writable()` / `readable()` stores and `$:` reactive statements — in favour of runes (`$state`, `$derived`, `$effect`) and reactive classes. The preliminary project specification referenced a flat `stores.ts` file using Svelte 4 store conventions. This ADR supersedes that approach and establishes the Svelte 5-idiomatic patterns that must be used throughout CXII.

---

## Decision

### Rule 1 — State mechanism is chosen by scope

The correct state mechanism is determined by where the state is needed, not by preference or familiarity. Three mechanisms are available, applied in this order of preference:

| Mechanism                          | Use when                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------- |
| Local `$state` in component        | State is needed only within a single component                            |
| Reactive class via `createContext` | State is shared within a component subtree                                |
| Reactive class in `$lib/stores/`   | State is shared across unrelated components or persists across navigation |

No mechanism is used outside its defined scope. A store is not created for state that a context would contain. A context is not created for state that belongs in a single component.

### Rule 2 — Local component state uses `$state`

State that does not leave a component is declared with the `$state` rune. `$derived` is used for values computed from state. `$effect` is an escape hatch used only when no other mechanism is adequate.

```svelte
<script lang="ts">
  let inputValue = $state('');
  let isSubmitting = $state(false);
  let charCount = $derived(inputValue.length);
</script>
```

`$effect` must not be used to compute values from state — that is `$derived`'s role. `$effect` must not be used to update state in response to state changes. Its permitted uses are limited to synchronising with external systems that Svelte cannot observe directly (e.g. a Web Speech API listener).

`$effect` must never be wrapped in `if (browser) { ... }` — effects do not run on the server and the check is redundant.

### Rule 3 — Shared state uses reactive classes

State shared across components is implemented as a class with `$state` fields. Svelte 4 `writable()` and `readable()` stores are not used in new code.

```ts
// $lib/stores/chat.svelte.ts
export class ChatState {
  messages = $state<Message[]>([]);
  status = $state<ChatStatus>('idle');
  isAvailable = $state(true);

  readonly isStreaming = $derived.by(() => this.status === 'streaming');
  readonly hasMessages = $derived.by(() => this.messages.length > 0);

  setUnavailable() {
    this.isAvailable = false;
    this.status = 'idle';
  }

  reset() {
    this.messages = [];
    this.status = 'idle';
  }
}
```

Classes with `$state` fields must be defined in `.svelte.ts` files — the `.svelte.ts` extension tells the Svelte compiler to process runes in non-component TypeScript files.

### Rule 4 — Subtree-scoped state uses `createContext`

State needed within a component subtree — not globally — is scoped using `createContext` from `svelte`. This prevents state from leaking between unrelated parts of the component tree and eliminates the SSR risk of module-level state being shared across requests.

`createContext` is preferred over the raw `setContext` / `getContext` pair because it provides type safety.

```ts
// $lib/ui/CommandPalette/commandPalette.context.ts
import { createContext } from 'svelte';

export const commandPaletteContext = createContext<CommandPaletteState>();
```

Context is not used as a substitute for a store when state is genuinely global. The scoping rule in Rule 1 determines which is appropriate.

### Rule 5 — Store files use the `.svelte.ts` extension

All files in `$lib/stores/` that define reactive classes use the `.svelte.ts` extension. Plain `.ts` files in `$lib/stores/` do not contain runes. The extension signals to the compiler that rune processing is required and prevents silent failures when `$state` or `$derived` appear in a non-component context.

```
$lib/stores/
├── chat.svelte.ts        # ChatState class with $state fields
└── interface.svelte.ts   # InterfaceState class with $state fields
```

### Rule 6 — API response state uses `$state.raw`

Data assigned from API responses — including streamed chat content — is stored with `$state.raw` rather than `$state`. API responses are large objects that are reassigned rather than mutated. `$state` creates a deep reactive proxy over objects, which has performance overhead not justified for data that is replaced wholesale. `$state.raw` opts out of deep reactivity while preserving top-level reactivity.

```ts
class ChatState {
  response = $state.raw<ChatResponse | null>(null); // replaced, not mutated

  setResponse(data: ChatResponse) {
    this.response = data; // triggers reactivity; no deep proxy overhead
  }
}
```

### Rule 7 — CXII's defined state classes

Two reactive state classes govern global application state:

**`ChatState`** (`$lib/stores/chat.svelte.ts`)

Owns the full lifecycle of the chat interface:

- Streaming status (`idle` | `loading` | `streaming` | `complete` | `error`)
- Message history for the current session
- Service availability — the layout-level flag defined in ADR-005
- Current streamed response content

**`InterfaceState`** (`$lib/stores/interface.svelte.ts`)

Owns the global interface mode:

- `inputMode` — whether input is in `text` or `voice` mode
- `voiceActive` — whether the Web Speech API is currently listening

These are the only two global state classes at project initialisation. Additional state classes require justification against Rule 1 before being added — state that fits within a component or context must not be elevated to a global store.

### Rule 8 — Runes-only; all Svelte 4 patterns are prohibited

CXII uses Svelte 5 runes mode exclusively. The following Svelte 4 patterns must not appear in new code anywhere in the project:

| Prohibited pattern            | Svelte 5 replacement                              |
| ----------------------------- | ------------------------------------------------- |
| `writable()` / `readable()`   | Reactive class with `$state` fields               |
| `export let prop`             | `$props()` rune                                   |
| `on:click={...}`              | `onclick={...}`                                   |
| `<slot>` / `$$slots`          | `{#snippet ...}` / `{@render ...}`                |
| `$: derived = value`          | `$derived`                                        |
| `$: { statement }`            | `$effect` (only when no better option exists)     |
| `use:action`                  | `{@attach ...}`                                   |
| `<svelte:component this={X}>` | `<X>` directly                                    |
| `<svelte:self>`               | `import Self from './ThisComponent.svelte'`       |
| `class:directive`             | `class` attribute with clsx-style array or object |

---

## Alternatives Considered

### Svelte 4 writable stores

Maintain the `writable()` / `readable()` store pattern from the preliminary specification for familiarity.

**Rejected because:** Svelte 5's own best practices documentation explicitly recommends reactive classes over stores for shared state. Stores remain functional in Svelte 5 for backwards compatibility but are not the idiomatic pattern for new code. Establishing a deprecated pattern as the project convention before development begins creates unnecessary migration debt.

---

### Module-level `$state` without classes

Define shared reactive state as module-level `$state` variables in `.svelte.ts` files rather than encapsulating them in classes.

**Rejected because:** Module-level state in SSR contexts is shared across all requests — a state mutation from one user's request can affect another's. Classes instantiated at the appropriate scope (component tree or store) isolate state correctly. The Svelte documentation specifically flags this risk and recommends context-scoped state or careful instantiation patterns.

---

### Svelte context for all shared state

Use `createContext` everywhere and skip global stores entirely, relying on the layout component to provide context for the whole application.

**Rejected because:** Context is appropriate for subtree-scoped state. Using the root layout to provide context for all global state is functionally equivalent to a global store but with more boilerplate and less clarity about intent. `ChatState` and `InterfaceState` are genuinely global — they persist across navigation and are accessed by unrelated components. A store is the correct mechanism.

---

## Consequences

### Benefits

- Reactive classes encapsulate related state and behaviour together — no scattered store subscriptions
- `.svelte.ts` extension makes it immediately clear which files contain runes
- `$state.raw` for API responses avoids unnecessary deep proxy overhead on large, replaced-not-mutated data
- The deprecated pattern table gives agents an unambiguous reference for what to reject in code review or generation
- Two clearly defined global state classes prevent state sprawl before it begins

### Trade-offs

- Reactive classes are a less familiar pattern than Svelte 4 stores for developers coming from prior Svelte experience
- `createContext` requires more setup than passing props for simple subtree state — the scope decision in Rule 1 must be applied carefully to avoid over-engineering

### Follow-up

- `ChatStatus` type (`'idle' | 'loading' | 'streaming' | 'complete' | 'error'`) should be defined in `$lib/types/` as a cross-cutting type referenced by both `ChatState` and error-handling components
- The layout-level chat unavailability handler described in ADR-005 is implemented via `ChatState.isAvailable` — its integration with `+layout.svelte` should be established when the layout is first implemented

---

## Agent Directives

- **When declaring state inside a single component:** use `$state`. Never reach for a store or context for state that does not leave the component.
- **When sharing state across a component subtree:** use `createContext` with a reactive class. Do not create a global store for subtree-scoped state.
- **When sharing state across unrelated components or across navigation:** define a reactive class in `$lib/stores/` using a `.svelte.ts` file.
- **When storing API response data in a reactive class:** use `$state.raw`. Use `$state` only for state that is mutated in place rather than replaced.
- **When computing a value from state:** use `$derived`. Never use `$effect` to compute or assign derived values.
- **When reaching for `$effect`:** confirm no other mechanism handles the use case. `$effect` is an escape hatch. Document why it is necessary in a comment at the call site.
- **When encountering any Svelte 4 pattern from the prohibited list in Rule 8:** replace it with the specified Svelte 5 equivalent. Do not leave Svelte 4 patterns in new code.
- **When creating a new global state class:** justify why it cannot be local component state or context-scoped state before adding it to `$lib/stores/`.
