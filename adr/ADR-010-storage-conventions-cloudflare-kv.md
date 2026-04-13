# ADR-010: Storage Conventions — Cloudflare KV Usage and Access Patterns

---

## Metadata

| Field             | Value           |
| ----------------- | --------------- |
| **ADR Number**    | ADR-010         |
| **Status**        | active          |
| **Date**          | 2026-04-10      |
| **Primary Owner** | Architecture    |
| **Decider**       | Human developer |

---

## Conditional Fields

| Field            | Value                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Related ADRs** | ADR-001 — Project File and Folder Structure; ADR-002 — Data Fetching Patterns; ADR-006 — Type and Schema Conventions; ADR-009 — API Boundary Security and Sanitization Model |

---

## Scope

This ADR governs **Cloudflare Workers KV** as used by the CXII application: namespace strategy, binding names, key/value conventions, TTL and size limits, where code may read or write KV, typing, failure semantics, local development, and testing. It applies to all server-side code that interacts with KV, including API route handlers, `hooks.server.ts`, and modules under `src/lib/server/kv/`.

This ADR does **not** govern relational storage (D1 is out of scope for this project). It does **not** decide where long-lived static assets or images are hosted (R2, Pages assets, or another host remain a separate decision). It does **not** replace ADR-009’s security model for `/api/ai`; KV usage there must remain consistent with ADR-009 and this ADR’s storage rules.

---

## Context

The project runs on Cloudflare Workers via `@sveltejs/adapter-cloudflare`. KV provides a small, eventually consistent key-value layer suitable for rate limiting, short-lived caching, and other non-authoritative state. Without explicit conventions, bindings leak into handlers, keys collide across features, values grow unbounded, and agents may store sensitive or disallowed data. Prior ADRs established server-only placement (`src/lib/server/`) and security expectations at the API boundary but did not define KV-specific operational rules. This ADR fills that gap using common Workers practices: separate namespaces per concern, prefixed keys, mandatory expiration, typed helpers, and conservative failure modes.

---

## Decision

**Cloudflare KV is an ephemeral support layer only.** It is used for rate limiting, optional response caching, and other temporary, non-critical data. It is not a system of record. **D1 is not used.** R2 or other object storage for static assets is undecided and outside this ADR.

**Namespaces and bindings**

- Use **one KV namespace per concern**. Bindings use **fixed names** that match wrangler configuration exactly — **no aliasing** (do not rename bindings in application code).
- Required binding: **`RATE_LIMIT_KV`** for rate limiting.
- Optional binding: **`CACHE_KV`** — create and bind this namespace **only** if HTTP or compute caching backed by KV is enabled. If caching is not implemented, omit `CACHE_KV` from configuration.

**Keys**

- Mandatory pattern: **`<feature>:<identifier>`** — one colon separating a feature prefix from the identifier segment (e.g. `cache:a1b2c3…`, `rl:…`).
- **No shared prefixes between features.** Each feature owns a distinct `<feature>` prefix.
- **Keep keys short** (KV key length limit is 512 bytes; stay well under this).
- **Never store raw IP addresses in keys.** Use **`hash(ip + salt)`** (or an equivalent stable HMAC/hash with a server-only salt from environment) for identifiers derived from client IP. The salt must be a **secret** (Worker env), not committed as a literal.
- Do not encode PII or raw user input in keys.

**Values**

- **JSON is allowed** for structured values. Payloads must be **small (target 1–5 KB per value)**, **self-contained**, and **shallow** — avoid deep nesting.
- **All structured values read from or written to KV must be validated or constructed with Zod** (see ADR-006) at the helper boundary so invalid shapes never propagate.

**TTL and permanence**

- **Every write must set expiration** (`expiration` or `expirationTtl`). **No permanent keys.**
- **Rate limiting and similar control-plane data:** TTL **5 minutes or less** per key or per sliding-window strategy as implemented in helpers.
- **Cache entries:** TTL **between 1 hour and 24 hours** as appropriate for the cached resource.

**Code layout and access**

- All KV reads and writes go through **helpers under `src/lib/server/kv/`** only. Organize by concern (e.g. rate limit helpers, cache helpers).
- **Direct use of KV bindings is forbidden outside those helpers** — do not call `env.RATE_LIMIT_KV.get()`, `put()`, `delete()`, or `list()` from API routes, hooks, or other modules. Call exported helper functions that encapsulate binding access.
- **Allowed call sites** that may invoke KV helpers: **`+server.ts`** (API routes), **`hooks.server.ts`**, and other modules under **`src/lib/server/`** that are imported by those entry points.
- **`+page.server.ts` is forbidden** for KV access or any path that exists solely to reach KV from a page load. Prefer API routes and server hooks plus `src/lib/server/kv/` helpers.

**Typing**

- Use **Wrangler-generated environment types** (`npm run gen` / `wrangler types`) so `env` reflects declared bindings. **No `any`** for `env` or KV payloads at helper boundaries — use Zod-inferred types or explicit interfaces aligned with validation.

**Consistency and correctness**

- **Do not rely on read-after-write correctness.** KV is eventually consistent; design for **approximate** rate limits and **possibly stale** cache reads.

**Failure semantics**

- **Rate limiting:** on KV failure (read/write errors, timeouts), **fail closed** — deny or error the protected operation rather than bypass limits.
- **Caching:** on KV failure, **fail open** — omit cache read/write and continue without cache rather than failing the user request (unless a stricter policy is mandated elsewhere for a specific route).

**Disallowed content in KV**

Secrets, full prompts or system prompts, raw user input, PII, and raw IP addresses must **not** be stored in KV values or keys. KV usage must align with ADR-009 and general security constraints.

**Local development and tests**

- Use **`wrangler dev`** (or the project’s preview script that runs the built Worker) for integration behavior; accept Miniflare/KV simulation limitations.
- **Unit tests** must **mock KV** (in-memory stub or injected mock). **Do not** use Cloudflare Workers test pools for this project’s unit tests.

---

## Alternatives Considered

### Single shared KV namespace for all features

One namespace with only key prefixes to separate concerns.

**Rejected because:** Namespace-level isolation simplifies binding clarity, quota reasoning, and operational rotation. Separate namespaces per concern match Cloudflare’s model and reduce accidental cross-feature operations.

### Direct binding access in route handlers

Pass `platform.env` into routes and call `env.RATE_LIMIT_KV` inline.

**Rejected because:** Duplicated key shapes, inconsistent TTL handling, and higher risk of forbidden data storage. Centralized helpers enforce one implementation of prefix rules, Zod validation, and failure policy.

### Using `+page.server.ts` for KV-backed page data

Load KV in SvelteKit `load` via `+page.server.ts` when a page needs edge state.

**Rejected because:** The project standardizes KV access through API routes, hooks, and `src/lib/server/kv/` helpers; `+page.server.ts` is excluded to keep KV usage predictable and to align with existing data-fetching ADRs for content routes.

---

## Consequences

### Benefits

- Clear, reviewable surface for all KV operations (`src/lib/server/kv/`).
- Binding names match infrastructure; no duplicate naming schemes.
- Mandatory TTL prevents unbounded growth and “forgotten” keys.
- Fail-closed rate limits and fail-open cache reduce abuse and user-visible outages appropriately.
- Zod-validated values catch schema drift early.

### Trade-offs

- Helpers add indirection; small features pay a one-time module cost.
- Eventual consistency means limits and cache are best-effort, not exact or strongly consistent.
- Hashing IP-derived identifiers requires a managed secret salt and careful key design.
- `wrangler.jsonc` must stay in sync with this ADR when namespaces are added or removed.

### Follow-up

- **ADR-002 alignment:** ADR-002 now states that **`+page.server.ts` is discouraged in general**, that **KV must not** be accessed via `+page.server.ts`, and that API routes / hooks / `src/lib/server/kv/` helpers are the correct paths — consistent with this ADR.
- **ADR-009 wording:** ADR-009 describes rate limiting “per IP” while storage keys must use hashed identifiers. Treat “per IP” as **logical** (one counter per client IP) with **storage** using hashed keys per this ADR; consider a small wording pass on ADR-009 for consistency.
- **Infrastructure:** Add `RATE_LIMIT_KV` (and `CACHE_KV` if caching ships) to `wrangler.jsonc` and Cloudflare dashboard when implementing; run `npm run gen` and commit generated types.
- **Static assets / R2:** Decide hosting for images and similar assets; update or add an ADR when chosen.

---

## Agent Directives

- **When** adding or modifying Cloudflare KV usage: implement reads and writes only in `src/lib/server/kv/` and expose functions; do not call `env.RATE_LIMIT_KV`, `env.CACHE_KV`, or other KV bindings outside that directory.
- **When** writing a KV key: use the form `<feature>:<identifier>` with a feature-unique prefix; never include raw IP addresses, PII, secrets, raw user input, or full prompts in keys or values.
- **When** persisting structured data to KV or parsing KV values: validate with Zod at the helper boundary; keep JSON small and shallow (target 1–5 KB).
- **When** writing any KV key: set expiration (rate-limit-related TTL ≤ 5 minutes; cache TTL between 1 and 24 hours); never write without TTL.
- **When** implementing rate limiting backed by KV: on KV errors, fail closed (deny or return error for the protected operation).
- **When** implementing cache backed by KV: on KV errors, fail open (skip cache; serve without blocking the request unless another ADR requires otherwise).
- **When** using KV from application entry points: only from `+server.ts`, `hooks.server.ts`, or modules under `src/lib/server/` consumed by those; do not add `+page.server.ts` for KV.
- **When** defining Worker bindings: use the exact names `RATE_LIMIT_KV` and (if caching exists) `CACHE_KV`; update Wrangler config and regenerate env types; do not alias bindings in code.
- **When** writing unit tests that touch KV helpers: mock KV; do not use Cloudflare Workers test pools.

---

## Notes

- Cloudflare KV is **not** strongly consistent; duplicate or reorder edge cases are acceptable for the use cases above.
- Optional response caching remains product-dependent; until implemented, only `RATE_LIMIT_KV` may exist in configuration.
- Best-practice references: [KV documentation](https://developers.cloudflare.com/kv/concepts/how-kv-works/) (eventual consistency, limits), [Workers runtime limits](https://developers.cloudflare.com/workers/platform/limits/).
