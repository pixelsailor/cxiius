# Cursor rules index — CXII

Quick reference for **agents** and **developers**: what each [`.mdc`](https://cursor.com/docs/context/rules) rule contains and **when it applies** in Cursor.

Authoritative architecture decisions remain in [`adr/INDEX.md`](../../adr/INDEX.md). These rules **distill** active ADRs and project workflows for day-to-day editing.

---

## Maintenance

**Update this file whenever a rule file is added, removed, renamed, or its activation mode changes (`alwaysApply`, `globs`, or manual-only with neither glob nor always-on).** Keep the **Rule summary** and **Activation** tables in sync with the `.mdc` files in this directory.

---

## Rule summary

Rules are grouped by **category**. Each table lists the rule file and a one-line summary.

### Governance and ADRs

| Rule file                                  | One-liner                                                                                                                              |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| [`adr-compliance.mdc`](adr-compliance.mdc) | Consult `adr/INDEX.md` for active ADRs before build-affecting work; follow `adr/GOVERNANCE.md`; do not treat proposed ADRs as binding. |

### Agent tooling

| Rule file                                                | One-liner                                                                                                                                                                                      |
| :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`svelte-mcp-workflow.mdc`](svelte-mcp-workflow.mdc)     | Stack and npm scripts; for Svelte/SvelteKit work use Svelte MCP (`list-sections` → `get-documentation` → `svelte-autofixer`; playground link only if user confirms and not for in-repo edits). |
| [`bits-ui-documentation.mdc`](bits-ui-documentation.mdc) | bits-ui docs via [bits-ui.com/llms.txt](https://bits-ui.com/llms.txt); agents may fetch linked `llms.txt` pages without prior approval when working under `src/lib/ui/` (ADR-011).             |

### Application architecture

| Rule file                                                                | One-liner                                                                                                                                                                         |
| :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`svelte-data-loading-and-state.mdc`](svelte-data-loading-and-state.mdc) | Unresolved `load()` promises, `{#await}` branches, `prerender`, no-JS navigation, Svelte 5 runes and stores — no legacy Svelte 4 patterns.                                        |
| [`server-boundary-types-schemas.mdc`](server-boundary-types-schemas.mdc) | `$lib/server/` vs thin API handlers; Zod only in server schemas; `z.infer`; `$lib/types/` and component type placement.                                                           |
| [`error-handling.mdc`](error-handling.mdc)                               | `Result<T>` in services, inline errors, no toasts, chat layout exception, sanitised `handleError`.                                                                                |
| [`content-model.mdc`](content-model.mdc)                                 | `$lib/content/` library: ADR-008 hard rules, add/edit/remove workflows, [`src/lib/content/INDEX.md`](../src/lib/content/INDEX.md) domain inventory.                               |
| [`content-interview.mdc`](content-interview.mdc)                         | Elicitation before writing: batched questions, confirm then write; privacy / off-limits (location, age, family, phone, health, legal-name parts); pairs with `content-model.mdc`. |

### Security and Cloudflare

| Rule file                                                | One-liner                                                                                                                 |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| [`api-boundary-security.mdc`](api-boundary-security.mdc) | AI/API boundary: single `input` field, length limits, Worker-only request shaping, rate limits, secrets never to client.  |
| [`cloudflare-kv-storage.mdc`](cloudflare-kv-storage.mdc) | KV only via `src/lib/server/kv/` helpers; bindings, keys, TTL, fail-closed vs fail-open; no KV through `+page.server.ts`. |

### UI and accessibility

| Rule file                                                            | One-liner                                                                                                     |
| :------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| [`semantic-html-accessibility.mdc`](semantic-html-accessibility.mdc) | Landmarks, nav, headings, native HTML first, keyboard, motion (`prefers-reduced-motion`), focus for overlays. |

### Code quality

| Rule file                                                | One-liner                                                                                                                                                                        |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`lint-and-code-quality.mdc`](lint-and-code-quality.mdc) | TypeScript and Svelte patterns for lint-friendly code: strict nullability, async/callbacks, logging vs ADR-005, `{#if}`/`{#each}`/`{#await}`; `npm run lint` / `npm run format`. |

### Orchestration

| Rule file                                                    | One-liner                                                                                                                |
| :----------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| [`orchestration-artifacts.mdc`](orchestration-artifacts.mdc) | Who may edit `task-manifest.json`, `plan.md`, `build-log.md`, and other files under `.cursor/orchestrations/{task-id}/`. |

---

## Activation

Rules are grouped by frontmatter **mode** (`alwaysApply` vs `alwaysApply: false` with `globs`). **One table** — each row is a mode; the **Rules** column lists **every** rule file in that group (comma-separated). Glob patterns live in each rule’s `.mdc` frontmatter.

| Mode            | Behavior                                                                                                                                                                                                                              | Rules                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **alwaysApply** | Loaded into every agent session automatically. No path filter and no user action needed (unless project rules are disabled in Cursor settings).                                                                                       | [`adr-compliance.mdc`](adr-compliance.mdc), [`svelte-mcp-workflow.mdc`](svelte-mcp-workflow.mdc)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Glob-scoped** | Loaded when workspace context includes files whose paths match that rule’s `globs` (for example open, attached, or referenced). If nothing matches, the rule may not apply. Exact matching can vary by Cursor version.                | [`svelte-data-loading-and-state.mdc`](svelte-data-loading-and-state.mdc), [`server-boundary-types-schemas.mdc`](server-boundary-types-schemas.mdc), [`api-boundary-security.mdc`](api-boundary-security.mdc), [`cloudflare-kv-storage.mdc`](cloudflare-kv-storage.mdc), [`semantic-html-accessibility.mdc`](semantic-html-accessibility.mdc), [`error-handling.mdc`](error-handling.mdc), [`content-model.mdc`](content-model.mdc), [`lint-and-code-quality.mdc`](lint-and-code-quality.mdc), [`orchestration-artifacts.mdc`](orchestration-artifacts.mdc), [`bits-ui-documentation.mdc`](bits-ui-documentation.mdc) |
| **Manual**      | `alwaysApply: false` and **no** `globs` — not path-triggered. Attach the rule (or use its trigger phrase from the rule description) when adding or updating narrative content so the agent interviews before editing `$lib/content/`. | [`content-interview.mdc`](content-interview.mdc)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

---

## See also

- [`.cursor/agents/`](../agents/) — orchestration agent definitions (Orchestrator, Planner, Builder, Test, Validator).
- [`.cursor/orchestrations/_template/`](../orchestrations/_template/) — `task-manifest.json` and approval template.
