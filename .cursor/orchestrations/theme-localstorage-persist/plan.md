# Plan — theme-localstorage-persist

## Objective restatement

When a user selects a theme with the theme slider, the choice is written to `localStorage`; on later visits in a JavaScript-enabled session, that value is read and applied (including index `0` for system/default), so the UI matches their last selection without requiring a new ADR or server-side storage.

## Scope boundary

**In scope**

- Persist the theme index (`0`–`4`) under a single documented `localStorage` key constant.
- Read stored value on client startup (after JS loads), validate/clamp, update `activeThemeIndex` and call existing `applyTheme` so the document `data-theme` attribute matches the saved choice (including clearing it for index `0`).
- Write to `localStorage` whenever the user changes the theme via the existing `handleThemeChange` path (slider / `onValueChange`).
- Unit tests for parsing, clamping, and storage helpers (mock `localStorage` / `window` as needed).
- SSR/build safety: never read or write `localStorage` except in the browser.

**Out of scope**

- Changing theme semantics, slider range, or `applyTheme` mapping (unless required to wire persistence).
- Server-side or cookie-based theme persistence; FOUC prevention via inline blocking scripts in `app.html` (not requested).
- New global reactive store classes in `$lib/stores/` for theme (ADR-007 reserves global stores for justified cross-cutting state; theme remains layout-local `$state`).
- Migrating or renaming existing `THEME_NAMES` / CSS contract.

## Component/file map

| File | Action | Purpose |
| ---- | ------ | ------- |
| `src/lib/utils/theme.ts` | Modify | Export `THEME_STORAGE_KEY`; add browser-only helpers to read persisted index (return `null` / ignore when unset or invalid), write persisted index, reuse `clampThemeIndex` / `applyTheme` behavior. |
| `src/routes/+layout.svelte` | Modify | On client init (e.g. `onMount` alongside existing `removeNoJsClassFromBody`), read stored index, set `activeThemeIndex`, call `applyTheme`. Ensure `handleThemeChange` persists after applying. |
| `src/lib/utils/theme.spec.ts` | Modify | Cover storage key constant usage, read path (missing, invalid, valid), write path, and that helpers do not assume `localStorage` when not mocked. |

## Interface contracts

### Constant

- `THEME_STORAGE_KEY` — `export const THEME_STORAGE_KEY = 'cxii.themeIndex'`  
  Single source of truth for the `localStorage` key; used for both read and write.

### Stored value shape

- Value: decimal string of an integer in `0`–`4`, e.g. `"0"` for system, `"3"` for twilight.  
- On read: `getItem` → if `null` or empty, treat as “no saved preference” (do not overwrite user’s session until they interact, or apply default `0` for initial state consistency — Builder must pick one behavior and document it in code comments: **recommended:** if missing, leave initial `$state(0)` and `applyTheme(0)` only when restoring explicitly after read returns a valid number; if read returns invalid, fall back to `0` and optionally clear bad entry).

### Functions (all exported from `theme.ts` unless layout-only glue is preferred for `onMount`; prefer keeping I/O in `theme.ts`)

- `readStoredThemeIndex(): 0 \| 1 \| 2 \| 3 \| 4 \| null`  
  - **Browser only:** if `typeof window === 'undefined'` or `localStorage` unavailable, return `null`.  
  - Parse string to integer; use `clampThemeIndex` or equivalent; if stored value is non-numeric or out of range after clamp, return `null` (or clamp — **must** end with a valid index or `null`).

- `persistThemeIndex(index: number): void`  
  - **Browser only:** no-op on server.  
  - `const i = clampThemeIndex(index)`; `localStorage.setItem(THEME_STORAGE_KEY, String(i))`.

### Layout behavior

- Initial `activeThemeIndex = $state(0)` remains valid for SSR/first paint.
- In `onMount` (client): call `readStoredThemeIndex()`; if result is not `null`, assign to `activeThemeIndex` and `applyTheme(result)`.
- In `handleThemeChange`: after `applyTheme(i)`, call `persistThemeIndex(i)`.

### SSR safety

- Any `localStorage` access lives inside functions that guard with `typeof window !== 'undefined'` (or SvelteKit `import { browser } from '$app/environment'` and branch on `browser`), and is only invoked from client lifecycle (`onMount`, user handlers), not during SSR render.

## ADR references

- **ADR-001 (Project File and Folder Structure):** Theme persistence logic stays in `$lib/utils/theme.ts` (client-safe utilities). No server-only imports; no new `lib/server/` code for this feature.

- **ADR-003 (Progressive Enhancement and No-JS Baseline):** Theme switching remains a JS enhancement (slider already gated on `isJsEnabled`). `localStorage` is unavailable without JS; no-JS users keep the default theme from HTML/CSS — acceptable. Do not move primary content into `onMount`; restoring theme is a browser-only presentation side effect, not route content.

- **ADR-004 (Semantic HTML and Accessibility):** Do not conditionally remove `<header>`, `<main>`, or `<footer>`; theme persistence does not change landmark structure or nav links.

- **ADR-006 (Type and Schema Conventions):** No Zod for `localStorage`; use TypeScript and `clampThemeIndex` for validation. No new `$lib/types/` entries unless a shared type is genuinely needed across modules (prefer inline return types in `theme.ts`).

- **ADR-007 (State Management Conventions):** Keep `activeThemeIndex` as **local `$state`** in `+layout.svelte`. Do not add `writable`/`readable` stores. Persist via plain functions from `handleThemeChange` and `onMount`; avoid `$effect` unless strictly necessary—prefer `onMount` for one-time restore and the existing change handler for writes (minimizes risk of effect-driven state loops).

## Open questions

- None blocking: storage key name and string format are fixed above; invalid stored values should clamp or clear per Builder implementation with tests documenting behavior.
