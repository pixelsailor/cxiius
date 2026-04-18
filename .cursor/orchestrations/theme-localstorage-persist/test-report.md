# Test report — theme-localstorage-persist

## Coverage map

| AC ID | Automated test location | Test name(s) |
| ----- | ------------------------ | ------------ |
| **AC-01** | `src/lib/utils/theme.spec.ts` | `readStoredThemeIndex / persistThemeIndex` → `persist writes clamped string under THEME_STORAGE_KEY` (asserts `THEME_STORAGE_KEY` and string values `"2"` and `"4"` after clamp). Pair with `read returns clamped index for valid decimal strings` for stored shape `"0"`–`"4"`. |
| **AC-02** | — | *Omitted — see [Uncovered criteria](#uncovered-criteria).* |
| **AC-03** | `src/lib/utils/theme.spec.ts` | `applyTheme` → `clears data-theme for index 0 (system)`; `sets data-theme to light, stone, twilight, dark for indices 1 to 4`. |
| **AC-04** | `src/lib/utils/theme.spec.ts` | `readStoredThemeIndex / persistThemeIndex` → `read returns null for missing key` (unset key ⇒ `null`, matching layout’s initial `0` until restore). |
| **AC-05** | `src/lib/utils/theme.spec.ts` | `read returns null for empty or whitespace-only value`; `read returns null for non-numeric value and removes the key`; `persist is a no-op when window is undefined` (no throw). |
| **AC-06** | `src/lib/utils/theme.spec.ts` | `THEME_STORAGE_KEY` → `is the documented localStorage key`. |
| **AC-07** | `src/lib/utils/theme.spec.ts` | `read returns null when window is undefined (SSR)`; `persist is a no-op when window is undefined`. |
| **AC-08** | — | *Omitted — see [Uncovered criteria](#uncovered-criteria).* |
| **AC-09** | `src/lib/utils/theme.spec.ts` | Entire `describe('readStoredThemeIndex / persistThemeIndex', …)` block (mocked `localStorage` / `window`; valid, missing, invalid paths). |
| **AC-10** | — | *Not a Vitest case — satisfied by running the commands in [Commands to run](#commands-to-run) (same verification as Builder `build-log.md`).* |

### Notes on partial vs full coverage

- **AC-01 / AC-03:** Unit tests exercise `persistThemeIndex`, `readStoredThemeIndex`, and `applyTheme` directly. They do **not** drive the theme `Slider` in `+layout.svelte` or assert a full navigation/reload cycle.
- **AC-04:** Missing-key behavior is covered at the helper layer; binding `activeThemeIndex` and `onMount` restore in `+layout.svelte` are not covered by a component or browser test.

## Uncovered criteria

| AC ID | Reason |
| ----- | ------ |
| **AC-02** | No automated integration or end-to-end test simulates a subsequent full page load and asserts `activeThemeIndex` (and slider UI) match `localStorage`. Requires browser harness (e.g. Playwright) or manual QA. |
| **AC-08** | Architectural constraint (`$state` in `+layout.svelte`, no new global theme store) is enforced by code review, not by a named automated test (no grep/architecture test in repo). |
| **AC-10** | Acceptance criterion is process verification (`npm run check`, `npm run test`), not a unit/integration test name. Evidence is command success (documented below). |

**Optional manual / future automation gaps (called out for Validator):**

- End-to-end: slider change → `localStorage` → reload → DOM + slider state (would strengthen AC-01, AC-02, AC-03, AC-04 at the layout level).
- Static or snapshot check for AC-08 if the project adopts that pattern.

## Test stability notes

- Tests use **Vitest** `vi.stubGlobal` for `window` and `localStorage` with in-memory stores; no real timers or network.
- No `waitFor`, animation frames, or arbitrary `setTimeout` assertions — **no known timing flake** in the theme suite.
- `applyTheme` tests depend on a minimal `document.documentElement` mock; order is isolated with `beforeEach` / `afterEach` unstub.

## Commands to run

From the repository root (`cxiius`):

```bash
npm run test
```

Equivalent (explicit Vitest run mode):

```bash
npm run test:unit -- --run
```

Acceptance criterion **AC-10** also requires:

```bash
npm run check
```

Run both for full AC-10 verification:

```bash
npm run check
npm run test
```

---

**Handoff:** Orchestrator may set `current_agent` to `validator` per pipeline contract.
