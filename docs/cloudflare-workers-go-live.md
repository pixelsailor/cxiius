# Cloudflare Workers Go-Live Runbook

This document is a practical checklist for getting `cxiius` live on Cloudflare using the current SvelteKit + `@sveltejs/adapter-cloudflare` setup.

## Current state assessment (as of 2026-04-22)

- `svelte.config.js` is already configured with `@sveltejs/adapter-cloudflare`.
- `wrangler.jsonc` exists and points `main` to `.svelte-kit/cloudflare/_worker.js`.
- Required runtime bindings are implemented in code:
  - KV binding: `RATE_LIMIT_KV`
  - Vars/secrets: `RATE_LIMIT_ID_SALT`, `ANTHROPIC_API_KEY`
- `src/routes/api/ai/+server.ts` depends on those bindings.
- Local blockers are cleared:
  - `npm run check` passes cleanly
  - `npm run build` passes with automated `.svelte-kit` cleanup via prebuild
  - Resume education field now consistently uses American spelling (`honors`)

## Decision: deploy target

Use **Cloudflare Workers** as the deployment target and connect the GitHub repo via **Workers Builds**.

Why: the app is already configured as a Worker build output (`wrangler.jsonc` + adapter output), and runtime bindings are Worker-style.

## Phase 1 - Local readiness checklist

Complete these before first production deployment.

### 1) Fix type-check blockers

- Fix typo in `src/routes/resume/+page.svelte`:
  - `education.honours` -> `education.honors`
- Resolve `svelte-check` scanning generated `.svelte-kit/output` JS files.
  - Preferred: adjust ts/svelte check configuration so generated runtime chunks are not checked as strict project source.
  - Target outcome: `npm run check` passes cleanly.

### 2) Stabilize Windows build workflow

The project now includes a prebuild cleanup script (`scripts/clean-sveltekit-cloudflare.mjs`) wired through `prebuild`, so `npm run build` first removes `.svelte-kit/cloudflare` with retries before adapter output.

If you still hit an intermittent lock:

- Ensure no process is holding `.svelte-kit` (stop preview/dev/test watchers).
- Run `npm run build` again (prebuild retry handles most transient lock races).
- Use Linux CI for deterministic release artifacts.

Target outcome: `npm run build` completes without adapter failure.

### 3) Prepare production Wrangler configuration

Update `wrangler.jsonc`:

- Keep `name`, `main`, and `assets` as-is unless you intentionally rename worker/app.
- Replace template KV namespace IDs:
  - `kv_namespaces[0].id`
  - `kv_namespaces[0].preview_id`
- Keep secrets out of committed config (`RATE_LIMIT_ID_SALT` and `ANTHROPIC_API_KEY` are secrets in Cloudflare, not `vars` in git).

Then regenerate worker env types:

```sh
npm run gen
```

### 4) Local preflight command set

Run before pushing deploy branch:

```sh
npm run check
npm run test
npm run build
```

## Phase 2 - Cloudflare account setup

### FAQ: There is no separate "Rate Limit KV" or "Rate Limit ID" in Cloudflare

Cloudflare does sell other rate-limiting products (for example **Rate limiting rules** on zones), but **this project does not use those for `/api/ai`**.

What you need instead:

1. **A normal Workers KV namespace** — the same kind of KV you already created. There is no special KV type for "rate limiting" in the dashboard. The app stores short-lived counters in KV using keys like `rl:…` (see `src/lib/server/kv/aiRateLimit.ts`).

2. **`RATE_LIMIT_KV` is a binding name in config and code**, not something you create in the UI with that label. In `wrangler.jsonc`, `binding` must stay `RATE_LIMIT_KV` because `src/routes/api/ai/+server.ts` reads `platform.env.RATE_LIMIT_KV`. The **`id`** and **`preview_id`** fields are the **namespace IDs** (32-character hex strings) of KV namespaces you already have or create.

3. **`RATE_LIMIT_ID_SALT` is not from Cloudflare at all** (and it is not a KV namespace ID — the full name is `RATE_LIMIT_ID_SALT`, always with `_SALT` on the end). It is a **secret string you invent** (for example 32+ random bytes from a password manager or `openssl rand -hex 32`). The Worker uses it with hashing so raw client IPs are not stored in KV keys (ADR-010). Set it as a **Worker secret** with exactly that name — you will not find it under KV; it lives with other Worker secrets.

### Why your Wrangler binding is not named `cxiius_kv`

When you run `npx wrangler kv namespace create cxiius_kv`, **`cxiius_kv` is the human-readable namespace title** in Cloudflare. It is **not** the name your Worker code uses to reach KV.

The app reads **`platform.env.RATE_LIMIT_KV`** only. In `wrangler.jsonc`, the object field `"binding"` must therefore be **`RATE_LIMIT_KV`**, while `"id"` is the **namespace ID** returned when you created `cxiius_kv` (32 hex characters). Same KV store, correct env name for the code.

### What is `preview_id`? (You will not see this label in the KV dashboard)

**`preview_id` exists only in Wrangler config** (`wrangler.jsonc`). Cloudflare’s KV UI shows **Namespace ID**; it does not call anything “preview ID.”

Wrangler uses **`id`** for production deploys and **`preview_id`** for **local `wrangler dev`** and some preview-style runs, so you can point dev at a different namespace than production. If you only created **one** namespace (`cxiius_kv`), put **the same Namespace ID** in both `id` and `preview_id`. That is normal and expected.

Optional later: create a dedicated preview namespace with `wrangler kv namespace create <some-name> --preview` and put that second ID only in `preview_id`.

**Where to find your KV namespace ID in the dashboard**

- **Workers & Pages** → **KV** (Storage) → open your namespace → copy **Namespace ID** (32 hex characters).
- Or: **Storage & databases** → **KV** → your namespace → details show the ID.

Paste that value into `wrangler.jsonc` as `kv_namespaces[0].id`. For `preview_id`, you can either:

- Create a second namespace (optional) for preview/local dev and paste its ID, or
- Use the **same** namespace ID as `id` for both fields while you are getting started (simplest).

**After importing GitHub and deploying**

That first deploy is expected. Finish wiring: set the two secrets on the Worker (or in the build environment if your setup requires it), attach KV with binding name **`RATE_LIMIT_KV`**, ensure `wrangler.jsonc` lists your real **namespace ID** under `RATE_LIMIT_KV` (binding name stays `RATE_LIMIT_KV` even if the namespace title in Cloudflare is `cxiius_kv`), commit, redeploy.

### 1) Create (or verify) Worker and KV namespace

In Cloudflare Dashboard:

- Go to **Workers & Pages**.
- Create a Worker project (or let Workers Builds create it during GitHub import).
- Create a **Workers KV** namespace (any title you like, for example `cxiius-rate-limit-kv`). You reuse this namespace for the `RATE_LIMIT_KV` binding.
- Copy the namespace **ID** (32 hex chars) into `wrangler.jsonc` as `id` and `preview_id` (or two different namespaces if you prefer).

You can also create KV via CLI:

```sh
wrangler kv namespace create cxiius-rate-limit-kv
wrangler kv namespace create cxiius-rate-limit-kv-preview --preview
```

Copy the printed IDs into `wrangler.jsonc` (`id` = production namespace, `preview_id` = preview namespace, or use one ID for both).

### 2) Configure production secrets/vars in Cloudflare

Set these in Worker settings (Production environment):

- Secret: `ANTHROPIC_API_KEY`
- Secret: `RATE_LIMIT_ID_SALT`
- KV binding:
  - Variable name: `RATE_LIMIT_KV`
  - Namespace: your production KV namespace

Optional/staging:

- Add the same keys in a Preview/Staging environment with separate KV namespace.

Exact values to enter:

- **KV binding variable name**: `RATE_LIMIT_KV`
- **Worker secret names**: `ANTHROPIC_API_KEY`, `RATE_LIMIT_ID_SALT`
- **Wrangler config path**: `wrangler.jsonc`
- **Wrangler KV `id` / `preview_id`**: both must be your KV **namespace ID** (32 hex chars). If you only have one namespace, use the same ID twice. The KV UI does not label either field “preview”; `preview_id` is only for Wrangler (local dev / optional separate preview namespace).

### 3) Connect GitHub repo (Workers Builds)

In Cloudflare Dashboard:

1. Open **Workers & Pages** -> **Create** -> **Import a repository** (Workers Builds).
2. Authorize Cloudflare GitHub app access to your repo/org.
3. Select the `cxiius` repository and target branch (usually `main`).
4. Configure build/deploy:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (if prompted explicitly)
   - Root directory: repo root (or subdirectory if monorepo)
5. Confirm that Wrangler config path is `wrangler.jsonc`.
6. Add required secrets/bindings in build settings if not inherited from Worker settings.
7. Save and trigger first deployment.

## Phase 3 - CI/CD and domain go-live

### 1) Verify deployment

After first successful build:

- Open the generated `*.workers.dev` URL.
- Validate:
  - Static routes render
  - `/api/ai` responds
  - Rate limit behavior returns `429` when exceeded

### 2) Connect custom domain

In Worker settings:

- Add `cxii.us` and `www.cxii.us` routes/domains.
- Confirm DNS records are proxied through Cloudflare.
- Ensure SSL/TLS mode is set appropriately (typically **Full (strict)**).

### 3) Post-go-live checks

- Enable Cloudflare Web Analytics (if desired).
- Confirm error logs in Worker Observability.
- Confirm no secrets are hard-coded in `wrangler.jsonc` or repo.

## Recommended release process (repeatable)

1. Branch -> implement changes.
2. Run local preflight (`check`, `test`, `build`).
3. Merge to deploy branch.
4. Cloudflare Workers Builds deploys automatically from GitHub.
5. Smoke-test production route and `/api/ai`.

## Known blockers to clear before first publish

- [x] Fix `education.honours` typo in `src/routes/resume/+page.svelte` (now `honors`).
- [x] Make `npm run check` pass without generated `.svelte-kit` type noise.
- [x] Resolve Windows `EBUSY` adapter cleanup failure with prebuild cleanup.
- [x] Wire `wrangler.jsonc` `kv_namespaces` to your real KV **namespace ID** (32 hex chars from the namespace you created, for example `cxiius_kv`). Use binding name **`RATE_LIMIT_KV`**. Set `preview_id` to the same ID unless you created a separate preview namespace (see FAQ — `preview_id` is Wrangler-only, not a Cloudflare KV UI label).
- [ ] Set `ANTHROPIC_API_KEY` and `RATE_LIMIT_ID_SALT` in Cloudflare secrets.
