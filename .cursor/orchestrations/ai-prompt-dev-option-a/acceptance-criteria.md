# Acceptance Criteria — ai-prompt-dev-option-a

## Functional

- [ ] **AC-01:** A new file `src/lib/server/ai.prompt.live.spec.ts` exists and imports `completeAiChat` from `./ai.service` (or `$lib/server/ai.service` per project alias conventions).
- [ ] **AC-02:** The live spec file contains **no** `vi.mock('@anthropic-ai/sdk', …)` (and no equivalent that replaces the real Anthropic client for that suite).
- [ ] **AC-03:** Running the default unit command documented for CI (e.g. `npm test` / `npm run test:unit -- --run`) **does not** invoke real Anthropic network calls (verified by: no `ANTHROPIC_API_KEY` required for success, or equivalent evidence such as excluded file pattern and passing run with key unset).
- [ ] **AC-04:** With `ANTHROPIC_API_KEY` set to a valid key and the documented opt-in (e.g. `RUN_AI_LIVE=1` if implemented), `npm run test:ai-live` executes the live spec and at least one test completes a **successful** `completeAiChat` call, asserting `result.ok === true` and non-empty `result.data.text` after TypeScript narrowing.
- [ ] **AC-05:** Live tests use request bodies that satisfy `AiRequestSchema` (single `input` string, length within 1–500 after trim, no extra fields) — e.g. via `AiRequestSchema.parse` or equivalent valid literals.
- [ ] **AC-06:** Existing `src/lib/server/ai.service.spec.ts` remains the mocked, fast suite and still passes under `npm test` (no removal of its mocked coverage unless superseded by an explicit, out-of-scope decision — not expected).

## Architectural / ADR alignment

- [ ] **AC-07:** No secrets are written to source files; `ANTHROPIC_API_KEY` is read only from environment (and optionally local `.env` loaded by tooling), consistent with ADR-009 secret handling expectations for dev.
- [ ] **AC-08:** Documentation explicitly states that direct `completeAiChat` live tests are **developer-only** and do **not** replace the `/api/ai` Worker as the production authority for validation, rate limiting, and HTTP boundary (ADR-009).
- [ ] **AC-09:** Documentation explains how to avoid burning Anthropic quota in CI (e.g. do not enable live env flags in CI pipelines; live files excluded from default test runs).

## Documentation

- [ ] **AC-10:** `.env.example` documents `ANTHROPIC_API_KEY` and the live-test opt-in variable (`RUN_AI_LIVE` or equivalent) and references `npm run test:ai-live` (or the actual script name implemented).
- [ ] **AC-11:** Contributor-facing documentation (e.g. `README.md`) includes: (1) setting `ANTHROPIC_API_KEY`, running **only** the live test script, and CI/quota safety; (2) a concise **Option B** future note: `adapter-cloudflare` `platformProxy`, `wrangler.jsonc`, and `.dev.vars` for `npm run dev` / `npm run preview` with KV — **without** requiring Option B to be implemented.

## Tooling

- [ ] **AC-12:** `package.json` defines a `test:ai-live` script that runs the live Vitest target(s) with the intended opt-in behavior.
- [ ] **AC-13:** `vite.config.ts` (or equivalent Vitest-only config) excludes `**/*.live.spec.ts` from the default `server` test project’s execution path, or uses another mechanism that achieves the same: default test run does not include live specs.
