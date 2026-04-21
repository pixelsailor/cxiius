# Plan — ai-prompt-dev-option-a

## Objective restatement

Deliver a **developer-only Vitest suite** that performs **real** Anthropic API calls through exported `completeAiChat` (no SDK mocking in that suite) so `$lib/content` and system prompt assembly can be tuned **without** Cloudflare bindings or KV, while **default** `npm test` remains fast and mocked via existing `ai.service.spec.ts`; and document env/setup, CI/quota safety, and a future **Option B** path using `adapter-cloudflare` `platformProxy`, `wrangler.jsonc`, and `.dev.vars` for `npm run dev` / `npm run preview` with KV.

## Scope boundary

**In scope**

- New live integration spec file (proposed name: `src/lib/server/ai.prompt.live.spec.ts`) that imports `completeAiChat` from `./ai.service`, uses the **real** `@anthropic-ai/sdk` (no `vi.mock('@anthropic-ai/sdk')` in this file), and exercises realistic `AiRequest` payloads so prompt/content changes surface in actual model output.
- **Gating** so the live suite does **not** run on the default unit/CI path: e.g. exclude `**/*.live.spec.ts` from the Vitest `server` project `include`/`exclude` (or equivalent), and run live tests only via an explicit npm script (proposed: `test:ai-live`) with an explicit env flag (proposed: `RUN_AI_LIVE=1`).
- **Secrets:** read `ANTHROPIC_API_KEY` from the environment when running the live suite (document setting it locally; align with ADR-009 secret handling — never log or echo the key). Optional: load `.env` for local convenience using Vite `loadEnv` in Vitest setup or documented shell usage — pick one approach in implementation.
- **Documentation** updates: how to set `ANTHROPIC_API_KEY`, run **only** the live tests, and **avoid** burning Anthropic quota in CI (e.g. do not set `RUN_AI_LIVE` in CI; keep live files excluded from default `vitest`); brief **Option B** subsection describing `platformProxy` + `wrangler.jsonc` + `.dev.vars` for dev/preview with KV (no requirement to implement Option B in this task).
- **`package.json`:** add `test:ai-live` (and only minimal related script changes required by the gating strategy).

**Out of scope**

- Implementing Option B (`platformProxy`, wiring KV for local `dev`/`preview`) — **document only** as a future path.
- Changing production HTTP behavior of `src/routes/api/ai/+server.ts` except where mechanically required for unrelated reasons (not expected).
- Mocking or replacing the Anthropic SDK **inside** the live suite (contradicts Option A).
- Moving `completeAiChat` or weakening ADR-009’s production authority: the Worker `/api/ai` path remains the authority for deployed traffic; live tests are **documented dev-only** direct service calls.

## Component/file map

| File | Action | Purpose |
| ---- | ------ | ------- |
| `src/lib/server/ai.prompt.live.spec.ts` | **Create** | Live Vitest tests: real `completeAiChat` + real SDK; assert `Result<{ text: string }>` per ADR-005; use valid `AiRequest` shapes (see Interface contracts). |
| `vite.config.ts` | **Modify** | Exclude `**/*.live.spec.ts` from the default `server` test project `include` (or add `exclude`) so `npm run test` / `npm run test:unit` does not execute live tests; optionally add a dedicated Vitest project or CLI pattern for `test:ai-live` if cleaner than a single-file run. |
| `package.json` | **Modify** | Add `test:ai-live` script (e.g. set `RUN_AI_LIVE=1` and invoke `vitest` against the live file(s) only — use a pattern that works on Windows PowerShell or a small Node/cross-platform pattern). |
| `.env.example` | **Modify** | Document `ANTHROPIC_API_KEY`, `RUN_AI_LIVE`, and pointer to `npm run test:ai-live` / quota-safe usage. |
| `README.md` (or project doc entry point the repo already uses for contributors) | **Modify** | Section (1): env vars, running live tests only, CI/quota guidance; section (2): Option B future — `adapter-cloudflare` `platformProxy`, `wrangler.jsonc`, `.dev.vars` for `npm run dev` / `npm run preview` with KV. If the repo standard is README-only, use `README.md`; do not add new markdown files unless none exists. |
| `src/lib/server/ai.service.spec.ts` | **No change required** (unless import path collisions) | Remains the fast, fully mocked unit suite for CI. |

## Interface contracts

**Service under test (existing — do not change signature in this task unless a bug blocks tests)**

```ts
// src/lib/server/ai.service.ts
export async function completeAiChat(
	apiKey: string,
	body: AiRequest,
	options?: { fetchImpl?: typeof fetch }
): Promise<Result<{ text: string }>>;
```

- **`AiRequest`:** `z.infer<typeof AiRequestSchema>` — strictly `{ input: string }` with semantics enforced by `AiRequestSchema` (`trim`, `min(1)`, `max(500)`, `.strict()`). Live tests should pass objects that satisfy the schema (e.g. `AiRequestSchema.parse({ input: '...' })` or literals known valid).

- **`Result<T>`:** Per `$lib/types/result.ts` — live tests use `if (result.ok)` / narrowing before reading `result.data.text`; failure cases may assert `ok === false` and allowed `error.code` values consistent with `completeAiChat` (e.g. `UNKNOWN` for missing key, `UPSTREAM_UNAVAILABLE` on provider failure).

**Environment (proposed — Builder implements exactly one gating scheme)**

- `ANTHROPIC_API_KEY` — required for successful real calls when live tests run; must not be committed.
- `RUN_AI_LIVE=1` — proposed opt-in flag read by the live spec or Vitest config to document intent (even if exclusion alone would skip the file).

**npm scripts (proposed)**

- `test:ai-live` — runs only the live spec file(s) with opt-in env; does not replace `test` / `test:unit`.

## ADR references

- **ADR-001 (layout):** Live tests belong under `src/lib/server/` next to `ai.service.ts`, consistent with existing `ai.service.spec.ts`. API routes stay thin; no new business logic in `routes/api` for this task.

- **ADR-005 (errors / Result):** Live tests assert on `Result` — no uncaught throws from `completeAiChat`; success path returns `ok: true` and non-empty assistant `text` when the API succeeds; failure paths match documented `AppError` codes from the service.

- **ADR-006 (schemas / types):** Test payloads are valid `AiRequest` values aligned with `AiRequestSchema` — no ad-hoc extra fields; prefer schema parse or typed literals that satisfy the schema.

- **ADR-009 (API boundary):** The **deployed** `/api/ai` Worker remains the sole authority for HTTP validation, rate limits, and shaping for real users. **Implication for this task:** direct `completeAiChat` calls in Vitest are **developer evaluation only** and must be **documented** as such; they must **not** add client-controlled model parameters, must not log secrets, and must not imply the live suite replaces production boundary checks. Using the same service function as production preserves prompt/model/token behavior for tuning; HTTP-only concerns (KV, IP rate limits) are intentionally bypassed here.

- **ADR-010 (KV):** **Not applicable** to Option A live tests (no KV). Document Option B for local dev with KV via Wrangler/`platformProxy` without implementing it in this task.

- **ADR-008 (content model, cross-cutting):** `completeAiChat` already pulls `getAiAssistantGuidelines` and `assembleSystemPromptFromSiteContent`; live runs validate end-to-end prompt assembly from `$lib/content` **as actually used** by the service — implication: content edits are observable without deploying.

## Open questions

1. **Vitest wiring:** Prefer **file exclude** from the default `server` project plus `vitest run src/lib/server/ai.prompt.live.spec.ts` for `test:ai-live`, versus a **second Vitest project** in `vite.config.ts` — Builder should choose the smallest change that keeps `npm test` green without live calls; document the chosen approach in `build-log.md`.

2. **Windows vs POSIX env in npm scripts:** If raw `RUN_AI_LIVE=1 vitest ...` fails on Windows CMD, use a **Node `-e` one-liner**, **`cross-env` devDependency**, or **PowerShell-compatible** script — Builder must verify `npm run test:ai-live` on the project’s primary dev OS or document the limitation.

3. **Assertion depth:** Minimum bar is `ok === true` and non-empty `data.text` for a smoke prompt; optional stronger assertions (substring, refusal behavior) are product decisions — Builder should implement at least one deterministic smoke case unless product specifies more.

4. **`.env` loading:** Whether to add **runtime** loading via Vite `loadEnv` in Vitest setup versus documenting **manual** `export`/`set` only — either is acceptable if `ANTHROPIC_API_KEY` is never printed and CI remains opt-out.
