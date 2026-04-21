# Validation report — ai-prompt-dev-option-a

## Verdict

**PASS**

## Acceptance criteria

| ID | Status |
|----|--------|
| AC-01 | PASS — `src/lib/server/ai.prompt.live.spec.ts` created with `./ai.service` import |
| AC-02 | PASS — no `vi.mock('@anthropic-ai/sdk')` in live file |
| AC-03 | PASS — default `npm test` completes without live network (gate + skip) |
| AC-04 | PASS — `npm run test:ai-live` with key succeeds (`result.ok`, non-empty text) |
| AC-05 | PASS — `AiRequestSchema.parse` used for body |
| AC-06 | PASS — `ai.service.spec.ts` unchanged in intent; mocked tests pass |
| AC-07 | PASS — key from env / `.env` via `loadEnv`; not in source |
| AC-08 | PASS — README states dev-only vs `/api/ai` |
| AC-09 | PASS — README warns not to enable live in CI |
| AC-10 | PASS — `.env.example` documents vars + script |
| AC-11 | PASS — README Option B subsection |
| AC-12 | PASS — `test:ai-live` in `package.json` |
| AC-13 | PASS — `server` project excludes `**/*.live.spec.ts` |

## Required remediations

None.

## Notes

- `npm run check` (svelte-check) reports many pre-existing errors under `.svelte-kit/cloudflare/_worker.js` when that artifact is present; not introduced by this task. Targeted ESLint on changed files is clean.
