# ADR-002: Data Fetching Patterns

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field             | Value           |
| ----------------- | --------------- |
| **ADR Number**    | ADR-002         |
| **Status**        | `active`        |
| **Date**          | 2026-04-08      |
| **Primary Owner** | Architecture    |
| **Decider**       | Human developer |

---

## Conditional Fields

| Field            | Value                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Related ADRs** | ADR-001 — Project File and Folder Structure, ADR-003 — Progressive Enhancement and No-JS Baseline, ADR-010 — Storage Conventions — Cloudflare KV |

---

## Scope

Governs how data is loaded and consumed across all SvelteKit routes in CXII. Applies to `+page.ts` load functions, `+server.ts` handlers, and any component-level data consumption. Does not govern internal service layer logic within `$lib/server/`. **Cloudflare KV access from route loads** is governed by **ADR-010** (`+page.server.ts` is not a valid path for KV).

---

## Context

CXII sources page content from typed TypeScript modules in `$lib/content/`. Each domain exposes an async getter returning `Promise<T>` so a future migration (for example, a headless CMS) can swap implementation without changing call signatures.

SvelteKit can return **promises** from `load()` and stream them to the browser. **Streaming deferred data only works when JavaScript is enabled.** If a universal `load()` returns top-level promises and the page resolves them only inside `{#await}` in the component, the server may emit the **pending** branch into HTML while the rest of the resolution depends on client behaviour — **users with JavaScript disabled then see loading shells or empty content**, which violates ADR-003.

Therefore, **content routes that must satisfy the no-JS baseline** resolve `$lib/content` data inside `load()` and pass **plain, serialisable values** on `data`. Pages render that markup directly. `{#await}` is not required for route-loaded content and is a poor fit for this baseline when tied to deferred `load()` promises.

---

## Decision

### Rule 1 — Content routes resolve data in `+page.ts` and return plain values

Every **content route** (pages driven by `$lib/content/`) exposes data through an `async` `load()` in `+page.ts` that **awaits** the relevant content getters and returns a plain object of serialisable values. **Do not** return unresolved promises from `load()` for content that must appear in HTML without JavaScript.

```ts
// src/routes/resume/+page.ts
import { getExperience } from '$lib/content/experience';
import { getIdentity } from '$lib/content/identity';

export const prerender = true;

export const load = async () => {
	const [identity, experience] = await Promise.all([getIdentity(), getExperience()]);
	return { identity, experience };
};
```

Content getters remain `Promise<T>` in `$lib/content/`; **the route** is responsible for awaiting them so `data` is resolved before HTML is produced (including prerender).

### Rule 2 — Content route components read `data` directly

For content routes, `+page.svelte` receives `data` from `load()` and renders it with normal markup (`{#each}`, `{#if}`, etc.). **Do not** wrap route-supplied content in `{#await}` solely to satisfy an older pattern — that pattern conflicts with the no-JS baseline when combined with deferred `load()` promises.

Optional `{#await}` remains appropriate for **other** async UI (for example, a future client-only stream) where ADR-005 applies to `:catch` branches.

### Rule 3 — `+page.server.ts` is discouraged; never for KV or Cloudflare KV access patterns

**Content routes** do not use `+page.server.ts`. Content files are client-safe TypeScript — there is no reason to restrict them to the server context.

**`+page.server.ts` is discouraged project-wide.** Prefer universal `+page.ts` (this ADR), **`+server.ts` API routes**, and **`hooks.server.ts`** unless a requirement truly cannot be met any other way. Any new use of `+page.server.ts` outside the content-route prohibition must be **exceptional**, justified, and recorded in a **proposed ADR** before implementation.

**KV and Cloudflare KV usage (ADR-010):** Reading or writing **Workers KV** — or using any load whose **sole purpose** is to reach KV from a page navigation — **must not** go through `+page.server.ts`. Use **`+server.ts`**, **`hooks.server.ts`**, and **`src/lib/server/kv/`** helpers only. This is not a stylistic preference; it keeps KV access aligned with ADR-010 and avoids tunneling edge state through `load()` in ways content routes cannot use.

**Other server-only needs** (secrets, non-KV bindings): still **prefer** API routes and hooks that delegate to `$lib/server/` before introducing `+page.server.ts`. If no alternative pattern can satisfy the requirement, capture the exception in a new ADR.

### Rule 4 — The AI chat endpoint is not a load function

The chat interface is global, persistent, and not bound to a specific route. It does not use `load()`. The interface component manages its own request lifecycle, posting to `routes/api/chat/+server.ts` via `fetch()` and managing the streaming response through a dedicated store. This is the only context in which `fetch()` appears in component or store code.

### Rule 5 — All content routes must declare `prerender = true`

Every content route `+page.ts` must export `export const prerender = true` (as the first export from that module, after imports). Together with resolved `load()` data, this ensures static HTML generated at build time contains full content for no-JS users and crawlers.

```ts
export const prerender = true;

export const load = async () => {
	/* await getters; return plain objects */
};
```

### Rule 6 — `onMount` must not be used to load content

`onMount` executes only in the browser after hydration. Content loaded inside `onMount` is invisible to no-JS users, crawlers, and the SSG build. It is prohibited for any data that must be present in the rendered HTML. `onMount` is permitted only for browser-specific side effects that are not content (for example, initialising a Web Speech API listener).

---

## Alternatives Considered

### Direct import in `+page.svelte`

Import content files directly in the component script block without a load function.

**Rejected because:** Bypasses SvelteKit's `data` flow, duplicates loading logic per route, and makes layout or shared concerns harder. Use `load()` and `data`.

---

### Unresolved promises from `load()` plus `{#await}` in the page

Return `{ key: getData() }` without awaiting and resolve in the component with `{#await}`.

**Rejected for content routes** because SvelteKit's deferred/streaming behaviour and universal `load()` semantics do not guarantee fully resolved HTML for no-JS visitors when the only resolution path is `{#await}` tied to promises on `data`. ADR-003 requires complete static HTML for content routes.

---

### `+page.server.ts` for all routes

Run all load functions server-side for consistency.

**Rejected because:** Content files are client-safe TypeScript. There is no security or capability reason to restrict them to the server context. Using `+page.server.ts` without a genuine need introduces unnecessary server dependency and is inconsistent with the stateless, edge-native architecture.

---

## Consequences

### Benefits

- No-JS users and crawlers receive full content in the initial HTML for prerendered routes
- `$lib/content` getters keep a stable `Promise<T>` API for future async sources; routes centralise awaiting
- Error handling for failed `load()` uses SvelteKit's normal mechanisms (`+error.svelte`, or structured handling inside `load()`)

### Trade-offs

- Client-side navigations to a content route wait until `load()` finishes before the new page can render (acceptable for small local data; mitigated by prerendered static HTML on first load)
- `{#await}` is no longer the mandated pattern for route data — components must still use it with `:catch` when they genuinely await a promise in markup (ADR-005)

### Follow-up

- If a content source becomes a slow remote dependency, prefer showing stale or partial **server-resolved** HTML for the no-JS baseline and enhancing with JS — do not reintroduce deferred `load()` promises for primary content without revisiting ADR-003
- **KV / ADR-010:** Never introduce `+page.server.ts` as a way to load or mutate KV-backed data for pages; see Rule 3 and ADR-010
- If a **non-KV** requirement appears to need `+page.server.ts`, first rule out `+server.ts`, `hooks.server.ts`, and delegation to `$lib/server/`. If no alternative exists, propose a new ADR that documents the exception before adding `+page.server.ts`

---

## Agent Directives

- **When creating a content route `+page.ts`:** use `async` `load()`, `await` the needed `$lib/content` getters (for example `await Promise.all([...])`), return plain objects. Do not return unresolved promises for content that must render without JavaScript.
- **When creating any content route `+page.ts`:** always include `export const prerender = true` as the first export (after imports). Its absence is a violation.
- **When creating a function in `$lib/content/`:** the return type must be `Promise<T>`. Wrap synchronous data in `Promise.resolve()`.
- **When consuming `data` in a content `+page.svelte`:** render fields from `data` directly. Do not add `{#await}` around route-loaded content solely out of habit.
- **When the chat interface needs to call the AI endpoint:** use `fetch()` in a store, not a load function. This is the only permitted use of `fetch()` outside of `$lib/server/`.
- **When considering `+page.server.ts`:** do not use it for **content routes** (`$lib/content`). Do **not** use it for **KV** or any pattern ADR-010 forbids — use API routes, `hooks.server.ts`, and `src/lib/server/kv/` helpers. For any other case, treat `+page.server.ts` as a **last resort** after ruling out alternatives; require a **proposed ADR** before adding it.
- **When reaching for `onMount` to fetch or display content:** do not. `onMount` is permitted only for browser-specific side effects that are not content. Any content required in rendered HTML must come through `load()`.
