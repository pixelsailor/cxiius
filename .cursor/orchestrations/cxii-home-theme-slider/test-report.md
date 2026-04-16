# Test report — cxii-home-theme-slider

## Coverage map

| AC ID     | Automated test (Vitest)       | Other verification                                                                                                                                                                                                                                  |
| --------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AC-01** | _None._                       | Static review of `src/routes/+page.svelte`: `.slider-container` wraps `Slider.Root` with `Slider.Range` and `Slider.Thumb` (`index={0}`). `npm run check` confirms the route compiles.                                                              |
| **AC-02** | _None._                       | Same file: `type="single"`, `min={0}`, `max={3}`, `step={1}`, `bind:value`, `let value = $state(0)`. `npm run check` for type/runner consistency.                                                                                                   |
| **AC-03** | _None._                       | Static review: no `Slider.Tick` in the file.                                                                                                                                                                                                        |
| **AC-04** | _None._                       | Static review: `THEME_NAMES` tuple order `light`, `stone`, `twilight`, `dark`; `currentThemeName` derived via `clampThemeIndex` + index lookup.                                                                                                     |
| **AC-05** | _None._                       | Static review: `onValueCommit={handleValueCommit}` and `handleValueCommit` body contains `console.log(...)`.                                                                                                                                        |
| **AC-06** | _None._                       | Static review: scoped styles use `var(--radius-input)`, `var(--muted)`, `var(--border-input)`, `var(--foreground-alt)`, `var(--background)`, `var(--shadow-btn)`, `var(--foreground)`, transition tokens.                                           |
| **AC-07** | _None._                       | Static review: transitions / active `transform` on thumb are inside `@media (prefers-reduced-motion: no-preference)`.                                                                                                                               |
| **AC-08** | _None._                       | Static review: `$state` / `$derived` only; no `writable`/`readable`, `$:`, or `export let` for this feature. `npm run check` for Svelte 5 diagnostics.                                                                                              |
| **AC-09** | _None._                       | Static review: `import { Slider } from 'bits-ui'`.                                                                                                                                                                                                  |
| **AC-10** | _None._                       | Static review: `aria-label="Color theme"` on `Slider.Root`. **Manual:** Confirm in browser/DevTools that the accessible name is exposed as intended (bits-ui may wrap root; verify effective name in Accessibility tree).                           |
| **AC-11** | _None._                       | Static review: thumb styles set `min-width: 44px; min-height: 44px` under `[data-slider-thumb]`. **Manual:** Optional browser box-model/DOM check; build-log documents 44×44 target and aligns with ADR-004 / workspace touch guidance.             |
| **AC-12** | _Implicit gate (not Vitest):_ | **`npm run check`** — last run: exit **0**, 0 errors, 0 warnings (full project).                                                                                                                                                                    |
| **AC-13** | _Implicit gate (not Vitest):_ | **Scoped to this route:** `npx eslint src/routes/+page.svelte` — exit **0**; `npx prettier --check src/routes/+page.svelte` — exit **0**. **Note:** Full **`npm run lint`** may still fail on other paths (see **Uncovered criteria** / build-log). |

No new `*.spec.ts` / `*.svelte.spec.ts` files were added for this task; the existing Vitest projects (`src/lib/vitest-examples/*`) are unchanged.

## Uncovered criteria

These acceptance items do **not** have a **named Vitest test**; they rely on the methods in the table above.

- **AC-01–AC-09, AC-10, AC-11:** No automated component or browser test was added. **Reason:** Deliverable scope was `test-report.md` only; structural and token rules are verified by **targeted code review** of `src/routes/+page.svelte` plus **`npm run check`**. **AC-10**/**AC-11** include **manual** accessibility checks (accessible name in the a11y tree; optional visual/inspector confirmation of 44×44 thumb) because asserting them robustly would warrant a **browser** test (existing pattern: `vitest-browser-svelte` + Playwright in `src/lib/vitest-examples/Welcome.svelte.spec.ts`)—out of scope for this handoff.
- **AC-13 (repository-wide):** **`npm run lint`** runs Prettier and ESLint on **`.`** and may fail due to formatting outside this task (`build-log.md` lists orchestration files and `src/routes/resume/+page.svelte`). The **route file for this feature** passes ESLint and Prettier when scoped as in the coverage map; repo-wide lint success is **not** guaranteed by this task alone.

## Test stability notes

- No new timed or async UI assertions were introduced (no new tests).
- **`npm run test`** runs Vitest with two projects (browser + node). The **browser** project (`src/**/*.svelte.spec.*`) requires **Playwright** browsers on disk. If Chromium is missing, Vitest may report an unhandled error and non-zero exit even when node tests pass — install with **`npx playwright install`** (or rely on CI where browsers are cached). This is an **environment** requirement, not a flake in test assertions.
- If browser tests are added later for this route, prefer role/label queries over arbitrary `setTimeout`; follow `vitest-browser-svelte` + Playwright patterns already in the repo.

## Commands to run

Exact commands (from repo root `cxiius`):

```bash
npm run check
```

```bash
npx eslint src/routes/+page.svelte
```

```bash
npx prettier --check src/routes/+page.svelte
```

```bash
npm run test
```

_(Optional if browser tests fail to launch:)_ `npx playwright install`

For full lint as defined in `package.json` (may fail until unrelated files are formatted):

```bash
npm run lint
```

**Manual QA (AC-10 / AC-11):** Run `npm run dev`, open the home route, verify the theme slider exposes a clear accessible name and the thumb meets the intended minimum hit area (see static CSS and build-log).
