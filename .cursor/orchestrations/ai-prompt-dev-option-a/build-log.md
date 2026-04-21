# Build log — ai-prompt-dev-option-a

## Summary

Implemented Option A: gated Vitest project `ai-live` with `src/lib/server/ai.prompt.live.spec.ts` calling real `completeAiChat`; default `server` test project excludes `**/*.live.spec.ts`. Added `cross-env` and `npm run test:ai-live`. Documented README and `.env.example`. Option B documented in README only (no `platformProxy` code yet).

## Component traceability

| Plan item | Implementation |
| --------- | -------------- |
| Live spec | `src/lib/server/ai.prompt.live.spec.ts` |
| Vitest gating | `vite.config.ts`: `server` excludes `*.live.spec.ts`; new `ai-live` project includes them |
| Script | `package.json`: `test:ai-live` = `cross-env RUN_AI_LIVE=1 vitest run --project ai-live` |
| Env docs | `.env.example`: `RUN_AI_LIVE`, pointers to script |
| Contributor docs | `README.md`: subsections under Developing |

## Deviations from plan

- **`completeAiChat` model string:** Updated `MODEL` in `ai.service.ts` from deprecated `claude-3-5-haiku-20241022` to **`claude-haiku-4-5-20251001`** to match `README.md` tech stack and unblock live Anthropic responses (deprecation/runtime failure on the old id).

## Unresolved open questions

- None blocking; assertion depth is minimal smoke per plan (non-empty assistant text).
