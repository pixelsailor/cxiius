# Local Development Troubleshooting

This guide focuses on local setup issues for the AI chat path (`/api/ai`) before production deploy.

## Quick smoke test (recommended)

1. Copy `.env.example` to `.env`.
2. Set:
   - `ANTHROPIC_API_KEY`
   - `RATE_LIMIT_ID_SALT`
   - `PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
3. For first-pass local validation, use Turnstile test keys:
   - Site key: `1x00000000000000000000AA`
   - Secret key: `1x0000000000000000000000000000000AA`
4. Run:
   - `npm run build`
   - `npm run preview`
5. Open `http://127.0.0.1:4173` and send a chat message.

If this works with test keys, swap in your real Turnstile keys and repeat the same local preview check.

## Symptom: "Verification failed. Please retry."

Meaning: the browser did not get a Turnstile token before sending the chat request.

Most common causes:

- Missing or invalid `PUBLIC_TURNSTILE_SITE_KEY`
- Missing or invalid `TURNSTILE_SECRET_KEY`
- Env values changed but local dev/preview process was not restarted
- Browser running stale client bundle after env changes

What to do:

1. Confirm `.env` contains both Turnstile values.
2. Fully stop and restart local process.
3. Hard-refresh browser (or open a private window).
4. Re-test via `npm run preview` first.

## Symptom: `/api/ai` returns `service_unavailable`

Possible causes:

- Missing `RATE_LIMIT_KV` binding in local Worker runtime
- Missing `ANTHROPIC_API_KEY` or other required runtime vars

What to do:

1. Run `npm run preview` and verify startup output lists:
   - `env.RATE_LIMIT_KV`
   - `env.ANTHROPIC_API_KEY`
   - `env.RATE_LIMIT_ID_SALT`
   - `env.PUBLIC_TURNSTILE_SITE_KEY`
   - `env.TURNSTILE_SECRET_KEY`
2. Align `wrangler.jsonc` KV namespace IDs with real values.

## Symptom: works in preview, fails in `npm run dev`

Reason: `npm run dev` may not perfectly mirror Worker runtime bindings without adapter `platformProxy` configuration.

Recommendation:

- Use `npm run build && npm run preview` as the source-of-truth local check for `/api/ai`.
- Treat plain Vite dev (`npm run dev`) as UI iteration mode unless platform proxy is configured.

## Symptom: `EBUSY` during build/check on Windows

Reason: another process is holding `.svelte-kit/cloudflare`.

What to do:

1. Stop dev/preview/test watcher processes.
2. Retry `npm run build` or `npm run check`.
3. If needed, close terminals/editors still holding generated files and retry.

## Pre-deploy checklist

- `npm run test`
- `npm run check`
- `npm run build`
- `npm run preview` chat smoke test passes locally
- Real Turnstile keys verified locally (after test-key pass)
