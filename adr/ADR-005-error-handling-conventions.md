# ADR-005: Error Handling Conventions

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field             | Value           |
| ----------------- | --------------- |
| **ADR Number**    | ADR-005         |
| **Status**        | `active`        |
| **Date**          | 2026-04-09      |
| **Primary Owner** | Architecture    |
| **Decider**       | Human developer |

---

## Conditional Fields

| Field            | Value                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Related ADRs** | ADR-002 — Data Fetching Patterns, ADR-004 — Semantic HTML and Accessibility Standards |

---

## Scope

Governs error detection, propagation, handling, and user communication across all layers of CXII — service layer, route load functions, API endpoint handlers, and UI components. Applies to `$lib/server/`, `src/routes/`, and all components in `$lib/ui/`. Defines escalation rules and the single exception to local error handling for the chat feature.

---

## Context

Error handling is a first-class concern in CXII, not an afterthought. Any request that can fail must have an error handler before it is considered complete. Two principles drive every error handling decision: keep the user within the context of their current view, and keep the user informed. A system that silently fails, redirects unnecessarily, or delegates error communication to an unrelated component violates both principles. ADR-002 mandates that every `{#await}` block includes a `:catch` branch — this ADR defines what those branches must do and how errors reach them.

---

## Decision

### Rule 1 — Validation-first: prevent invalid states before they cause errors

Errors must not occur because a user was permitted to make an invalid request. Input validation is a prerequisite to error handling — not a complement to it. Before any request is dispatched, its inputs must be validated and any invalid state must be caught and communicated to the user at the point of input.

This applies at every layer:

- UI components validate user input before submitting
- `$lib/server/` service functions validate input at their boundary using Zod schemas before performing any operation
- Route handlers reject malformed requests with appropriate HTTP status codes before delegating to the service layer

An error handler for an invalid input state is a fallback of last resort. The primary goal is that the invalid state is never reachable in normal usage.

### Rule 2 — Handle errors at the level they occur

Every error must be handled at the layer where it originates. Errors are not passed upward through the stack unless no handler exists at the originating level. The area of responsibility belongs to the code making the request.

A component that requests data owns the loading state, the success state, and the error state for that request. It does not delegate error communication to a parent component, a layout, a store, or a notification system.

A partial failure — one component's request failing — must never affect the state, rendering, or functionality of any other component on the page.

### Rule 3 — The service layer uses result types, not thrown errors

Functions in `$lib/server/` return typed result objects rather than throwing errors. This enforces local handling — every call site receives an explicit result and must handle both outcomes. Thrown errors from external APIs are caught within the service function and translated into a typed result before returning.

```ts
// $lib/types/result.ts
export type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

export type AppError = {
	code: ErrorCode;
	message: string;
	detail?: string;
};

export type ErrorCode = 'RATE_LIMITED' | 'UPSTREAM_UNAVAILABLE' | 'INVALID_INPUT' | 'NOT_FOUND' | 'UNKNOWN';
```

```ts
// $lib/server/chat.service.ts
export const streamChatResponse = async (input: ChatRequest): Promise<Result<ReadableStream>> => {
	try {
		const stream = await anthropicClient.stream(input);
		return { ok: true, data: stream };
	} catch (err) {
		return { ok: false, error: mapAnthropicError(err) };
	}
};
```

Route handlers check the result and respond accordingly — they do not let service errors propagate as unhandled exceptions.

### Rule 4 — Inline error states are mandatory; toast notifications are prohibited

Every component that can fail must render its error state inline within its own DOM boundaries. Error messaging is the responsibility of the component making the request — it is never proxied to a toast notification, a snackbar, a global alert, or any UI element rendered outside the component's own subtree.

Toast-style notifications are explicitly prohibited as a mechanism for communicating request or component errors.

Inline error states must be:

- **Human-friendly** — written in plain language, not technical jargon or error codes
- **Clear and concise** — unambiguous about what went wrong
- **Actionable where possible** — offer a path to resolution if one exists (retry, correct input, navigate elsewhere)
- **Accessible** — error messages must be present in the DOM and reachable by screen readers

```svelte
{#await content}
	<LoadingState />
{:then content}
	<ContentView {content} />
{:catch error}
	<ErrorState message="This content couldn't be loaded." action={{ label: 'Try again', handler: reload }} />
{/await}
```

### Rule 5 — `+error.svelte` is reserved for page-level failures only

SvelteKit's `+error.svelte` boundary is invoked only when a failure prevents the current page from rendering entirely. This includes:

- `404` — the requested route does not exist
- `500` — an unrecoverable server error during page load
- A `load()` function throwing an unhandled error

It is not used for component-level data failures, API call failures, or any failure that leaves the page itself renderable. If the page structure can render, the error is handled inline.

### Rule 6 — Escalation is permitted only when no local handler exists

If a lower layer cannot handle an error — because it lacks the context to communicate it to the user — it may escalate to the nearest enclosing handler. Escalation must be deliberate and documented in a comment at the point of escalation. Silent re-throwing without a comment is a violation.

Escalation chain:

```
Service layer → Route handler → SvelteKit error boundary (+error.svelte)
Component → Parent component → Layout (only for the chat exception below)
```

Escalation must stop at the first level that can communicate the error to the user. It must never travel the full chain when an intermediate handler is adequate.

### Rule 7 — Chat unavailability is a layout-level exception

When the AI chat service is unavailable — due to a failed health check, a persistent upstream error, or an environment configuration issue — this state is communicated at the layout level. This is the single exception to Rule 2.

The layout-level handler:

- Marks the chat interface as unavailable
- Communicates the unavailability to the user inline within the interface area
- Degrades the command input to route navigation only — slash commands continue to function
- Does not redirect, does not render `+error.svelte`, and does not prevent access to any content route

Individual chat request failures (a single message failing to get a response) are handled inline within the chat interface component and do not escalate to the layout.

### Rule 8 — Anthropic API errors surface generic messaging

Errors returned by the Anthropic API are caught in the service layer, mapped to an `AppError` with code `UPSTREAM_UNAVAILABLE` or `UNKNOWN`, and surfaced to the user with a generic human-friendly message. Technical detail from the Anthropic response must not be forwarded to the client.

```
"Something went wrong. Please try again."
```

If differentiated error messaging for specific Anthropic failure modes is needed in future, a new ADR must be proposed.

### Rule 9 — `handleError` in `hooks.server.ts` sanitises unexpected errors

SvelteKit's global `handleError` hook is implemented in `hooks.server.ts`. Its responsibilities are:

- Log the full error detail server-side (including stack trace where available)
- Return a sanitised `App.Error` object to the client that contains no stack trace, no internal paths, and no sensitive context
- Map to the appropriate `ErrorCode` where determinable

```ts
// hooks.server.ts
export const handleError: HandleServerError = ({ error, event }) => {
	console.error(error); // server-side log
	return {
		message: 'An unexpected error occurred.',
		code: 'UNKNOWN'
	};
};
```

---

## Alternatives Considered

### Toast notifications for non-critical errors

Display transient toast messages for API failures and background request errors rather than inline states.

**Rejected because:** Toast notifications remove error communication from the component responsible for the request. A user seeing a toast has no clear indication of which part of the interface failed. Inline states are unambiguous and co-located with the failed request.

---

### Thrown errors throughout the service layer

Allow service functions to throw and rely on try/catch at call sites and SvelteKit's error boundary as the ultimate fallback.

**Rejected because:** Thrown errors rely on catch discipline at every level of the call stack. A missed catch sends the error to `+error.svelte`, replacing the entire page — the opposite of keeping the user in context. Result types make every failure explicit and local at the call site without relying on catch discipline.

---

### Global error store for cross-component error state

Maintain a writable store that any component can write error state to, consumed by a global error display component.

**Rejected because:** This is a toast notification system by another name. It decouples error communication from the component responsible for the error, violating the locality principle.

---

## Consequences

### Benefits

- Partial failures are isolated — one component failing never affects the rest of the page
- Error states are always co-located with the request that failed — users always know what went wrong and where
- Result types make unhandled errors impossible to introduce silently — every call site is forced to handle both outcomes
- Validation-first prevents the majority of error conditions from arising in normal usage
- Sensitive error detail never reaches the client

### Trade-offs

- Result types add verbosity at every call site — every service call requires an `ok` check before using `data`
- Inline error states require design work for every component that makes a request — error states are not optional and must be designed alongside the success state
- The chat layout-level exception introduces a single point of coordination between the layout and the chat service state that must be maintained as the chat feature evolves

### Follow-up

- `Result<T>`, `AppError`, and `ErrorCode` must be defined in `$lib/types/` before any service layer code is written. These types are foundational and must not be defined inline or duplicated across modules.
- A shared `<ErrorState>` component should be defined in `$lib/ui/` with props for message and optional action. Individual components use this rather than implementing their own error UI.
- A shared `<LoadingState>` component should be defined alongside `<ErrorState>` for consistency across `{#await}` pending branches.
- The chat layout-level unavailability handler should be designed when the chat interface component is implemented.

---

## Agent Directives

- **When writing a function in `$lib/server/`:** the return type must be `Promise<Result<T>>`. The function must never throw. Catch all external errors internally and return `{ ok: false, error: AppError }`.
- **When calling a service function in a route handler or component:** always check `result.ok` before accessing `result.data`. Never access `result.data` without first confirming `result.ok === true`.
- **When implementing a `{#await}` block:** the `:catch` branch must render an inline error state within the component's own DOM. It must never dispatch to a toast, store, or parent component.
- **When a component has a request that can fail:** the error state is designed and implemented at the same time as the success state. Leaving `:catch` as a placeholder is a violation.
- **When validating user input:** validate before submitting the request. An error handler for invalid input is a last resort — the invalid state must be caught at the input level first.
- **When an Anthropic API call fails:** map to `{ ok: false, error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Something went wrong. Please try again.' } }`. Do not forward API error detail to the client.
- **When the chat service is unavailable:** escalate to the layout-level handler only. Do not render `+error.svelte`. Do not affect content routes.
- **When writing `hooks.server.ts`:** log full error detail server-side. Return only a sanitised message and error code to the client.
