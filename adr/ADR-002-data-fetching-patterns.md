# ADR-002: Data Fetching Patterns

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field | Value |
|---|---|
| **ADR Number** | ADR-002 |
| **Status** | `active` |
| **Date** | 2026-04-08 |
| **Primary Owner** | Architecture |
| **Decider** | Human developer |

---

## Conditional Fields

| Field | Value |
|---|---|
| **Related ADRs** | ADR-001 — Project File and Folder Structure, ADR-003 — Progressive Enhancement and No-JS Baseline |

---

## Scope

Governs how data is loaded and consumed across all SvelteKit routes in CXII. Applies to `+page.ts` load functions, `+server.ts` handlers, and any component-level data consumption. Does not govern internal service layer logic within `$lib/server/`.

---

## Context

CXII currently sources all page content from typed TypeScript files in `$lib/content/`. These imports are synchronous. However, the content model may migrate to an external provider (e.g. a headless CMS on a separate domain) in the future, which would make data loading genuinely asynchronous. SvelteKit's default `load()` behavior blocks navigation until data resolves, which conflicts with the requirement that pages render immediately and handle loading state in the component. Establishing a consistent promise-based pattern now prevents a future migration from requiring changes across every route.

---

## Decision

All data loading in CXII follows a single pattern regardless of whether the underlying source is synchronous or asynchronous.

### Rule 1 — All content routes use `+page.ts` with an unresolved promise

Every content route exposes its data via a `load()` function in `+page.ts`. The load function returns an object containing unresolved promises. It must never `await` data before returning.

```ts
// src/routes/resume/+page.ts
import { getResume } from '$lib/content/resume'

export const load = () => ({
  resume: getResume()  // returned as a promise — never awaited
})
```

`getResume()` returns a promise even when the underlying source is synchronous, ensuring the contract is consistent and migration-safe:

```ts
// src/lib/content/resume.ts
import type { Resume } from '$lib/types'

const data: Resume = { /* ... */ }

export const getResume = (): Promise<Resume> =>
  Promise.resolve(data)
```

### Rule 2 — Components consume data exclusively via `{#await}`

All route components receive a `data` prop and resolve it using `{#await}`. No component may access `data.x` directly without going through `{#await}` first.

```svelte
<!-- src/routes/resume/+page.svelte -->
<script lang="ts">
  export let data

  const { resume } = data
</script>

{#await resume}
  <LoadingState />
{:then resume}
  <ResumeContent {resume} />
{:catch error}
  <ErrorState {error} />
{/await}
```

Every `{#await}` block must include all three branches: pending, resolved, and error. Omitting `:catch` is not permitted.

### Rule 3 — `+page.server.ts` is not used for content routes

Content routes do not use `+page.server.ts`. Content files are client-safe TypeScript — there is no reason to restrict them to the server context. `+page.server.ts` is reserved for routes that require direct access to secrets, KV, or Cloudflare bindings. No such route currently exists.

### Rule 4 — The AI chat endpoint is not a load function

The chat interface is global, persistent, and not bound to a specific route. It does not use `load()`. The interface component manages its own request lifecycle, posting to `routes/api/chat/+server.ts` via `fetch()` and managing the streaming response through a dedicated store. This is the only context in which `fetch()` appears in component or store code.

### Rule 5 — Navigation never waits for data

A route must render immediately on navigation. The unresolved promise pattern enforces this — SvelteKit will not block navigation when `load()` returns a pending promise. Blocking load functions (`async load()` with internal `await`) are prohibited in content routes.

### Rule 6 — All content routes must declare `prerender = true`

Every content route `+page.ts` must export `export const prerender = true`. This guarantees the load function runs at build time, the promise resolves before HTML is written to disk, and no-JS users receive fully rendered content. Without this declaration, SvelteKit may fall back to SSR or client-side rendering depending on adapter configuration, making the no-JS guarantee runtime-dependent rather than build-time guaranteed.

```ts
// src/routes/resume/+page.ts
export const prerender = true

export const load = () => ({
  resume: getResume()
})
```

### Rule 7 — `onMount` must not be used to load content

`onMount` executes only in the browser after hydration. Content loaded inside `onMount` is invisible to no-JS users, crawlers, and the SSG build. It is prohibited for any data that must be present in the rendered HTML. `onMount` is permitted only for browser-specific side effects that are not content (e.g. initialising a Web Speech API listener).

---

## Alternatives Considered

### Direct import in `+page.svelte`

Import content files directly in the component script block without a load function.

**Rejected because:** Creates inconsistency between routes that use load functions and those that don't. When a content source becomes async, every component using direct imports requires structural changes. Bypasses SvelteKit's data flow model and makes component scripts responsible for data concerns.

---

### Blocking `async load()` with `await`

Use `async load()` and `await` data before returning, letting SvelteKit handle the resolved value.

**Rejected because:** Blocks navigation until data resolves. The page does not render until load completes. This violates the requirement that routes render immediately and manage loading state in the component via `{#await}`.

---

### `+page.server.ts` for all routes

Run all load functions server-side for consistency.

**Rejected because:** Content files are client-safe TypeScript. There is no security or capability reason to restrict them to the server context. Using `+page.server.ts` without a genuine need introduces unnecessary server dependency and is inconsistent with the stateless, edge-native architecture.

---

## Consequences

### Benefits

- Navigation is never blocked — pages render immediately regardless of data load time
- `{#await}` is the single, consistent pattern for all data consumption across every route
- Content source migrations (e.g. to a headless CMS) require changes only in `$lib/content/` — route files and components are unaffected
- Error states are explicitly required, preventing silent failures

### Trade-offs

- Wrapping synchronous content in `Promise.resolve()` is artificial overhead with no runtime benefit in the current implementation
- Developers unfamiliar with SvelteKit's streaming behavior may not understand why `load()` returns an unresolved promise rather than resolved data — this ADR is the explanation

### Follow-up

- If a content source migrates to an external async provider, the change is isolated to the relevant file in `$lib/content/`. No ADR update is required unless the fetching pattern itself changes.
- If a route requires server-side data (secrets, KV, Cloudflare bindings), a new ADR should be proposed before introducing `+page.server.ts` to establish its usage rules.

---

## Agent Directives

- **When creating a content route `+page.ts`:** return data as unresolved promises. Never use `async load()` with internal `await`. The signature is `export const load = () => ({ key: getData() })`.
- **When creating any content route `+page.ts`:** always include `export const prerender = true` as the first export. Its absence is a violation.
- **When creating a function in `$lib/content/`:** the return type must be `Promise<T>`. Wrap synchronous data in `Promise.resolve()`.
- **When consuming `data` in a `+page.svelte`:** always use `{#await}` with all three branches — pending, `:then`, and `:catch`. Direct access to `data.x` without `{#await}` is a violation.
- **When the chat interface needs to call the AI endpoint:** use `fetch()` in a store, not a load function. This is the only permitted use of `fetch()` outside of `$lib/server/`.
- **When considering `+page.server.ts` for a content route:** do not use it. Content files are client-safe. Only introduce `+page.server.ts` if the route requires direct access to secrets or Cloudflare bindings, and only after a new ADR is approved.
- **When reaching for `onMount` to fetch or display content:** do not. `onMount` is permitted only for browser-specific side effects that are not content. Any content required in rendered HTML must come through `load()`.
