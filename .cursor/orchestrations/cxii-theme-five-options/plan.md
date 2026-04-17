# Plan — cxii-theme-five-options

## Objective restatement

Deliver five discrete appearance modes—**system**, **light**, **stone**, **twilight**, and **dark**—as complete CSS custom-property groups in `static/styles/tokens.css` (or the same load order), driven by the existing bits-ui `Slider` in `src/routes/+layout.svelte` on `onValueCommit`, with **system** matching today’s `prefers-color-scheme` behavior, **light** and **dark** explicit palettes matching **exactly** the current `:root` light defaults and the current `@media (prefers-color-scheme: dark)` block respectively, **stone** and **twilight** as distinct tunable palettes, and **`clampThemeIndex` corrected** so indices **0–4** are valid.

## Scope boundary

**In scope**

- Refactor `tokens.css` so that:
  - **System (slider index 0):** `<html>` has **no** `data-theme` attribute (or it is removed when switching to system). Default `:root` colors remain the **exact** current light palette; automatic dark appearance continues to come **only** from `@media (prefers-color-scheme: dark)` applied to `:root` **when no explicit theme attribute is present** (see Interface contracts for the precise CSS precedence pattern).
  - **Explicit themes (indices 1–4):** Set `document.documentElement.dataset.theme` (or equivalent `data-theme` on `<html>`) to **`light`**, **`stone`**, **`twilight`**, or **`dark`** respectively. Each of these must define a **complete** set of theme variables needed by the app (same coverage as today’s light/dark groups—not only the subset in the current `:root[data-theme="light"]` block).
  - **Value preservation:** The numeric/color token **values** that today live in default `:root` (light) and in the dark `@media` block must reappear **unchanged** as the explicit **`light`** and **`dark`** theme groups (allowing reorder/refactor of selectors, not value edits).
  - **Stone** and **twilight:** New palettes, product-tunable; Builder implements distinct warm-neutral and blue-purple directions per “Interface contracts” (no requirement to match an external spec beyond coherence and full variable coverage).
- **`+layout.svelte`:** Fix `clampThemeIndex` to **`0 | 1 | 2 | 3 | 4`**, wire **`onValueCommit`** to apply the theme (remove placeholder `console.log` / objective placeholder behavior).
- **Precedence:** Document and implement CSS so **explicit `data-theme` always overrides** system `prefers-color-scheme` for the same properties (e.g. user chooses explicit **light** while OS is dark, or explicit **dark** while OS is light).
- **ADR-aligned implementation:** Svelte 5 runes for layout state; keep **Slider** as the bits-ui-based control already under `$lib/ui/slider`; optional small **client-safe** helper module under `src/lib/utils/` if it keeps `+layout.svelte` readable.

**Out of scope**

- **Persisting theme choice** (e.g. `localStorage` / cookies): **not in scope** for this task. Theme applies for the current session after interaction; no-JS users keep system/CSS-only behavior per ADR-003. (A follow-up may add persistence with documented flash/SSR trade-offs.)
- Changing **non-token** layout structure (landmarks, nav, skip links) or **bits-ui**/`Slider` API beyond what is required to call `onValueCommit` and apply theme.
- Fixing pre-existing unrelated token typos (e.g. invalid `var(hsla(...))` usages) unless the Builder must touch those lines to complete the theme split—if so, document under deviations only as needed for consistency.

## Component/file map

| File                                | Action | Purpose                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `static/styles/tokens.css`          | Modify | Define `:root` base (light, exact current values), scope **system dark** to `:root` **without** `[data-theme]` inside `prefers-color-scheme: dark`, and add full variable groups for `:root[data-theme="light"]`, `[data-theme="stone"]`, `[data-theme="twilight"]`, `[data-theme="dark"]` with explicit **light**/**dark** matching current values; define **stone**/**twilight** as complete groups. |
| `src/routes/+layout.svelte`         | Modify | `clampThemeIndex` for **0–4**; implement **`applyTheme(index)`** (or inline equivalent) setting/removing `dataset.theme`; **`handleThemeChange`** calls **`applyTheme`** after commit; remove debug logging; keep **`activeThemeIndex`** / **`currentThemeName`** in sync with applied theme for the slider UI.                                                                                        |
| `src/lib/utils/theme.ts` (optional) | Create | If extraction helps ADR-001 clarity: **`applyTheme`**, **`clampThemeIndex`**, and shared **`THEME_NAMES`** / types—**only** if the Builder keeps `+layout.svelte` as the single consumer; avoid new global stores (ADR-007).                                                                                                                                                                           |

## Interface contracts

### Theme indices and names

- **`THEME_NAMES`:** `['system', 'light', 'stone', 'twilight', 'dark']` as `const` tuple; index **`i`** maps to name **`THEME_NAMES[i]`**.

### DOM / dataset

- **Index `0` (system):** Remove `data-theme` from **`document.documentElement`** (`delete document.documentElement.dataset.theme` or equivalent so the attribute is absent).
- **Indices `1`–`4`:** Set **`document.documentElement.dataset.theme`** to **`'light'`** | **`'stone'`** | **`'twilight'`** | **`'dark'`** respectively (string values must match CSS attribute selectors exactly).

### CSS precedence (normative for Builder)

- **System:** With **no** `data-theme` on `<html>`, appearance is **only** `:root` defaults plus **`@media (prefers-color-scheme: dark)`** rules scoped to **`:root:not([data-theme])`** (or equivalent specificity so explicit themes do not depend on media).
- **Explicit:** Selectors of the form **`:root[data-theme="…"]`** supply the full palette for that theme and **take precedence over** the dark media block for all tokens they set (so OS preference does not override an explicit user choice).

### Functions (signatures)

```ts
function clampThemeIndex(v: number): 0 | 1 | 2 | 3 | 4;

function applyTheme(index: number): void;
```

- **`clampThemeIndex`:** `Math.round`, then clamp to **`[0, 4]`** inclusive; return type is the union above.
- **`applyTheme`:** Calls **`clampThemeIndex`**, then for **`0`** clears **`data-theme`**, else sets **`dataset.theme`** to the corresponding **`'light' | 'stone' | 'twilight' | 'dark'`**.

### Slider wiring

- **`onValueCommit`** receives the committed numeric value; handler updates **`activeThemeIndex`** (if not solely controlled by Slider) and calls **`applyTheme`** with that value.

### Stone / twilight (non-binding examples)

- **Stone:** Warm neutral direction—e.g. backgrounds in **hue ~30–50°, low chroma**, foregrounds slightly warm grays; borders/muted steps consistent with that family.
- **Twilight:** Blue–purple direction—e.g. backgrounds **~240–280°** at low–mid lightness, accents with separated hue; maintain readable contrast (ADR-004).

### localStorage

- **Not in scope;** no `localStorage` key defined for this task.

## ADR references

- **ADR-001 (Project file and folder structure):** Theme logic belongs in **`+layout.svelte`** and **`static/styles/`**; optional **`src/lib/utils/theme.ts`** follows **`camelCase.ts`** utils placement. Do **not** add **`$lib/ui`** barrels; **`Slider`** stays imported from its existing path. No server-only code for theme application.

- **ADR-003 (Progressive enhancement / no-JS baseline):** Theme switching remains a **JavaScript enhancement** (Slider is already behind **`isJsEnabled`**). Without JS, there is **no** persisted or slider-driven theme—**system** appearance via CSS only. **Out-of-scope persistence** avoids implying a no-JS-available stored preference.

- **ADR-004 (Semantic HTML / a11y):** Do **not** remove or gate **header / main / footer / nav** links. **Slider** keeps an accessible name (e.g. existing **`aria-label="Theme switcher"`**). Explicit theme choices must remain **keyboard-operable** via the Slider; no hover-only behavior.

- **ADR-007 (State management):** Use **`$state`** / **`$derived`** in the layout for **`activeThemeIndex`** and derived theme name; **do not** add a new global **`.svelte.ts`** store class **solely** for theme unless the Builder discovers shared consumers (unlikely for this task).

- **ADR-011 (bits-ui):** Continue using the existing **`Slider`** wrapper built on bits-ui for the control; styling remains project CSS/tokens.

## Open questions

- None that block implementation: **persistence** is explicitly **out of scope**; **stone**/**twilight** values are intentionally left to product tuning within the stated HSL directions.
